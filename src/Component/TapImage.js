import React, { useState, useEffect } from 'react';
import './image.css';

const TapImage = ({ images, level, taps, setTaps, setLevel, addTotalBal, setCompleted, tapLeft, setTapLeft, tapTime, setTapTime }) => {
  const [imageSrc, setImageSrc] = useState(images[0]);
  const [clicked, setClicked] = useState(false);

  // Handle click event for the image
  const handleClickC3 = () => {
    if (tapLeft > 0 && tapTime > 0 && level <= 9) {
      setClicked(true); // Set clicked state to true on click

      setTapLeft(tapLeft - 1);
      setTaps(taps + 1);
      addTotalBal(0.1); // Update totalBal using addTotalBal from context

      const newCompleted = ((taps + 1) % 20) * 5; // Each tap is 5% progress (20 taps for 100%)
      setCompleted(newCompleted);

      if (taps + 1 >= 20 && level < 9) {
        setLevel(prevLevel => prevLevel + 1); // Increase level after 20 taps
        setTaps(0); // Reset taps
      }

      // Reset the clicked state after a delay (e.g., 200ms) if you want to remove the effect
      setTimeout(() => setClicked(false), 200);
    }
  };

  // Update imageSrc based on the level, but only up to level 9
  useEffect(() => {
    setImageSrc(images[Math.min(level, 9)]); // Change image source based on the current level
  }, [level, images]);

  return (
    <div className="flex justify-center pt-7">
      <img
        id="C3"
        src={imageSrc}
        alt="Lunar Token"
        srcset=""
        class="image-hover"
        style={{ width: '200px', height: '200px' }}
        onClick={handleClickC3}
      />
    </div>
  );
};

export default TapImage;
