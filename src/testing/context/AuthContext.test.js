import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthProvider, AuthContext } from '../../context/AuthContext'; // Importa el proveedor de autenticación y el contexto
import { loginUser } from '../../api/api'; // Importa la función de login de la API

// Mock de la función loginUser
jest.mock('../../api/api', () => ({
  loginUser: jest.fn(), // Moficar la función para que sea un jest.fn()
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store = {}; // Almacenamiento simulado
  return {
    getItem: jest.fn((key) => store[key] || null), // Simula la obtención de un ítem
    setItem: jest.fn((key, value) => {
      store[key] = value.toString(); // Simula el establecimiento de un ítem
    }),
    removeItem: jest.fn((key) => {
      delete store[key]; // Simula la eliminación de un ítem
    }),
    clear: jest.fn(() => {
      store = {}; // Simula limpiar el almacenamiento
    }),
  };
})();

// Define el mock de localStorage en la ventana global
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Función para renderizar componentes con el AuthProvider
const renderWithProvider = (ui) => {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear(); // Limpia el almacenamiento simulado antes de cada prueba
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  test('checkUserAuthentication sets user if token and user are in localStorage', async () => {
    // Establece valores simulados en localStorage
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, category: 'test' }));

    let contextValues;
    renderWithProvider(
      <AuthContext.Consumer>
        {(value) => {
          contextValues = value; // Obtiene los valores del contexto
          return null;
        }}
      </AuthContext.Consumer>
    );

    // Espera a que se actualicen los valores del contexto
    await waitFor(() => {
      console.log('contextValues:', contextValues);
      expect(contextValues).not.toBeNull();
      expect(contextValues.isLoggedIn).toBe(true); // Verifica si el usuario está autenticado
      expect(contextValues.user).toEqual({ username: 'testuser', userId: 1, category: 'test' }); // Verifica los datos del usuario
    }, { timeout: 3000 });
  });

  test('login sets user and token in localStorage', async () => {
    const fakeResponse = {
      access_token: 'fake-token',
      username: 'testuser',
      userId: 1,
      category: 'test'
    };
    loginUser.mockResolvedValueOnce(fakeResponse); // Mockea la respuesta de loginUser

    let contextValues;
    renderWithProvider(
      <AuthContext.Consumer>
        {(value) => {
          contextValues = value; // Obtiene los valores del contexto
          return null;
        }}
      </AuthContext.Consumer>
    );

    // Realiza el login y espera a que se resuelva
    await act(async () => {
      await contextValues.login('username', 'password');
    });

    // Verifica que los ítems se hayan establecido en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ username: 'testuser', userId: 1, category: 'test' }));
    expect(contextValues.isLoggedIn).toBe(true); // Verifica si el usuario está autenticado
    expect(contextValues.user).toEqual({ username: 'testuser', userId: 1, category: 'test' }); // Verifica los datos del usuario
  });

  test('logout removes user and token from localStorage', async () => {
    // Establece valores simulados en localStorage
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, category: 'test' }));

    let contextValues;
    renderWithProvider(
      <AuthContext.Consumer>
        {(value) => {
          contextValues = value; // Obtiene los valores del contexto
          return null;
        }}
      </AuthContext.Consumer>
    );

    // Espera a que se actualicen los valores del contexto
    await waitFor(() => {
      console.log('contextValues before logout:', contextValues);
      expect(contextValues).not.toBeNull();
      expect(contextValues.isLoggedIn).toBe(true); // Verifica si el usuario está autenticado
    });

    // Realiza el logout
    act(() => {
      contextValues.logout();
    });

    // Verifica que los ítems se hayan eliminado de localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(contextValues.isLoggedIn).toBe(false); // Verifica si el usuario está desautenticado
    expect(contextValues.user).toBe(null); // Verifica que los datos del usuario se hayan eliminado
  });
});
