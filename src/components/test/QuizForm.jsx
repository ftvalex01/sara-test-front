import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { useLocation } from 'react-router-dom';

const QuizForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [testName, setTestName] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const { state } = useLocation(); 
  const { user } = useContext(AuthContext);
  const { numQuestions } = useTest();
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (state && state.testName) {
      setTestName(state.testName);
    }
  }, [state]);
  useEffect(() => {
    const fetchQuestions = async () => {
      if (user && numQuestions > 0) {
        try {
          const response = await axios.post(`${apiBaseUrl}/tests/generate`, {
            userId: user.userId,
            numberOfQuestions: numQuestions,
            testName: testName 
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
                })),
                testName
            });
            setResults(response.data);
            const updatedQuestions = questions.map(q => {
                const detail = response.data.details.find(d => d.questionId === q._id);
                return {
                    ...q,
                    isCorrect: detail.isCorrect,
                    correctAnswer: q.correct_answer // Asume que obtienes esto desde el backend
                };
            });
            setQuestions(updatedQuestions);
            setTestCompleted(true);  // Indica que el test ha sido completado
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
console.log(testName)

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.length > 0 ? questions.map(question => (
         <div key={question._id} className={`bg-white shadow-md rounded-lg p-4 ${testCompleted ? (answers[question._id] === question.correctAnswer ? 'bg-green-700' : 'bg-red-800') : ''}`}>

            <h3 className="text-lg font-semibold">{question.question}</h3>
            <div className="mt-2">
              {Object.entries(question.options).map(([optionKey, optionValue]) => (
                <label key={optionKey} className="block">
                  <input
                    type="radio"
                    name={`question_${question._id}`}
                    value={optionKey}
                    checked={answers[question._id] === optionKey}
                    onChange={(event) => handleOptionChange(question._id, event.target.value)}
                    className="mr-2"
                    disabled={testCompleted}  // Deshabilitar después de enviar el test
                  />
                  {optionValue}
                </label>
              ))}
              {testCompleted && answers[question._id] !== question.correctAnswer && (
                <p className="text-white">Respuesta correcta: {question.correctAnswer}</p>
              )}
            </div>
          </div>
        )) : <p>No hay preguntas disponibles.</p>}
        {!testCompleted && (
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Enviar Test</button>
        )}
      </form>
      {results && (
  <div className="mt-4 bg-white shadow-md rounded-lg p-4">
    <h3 className="text-lg font-semibold">Resultados del Test:</h3>
    <p>Respuestas correctas: {results.correctCount}</p>
    <p>Respuestas incorrectas: {results.incorrectCount}</p>
    <p>Puntuación: {((results.correctCount / questions.length) * 100).toFixed(2)}%</p>
  </div>
)}
</div>

  );
};


export default QuizForm;
