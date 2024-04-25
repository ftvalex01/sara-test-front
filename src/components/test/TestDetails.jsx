import React from 'react';

const TestDetails = ({ test, onBack }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detalles del Test</h2>
        <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          Volver
        </button>
      </div>
      <div className="grid gap-4">
        {test.questions.map((question, index) => (
          <div key={question.questionId} className="bg-white shadow-lg rounded-lg p-4">
            <p className="text-lg font-bold mb-2">Pregunta {index + 1}: {question.question}</p>
            {Object.entries(question.options).map(([key, value]) => {
              const isCorrectAnswer = key === question.correctAnswer;
              const isUserAnswer = test.answers[index] === key;
              const answerClasses = isCorrectAnswer ? 'text-green-500' :
                                   isUserAnswer ? 'text-red-500' : '';
              return (
                <p key={key} className={`pl-4 ${answerClasses}`}>
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
