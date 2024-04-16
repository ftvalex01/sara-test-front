import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Asegúrate de tener el contexto de autenticación

const ErrorQuizForm = () => {
  const { user } = useContext(AuthContext); // Asumimos que el usuario está almacenado en el contexto
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchErrorQuestions = async () => {
      if (user) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/tests/faults/${user.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // Asume que usas autenticación JWT
            }
          });
          setQuestions(response.data);
        } catch (error) {
          console.error('Error fetching error questions:', error);
        }
      }
    };

    fetchErrorQuestions();
  }, [user]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Aquí podrías enviar estas respuestas al servidor para evaluarlas
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/questions/check-answers`, { answers: Object.keys(answers).map(key => ({ questionId: key, selectedOption: answers[key] })) });
      console.log(response.data); // O manejar la respuesta como consideres necesario
      alert('Respuestas enviadas y evaluadas!');
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map(question => (
        <div key={question._id} className="block p-4 shadow-lg rounded-lg bg-white">
          <h3 className="text-lg font-semibold">{question.questionText}</h3>
          <div className="mt-2">
            {question.options.map(option => (
              <label key={option} className="inline-flex items-center mt-3">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-gray-600"
                  name={`question_${question._id}`}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleOptionChange(question._id, option)}
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Enviar Test de Errores
      </button>
    </form>
  );
};

export default ErrorQuizForm;
