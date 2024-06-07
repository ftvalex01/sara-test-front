import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/login/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import mockAxios from '../__mocks__/axios';
import '@testing-library/jest-dom/extend-expect';

// Resetear mockAxios después de cada prueba
afterEach(() => {
  mockAxios.reset();
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('LoginForm', () => {
  beforeEach(() => {
    renderWithRouter(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/contraseña/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('shows error message if username and password are not provided', async () => {
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/el nombre de usuario y la contraseña son obligatorios/i)).toBeInTheDocument();
  });

  test('calls login function with username and password', async () => {
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user' } });
    fireEvent.change(screen.getAllByLabelText(/contraseña/i)[0], { target: { value: 'password' } });

    await act(async () => {
      mockAxios.post.mockResolvedValueOnce({
        data: { access_token: 'fake-token', username: 'testuser', userId: 1, category: 'admin' }
      });
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/users/login', { username: 'user', password: 'password' });
    });
  });


});
