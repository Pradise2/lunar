// GlobalStateContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    completed: 0,
    farm: 0,
    farmTime: 60,
    lastActiveTime: null,
    level: 0,
    tapLeft: 0,
    tapTime: 0,
    taps: 0,
    totalBal: 0,
  });

  const [userId, setUserId] = useState(null);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        fetchUserData(user.id);
      } else {
        alert('User data is not available.');
      }
    } else {
      alert('Telegram WebApp script is not loaded.');
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'Game', String(userId));
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setGlobalState(userDoc.data());
      } else {
        await setDoc(userDocRef, globalState);
      }
    } catch (error) {
      alert('Error fetching user data: ' + error.message);
      console.log('Error fetching user data:', error);
    }
  };

  const updateUserData = async (updatedData) => {
    if (userId) {
      try {
        const userDocRef = doc(db, 'Game', String(userId));
        await setDoc(userDocRef, updatedData, { merge: true });
        setGlobalState((prevState) => ({
          ...prevState,
          ...updatedData,
        }));
      } catch (error) {
        alert('Error saving user data: ' + error.message);
        console.log('Error saving user data:', error);
      }
    }
  };

  return (
    <GlobalStateContext.Provider value={{ globalState, updateUserData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
