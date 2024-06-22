import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGlobalState } from './GlobalStateContext'; // Ensure this path is correct
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const TotalBalContext = createContext();

export const useTotalBal = () => {
  return useContext(TotalBalContext);
};

export const TotalBalProvider = ({ children }) => {
  const { globalState, updateUserData } = useGlobalState();
  const [totalBal, setTotalBal] = useState(globalState.totalBal || 0);

  useEffect(() => {
    setTotalBal(globalState.totalBal);
  }, [globalState.totalBal]);

  const addTotalBal = async (amount) => {
    const newTotalBal = totalBal + amount;
    setTotalBal(newTotalBal);
    updateUserData({ totalBal: newTotalBal });

    // Update in database
    const userId = globalState.userId;
    if (userId) {
      try {
        const userDocRef = doc(db, 'Game', String(userId));
        await setDoc(userDocRef, { totalBal: newTotalBal }, { merge: true });
      } catch (error) {
        alert('Error saving total balance to Firestore: ' + error.message);
        console.log('Error saving total balance:', error);
      }
    }
  };

  return (
    <TotalBalContext.Provider value={{ totalBal, setTotalBal, addTotalBal }}>
      {children}
    </TotalBalContext.Provider>
  );
};
