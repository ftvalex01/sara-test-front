import axios from 'axios';




const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar los errores globalmente
apiClient.interceptors.response.use(
  response => response,
  error => handleErrorResponse(error)
);

const handleErrorResponse = (error) => {
  if (error.response) {
    // Errores de cliente (400) o de servidor (500)
    console.error('Error con respuesta del servidor:', error.response);
    throw new Error(error.response.data.message || 'Error en la solicitud al servidor');
  } else if (error.request) {
    // Errores de red o sin respuesta del servidor
    console.error('Error en la solicitud:', error.request);
    throw new Error('Error en la solicitud. Por favor, verifica tu conexión a Internet.');
  } else {
    // Otros errores
    console.error('Error:', error.message);
    throw new Error('Algo salió mal. Por favor, intenta de nuevo.');
  }
};

const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post('/users/login', loginData);
    return response.data; // Aquí se espera que el backend devuelva el token y otros datos del usuario si es necesario.
  } catch (error) {
    handleErrorResponse(error);
  }
};

const getProfile = async (token) => {
  try {
    setAuthToken(token);
    const response = await apiClient.get('/users/profile');
    return response.data; // Este será el perfil del usuario
  } catch (error) {
    handleErrorResponse(error);
  }
};

export { loginUser, getProfile, setAuthToken };
