import React from 'react';
import LoginForm from '../../components/login/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="w-full max-w-md p-8  rounded-lg shadow-2xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
