import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black-100">
      <main className="flex-1 overflow-x-hidden overflow-y-auto flex justify-center items-center text-center">
        <div className="max-w-lg p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold mb-4">¡Bienvenido a tu aplicación de preparación para oposiciones!</h1>
          <p className="text-lg text-gray-700 mb-8">Aquí podrás practicar con una variedad de tests diseñados para ayudarte en tu camino hacia el éxito en las oposiciones. ¡Prepárate para alcanzar tus metas con confianza y determinación!</p>
          <p className="text-green-600 font-bold text-xl mb-4">¡Buena suerte en tu preparación!</p>
          <p className="text-sm text-gray-500">Hecho con amor por Alejandro</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
