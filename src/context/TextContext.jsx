import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [numQuestions, setNumQuestions] = useState(0);
  const [numErrorQuestions, setNumErrorQuestions] = useState(0);
  const [timeLimit, setTimeLimit] = useState(null); 

  const resetTests = async (userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tests/reset/${userId}`);
      if (response.data.success) {
        setNumQuestions(0);
        setNumErrorQuestions(0);
        setTimeLimit(null);
        return response.data.success
      } else {
        console.error('Error resetting tests:', response.data.error);
      }
    } catch (error) {
      console.error('Error resetting tests:', error);
    }
  };

  return (
    <TestContext.Provider value={{ numQuestions, setNumQuestions, numErrorQuestions, setNumErrorQuestions, timeLimit, setTimeLimit, resetTests }}>
      {children}
    </TestContext.Provider>
  );
};
