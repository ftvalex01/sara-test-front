import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizSetupForm = () => {
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const num = parseInt(numQuestions);
    if (num < 1 || num > 20 || isNaN(num)) {
      setError('Por favor, introduce un número entre 1 y 20');
      return;
    }
    navigate(`/quiz/${num}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <label htmlFor="numQuestions" className="block text-gray-700 text-sm font-bold mb-2">
          Número de preguntas del test
        </label>
        <input
          id="numQuestions"
          type="number"
          placeholder="Número de preguntas"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Empezar Test
      </button>
    </form>
  );
};

export default QuizSetupForm;
