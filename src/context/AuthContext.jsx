import React, { createContext, useEffect, useState } from 'react';
import { loginUser, getProfile } from '../api/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await loginUser({ username, password }); // Obtenemos la respuesta completa
      const { access_token, username: loggedInUsername } = response; // Extraemos el access_token y el username
      
      if (access_token) {
        localStorage.setItem('token', access_token); // Guarda el token en localStorage
        setIsLoggedIn(true);
        setUser({ username: loggedInUsername }); // Establece el username en el estado del usuario
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  // const logout = () => {
  //   localStorage.removeItem('user');
  //   setIsLoggedIn(false);
  //   setUser(null);
  // };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await getProfile(token);
        setIsLoggedIn(true);
        setUser(profile); // Asumiendo que profile contiene el username
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Aquí podrías manejar la expiración del token o errores de red
      }
    }
  };
  

  // Cargar el perfil del usuario al montar el componente si hay un token almacenado
  useEffect(() => {
    fetchProfile();
  }, []);
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
