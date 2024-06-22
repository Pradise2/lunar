import React, { useState, useRef } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';

const Farm = () => {
  const [farmTime, setFarmTime] = useState(60);
  const [farm, setFarm] = useState(0);
  const [isFarmActive, setIsFarmActive] = useState(false);
  const [claimed, setClaimed] = useState(false); // State to track if rewards are claimed
  const farmIntervalRef = useRef(null);
  const { addTotalBal } = useTotalBal();

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
    setFarm(0);
    setFarmTime(60);
    setClaimed(true);
  };

  const handleButtonClick = () => {
    if (isFarmActive) {
      claimFarmRewards();
    } else {
      startFarm();
    }
  };

  return (
    <div class="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Lunar Token Farming</h1>
      <p class="mt-6">keep your farm thriving!</p>
    </div>
    <div className="bg-gradient-to-r  bg-zinc-800 text-center py-2 px-4 rounded-lg mr-4 flex justify-center mt-5">
      <span className="material-icons">access_time</span>
      <p className="text-center font-bold"><FormattedTime time={farmTime} /></p>
    </div>
    <div class="mt-6 bg-zinc-800 rounded-lg p-6 relative">
      <p class="text-center text-zinc-400"> Era Reward</p>
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
