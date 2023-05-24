// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import "firebase/compat/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARGBcyklI11bQd4dNdGJ0MwbJtStNGARM",
  authDomain: "referencemanagement-81918.firebaseapp.com",
  databaseURL: "https://referencemanagement-81918-default-rtdb.firebaseio.com",
  projectId: "referencemanagement-81918",
  storageBucket: "referencemanagement-81918.appspot.com",
  messagingSenderId: "25597210813",
  appId: "1:25597210813:web:3b12de9743b635b1d887d4",
  measurementId: "G-PCYDB9WN3R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getDatabase(app);
const storage = getStorage(app);
export { db, auth, provider, storage };
