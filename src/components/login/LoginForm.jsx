import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      setError('Falló el inicio de sesión. Verifica tus credenciales');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-xl">
      <div className="mb-8">
        {/* Aquí puedes incluir tu imagen de logo si tienes una */}
        {/* <img
          src="/path-to-your-logo.png"
          alt="Logo"
          className="w-20 h-20 rounded-full mb-4"
        /> */}
        <h2 className="text-2xl text-black-700 font-bold mb-6">Iniciar Sesión</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
