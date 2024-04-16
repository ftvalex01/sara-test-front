import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizForm = ({ numQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/tests/generate`, { userId: 'userID', numberOfQuestions: numQuestions });
        setQuestions(response.data);
        setAnswers({});
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (parseInt(numQuestions) > 0) {
      fetchQuestions();
    }
  }, [numQuestions]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tests/complete`, { userId: 'userID', answers: Object.keys(answers).map(key => ({ questionId: key, selectedOption: answers[key] })) });
      console.log(response.data); // Aquí podrías mostrar los resultados o manejarlos como prefieras
      alert('Respuestas enviadas y evaluadas!');
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(question => (
        <div key={question.id}>
          <h3>{question.questionText}</h3>
          {question.options.map(option => (
            <label key={option}>
              <input
                type="radio"
                name={`question_${question.id}`}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => handleOptionChange(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button type="submit">Enviar Test</button>
    </form>
  );
};

export default QuizForm;
