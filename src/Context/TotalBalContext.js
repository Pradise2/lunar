import React, { createContext, useContext, useState } from 'react';

const TotalBalContext = createContext();

export const useTotalBal = () => {
  return useContext(TotalBalContext);
};

export const TotalBalProvider = ({ children }) => {
  const [totalBal, setTotalBal] = useState(0);

  const addTotalBal = (amount) => {
    setTotalBal((prevTotalBal) => prevTotalBal + amount);
  };

  return (
    <TotalBalContext.Provider value={{ totalBal, setTotalBal, addTotalBal }}>
      {children}
    </TotalBalContext.Provider>
  );
};
