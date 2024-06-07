import axios from 'axios';
import { loginUser, getProfile, setAuthToken } from '../../api/api'; // Ajusta la ruta según la estructura de tu proyecto

jest.mock('axios');

describe('API tests', () => {
  test('loginUser makes a POST request and returns data', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'fake-token' } });

    const loginData = { username: 'test', password: 'password' };
    const response = await loginUser(loginData);

    expect(axios.post).toHaveBeenCalledWith('/users/login', loginData);
    expect(response).toEqual({ access_token: 'fake-token' });
  });

  test('getProfile makes a GET request and returns data', async () => {
    axios.get.mockResolvedValue({ data: { profile: 'user-profile' } });

    const response = await getProfile('fake-token');

    expect(axios.get).toHaveBeenCalledWith('/users/profile');
    expect(response).toEqual({ profile: 'user-profile' });
  });

  test('setAuthToken sets the Authorization header', () => {
    setAuthToken('fake-token');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer fake-token');

    setAuthToken(null);
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
