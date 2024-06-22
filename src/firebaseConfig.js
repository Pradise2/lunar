import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration
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

// Create initial user data
function createInitialUserData(userId) {
  return {
    userId: userId.toString(),
    tapLeft: 1000,
    tapTime: 300,
    lastActiveTime: Math.floor(Date.now() / 1000),
    totalBal: 0,
    level: 1,
    completed: 0,
    taps: 0,
    farm: 0,
    farmTime: 60,
    isFarmActive: false,
    claimed: false,
    addTotalBal: 0,
    tasksValue: 0,
    taskStates: 0,
  };
}

// Function to save progress
export async function saveProgress(userId, data) {
  const docRef = doc(db, "Test", userId.toString());
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const newData = { ...existingData, ...data };
      console.log('Existing data:', existingData);
      console.log('New data to save:', newData);
      await setDoc(docRef, newData);
    } else {
      console.log('Creating new document with data:', data);
      await setDoc(docRef, data);
    }
    console.log('Progress saved');
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

// Function to get progress
export async function getProgress(userId) {
  const docRef = doc(db, "Test", userId.toString());
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document! Creating new user...');
      const initialData = createInitialUserData(userId);
      await saveProgress(userId, initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Error getting progress:', error);
    throw error; // Rethrow the error if needed for further handling
  }
}
