import axios from 'axios';
import { loginUser, getProfile, setAuthToken } from '../../api/api'; 

// Mock de axios para simular las llamadas HTTP
jest.mock('axios');

describe('API tests', () => {
  // Prueba para verificar que loginUser realiza una solicitud POST y devuelve datos
  test('loginUser makes a POST request and returns data', async () => {
    // Mock de la respuesta de axios.post
    axios.post.mockResolvedValue({ data: { access_token: 'fake-token' } });

    const loginData = { username: 'test', password: 'password' };
    const response = await loginUser(loginData);

    // Verifica que axios.post se llamó con los datos correctos
    expect(axios.post).toHaveBeenCalledWith('/users/login', loginData);
    expect(response).toEqual({ access_token: 'fake-token' });
  });

  // Prueba para verificar el manejo de errores del servidor en loginUser
  test('loginUser handles server error response', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Server error' } }
    });

    const loginData = { username: 'test', password: 'password' };

    // Verifica que loginUser lanza un error con el mensaje correcto
    await expect(loginUser(loginData)).rejects.toThrow('Server error');
    expect(axios.post).toHaveBeenCalledWith('/users/login', loginData);
  });

  // Prueba para verificar el manejo de errores de red en loginUser
  test('loginUser handles network error', async () => {
    axios.post.mockRejectedValue({
      request: {}
    });

    const loginData = { username: 'test', password: 'password' };

    // Verifica que loginUser lanza un error con el mensaje correcto
    await expect(loginUser(loginData)).rejects.toThrow('Error en la solicitud. Por favor, verifica tu conexión a Internet.');
    expect(axios.post).toHaveBeenCalledWith('/users/login', loginData);
  });

  // Prueba para verificar el manejo de otros errores en loginUser
  test('loginUser handles other errors', async () => {
    axios.post.mockRejectedValue(new Error('Unexpected error'));

    const loginData = { username: 'test', password: 'password' };

    // Verifica que loginUser lanza un error con el mensaje correcto
    await expect(loginUser(loginData)).rejects.toThrow('Algo salió mal. Por favor, intenta de nuevo.');
    expect(axios.post).toHaveBeenCalledWith('/users/login', loginData);
  });

  // Prueba para verificar que getProfile realiza una solicitud GET y devuelve datos
  test('getProfile makes a GET request and returns data', async () => {
    axios.get.mockResolvedValue({ data: { profile: 'user-profile' } });

    const response = await getProfile('fake-token');

    // Verifica que axios.get se llamó con la URL correcta
    expect(axios.get).toHaveBeenCalledWith('/users/profile');
    expect(response).toEqual({ profile: 'user-profile' });
  });

  // Prueba para verificar el manejo de errores del servidor en getProfile
  test('getProfile handles server error response', async () => {
    axios.get.mockRejectedValue({
      response: { data: { message: 'Server error' } }
    });

    // Verifica que getProfile lanza un error con el mensaje correcto
    await expect(getProfile('fake-token')).rejects.toThrow('Server error');
    expect(axios.get).toHaveBeenCalledWith('/users/profile');
  });

  // Prueba para verificar el manejo de errores de red en getProfile
  test('getProfile handles network error', async () => {
    axios.get.mockRejectedValue({
      request: {}
    });

    // Verifica que getProfile lanza un error con el mensaje correcto
    await expect(getProfile('fake-token')).rejects.toThrow('Error en la solicitud. Por favor, verifica tu conexión a Internet.');
    expect(axios.get).toHaveBeenCalledWith('/users/profile');
  });

  // Prueba para verificar el manejo de otros errores en getProfile
  test('getProfile handles other errors', async () => {
    axios.get.mockRejectedValue(new Error('Unexpected error'));

    // Verifica que getProfile lanza un error con el mensaje correcto
    await expect(getProfile('fake-token')).rejects.toThrow('Algo salió mal. Por favor, intenta de nuevo.');
    expect(axios.get).toHaveBeenCalledWith('/users/profile');
  });

  // Prueba para verificar que setAuthToken establece el header de autorización correctamente
  test('setAuthToken sets the Authorization header', () => {
    setAuthToken('fake-token');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer fake-token');

    setAuthToken(null);
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
