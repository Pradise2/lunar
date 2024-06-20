// src/MoonPhase.js
import React from "react";

const moonPhases = [
  "new",
  "waxing_crescent",
  "first_quarter",
  "waxing_gibbous",
  "full",
  "waning_gibbous",
  "last_quarter",
  "waning_crescent",
];

const phaseToSVG = {
  new: <circle cx="50" cy="50" r="30" fill="black" />,
  waxing_crescent: (
    <path
      d="M 50 20
         A 30 30 0 1 0 50 80
         A 15 30 0 0 1 50 20"
      fill="white"
    />
  ),
  first_quarter: (
    <path
      d="M 50 20
         A 30 30 0 1 0 50 80
         L 50 20"
      fill="white"
    />
  ),
  waxing_gibbous: (
    <path
      d="M 50 20
         A 30 30 0 1 0 50 80
         A 15 30 0 0 0 50 20"
      fill="white"
    />
  ),
  full: <circle cx="50" cy="50" r="30" fill="white" />,
  waning_gibbous: (
    <path
      d="M 50 20
         A 30 30 0 1 1 50 80
         A 15 30 0 0 0 50 20"
      fill="white"
    />
  ),
  last_quarter: (
    <path
      d="M 50 20
         A 30 30 0 1 1 50 80
         L 50 20"
      fill="white"
    />
  ),
  waning_crescent: (
    <path
      d="M 50 20
         A 30 30 0 1 1 50 80
         A 15 30 0 0 1 50 20"
      fill="white"
    />
  ),
};

const MoonPhase = ({ phase }) => (
  <svg width="150" height="150" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="30" fill="black" />
    {phaseToSVG[phase]}
  </svg>
);

export default MoonPhase;
