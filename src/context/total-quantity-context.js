"use client";
import { useState, createContext, useContext } from "react";

const TotalQuantityContext = createContext(null);

const useTotalQuantity = () => {
  const { totalQuantity, setTotalQuantity } = useContext(TotalQuantityContext);
  return { totalQuantity, setTotalQuantity };
};

const TotalQuantityProvider = ({ children }) => {
  const [totalQuantity, setTotalQuantity] = useState();

  return (
    <TotalQuantityContext.Provider value={{ totalQuantity, setTotalQuantity }}>
      {children}
    </TotalQuantityContext.Provider>
  );
};

export { useTotalQuantity, TotalQuantityProvider };
