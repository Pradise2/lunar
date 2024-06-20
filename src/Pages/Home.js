import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import tapps from '../images/tapps.png';
import blue from '../images/blue.webp'
import a from "../images/a.jpg";
import b from "../images/b.jpg";
import c from "../images/c.jpg";
import d from "../images/d.jpg";
import e from "../images/e.jpg";
import f from "../images/f.jpg";
import g from "../images/g.jpg";
import h from "../images/h.jpg";
import i from "../images/i.jpg";
import FormattedTime from '../Component/FormattedTime';
import { useTotalBal } from '../Context/TotalBalContext'; 
import MoonAnimation from '../Animation/MoonAnimation';
import ProgressBar from '../Component/ProgressBar';

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
  const images = [tapps,blue, a, b, c, d, e, f, g, h, i]; // Array of images for each level
  // Set initial image source based on the initial level
  const [imageSrc, setImageSrc] = useState(images[0]); 

  window.Telegram.WebApp.expand();

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

  // Handle click event for the image
  const handleClickC3 = () => {
    if (tapLeft > 0 && tapTime > 0 && level <= 9) {
      setTapLeft(tapLeft - 1);
      setTaps(taps + 1);
      addTotalBal(0.1); // Update totalBal using addTotalBal from context

      const newCompleted = ((taps + 1) % 20) * 5; // Each tap is 5% progress (20 taps for 100%)
      setCompleted(newCompleted);

      if (taps + 1 >= 20 && level < 9) {
        setLevel(prevLevel => prevLevel + 1); // Increase level after 20 taps
        setTaps(0); // Reset taps
      }
    }
  };

  // Update imageSrc based on the level, but only up to level 9
  useEffect(() => {
    setImageSrc(images[Math.min(level, 9)]); // Change image source based on the current level
  }, [level, images]);

  // Show loading animation if data is still loading
  if (isLoading) {
    return <MoonAnimation />;
  }

  return (
    <div className="p-7 min-h-screen bg-zinc-900 text-white flex flex-col items-center">
      <div className="p-2 rounded-lg text-center w-full max-w-md">
        <p className="p-3 text-zinc-400 font-bold">Lunar Token</p>
        <p className="p-4 text-4xl font-bold">
          {totalBalCom(totalBal)} <span className="text-purple-400">lunar</span>
        </p>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-zinc-400">
          Won't stop! Tap time shows refill, {userId ? `${userId} ` : ''} but the fun won’t flop! <span className="text-yellow-400">👍</span>
        </p>
        <div className=" flex justify-center space-x-4">
          <div className="bg-purple-800 p-2 rounded-lg flex">
            <p>{tapLeft} taps left</p>
          </div>
          <div className="bg-yellow-800 p-2 rounded-lg flex items-center space-x-2">
            <span className="material-icons">access_time</span>
            <p><FormattedTime time={tapTime} /></p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-7">
      <img
  id="C3"
  src={imageSrc}
  alt="Lunar Token"
  className="rounded-full cursor-pointer"
  style={{ width: '200px', height: '200px'}}
  onClick={handleClickC3}
/>
      </div>
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
