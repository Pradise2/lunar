import React, { useEffect, useRef } from 'react';
import Footer from '../Component/Footer';
import FormattedTime from '../Component/FormattedTime';
import { useGlobalState } from '../Context/GlobalStateContext';
import { useTotalBal } from '../Context/TotalBalContext';

const Farm = () => {
  const { globalState, updateUserData } = useGlobalState();
  const { totalBal, addTotalBal } = useTotalBal();
  const farmIntervalRef = useRef(null);

  useEffect(() => {
    if (globalState.isFarmActive && globalState.farmTime > 0) {
      startFarmInterval();
    }

    return () => clearInterval(farmIntervalRef.current); // Clear interval on unmount
  }, [globalState.isFarmActive, globalState.farmTime]);

  const startFarmInterval = () => {
    farmIntervalRef.current = setInterval(() => {
      updateUserData({
        farmTime: globalState.farmTime - 1,
        farm: globalState.farm + 0.01,
      });
    }, 1000);
  };

  const startFarm = () => {
    updateUserData({ isFarmActive: true, claimed: false });
  };

  const claimFarmRewards = () => {
    clearInterval(farmIntervalRef.current);
    updateUserData({
      isFarmActive: false,
      farm: 0,
      farmTime: 60,
      totalBal: globalState.totalBal + globalState.farm,
      claimed: true,
    });
    addTotalBal(globalState.farm);
  };

  const handleButtonClick = () => {
    if (globalState.isFarmActive) {
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
        <p className="text-center font-bold"><FormattedTime time={globalState.farmTime} /></p>
      </div>
      <div className="mt-6 bg-zinc-800 rounded-lg p-6 relative">
        <p className="text-center text-zinc-400">Era Reward</p>
        <p className="text-center text-4xl font-bold mt-2">
          {globalState.farm.toFixed(2)} <span className="text-purple-400">lunar</span>
        </p>
      </div>
      <button
        className="mt-6 bg-zinc-700 text-white py-2 px-6 rounded-lg"
        onClick={handleButtonClick}
        disabled={globalState.isFarmActive && globalState.farmTime > 0}
      >
        {globalState.claimed ? 'Claimed' : (globalState.isFarmActive && globalState.farmTime === 0 ? 'Claim' : 'Start')}
      </button>
      <Footer className="mt-7 pt-6"/>
    </div>
  );
};

export default Farm;
