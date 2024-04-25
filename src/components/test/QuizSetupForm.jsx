import React, { useState, useEffect, useContext } from 'react';
import { useTest } from '../../context/TextContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const QuizSetupForm = () => {
  const [numQuestionsInput, setNumQuestionsInput] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [error, setError] = useState('');
  const [withTime, setWithTime] = useState(false);
  const [timeMinutes, setTimeMinutes] = useState(5); // Default time is 5 minutes
  const { setNumQuestions, setTimeLimit } = useTest(); // Assume you have a setTimeLimit function in your context
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAvailableQuestions = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.post(`${apiBaseUrl}/tests/generate`, {
            userId: user.userId,
            numberOfQuestions: 0
          });
          setTotalQuestions(response.data.length);
        } catch (error) {
          console.error('Error fetching available questions:', error);
          setError('No se pudo cargar el número total de preguntas disponibles.');
        }
      }
    };
    fetchAvailableQuestions();
  }, [user, apiBaseUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const num = parseInt(numQuestionsInput);
    if (isNaN(num) || num < 1 || num > 20) {
      setError(`Por favor, introduce un número entre 1 y 20`);
      return;
    }
    setNumQuestions(num);
    setTimeLimit(withTime ? timeMinutes * 60 : null); // Convert minutes to seconds
    navigate("/quiz/start");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <label htmlFor="numQuestions" className="block text-gray-700 text-sm font-bold mb-2">
          Número de preguntas del test (disponibles: {totalQuestions})
        </label>
        <input
          id="numQuestions"
          type="number"
          placeholder="Número de preguntas"
          value={numQuestionsInput}
          onChange={(e) => setNumQuestionsInput(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {/* <div className="mb-6">
        <label htmlFor="withTime" className="block text-gray-700 text-sm font-bold mb-2">
          ¿Deseas un test con tiempo?
        </label>
        <input
          id="withTime"
          type="checkbox"
          checked={withTime}
          onChange={(e) => setWithTime(e.target.checked)}
          className="mr-2 leading-tight"
        />
        <label htmlFor="withTime" className="text-gray-700">Sí</label>
      </div>
      {withTime && (
        <div className="mb-6">
          <label htmlFor="timeMinutes" className="block text-gray-700 text-sm font-bold mb-2">
            Duración del test (minutos)
          </label>
          <input
            id="timeMinutes"
            type="number"
            placeholder="Duración en minutos"
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )} */}
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Empezar Test
      </button>
    </form>
  );
};

export default QuizSetupForm;
