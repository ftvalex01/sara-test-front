import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TestCard from './TestCard';
import TestDetails from './TestDetails';
import { AuthContext } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './TestStatistics.css';  // Estilos personalizados

const TestStatistics = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
      }
    };
    fetchTests();
  }, [user]);

  useEffect(() => {
    filterTests();
  }, [searchTerm, startDate, endDate, tests]);

  const filterTests = () => {
    let filtered = tests;
    if (startDate && endDate) {
      filtered = filtered.filter(test => {
        const testDate = new Date(test.createdAt);
        return testDate >= startDate && testDate <= endDate;
      });
    }
    if (searchTerm) {
      filtered = filtered.filter(test => test.testName?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredTests(filtered);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
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
    <div className="test-statistics">
      <h2 className="title">Estadísticas de Tests Realizados</h2>
      <div className="filters">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Inicio"
          isClearable
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Fin"
          isClearable
        />
        <input
          type="text"
          placeholder="Buscar test..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={clearFilters} className="clear-filters">Limpiar Filtros</button>
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
