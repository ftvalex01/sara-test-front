// /context/AuthContext.jsx
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
      const { access_token, username: loggedInUsername } = response;
      
      if (access_token) {
        localStorage.setItem('token', access_token);
        setIsLoggedIn(true);
        setUser({ username: loggedInUsername });
      }
      
      return response; 
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);

  };

  const checkUserAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
