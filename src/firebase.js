// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoapqfEEJwsZiStOWhZeTZlpFStKFCY80",
  authDomain: "lunar-2ac46.firebaseapp.com",
  databaseURL: "https://lunar-2ac46-default-rtdb.firebaseio.com",
  projectId: "lunar-2ac46",
  storageBucket: "lunar-2ac46.appspot.com",
  messagingSenderId: "954289049346",
  appId: "1:954289049346:web:1a08d54b3ae4122c82fc1b",
  measurementId: "G-57Q2844SHQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
