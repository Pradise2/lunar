import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import imageList from '../utils/ImageList';
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext'; 
import MoonAnimation from '../Animation/MoonAnimation';
import ProgressBar from '../Component/ProgressBar';
import TapImage from '../Component/TapImage';
import { db } from '../firebaseConfig'; // Import your Firestore instance
import { collection, setDoc } from 'firebase/firestore'; // Import Firestore functions

// Function to format numbers with commas and two decimal places
const totalBalCom = (totalBal) => {
  const fixedNumber = totalBal.toFixed(2);
  return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [tapLeft, setTapLeft] = useState(1000);
  const [tapTime, setTapTime] = useState(60); // Initial tap time in seconds
  const [taps, setTaps] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const { totalBal, addTotalBal } = useTotalBal(); 
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(0);

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

  // Save data to Firestore when userId changes
  useEffect(() => {
    if (userId !== null) {
      try {
        // Reference to the 'Game' collection and set document with userId
        const gameRef = collection(db, 'Game');
        const userDoc = setDoc(gameRef.doc(userId), {
          tapLeft,
          tapTime,
          totalBal,
          level,
          completed,
          taps
        });
      } catch (error) {
        console.error('Error saving data to Firestore:', error);
        // Handle the error, e.g., display an error message to the user
      }
    }
  }, [userId, tapLeft, tapTime, totalBal, level, completed, taps]);

  // Simulate loading data for the initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout duration as needed
    return () => clearTimeout(timer);
  }, []); 

  // Countdown timer for tapTime
  useEffect(() => {
    if (tapTime > 0) {
      const interval = setInterval(() => {
        setTapTime(prevTapTime => prevTapTime - 1);
      }, 1000); 
      return () => clearInterval(interval);
    } else {
      setTapLeft(1000);
      setTapTime(60); // Reset tapTime
    }
  }, [tapTime]);

  // Show loading animation if data is still loading
  if (isLoading) {
    return <MoonAnimation />;
  }

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
