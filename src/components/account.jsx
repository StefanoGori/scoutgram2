import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./index.css";
import Loader from "./Loader";

function Account() {
  const [showResult, setShowResult] = useState(false);
  const [user, setUser] = useState([]);
  const [Nomeptg, setNomeptg] = useState("");
  const [Posts, setPosts] = useState([]);
  const { id } = useParams();
  const [ImagesLoaded, setImagesLoaded] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    Promise.all(
      Posts.map((post) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = post;
        });
      })
    )
      .then(() => {
        setTimeout(()=>{
          setImagesLoaded(true);
        },10000);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [Posts]);

  const handleClick = () => {
    setShowResult(true);
    const coll = onSnapshot(collection(db, "Users"), (snapshot) => {
      const a = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((doc) => doc.Nome === Nomeptg);
      setUser(a[0] || {});
      console.log(a);
    });
    setNomeptg("");
    setPosts([]);
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
      <div className="scoutgram">
        <button onClick={() => navigate(-1)}>
          <ArrowBackIcon
            className="text-blue-600 hover:text-blue-700"
            sx={{ width: "8vw", height: "8vw" }}
            style={{ position: "absolute", left: "7vw", top: "3vw" }}
          />
        </button>
        Scoutgram
      </div>
      <hr></hr>
      <br></br>

      <div className="flex items-center justify-center space-x-2">
        <input
          type="text"
          placeholder="Pattuglia Grifoni"
          className="py-2 px-4 border border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="Nomeptg"
          onChange={(e) => setNomeptg(e.target.value)}
        />
        <button
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-100"
          onClick={handleClick}
        >
          Search
        </button>
      </div>
      {showResult && (
        <div>
          <Avatar
            src={user.ProfilePic}
            sx={{ width: "30vw", height: "30vw", borderRadius: "50%" }}
            style={{
              marginLeft: "5%",
              marginTop: "3%",
            }}
          />
          <div
            style={{ textAlign: "left", marginLeft: "5%", fontSize: "150%" }}
          >
            <b>{user.Nome}</b>
            <br />
            {user.Descrizione}
          </div>
          {ImagesLoaded ? (
            <div>
              <div class="grid grid-cols-3">
                {Posts.map((post, index) => {
                  return (
                    <img
                    loading="lazy"
                      key={index}
                      src={post}
                      alt={`${index}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1/1",
                      }}
                      class="w-full h-full object-cover"
                      onClick={() => openPost(index)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
