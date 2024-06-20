import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBoapqfEEJwsZiStOWhZeTZlpFStKFCY80",
  authDomain: "lunar-2ac46.firebaseapp.com",
  projectId: "lunar-2ac46",
  storageBucket: "lunar-2ac46.appspot.com",
  messagingSenderId: "954289049346",
  appId: "1:954289049346:web:1a08d54b3ae4122c82fc1b",
  measurementId: "G-57Q2844SHQ",
    databaseURL: "https://lunar-2ac46.firestore.europe-west3.firebasedatabase.app" 
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };