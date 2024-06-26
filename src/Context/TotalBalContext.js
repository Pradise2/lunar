import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveProgress, getProgress } from '../firebaseConfig';

const TotalBalContext = createContext();

export const useTotalBal = () => useContext(TotalBalContext);

export const TotalBalProvider = ({ children }) => {
  const [totalBal, setTotalBal] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Example: fetch user data from auth system
        const user = { id: "1" }; // Placeholder, replace with actual auth logic
        if (user) {
          setUserId(user.id);
        } else {
          console.error('User data is not available.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userData = await getProgress(userId);
          if (userData && userData.totalBal) {
            setTotalBal(userData.totalBal);
          } else {
            setTotalBal(0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const addTotalBal = (amount) => {
    setTotalBal((prevTotalBal) => {
      const newTotalBal = prevTotalBal + amount;
      saveProgress(userId, { totalBal: newTotalBal }).catch(error => {
        console.error('Error saving total balance:', error);
      });
      return newTotalBal;
    });
  };

  return (
    <TotalBalContext.Provider value={{ totalBal, setTotalBal, addTotalBal }}>
      {children}
    </TotalBalContext.Provider>
  );
};
