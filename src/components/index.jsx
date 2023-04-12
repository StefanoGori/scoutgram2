import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { Avatar } from "@mui/material";
import { storage } from "../firebase";
import "./index.css";
const Index = () => {
  let [ProfilePic, setProfilePic] = useState("");
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    const coll = onSnapshot(collection(db, "Users"), (snapshot) => {
      const a = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((doc) => doc.id === id);
      setUser(a[0] || {});
    });
  }, []);

  const handleProfilePic = async (e) => {
    const storageRef = ref(storage, `${id}/ProfilePic`);
    await uploadBytes(storageRef, e.target.files[0]).then(() => {
      getDownloadURL(storageRef).then((url) => {
        const payload = { ProfilePic: url };
        const docRef = doc(db, "Users", id);
        updateDoc(docRef, payload);
        setUser({ ...user, ProfilePic: url });
      });
    });
  };
  const handleDescrizione = () => {
    const descrizione = prompt("Inserisci la descrizione");
    const payload = { Descrizione: descrizione };
    const docRef = doc(db, "Users", id);
    updateDoc(docRef, payload);
    setUser({ ...user, Descrizione: descrizione });
  };
  const handleNome = () => {
    const nome = prompt("Inserisci il nome");
    const payload = { Nome: nome };
    const docRef = doc(db, "Users", id);
    updateDoc(docRef, payload);
    setUser({ ...user, Nome: nome });
  };
  function generateRandomString() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * 10));
    }
    return result;
  }
  const handlePosts = async (e) => {
    const storageRef = ref(storage, `${id}/Posts/${generateRandomString()}`);
    await uploadBytes(storageRef, e.target.files[0]).then(() => {
      getDownloadURL(storageRef).then((url) => {
        const payload = { Posts: url };
        const docRef = doc(db, "Users", id);
        updateDoc(docRef, payload);
        setUser({ ...user, Posts: url });
      });
    });
  };
  async function saveImagesLink() {
    const imagesRef = ref(storage, `${id}/Posts`);
    const imagesList = await listAll(imagesRef);
    const imagesLink = [];
    for (const item of imagesList.items) {
      const downloadUrl = await getDownloadURL(item);
      imagesLink.push(downloadUrl);
    }
    const imagesLinkString = imagesLink.join(" ");
    const payload = { Posts: imagesLinkString };
    const docRef = doc(db, "Users", id);
    updateDoc(docRef, payload);
    setUser({ ...user, Posts: imagesLinkString });
  }
  useEffect(() => {
    saveImagesLink();
    if (user.Posts) {
      setPosts(user.Posts.split(" "));
    }
  }, [user.Posts]);
  return (
    <div>
      <div className="scoutgram">Scoutgram</div>
      <hr></hr>
      <div>
        <Avatar
          onClick={() => document.getElementById("PrInput").click()}
          src={user.ProfilePic}
          sx={{ width: 200, height: 200, borderRadius: "50%" }}
          style={{
            marginLeft: "5%",
            marginTop: "3%",
          }}
        />
        <input
          id="PrInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfilePic}
        />
      </div>
      <div style={{ textAlign: "left", marginLeft: "5%", fontSize:"200%"}}>
        <b>{user.Nome}</b>
        <br />
        {user.Descrizione}
      </div>
      <div class="text-left">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-5 my-2 rounded"
          onClick={handleDescrizione}
          style={{width: "30%" }}
        >
          Modifica Descrizione
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-5 my-2 rounded"
          onClick={handleNome}
          style={{width: "30%" }}
        >
          {" "}
          Modifica Nome
        </button>
      </div>
      <br />
      <div>
        <div class="grid grid-cols-3">
          {Posts.map((post, index) => {
            return (
              <img
                key={index}
                src={post}
                alt={`${index}`}
                class="w-full h-full object-cover"
              />
            );
          })}
        </div>
      </div>
      <div
        class="fixed bottom-0 inset-x-0 "
        style={{
          height: "7%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <hr class=" col w-full border-black-2 border-t-2 z-10 " />
        <button
          class=" col w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto text-white hover:from-blue-600 hover:to-blue-800 shadow-lg flex justify-center items-center"
          onClick={() => document.getElementById("Posts").click()}
        >
          <svg viewBox="0 0 24 24" class="w-8.5 h-8.5 fill-current">
            <path d="M12 4a8 8 0 1 0 8 8a8 8 0 0 0-8-8zM11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
          </svg>
        </button>
      </div>
      <input
        id="Posts"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePosts}
      />
    </div>
  );
};

export default Index;
