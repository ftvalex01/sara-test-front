import axios from 'axios';

// Crear una instancia de axios con configuración personalizada
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para manejar errores de respuesta
const handleErrorResponse = (error) => {
  if (error.response) {
    console.error('Error con respuesta del servidor:', error.response);
    throw new Error(error.response.data?.message || 'Error en la solicitud al servidor');
  } else if (error.request) {
    console.error('Error en la solicitud:', error.request);
    throw new Error('Error en la solicitud. Por favor, verifica tu conexión a Internet.');
  } else {
    console.error('Error:', error.message);
    throw new Error('Algo salió mal. Por favor, intenta de nuevo.');
  }
};

// Función para establecer el token de autenticación en el header de las solicitudes
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Función para manejar el inicio de sesión del usuario
const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post('/users/login', loginData);
    if (!response || !response.data) {
      throw new Error('No se recibió una respuesta válida del servidor');
    }
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
  }
};

// Función para obtener el perfil del usuario
const getProfile = async (token) => {
  try {
    setAuthToken(token);
    const response = await apiClient.get('/users/profile');
    if (!response || !response.data) {
      throw new Error('No se recibió una respuesta válida del servidor');
    }
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
  }
};

export { loginUser, getProfile, setAuthToken };
