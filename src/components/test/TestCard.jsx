import React from 'react';

const TestCard = ({ test, onToggleDetails }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getUTCDate().toString().padStart(2, '0') + '/' + 
           (date.getUTCMonth() + 1).toString().padStart(2, '0') + '/' + 
           date.getUTCFullYear();
  };

  // Función para comparar las respuestas del usuario con las respuestas correctas
  const countCorrectAnswers = () => {
    let correctCount = 0;
    test.questions.forEach((question, index) => {
      if (test.answers[index] === question.correctAnswer) {
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
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out" onClick={() => onToggleDetails(test._id)}>
      <h3 className="text-lg font-semibold">{`Test realizado el ${formatDate(test.createdAt)}`}</h3>
      <div className="text-sm text-gray-600">
        <p>Respuestas correctas: {correctAnswers}</p>
        <p>Respuestas incorrectas: {incorrectAnswers}</p>
        <p>Porcentaje de acierto: {percentage}%</p>
      </div>
    </div>
  );
};

export default TestCard;
