// Importaciones necesarias desde React y otros módulos para pruebas
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/login/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import mockAxios from '../__mocks__/axios';
import '@testing-library/jest-dom/extend-expect';

// Resetear mockAxios después de cada prueba para asegurar un estado limpio
afterEach(() => {
  mockAxios.reset();
});

// Función auxiliar para renderizar componentes con Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  // Cambia la URL del historial de la ventana
  window.history.pushState({}, 'Test page', route);
  // Renderiza el componente dentro del contexto del BrowserRouter
  return render(ui, { wrapper: BrowserRouter });
};

// Describe el conjunto de pruebas para el componente LoginForm
describe('LoginForm', () => {
  // Antes de cada prueba, renderiza el LoginForm dentro del AuthProvider
  beforeEach(() => {
    renderWithRouter(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  });

  // Prueba que verifica que el formulario de login se renderiza correctamente
  test('renders login form', () => {
    // Verifica que el campo de nombre de usuario está en el documento
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    // Verifica que el campo de contraseña está en el documento
    expect(screen.getAllByLabelText(/contraseña/i)[0]).toBeInTheDocument();
    // Verifica que el botón de iniciar sesión está en el documento
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  // Prueba que muestra un mensaje de error si el nombre de usuario y la contraseña no son proporcionados
  test('shows error message if username and password are not provided', async () => {
    // Simula un clic en el botón de iniciar sesión
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Espera a que el mensaje de error aparezca en el documento
    expect(await screen.findByText(/el nombre de usuario y la contraseña son obligatorios/i)).toBeInTheDocument();
  });

  // Prueba que verifica que la función de login es llamada con el nombre de usuario y la contraseña
  test('calls login function with username and password', async () => {
    // Simula el cambio en el campo de nombre de usuario
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user' } });
    // Simula el cambio en el campo de contraseña
    fireEvent.change(screen.getAllByLabelText(/contraseña/i)[0], { target: { value: 'password' } });

    // Actúa de manera asincrónica para simular el envío del formulario y la respuesta del servidor
    await act(async () => {
      // Mockea la respuesta del axios.post cuando se llama al endpoint de login
      mockAxios.post.mockResolvedValueOnce({
        data: { access_token: 'fake-token', username: 'testuser', userId: 1, category: 'admin' }
      });
      // Simula un clic en el botón de iniciar sesión
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    });

    // Espera a que la llamada al endpoint de login sea realizada con los parámetros correctos
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/users/login', { username: 'user', password: 'password' });
    });
  });
});
