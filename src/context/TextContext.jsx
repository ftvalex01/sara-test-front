// /context/TestContext.js
import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [numQuestions, setNumQuestions] = useState(0);

  return (
    <TestContext.Provider value={{ numQuestions, setNumQuestions }}>
      {children}
    </TestContext.Provider>
  );
};
