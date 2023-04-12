// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1xt0_fiSScU81bhxzQBkIsDd2qCSozJ0",
  authDomain: "scoutgram-95085.firebaseapp.com",
  projectId: "scoutgram-95085",
  storageBucket: "scoutgram-95085.appspot.com",
  messagingSenderId: "989830774327",
  appId: "1:989830774327:web:308221100f4f71708e09b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);
export const db=getFirestore(app);
export default app;