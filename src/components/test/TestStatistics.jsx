import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TestCard from './TestCard';
import TestDetails from './TestDetails';

const TestStatistics = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

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

  const handleToggleDetails = testId => {
    const test = tests.find(t => t._id === testId);
    setSelectedTest(test);
  };

  const handleBack = () => {
    setSelectedTest(null);
  };
console.log(tests)
console.log(selectedTest)
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de Tests Realizados</h2>
      {!selectedTest && (
        <div>
          {tests.map((test) => (
            <TestCard
              key={test._id}
              test={test}
              onToggleDetails={handleToggleDetails}
            />
          ))}
        </div>
      )}
      {selectedTest && <TestDetails test={selectedTest} onBack={handleBack} />}
    </div>
  );
};

export default TestStatistics;
