import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import imageList from '../utils/ImageList';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import ProgressBar from '../Component/ProgressBar';
import TapImage from '../Component/TapImage';
import { saveProgress, getProgress } from '../firebaseConfig';
import MoonAnimation from '../Animation/MoonAnimation';

const totalBalCom = (totalBal) => {
  const fixedNumber = totalBal.toFixed(2);
  return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const defaultData = {
  tapLeft: 1000,
  tapTime: 300,
  lastActiveTime: Math.floor(Date.now() / 1000),
  totalBal: 0,
  level: 1,
  completed: 0,
  taps: 0,
};

const Home = () => {
  const [userId, setUserId] = useState(null);
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
      try {
        const userData = await getProgress(userId);
        setTapLeft(userData.tapLeft);
        setTapTime(userData.tapTime);
        setLastActiveTime(userData.lastActiveTime);
        setTotalBal(userData.totalBal);
        setLevel(userData.level);
        setCompleted(userData.completed);
        setTaps(userData.taps);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = async () => {
    try {
      await saveProgress(userId, {
        tapLeft,
        tapTime,
        lastActiveTime: Math.floor(Date.now() / 1000), // Update lastActiveTime on save
        totalBal,
        level,
        completed,
        taps
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

  return (
    <>
      {isLoading ? (
        <MoonAnimation />
      ) : (
        <div className="p-7 min-h-screen bg-zinc-900 text-white flex flex-col items-center">
          <div className="p-2 rounded-lg text-center w-full max-w-md">
            <p className="p-3 text-zinc-400 font-bold text-2xl">Lunar Token</p>
            <p className="p-4 text-4xl font-bold">
              {totalBalCom(totalBal)} <span className="text-purple-400">lunar</span>
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-zinc-400">
              Won't stop! Tap time shows refill, {userId ? `${userId} ` : ''} but the fun won’t flop! <span className="text-yellow-400">👍</span>
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-purple-800 p-2 rounded-lg flex">
                <p>{tapLeft} taps left</p>
              </div>
              <div className="bg-yellow-800 p-2 rounded-lg flex items-center space-x-2">
                <span className="material-icons">access_time</span>
                <p><FormattedTime time={tapTime} /></p>
              </div>
            </div>
          </div>

          <TapImage
            images={imageList}
            level={level}
            taps={taps}
            setTaps={setTaps}
            setLevel={setLevel}
            addTotalBal={addTotalBal}
            setCompleted={setCompleted}
            tapLeft={tapLeft}
            setTapLeft={setTapLeft}
            tapTime={tapTime}
            setTapTime={setTapTime}
          />

          <div className="w-full justify-center">
            <ProgressBar
              completed={completed}
              level={level}
              totalLevels={9}
            />
          </div>
          <div className="w-full max-w-md flex justify-around">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
