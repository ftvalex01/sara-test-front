import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import './TestStatistics.css';

const QuizForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
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
            category: state.category
          });
          setQuestions(response.data);
          const answers = {};
          response.data.forEach((question) => {
            answers[question.id] = '';
          });
          setAnswers(answers);
          
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
    };
    fetchQuestions();
  }, [numQuestions, user, testName, apiBaseUrl, state.category]);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    if (!answeredQuestions.includes(questionId)) {
      setAnsweredQuestions([...answeredQuestions, questionId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const allAnswered = questions.every(question => answers[question.id] !== '');
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
            questionId: parseInt(key, 10),
            selectedOption: answers[key]
          })),
          testName,
          category: state.category
        });
        setResults(response.data);
        const updatedQuestions = questions.map(q => {
          const detail = response.data.details.find(d => d.questionId === q.id);
          return {
            ...q,
            isCorrect: detail ? detail.isCorrect : false,
            correctAnswer: q.correct_answer
          };
        });
        setQuestions(updatedQuestions);
        setTestCompleted(true);
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400 dark:bg-gray-800 p-4">
      <h2 className="text-2xl font-bold mb-8 dark:text-gray-200 text-center">{testName}</h2>
      <div className="flex items-center justify-center mb-4 flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionNavigation(index)}
            className={`w-8 h-8 rounded-full ${
              currentQuestionIndex === index ? 'border-2 border-black dark:border-blue-700' : ''
            } ${
              testCompleted ? (questions[index].isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') :
              answeredQuestions.includes(question.id) ? 'bg-blue-600 dark:bg-yellow-500 text-white' : 'bg-white text-black dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <main className="w-full p-4">
        {questions.length > 0 && (
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 md:p-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">{questions[currentQuestionIndex].question}</h3>
              <div className="space-y-2">
                {questions[currentQuestionIndex].options && Object.entries(questions[currentQuestionIndex].options).map(([optionKey, optionValue]) => {
                  const isCorrectAnswer = optionKey === questions[currentQuestionIndex].correctAnswer;
                  const isUserAnswer = answers[questions[currentQuestionIndex].id] === optionKey;
                  const answerClasses = testCompleted
                    ? isCorrectAnswer ? 'text-green-500 dark:text-green-400' :
                      isUserAnswer ? 'text-red-500 dark:text-red-400' : ''
                    : '';

                  return (
                    <div
                      key={optionKey}
                      onClick={() => !testCompleted && handleOptionChange(questions[currentQuestionIndex].id, optionKey)}
                      className={`border border-gray-300 rounded-md p-4 cursor-pointer ${answerClasses} dark:text-gray-200 hover:border-blue-400`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 mr-2 border rounded-full ${isUserAnswer ? (isCorrectAnswer ? 'border-green-500' : 'border-blue-700 dark:border-yellow-400') : 'border-gray-400'}`}
                        ></div>
                        <span>{optionValue}</span>
                      </div>
                      {testCompleted && (isUserAnswer || isCorrectAnswer) && (
                        <>
                          {isUserAnswer && ` - Tu respuesta${isCorrectAnswer ? ' ✓' : ' ✕'}`}
                          {!isUserAnswer && isCorrectAnswer && ' - Respuesta correcta ✓'}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4">
                {!testCompleted && currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Anterior
                  </button>
                )}
                {!testCompleted && currentQuestionIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {!testCompleted && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enviar Test
          </button>
        )}
        {results && (
          <div className="mt-8 bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Resultados del Test:</h3>
            <p className="text-lg dark:text-gray-200">Respuestas correctas: {results.correctCount}</p>
            <p className="text-lg dark:text-gray-200">Respuestas incorrectas: {results.incorrectCount}</p>
            <p className="text-lg dark:text-gray-200">Puntuación: {((results.correctCount / questions.length) * 100).toFixed(2)}%</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizForm;
