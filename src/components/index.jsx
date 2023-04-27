import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams, Link } from "react-router-dom";
import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { storage } from "../firebase";
import "./index.css";
import { display } from "@mui/system";
const Index = () => {
  let [ProfilePic, setProfilePic] = useState("");
  const { id } = useParams();
  const [user, setUser] = useState("");
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
  const openPost = (index) => {
    const postToOpen = Posts[index];
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    const postImage = document.createElement("img");
    postImage.src = postToOpen;
    postImage.alt = `Post ${index}`;
    postImage.style.maxWidth = "100%";
    postImage.style.maxHeight = "100%";

    modal.appendChild(postImage);
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };
  return (
    <div>
      <div className="scoutgram">Scoutgram</div>
      <hr></hr>
      <div>
        <Avatar
          onClick={() => document.getElementById("PrInput").click()}
          src={user.ProfilePic}
          sx={{ width: "30vw", height: "30vw", borderRadius: "50%" }}
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
      <div style={{ textAlign: "left", marginLeft: "5%", fontSize: "150%" }}>
        <b>{user.Nome}</b>
        <br />
        {user.Descrizione}
      </div>
      <div class="text-left">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-5 my-2 rounded"
          onClick={handleDescrizione}
        >
          Modifica Descrizione
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-5 my-2 rounded"
          onClick={handleNome}
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
                style={{ width: "100%", height: "auto", aspectRatio: "1/1" }}
                class="w-full h-full object-cover"
                onClick={() => openPost(index)}
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
          class=" col bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto text-white hover:from-blue-600 hover:to-blue-800 shadow-lg absolute justify-center items-center"
          style={{ height: "10vw", width: "10vw", padding: "10" }}
          onClick={() => document.getElementById("Posts").click()}
        >
          <svg viewBox="0 0 24 24" class="w-8.5 h-8.5 fill-current">
            <path d="M12 4a8 8 0 1 0 8 8a8 8 0 0 0-8-8zM11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4z" />
          </svg>
        </button>
        <button
          class="bg-gradient-to-r from-blue-500 to-blue-700 rounded-full  text-white hover:from-blue-600 hover:to-blue-800 shadow-lg flex justify-center items-center"
          style={{
            height: "10vw",
            width: "10vw",
            marginLeft: "auto",
            padding: "10",
          }}
        >
          <AccountCircleIcon
            style={{ fontSize: "10vw" }}
            onClick={() => document.getElementById("Account").click()}
          />
        </button>
      </div>
      <input
        id="Posts"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePosts}
      />
      <Link to="/account" style={{ display: "none" }} id="Account"/>
    </div>
  );
};

export default Index;
