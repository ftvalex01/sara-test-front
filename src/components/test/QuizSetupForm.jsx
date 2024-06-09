import React, { useState, useEffect, useContext } from 'react';
import { useTest } from '../../context/TextContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const QuizSetupForm = () => {
  const [numQuestionsInput, setNumQuestionsInput] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [error, setError] = useState('');
  const [testName, setTestName] = useState('');
  const [withTime, setWithTime] = useState(false);
  const [timeMinutes, setTimeMinutes] = useState(5); 
  const { setNumQuestions, setTimeLimit } = useTest(); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAvailableQuestions = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${apiBaseUrl}/tests/available-questions`, {
            params: {
              userId: user.userId,
              category: user.category
            }
          });
          const questions = response.data;
          setTotalQuestions(questions.length);
        } catch (error) {
          console.error('Error fetching available questions:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el número total de preguntas disponibles.',
          });
        }
      }
    };
    fetchAvailableQuestions();
  }, [user, apiBaseUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const num = parseInt(numQuestionsInput);
    if (!testName || testName.length > 50) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del test es obligatorio',
      });
      return;
    }
    if (isNaN(num) || num < 1 || num > 20) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'Por favor, introduce un número entre 1 y 20',
      });
      return;
    }
    setNumQuestions(num);
    setTimeLimit(withTime ? timeMinutes * 60 : null);
    navigate("/quiz/start", { state: { numberOfQuestions: num, testName, category: user.category } });
  };

  const sanitizeInput = (value) => {
    return value.replace(/<[^>]*>?/gm, '').substring(0, 50);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-900 shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Configurar Test</h2>
        <div>
          <label htmlFor="testName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre del Test</label>
          <input
            id="testName"
            type="text"
            value={testName}
            onChange={(e) => setTestName(sanitizeInput(e.target.value))}
            placeholder="Ingrese un nombre para el test"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
            maxLength="50"
            pattern="^[a-zA-Z0-9\s]+$"
            title="El nombre del test debe contener solo letras y números"
          />
        </div>
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Número de preguntas del test (disponibles: {totalQuestions})
          </label>
          <input
            id="numQuestions"
            type="number"
            placeholder="Número de preguntas"
            value={numQuestionsInput}
            onChange={(e) => setNumQuestionsInput(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
            min="1"
            max="20"
          />
        </div>
        {/* <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="withTime"
            checked={withTime}
            onChange={(e) => setWithTime(e.target.checked)}
            className="form-checkbox"
          />
          <label htmlFor="withTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Configurar límite de tiempo</label>
        </div>
        {withTime && (
          <div>
            <label htmlFor="timeMinutes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Minutos:</label>
            <input
              id="timeMinutes"
              type="number"
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
              min="1"
              max="120"
            />
          </div>
        )} */}
        {error && <p className="text-red-500 text-xs italic dark:text-red-400">{error}</p>}
        <button 
          type="submit" 
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105 ${
            totalQuestions === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={totalQuestions === 0}
        >
          Empezar Test
        </button>
      </form>
    </div>
  );
};

export default QuizSetupForm;
