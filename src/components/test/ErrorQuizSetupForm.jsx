import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2';

const ErrorQuizSetupForm = () => {
  const [numErrorQuestionsInput, setNumErrorQuestionsInput] = useState('');
  const [totalErrorQuestions, setTotalErrorQuestions] = useState(0);
  const [testName, setTestName] = useState('');
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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el número total de preguntas de errores disponibles.',
          });
        });
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const num = parseInt(numErrorQuestionsInput);
    if (!testName || testName.length > 50) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del test es obligatorio y debe tener menos de 50 caracteres',
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
    setNumErrorQuestions(num);
    navigate("/error-quiz/start", { state: { numberOfQuestions: num, testName, category: user.category } });
  };

  const sanitizeInput = (value) => {
    return value.replace(/<[^>]*>?/gm, '').substring(0, 50);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Configurar Test de Errores</h2>
        <h3 className="text-1xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Aqui puedes realizar test con las preguntas falladas anteriormente</h3>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Preguntas de errores disponibles: {totalErrorQuestions}</p>
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
          <label htmlFor="numErrorQuestions" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Número de preguntas de errores:</label>
          <input
            id="numErrorQuestions"
            type="number"
            value={numErrorQuestionsInput}
            onChange={(e) => setNumErrorQuestionsInput(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
            min="1"
            max="20"
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105 ${
              totalErrorQuestions === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={totalErrorQuestions === 0}
          >
            Configurar Test de Errores
          </button>
        </div>
      </form>
    </div>
  );
};

export default ErrorQuizSetupForm;
