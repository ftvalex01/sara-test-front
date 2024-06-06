import React from 'react';

const TestDetails = ({ test, onBack }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="bg-gray-200 outline dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded inline-flex items-center">
          Volver
        </button>
        <h2 className="text-xl font-semibold dark:text-gray-200">Detalles del Test</h2>
      </div>
      <div className="grid gap-4">
        {test.questions.map((question, index) => (
          <div key={question.questionId} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
            <p className="text-lg font-bold mb-2 dark:text-gray-200">Pregunta {index + 1}: {question.question}</p>
            {Object.entries(question.options).map(([key, value]) => {
              const isCorrectAnswer = key === question.correct_answer;
              const isUserAnswer = test.answers[index] === key;
              const answerClasses = isCorrectAnswer ? 'text-green-500 dark:text-green-400' :
                                   isUserAnswer ? 'text-red-500 dark:text-red-400' : '';
              return (
                <p key={key} className={`pl-4 ${answerClasses} dark:text-gray-200`}>
                  {key}. {value}
                  {isUserAnswer && ` - Tu respuesta${isCorrectAnswer ? ' ✓' : ' ✕'}`}
                  {!isUserAnswer && isCorrectAnswer && ' - Respuesta correcta ✓'}
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestDetails;
