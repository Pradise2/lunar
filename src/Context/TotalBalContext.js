
import React, { createContext, useContext, useState } from 'react';

const TotalBalContext = createContext();

export const TotalBalProvider = ({ children }) => {
  const [totalBal, setTotalBal] = useState(0);

  const addTotalBal = (amount) => {
    setTotalBal(prevTotalBal => prevTotalBal + amount);
  };

  return (
    <TotalBalContext.Provider value={{ totalBal, addTotalBal }}>
      {children}
    </TotalBalContext.Provider>
  );
};

export const useTotalBal = () => useContext(TotalBalContext);
