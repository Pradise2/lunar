import React, { useState, useRef, useEffect } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import { saveProgress, getProgress } from '../firebaseConfig';
import './Farm.css'; 

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
  const [buttonText, setButtonText] = useState('Start');
  const farmIntervalRef = useRef(null);
  const { addTotalBal, totalBal } = useTotalBal(); // Assuming useTotalBal provides totalBal as well
  const [lastActiveFarmTime, setLastActiveFarmTime] = useState(defaultData.lastActiveFarmTime);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setUserName(user.username);
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
        if (userData) {
          const currentTime = Math.floor(Date.now() / 1000);
          const elapsed = currentTime - userData.lastActiveFarmTime;

          setLastActiveFarmTime(currentTime);
          setClaimed(userData.claimed);

          if (userData.isFarmActive) {
            const remainingFarmTime = userData.farmTime - elapsed;
            if (remainingFarmTime > 0) {
              setFarm(userData.farm + elapsed * 0.01);
              setFarmTime(remainingFarmTime);
              setIsFarmActive(true);
              startFarmInterval();
              setButtonText('Farming...');
            } else {
              setFarm(userData.farm + userData.farmTime * 0.01);
              setFarmTime(0);
              setIsFarmActive(false);
              setButtonText('Claim');
            }
          } else {
            setFarm(userData.farm);
            setFarmTime(userData.farmTime);
            setIsFarmActive(false);
            setButtonText('Start');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const saveData = async (additionalData = {}) => {
    try {
      await saveProgress(userId, {
        lastActiveFarmTime: Math.floor(Date.now() / 1000),
        farm,
        farmTime,
        isFarmActive,
        claimed,
        totalBal,
        ...additionalData, // Spread additionalData to include any other data needed
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
  }, [userId, farm, farmTime, isFarmActive, claimed, totalBal]);

  const startFarmInterval = () => {
    if (farmIntervalRef.current) return;
    farmIntervalRef.current = setInterval(() => {
      setFarmTime((prevFarmTime) => {
        if (prevFarmTime <= 0) {
          clearInterval(farmIntervalRef.current);
          farmIntervalRef.current = null;
          setIsFarmActive(false);
          setButtonText('Claim');
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
    setButtonText('Farming...');
  };

  const claimFarmRewards = async () => {
    const claimedAmount = farm;
    const newTotalBal = totalBal + claimedAmount;
    
    // Update the balance immediately
    addTotalBal(claimedAmount); 
  
    setFarm(0);
    setFarmTime(60);
    setClaimed(true);
    setButtonText('Start');
    
    // Persist data immediately after claiming
    await saveData({ totalBal: newTotalBal, claimed: true }); 
  };
  

  const handleButtonClick = () => {
    if (buttonText === 'Start') {
      startFarm();
    } else if (buttonText === 'Claim') {
      claimFarmRewards();
    }
  };

  return (
 
    <body class="min-h-screen bg-zinc-900 text-white flex flex-col justify-between">
    <div className="flex-grow flex flex-col items-center justify-start px-4 mt-8">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Lunar Token Farming</h1>
        </div>
    
        <div className="mt-4">
            <img src="avatar_url" alt="Avatar" className="w-16 h-16 rounded-full mx-auto"/>
            <p className="text-center text-zinc-400 italic mt-2">{userName ? `${userName} ` : ''}</p>
        </div>
    
        <div className="text-center mt-2 md:mt-4">
            <p className="text-zinc-400">Keep your farm thriving!</p>
        </div>
    
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-center py-3 px-6 rounded-lg flex justify-center items-center mt-5 transition transform hover:scale-105 hover:shadow-lg">
            <span className="material-icons mr-2">access_time</span>
            <p className="font-bold text-lg md:text-xl"><FormattedTime time={farmTime} /></p>
        </div>
    
        <div className="mt-8 bg-zinc-800 rounded-lg p-6 relative w-full max-w-sm transition transform hover:scale-105 hover:shadow-lg">
            <p className="text-center text-zinc-400">Era Reward</p>
            <p className="text-center text-4xl font-bold mt-2">
                {farm.toFixed(2)} <span className="text-purple-400">lunar</span>
            </p>
        </div>
    
        <button
            className="mt-4 bg-zinc-700 text-white py-2 px-6 rounded-lg transition transform hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleButtonClick}
            disabled={isFarmActive && farmTime > 0}
        >
            {buttonText}
        </button>
    </div>

  
    <div className="w-full max-w-md flex justify-around mt-4 fixed bottom-0 left-0 bg-zinc-800 py-2">
        <Footer />
    </div>
</body>


  );
};

export default Farm;
