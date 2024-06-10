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
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
      <div className="mb-6 text-center">
 
        {/* <img
          src=""
          alt="Logo"
          className="w-20 h-20 rounded-full mb-4"
        /> */}
        <h2 className="text-3xl text-gray-800 dark:text-gray-200 font-bold mb-4">Iniciar Sesión</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black dark:text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black dark:text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
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
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
