import React, { useState, useRef, useEffect } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const Farm = () => {
  const [farmTime, setFarmTime] = useState(() => {
    return localStorage.getItem('farmTime') ? parseInt(localStorage.getItem('farmTime'), 10) : 60;
  });
  const [farm, setFarm] = useState(() => {
    return localStorage.getItem('farm') ? parseFloat(localStorage.getItem('farm')) : 0;
  });
  const [isFarmActive, setIsFarmActive] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const farmIntervalRef = useRef(null);
  const { addTotalBal } = useTotalBal();
  const [userId, setUserId] = useState(null);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      } else {
        alert('User data is not available.');
      }
    } else {
      alert('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, 'Game', String(userId));
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setFarm(data.farm ?? 0);
            setFarmTime(data.farmTime ?? 60);
            setIsFarmActive(data.isFarmActive ?? false);
            setClaimed(data.claimed ?? false);
            localStorage.setItem('farm', data.farm ?? 0);
            localStorage.setItem('farmTime', data.farmTime ?? 60);
          } else {
            await setDoc(userDocRef, {
              farm: 0,
              farmTime: 60,
              isFarmActive: false,
              claimed: false,
            });
          }
        } catch (error) {
          alert('Error fetching farm data: ' + error.message);
          console.log('Error fetching farm data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (isFarmActive && farmTime > 0) {
      startFarmInterval();
    }

    return () => clearInterval(farmIntervalRef.current); // Clear interval on unmount
  }, [isFarmActive, farmTime]);

  useEffect(() => {
    localStorage.setItem('farmTime', farmTime);
    localStorage.setItem('farm', farm);
    saveFarmData({ farmTime, farm });
  }, [farmTime, farm]);

  const saveFarmData = async (updatedData) => {
    if (userId) {
      try {
        const userDocRef = doc(db, 'Game', String(userId));
        await setDoc(userDocRef, updatedData, { merge: true });
      } catch (error) {
        alert('Error saving farm data to Firestore: ' + error.message);
        console.log('Error saving farm data:', error);
      }
    }
  };

  const startFarmInterval = () => {
    farmIntervalRef.current = setInterval(() => {
      setFarmTime((prevFarmTime) => {
        if (prevFarmTime <= 0) {
          clearInterval(farmIntervalRef.current);
          setIsFarmActive(false);
          return 0;
        } else {
          setFarm((prevFarm) => {
            const newFarm = prevFarm + 0.01;
            localStorage.setItem('farm', newFarm.toFixed(2));
            saveFarmData({ farm: newFarm });
            return newFarm;
          });
          return prevFarmTime - 1;
        }
      });
    }, 1000);
  };

  const startFarm = () => {
    setIsFarmActive(true);
    setClaimed(false);
    saveFarmData({ isFarmActive: true, claimed: false });
  };

  const claimFarmRewards = async () => {
    clearInterval(farmIntervalRef.current);
    setIsFarmActive(false);
    addTotalBal(farm);
    try {
      const userDocRef = doc(db, 'Game', String(userId));
      await updateDoc(userDocRef, {
        totalBal: farm,
      });
    } catch (error) {
      alert('Error updating total balance: ' + error.message);
      console.log('Error updating total balance:', error);
    }
    setFarm(0);
    setFarmTime(60);
    setClaimed(true);
    saveFarmData({ farm: 0, farmTime: 60, isFarmActive: false, claimed: true });
  };

  const handleButtonClick = () => {
    if (isFarmActive) {
      claimFarmRewards();
    } else {
      startFarm();
      startFarmInterval(); // Start the interval when farm begins
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Lunar Token Farming</h1>
        <p className="mt-6">Keep your farm thriving!</p>
      </div>
      <div className="bg-gradient-to-r bg-zinc-800 text-center py-2 px-4 rounded-lg mr-4 flex justify-center mt-5">
        <span className="material-icons">access_time</span>
        <p className="text-center font-bold"><FormattedTime time={farmTime} /></p>
      </div>
      <div className="mt-6 bg-zinc-800 rounded-lg p-6 relative">
        <p className="text-center text-zinc-400">Era Reward</p>
        <p className="text-center text-4xl font-bold mt-2">
          {farm.toFixed(2)} <span className="text-purple-400">lunar</span>
        </p>
      </div>
      <button
        className="mt-6 bg-zinc-700 text-white py-2 px-6 rounded-lg"
        onClick={handleButtonClick}
        disabled={isFarmActive && farmTime > 0}
      >
        {claimed ? 'Claimed' : (isFarmActive && farmTime === 0 ? 'Claim' : 'Start')}
      </button>
      <Footer className="mt-7 pt-6"/>
    </div>
  );
};

export default Farm;
