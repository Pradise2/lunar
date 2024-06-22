import React, { useState, useRef, useEffect } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import { saveProgress, getProgress } from '../firebaseConfig';

const Farm = () => {
  const defaultData = {
    lastActiveFarmTime: Math.floor(Date.now() / 1000),
    farm: 0,
    farmTime: 60,
    isFarmActive: false,
    claimed: false,
  };

  const [farmTime, setFarmTime] = useState(defaultData.farmTime);
  const [farm, setFarm] = useState(defaultData.farm);
  const [isFarmActive, setIsFarmActive] = useState(defaultData.isFarmActive);
  const [claimed, setClaimed] = useState(defaultData.claimed);
  const farmIntervalRef = useRef(null);
  const { addTotalBal } = useTotalBal();
  const [lastActiveFarmTime, setLastActiveFarmTime] = useState(defaultData.lastActiveFarmTime);
  const [userId, setUserId] = useState(null);

  window.Telegram.WebApp.expand();

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
      try {
        const userData = await getProgress(userId);
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsed = currentTime - userData.lastActiveFarmTime;

        setLastActiveFarmTime(currentTime);
        setClaimed(userData.claimed);
        setFarm(userData.farm + (userData.isFarmActive ? (elapsed * 0.01) : 0));
        setFarmTime(userData.farmTime - elapsed > 0 ? userData.farmTime - elapsed : 0);
        setIsFarmActive(userData.isFarmActive && userData.farmTime - elapsed > 0);

        if (userData.isFarmActive && userData.farmTime - elapsed > 0) {
          startFarmInterval();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const saveData = async () => {
    try {
      await saveProgress(userId, {
        lastActiveFarmTime: Math.floor(Date.now() / 1000),
        farm,
        farmTime,
        isFarmActive,
        claimed
      });
    } catch (error) {
      console.error('Error saving user data:', error);
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
  }, [userId, farm, farmTime, isFarmActive, claimed]);

  const startFarmInterval = () => {
    if (farmIntervalRef.current) return;
    farmIntervalRef.current = setInterval(() => {
      setFarmTime((prevFarmTime) => {
        if (prevFarmTime <= 0) {
          clearInterval(farmIntervalRef.current);
          farmIntervalRef.current = null;
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
    setLastActiveFarmTime(Math.floor(Date.now() / 1000));
    startFarmInterval();
    setClaimed(false);
  };

  const claimFarmRewards = () => {
    clearInterval(farmIntervalRef.current);
    farmIntervalRef.current = null;
    setIsFarmActive(false);
    addTotalBal(farm);
    setFarm(0);
    setFarmTime(60);
    setClaimed(true);
    saveData();
  };

  const handleButtonClick = () => {
    if (isFarmActive && farmTime === 0) {
      claimFarmRewards();
    } else if (!isFarmActive) {
      startFarm();
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
