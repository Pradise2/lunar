// src/components/MoonP.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const PhaseContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.p`
  margin-top: 10px;
  font-size: 1.2em;
  text-align: center;
`;

const phasesStyles = {
  "New Moon": { backgroundColor: "black" },
  "Waxing Crescent": {
    backgroundImage: "radial-gradient(circle at 75% 50%, white 20%, black 20%)",
  },
  "First Quarter": {
    backgroundImage: "linear-gradient(to right, white 50%, black 50%)",
  },
  "Waxing Gibbous": {
    backgroundImage: "radial-gradient(circle at 25% 50%, white 75%, black 75%)",
  },
  "Full Moon": { backgroundColor: "white" },
  "Waning Gibbous": {
    backgroundImage: "radial-gradient(circle at 75% 50%, black 75%, white 75%)",
  },
  "Last Quarter": {
    backgroundImage: "linear-gradient(to right, black 50%, white 50%)",
  },
  "Waning Crescent": {
    backgroundImage: "radial-gradient(circle at 25% 50%, black 20%, white 20%)",
  },
  "Blue Moon": { backgroundColor: "blue" },
  "Supermoon": { backgroundColor: "yellow", transform: "scale(1.2)" },
  "Micromoon": { backgroundColor: "gray", transform: "scale(0.8)" },
  "Blood Moon": { backgroundColor: "red" },
  "Harvest Moon": { backgroundColor: "orange" },
  "Hunter's Moon": { backgroundColor: "darkred" },
  "Black Moon": { backgroundColor: "black" },
  "Strawberry Moon": { backgroundColor: "pink" },
  "Wolf Moon": { backgroundColor: "lightgray" },
  "Snow Moon": { backgroundColor: "lightblue" },
};

export const MoonP = ({ phase }) => {
  const style = phasesStyles[phase] || { backgroundColor: "gray" }; // Default style

  return (
    <PhaseContainer
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Label>{phase}</Label>
    </PhaseContainer>
  );
};

MoonP.propTypes = {
  phase: PropTypes.string.isRequired,
};