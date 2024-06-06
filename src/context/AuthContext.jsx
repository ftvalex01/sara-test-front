// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const response = await loginUser({ username, password });
      const { access_token, username: loggedInUsername, userId, category } = response;
      
      if (access_token) {
        // Guardar el token y la información del usuario en localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify({ username: loggedInUsername, userId, category }));
        setIsLoggedIn(true);
        setUser({ username: loggedInUsername, userId, category });
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    // Remover token y usuario de localStorage al hacer logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const checkUserAuthentication = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // Parsear el usuario guardado y actualizar el estado
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
