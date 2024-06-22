import React, { useState, useEffect, useCallback } from 'react';
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
  const [userData, setUserData] = useState({ ...defaultData });
  const [userId, setUserId] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { totalBal, setTotalBal, addTotalBal } = useTotalBal();

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setFirstName(user.first_name);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const fetchedData = await getProgress(userId);
          const combinedData = { ...defaultData, ...fetchedData };
          setUserData(combinedData);
          setTotalBal(combinedData.totalBal);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = useCallback(async () => {
    try {
      await saveProgress(userId, {
        ...userData,
        lastActiveTime: Math.floor(Date.now() / 1000),
        totalBal, // Make sure to include the latest totalBal from the context
      });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [userId, userData, totalBal]);

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
  }, [userId, saveData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserData((prevData) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsed = currentTime - prevData.lastActiveTime;
        const newTapTime = prevData.tapTime - elapsed;

        if (newTapTime <= 0) {
          return { ...prevData, tapLeft: defaultData.tapLeft, tapTime: defaultData.tapTime, lastActiveTime: currentTime };
        }

        return { ...prevData, tapTime: newTapTime, lastActiveTime: currentTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userData.lastActiveTime]);

  const { tapLeft, tapTime, level, completed, taps } = userData;

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
            setTaps={(taps) => setUserData((data) => ({ ...data, taps }))}
            setLevel={(level) => setUserData((data) => ({ ...data, level }))}
            addTotalBal={addTotalBal}
            setCompleted={(completed) => setUserData((data) => ({ ...data, completed }))}
            tapLeft={tapLeft}
            setTapLeft={(tapLeft) => setUserData((data) => ({ ...data, tapLeft }))}
            tapTime={tapTime}
            setTapTime={(tapTime) => setUserData((data) => ({ ...data, tapTime }))}
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
