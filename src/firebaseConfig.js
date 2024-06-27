import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app);



// Create initial user data
function createInitialUserData(userId) {
  return {
    userId: userId.toString(),
    tapLeft: 1000,
    tapTime: 300,
    lastActiveTime: Math.floor(Date.now() / 1000),
    lastActiveFarmTime: Math.floor(Date.now() / 1000),
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
    taskStates: {},
    completedTasks: {
      1:false,
      2:false,
      3:false,
      4:false,
    },
  };
}

// Function to save progress
async function saveProgress(userId, data) {
  if (!userId) {
    console.error('saveProgress called with undefined or null userId:', userId);
    return;
  }

  const docRef = doc(db, "Run", userId.toString());
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const newData = { ...existingData, ...data };
      await setDoc(docRef, newData);
    } else {
      await setDoc(docRef, data);
    }
    console.log('Progress saved');
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

// Function to get progress
async function getProgress(userId) {
  const docRef = doc(db, "Run", userId.toString());
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

export { db, auth, saveProgress, getProgress };
