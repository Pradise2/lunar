import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTotalBal } from '../Context/TotalBalContext';

const defaultData = {
  tapLeft: 1000,
  tapTime: 300,
  lastActiveTime: Math.floor(Date.now() / 1000),
  totalBal: 0,
  level: 1,
  completed: 0,
  taps: 0,
};

const useGameData = (userId) => {
  const [firstname, setFirstName] = useState(null);
  const [tapLeft, setTapLeft] = useState(defaultData.tapLeft);
  const [tapTime, setTapTime] = useState(defaultData.tapTime);
  const [lastActiveTime, setLastActiveTime] = useState(defaultData.lastActiveTime);
  const [taps, setTaps] = useState(defaultData.taps);
  const [isLoading, setIsLoading] = useState(true);
  const { totalBal, setTotalBal, addTotalBal } = useTotalBal();
  const [level, setLevel] = useState(defaultData.level);
  const [completed, setCompleted] = useState(defaultData.completed);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const savedData = localStorage.getItem(`gameData_${userId}`);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setTapLeft(parsedData.tapLeft);
            setTapTime(parsedData.tapTime);
            setLastActiveTime(parsedData.lastActiveTime);
            setTotalBal(parsedData.totalBal);
            setLevel(parsedData.level);
            setCompleted(parsedData.completed);
            setTaps(parsedData.taps);
          } else {
            const userDocRef = doc(db, 'Game', String(userId));
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              setTapLeft(data.tapLeft);
              setLastActiveTime(data.lastActiveTime);
              setTotalBal(data.totalBal);
              setLevel(data.level);
              setCompleted(data.completed);
              setTaps(data.taps);
  
              const currentTime = Math.floor(Date.now() / 1000);
              const elapsed = currentTime - data.lastActiveTime;
              const newTapTime = data.tapTime - elapsed;
  
              if (newTapTime > 0) {
                setTapTime(newTapTime);
              } else {
                setTapLeft(defaultData.tapLeft);
                setTapTime(defaultData.tapTime);
              }
              setLastActiveTime(currentTime);
            } else {
              await setDoc(userDocRef, defaultData);
              setTapLeft(defaultData.tapLeft);
              setTapTime(defaultData.tapTime);
              setLastActiveTime(defaultData.lastActiveTime);
              setTotalBal(defaultData.totalBal);
              setLevel(defaultData.level);
              setCompleted(defaultData.completed);
              setTaps(defaultData.taps);
              localStorage.setItem(`gameData_${userId}`, JSON.stringify(defaultData));
            }
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = async () => {
    const dataToSave = {
      tapLeft,
      tapTime,
      lastActiveTime: Math.floor(Date.now() / 1000),
      totalBal,
      level,
      completed,
      taps,
    };
    try {
      const userDocRef = doc(db, 'Game', String(userId));
      await setDoc(userDocRef, dataToSave);
      localStorage.setItem(`gameData_${userId}`, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (userId) {
        saveData();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        saveData();
      }
    };
  }, [userId, tapLeft, tapTime, totalBal, level, completed, taps]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTapTime((prevTapTime) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsed = currentTime - lastActiveTime;
        const newTapTime = prevTapTime - elapsed;

        if (newTapTime <= 0) {
          setTapLeft(defaultData.tapLeft);
          return defaultData.tapTime;
        }

        setLastActiveTime(currentTime);
        return newTapTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActiveTime]);

  return {
    firstname,
    tapLeft,
    tapTime,
    lastActiveTime,
    taps,
    isLoading,
    totalBal,
    level,
    completed,
    setFirstName,
    setTapLeft,
    setTapTime,
    setLastActiveTime,
    setTaps,
    setTotalBal,
    setLevel,
    setCompleted,
    addTotalBal,
  };
};

export default useGameData;
