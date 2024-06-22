import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import imageList from '../utils/ImageList';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext'; 
import ProgressBar from '../Component/ProgressBar';
import TapImage from '../Component/TapImage';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const totalBalCom = (totalBal) => {
  const fixedNumber = totalBal.toFixed(2);
  return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [tapLeft, setTapLeft] = useState(1000);
  const [tapTime, setTapTime] = useState(300);
  const [lastActiveTime, setLastActiveTime] = useState(null);
  const [taps, setTaps] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const { totalBal, setTotalBal, addTotalBal } = useTotalBal(); 
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(0);

  window.Telegram.WebApp.expand();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setFirstName(user.first_name);
        console.log(`User logged in: ${user.first_name}`);
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
        console.log('Fetching data for user:', userId);
        const userDocRef = doc(db, 'Game', String(userId));
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setTapLeft(data.tapLeft);
          setTapTime(data.tapTime);
          setLastActiveTime(data.lastActiveTime);
          setTotalBal(data.totalBal);
          setLevel(data.level);
          setCompleted(data.completed);
          setTaps(data.taps);

          const currentTime = Math.floor(Date.now() / 1000);
          const elapsed = currentTime - data.lastActiveTime;
          const newTapTime = data.tapTime - elapsed;

          if (newTapTime > 0) {
            setTapTime(newTapTime);
          } else {
            setTapLeft(1000);
            setTapTime(300);
          }
        } else {
          console.log('No user data found, using default values');
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, setTotalBal]);

  const saveData = async () => {
    try {
      const userDocRef = doc(db, 'Game', String(userId));
      await setDoc(userDocRef, {
        tapLeft,
        tapTime,
        lastActiveTime: Math.floor(Date.now() / 1000),
        totalBal,
        level,
        completed,
        taps
      });
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
      alert(`Error saving data: ${error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (userId) {
        saveData();
      }
    };
  }, [userId, tapLeft, tapTime, totalBal, level, completed, taps]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        saveData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userId, tapLeft, tapTime, totalBal, level, completed, taps]);

  useEffect(() => {
    if (tapTime > 0) {
      const interval = setInterval(() => {
        setTapTime(prevTapTime => prevTapTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTapLeft(1000);
      setTapTime(300);
    }
  }, [tapTime]);

 

  return (
    <div className="p-7 min-h-screen bg-zinc-900 text-white flex flex-col items-center">
      <div className="p-2 rounded-lg text-center w-full max-w-md">
        <p className="p-3 text-zinc-400 font-bold text-2xl ">Lunar Token</p>
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
  );
};

export default Home;
