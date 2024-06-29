import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import imageList from '../utils/ImageList';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import ProgressBar from '../Component/ProgressBar';
import TapImage from '../Component/TapImage';
import { saveProgress, getProgress } from '../firebaseConfig';
import MoonAnimation from '../Animation/MoonAnimation';

const totalBalCom = (totalBal = 0) => {
  if (isNaN(totalBal)) {
    return '0.00';
  }
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

  window.Telegram.WebApp.expand();

  useEffect(() => {
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
    console.log('User ID changed:', userId);
    const fetchData = async () => {
      if (userId) {
        try {
          const userData = await getProgress(userId);
          console.log('User data from Firestore:', userData);

          setTapLeft(userData.tapLeft || defaultData.tapLeft);
          setTapTime(userData.tapTime || defaultData.tapTime);
          setLastActiveTime(userData.lastActiveTime || defaultData.lastActiveTime);
          setTotalBal(userData.totalBal || defaultData.totalBal);
          setLevel(userData.level || defaultData.level);
          setCompleted(userData.completed || defaultData.completed);
          setTaps(userData.taps || defaultData.taps);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } 
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = async () => {
    try {
      await saveProgress(userId, {
        tapLeft,
        tapTime,
        lastActiveTime: Math.floor(Date.now() / 1000),
        totalBal,
        level,
        completed,
        taps
      });
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (userId) {
        saveData();
        console.log('Saving user data before unload');
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userId) {
        saveData();
        console.log('Saving user data on cleanup');
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

    return () => {
      clearInterval(interval);
      console.log('Interval cleared');
    };
  }, [lastActiveTime]);

  useEffect(() => {
    console.log('Total Balance:', totalBal);
  }, [totalBal]);

  console.log('Rendering Home component');

  return (
    <>
     <body className="min-h-screen bg-zinc-900 text-white flex flex-col justify-between bg-cover bg-center">
    <div className="flex-grow flex flex-col items-center justify-start mt-4 pb-12">
        <div className=" rounded-lg text-center w-full max-w-md">
            <p className="p-2 text-zinc-400 font-bold text-2xl">Lunar Token</p>
            <p className="p-4 text-4xl font-bold">
                {totalBalCom(totalBal)} <span className="text-purple-400">lunar</span>
            </p>
        </div>

        <div className="text-center space-y-2">
            <p className="text-zinc-400">
                Won't stop! Tap time shows refill, {userId ? `${userId} ` : ''} but the fun won’t flop! <span className="text-yellow-400">👍</span>
            </p>
            <div className="flex justify-center space-x-4">
                <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-2 rounded-lg flex">
                    <p>{tapLeft} taps</p>
                </div>
                <div className="bg-gradient-to-r bg-yellow-800 p-2 rounded-lg flex items-center space-x-2">
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

        <div className="w-full justify-center ">
            <ProgressBar
                completed={completed}
                level={level}
                totalLevels={9}
            />
        </div>
    </div>

    <div className="w-full max-w-md fixed bottom-0 left-0 flex justify-around mt-4  bg-zinc-800 py-2">
        <Footer />
    </div>
</body>
    </>
  );
};

export default Home;
