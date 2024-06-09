import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    setError('');
    event.preventDefault();
    if (!username || !password) {
      setError('El nombre de usuario y la contraseña son obligatorios');
      return;
    }
    try {
      const response = await login(username, password);
      if (response.access_token) {
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Falló el inicio de sesión. Verifica tus credenciales',
      });
      setError('Falló el inicio de sesión. Verifica tus credenciales');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-900 rounded-lg shadow-xl min-h-screen">
      <div className="mb-8 text-center">
        {/* Aquí puedes incluir tu imagen de logo si tienes una */}
        {/* <img
          src="/path-to-your-logo.png"
          alt="Logo"
          className="w-20 h-20 rounded-full mb-4"
        /> */}
        <h2 className="text-2xl text-gray-800 dark:text-gray-200 font-bold mb-6">Iniciar Sesión</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform focus:scale-105"
          />
          <div className="flex items-center mt-2">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700 dark:text-gray-300">Mostrar contraseña</label>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105">
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
