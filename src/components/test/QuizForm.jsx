import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const QuizForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const { user } = useContext(AuthContext);
  const { numQuestions } = useTest();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchQuestions = async () => {
      if (user && numQuestions > 0) {
        try {
          const response = await axios.post(`${apiBaseUrl}/tests/generate`, {
            userId: user.userId,
            numberOfQuestions: numQuestions
          });
          setQuestions(response.data);
          setAnswers(response.data.reduce((acc, question) => ({ ...acc, [question._id]: '' }), {}));
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
    };
    fetchQuestions();
  }, [numQuestions, user]);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Verificar si todas las preguntas han sido respondidas
    const allAnswered = questions.every(question => answers[question._id] !== '');
    if (!allAnswered) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, responde a todas las preguntas antes de enviar el test.',
      });
      return;
    }

    if (user && questions.length > 0) {
      try {
        const response = await axios.post(`${apiBaseUrl}/tests/complete`, {
          userId: user.userId,
          answers: Object.keys(answers).map(key => ({
            questionId: key,
            selectedOption: answers[key]
          }))
        });
        setResults(response.data);
        Swal.fire(
          '¡Buen trabajo!',
          'Respuestas enviadas y evaluadas correctamente',
          'success'
        );
      } catch (error) {
        console.error('Error submitting answers:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar',
          text: 'Ocurrió un error al enviar las respuestas.',
        });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Sesión no iniciada',
        text: 'Debe iniciar sesión y tener preguntas para enviar respuestas.',
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.length > 0 ? questions.map(question => (
          <div key={question._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">{question.question}</h3>
            <div className="mt-2">
              {question.options.map(option => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question_${question._id}`}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={(event) => handleOptionChange(question._id, event.target.value)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )) : <p>No hay preguntas disponibles.</p>}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Enviar Test</button>
      </form>
      {results && (
        <div className="mt-4 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">Resultados del Test:</h3>
          <p>Respuestas correctas: {results.correctAnswers}</p>
          <p>Respuestas incorrectas: {results.incorrectAnswers}</p>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
