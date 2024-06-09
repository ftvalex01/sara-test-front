import React from 'react';

const TestCard = ({ test, onToggleDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getUTCDate().toString().padStart(2, '0') + '/' + 
           (date.getUTCMonth() + 1).toString().padStart(2, '0') + '/' + 
           date.getUTCFullYear();
  };

  const countCorrectAnswers = () => {
    let correctCount = 0;
    test.questions.forEach((question, index) => {
      if (test.answers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const correctAnswers = countCorrectAnswers();
  const totalQuestions = test.questions.length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div
      className="bg-gray-400 dark:bg-gray-700 shadow-lg rounded-lg p-4 mb-4 cursor-pointer outline hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
      onClick={() => onToggleDetails(test._id)}
  
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{test?.testName}</h3>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{`Test realizado el ${formatDate(test.createdAt)}`}</h3>
      <div className="text-sm text-gray-900 dark:text-gray-200">
        <p>Respuestas correctas: {correctAnswers}</p>
        <p>Respuestas incorrectas: {incorrectAnswers}</p>
        <p>Porcentaje de acierto: {percentage}%</p>
      </div>
    </div>
  );
};

export default TestCard;
