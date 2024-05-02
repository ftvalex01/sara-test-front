import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';

const ErrorQuizSetupForm = () => {
  const [numErrorQuestionsInput, setNumErrorQuestionsInput] = useState('');
  const [totalErrorQuestions, setTotalErrorQuestions] = useState(0);
  const [testName, setTestName] = useState('');
  const [error, setError] = useState('');
  const { setNumErrorQuestions } = useTest();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userId) {
      axios.get(`${process.env.REACT_APP_API_URL}/tests/count-faults/${user.userId}`)
        .then(response => {
          setTotalErrorQuestions(response.data.count);
        })
        .catch(error => {
          console.error('Error fetching error questions count:', error);
          setError('No se pudo cargar el número total de preguntas de errores disponibles.');
        });
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const num = parseInt(numErrorQuestionsInput);
    if (isNaN(num) || num < 1 || num > 20) {
      alert(`Por favor, introduce un número entre 1 y 20`);
      return;
    }
    setNumErrorQuestions(num);
    navigate("/error-quiz/start",{ state: { numberOfQuestions: num, testName } });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="testName" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Test:</label>
        <input
          id="testName"
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Ingrese un nombre para el test"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="numErrorQuestions" className="block text-gray-700 text-sm font-bold mb-2">Número de preguntas de errores:</label>
        <input
          id="numErrorQuestions"
          type="number"
          value={numErrorQuestionsInput}
          onChange={(e) => setNumErrorQuestionsInput(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <div className="mb-6">
        <p className="text-sm">Preguntas de errores disponibles: {totalErrorQuestions}</p>
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Configurar Test de Errores</button>
      </div>
    </form>
  );
};

export default ErrorQuizSetupForm;
