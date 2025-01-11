// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG6XntaXg7dmxApe4YFxwIT4AY7LKSVj0",
  authDomain: "helionix-c2cb3.firebaseapp.com",
  projectId: "helionix-c2cb3",
  storageBucket: "helionix-c2cb3.firebasestorage.app",
  messagingSenderId: "1021924905869",
  appId: "1:1021924905869:web:b8486b45de02c6d947e3c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }