import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/users'; // Asegúrate de usar el puerto correcto y la URL de tu backend.

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Puedes agregar headers que sean comunes para todas las llamadas aquí.
});

const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post('/login', loginData);
    return response.data; // Aquí se espera que el backend devuelva el token y otros datos del usuario si es necesario.
  } catch (error) {
    throw error;
  }
};

// en tu api.js
const getProfile = async (token) => {
    try {
      const response = await apiClient.get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Este será el perfil del usuario
    } catch (error) {
      throw error;
    }
  };
  

export { loginUser, getProfile };
