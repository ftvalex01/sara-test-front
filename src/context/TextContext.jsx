// /context/TestContext.js
import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [numQuestions, setNumQuestions] = useState(0);
  const [timeLimit, setTimeLimit] = useState(null); // Estado para el límite de tiempo

  return (
    <TestContext.Provider value={{ numQuestions, setNumQuestions, timeLimit, setTimeLimit }}>
      {children}
    </TestContext.Provider>
  );
};
