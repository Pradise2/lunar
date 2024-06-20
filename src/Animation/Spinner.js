import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SpinnerCircle = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #1d72b8;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const Spinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerCircle /> 
    </SpinnerContainer>
  );
};

export default Spinner;
