import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestStatistics = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tests/completed`);
        setTests(response.data.map(test => ({ ...test, isOpen: false })));
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  const toggleDetails = index => {
    const newTests = tests.map((test, i) => {
      if (i === index) {
        return { ...test, isOpen: !test.isOpen };
      }
      return test;
    });
    setTests(newTests);
  };

 
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Tests Realizados</h2>
      <div>
        {tests.map((test, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={() => toggleDetails(index)}>
            <h3 className="text-lg font-bold">{test.testName} - {test.date}</h3>
            <p className="text-sm text-gray-600">Puntuación: {test.score}</p>
            {test.isOpen && (
              <div className="mt-2 text-gray-800">
                <p>Detalles del Test:</p>
                {/* Asumiendo que los detalles se encuentran bien definidos en tu backend */}
                <p>{test.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestStatistics;
