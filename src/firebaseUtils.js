import { db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function createInitialUserData(userId) {
  return {
    userId: userId,
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
    completedTasks: {},
  };
}

export async function saveProgress(userId, data) {
  if (!userId) {
    console.error('saveProgress called with undefined or null userId:', userId);
    return;
  }

  const docRef = doc(db, "Run", userId);
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

export async function getProgress(userId) {
  const docRef = doc(db, "Run", userId);
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
