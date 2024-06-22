import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveProgress, getProgress } from '../firebaseConfig';

const TotalBalContext = createContext();

export const useTotalBal = () => useContext(TotalBalContext);

export const TotalBalProvider = ({ children }) => {
  const [totalBal, setTotalBal] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if Telegram WebApp and user data are available
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userData = await getProgress(userId);
          setTotalBal(userData.totalBal);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const addTotalBal = async (amount) => {
    setTotalBal((prevTotalBal) => prevTotalBal + amount);
    await saveProgress(userId, { totalBal: totalBal + amount });
  };

  return (
    <TotalBalContext.Provider value={{ totalBal, setTotalBal, addTotalBal }}>
      {children}
    </TotalBalContext.Provider>
  );
};
