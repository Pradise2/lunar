import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import imageList from '../utils/ImageList';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext';
import ProgressBar from '../Component/ProgressBar';
import TapImage from '../Component/TapImage';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setFirstName(user.first_name);
        alert(`User logged in: ${user.first_name}`);
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
          const savedData = localStorage.getItem(`gameData_${userId}`);
          if (savedData) {
            alert('Data found in local storage');
            const parsedData = JSON.parse(savedData);
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsed = currentTime - parsedData.lastActiveTime;
            const newTapTime = parsedData.tapTime - elapsed;

            setTapLeft(parsedData.tapLeft);
            setTapTime(newTapTime > 0 ? newTapTime : defaultData.tapTime);
            setLastActiveTime(parsedData.lastActiveTime);
            setTotalBal(parsedData.totalBal);
            setLevel(parsedData.level);
            setCompleted(parsedData.completed);
            setTaps(parsedData.taps);
          } else {
            alert('Fetching data for user from Firestore');
            const userDocRef = doc(db, 'Game', String(userId));
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              alert('User data found in Firestore');
              const data = userDoc.data();
              const currentTime = Math.floor(Date.now() / 1000);
              const elapsed = currentTime - data.lastActiveTime;
              const newTapTime = data.tapTime - elapsed;

              setTapLeft(data.tapLeft);
              setTapTime(newTapTime > 0 ? newTapTime : defaultData.tapTime);
              setLastActiveTime(data.lastActiveTime);
              setTotalBal(data.totalBal);
              setLevel(data.level);
              setCompleted(data.completed);
              setTaps(data.taps);
            } else {
              alert('No user data found, creating new document');
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
          alert('Error fetching data: ' + error.message);
          console.log('Error fetching data:', error);
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
      taps
    };
    try {
      const userDocRef = doc(db, 'Game', String(userId));
      await setDoc(userDocRef, dataToSave);
      localStorage.setItem(`gameData_${userId}`, JSON.stringify(dataToSave));
    } catch (error) {
      alert('Error saving data to Firestore: ' + error.message);
      console.log('Error saving data:', error);
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
    if (tapTime > 0) {
      const interval = setInterval(() => {
        setTapTime((prevTapTime) => {
          const newTapTime = prevTapTime - 1;
          if (newTapTime <= 0) {
            setTapLeft(defaultData.tapLeft);
            return defaultData.tapTime;
          }
          return newTapTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tapTime]);

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
