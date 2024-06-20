// src/MoonAnimation.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoonPhase from './MoonPhase';
import backgroundImage from './backiee-248000.jpg'; // Ensure you have an appropriate path to your background image

const moonPhases = [
  'new',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full',
  'waning_gibbous',
  'last_quarter',
  'waning_crescent',
];

const MoonAnimation = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhaseIndex((prevIndex) => (prevIndex + 1) % moonPhases.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      x: "-50vw"
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: "0vw",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: "50vw",
      transition: { duration: 0.5 }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <AnimatePresence>
        <motion.div
          key={currentPhaseIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <MoonPhase phase={moonPhases[currentPhaseIndex]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoonAnimation;
