import React, { useState, useEffect, useRef } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const defaultFarmData = {
  farmTime: 60,
  farm: 0,
};

const Farm = () => {
  const [farmTime, setFarmTime] = useState(defaultFarmData.farmTime);
  const [farm, setFarm] = useState(defaultFarmData.farm);
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
            setFarmTime(data.farmTime ?? defaultFarmData.farmTime);
            setFarm(data.farm ?? defaultFarmData.farm);
          } else {
            await setDoc(userDocRef, defaultFarmData);
          }
        } catch (error) {
          alert('Error fetching farm data: ' + error.message);
          console.log('Error fetching farm data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const saveFarmData = async () => {
    if (userId) {
      const dataToSave = {
        farmTime,
        farm,
      };
      try {
        const userDocRef = doc(db, 'Game', String(userId));
        await setDoc(userDocRef, dataToSave, { merge: true });
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
          setFarm((prevFarm) => prevFarm + 0.01);
          return prevFarmTime - 1;
        }
      });
    }, 1000);
  };

  const startFarm = () => {
    setIsFarmActive(true);
    startFarmInterval();
    setClaimed(false);
  };

  const claimFarmRewards = () => {
    clearInterval(farmIntervalRef.current);
    setIsFarmActive(false);
    addTotalBal(farm);
    setFarm(defaultFarmData.farm);
    setFarmTime(defaultFarmData.farmTime);
    setClaimed(true);
    saveFarmData();
  };

  const handleButtonClick = () => {
    if (isFarmActive) {
      claimFarmRewards();
    } else {
      startFarm();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (userId && isFarmActive) {
        saveFarmData();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId && isFarmActive) {
        saveFarmData();
      }
    };
  }, [userId, farmTime, farm, isFarmActive]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Lunar Token Farming</h1>
        <p className="mt-6">keep your farm thriving!</p>
      </div>
      <div className="bg-gradient-to-r bg-zinc-800 text-center py-2 px-4 rounded-lg mr-4 flex justify-center mt-5">
        <span className="material-icons">access_time</span>
        <p className="text-center font-bold"><FormattedTime time={farmTime} /></p>
      </div>
      <div className="mt-6 bg-zinc-800 rounded-lg p-6 relative">
        <p className="text-center text-zinc-400"> Era Reward</p>
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
      <Footer className="mt-7 pt-6" />
    </div>
  );
};

export default Farm;
