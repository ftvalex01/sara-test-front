import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TestCard from './TestCard';
import TestDetails from './TestDetails';
import { AuthContext } from '../../context/AuthContext';
import './TestStatistics.css';
import Swal from 'sweetalert2';

const TestStatistics = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tests/completed/${user.userId}`);
        const sortedTests = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTests(sortedTests);
        setFilteredTests(sortedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las estadísticas de los tests.',
        });
      }
    };
    fetchTests();
  }, [user]);

  useEffect(() => {
    filterTests();
  }, [searchTerm, startDate, tests]);

  const filterTests = () => {
    let filtered = tests;
    if (startDate) {
      filtered = filtered.filter((test) => {
        const testDate = new Date(test.createdAt);
        return testDate.getDate() === startDate.getDate() &&
          testDate.getMonth() === startDate.getMonth() &&
          testDate.getFullYear() === startDate.getFullYear();
      });
    }
    if (searchTerm) {
      filtered = filtered.filter((test) => test.testName?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredTests(filtered);
  };

  const clearFilters = () => {
    setStartDate(null);
    setSearchTerm('');
    setFilteredTests(tests);
  };

  const handleToggleDetails = testId => {
    const test = tests.find(t => t._id === testId);
    setSelectedTest(test);
  };

  const handleBack = () => {
    setSelectedTest(null);
  };

  return (
    <div className="test-statistics h-full bg-gray-100 dark:bg-gray-800">
      <h2 className="title dark:text-gray-200">Estadísticas de Tests Realizados</h2>
      <div className="filters">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fecha"
          isClearable
          className="dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar test..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
        />
        <button onClick={clearFilters} className="clear-filters dark:bg-gray-700 dark:text-gray-200">
          Limpiar Filtros
        </button>
      </div>
      <div className="test-container">
        {!selectedTest ? filteredTests.map((test) => (
          <TestCard key={test._id} test={test} onToggleDetails={handleToggleDetails} />
        )) : <TestDetails test={selectedTest} onBack={handleBack} />}
      </div>
    </div>
  );
};

export default TestStatistics;
