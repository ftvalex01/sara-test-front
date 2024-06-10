import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { TestProvider, useTest } from '../../context/TextContext'; // Ajusta la ruta según tu estructura de proyecto

// Mock de axios para simular las llamadas HTTP
jest.mock('axios');

// Mock de localStorage para simular el almacenamiento local en las pruebas
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Define el mock de localStorage en la ventana global
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Componente de prueba que utiliza el contexto TestContext
const TestComponent = () => {
  const {
    numQuestions,
    setNumQuestions,
    numErrorQuestions,
    setNumErrorQuestions,
    resetTests,
  } = useTest();

  return (
    <div>
      <div data-testid="numQuestions">{numQuestions}</div>
      <div data-testid="numErrorQuestions">{numErrorQuestions}</div>
      <button
        onClick={() => {
          setNumQuestions(10);
          setNumErrorQuestions(2);
        }}
      >
        Set Values
      </button>
      <button onClick={() => resetTests('testUserId')}>Reset</button>
    </div>
  );
};

// Función para renderizar el componente con el proveedor de contexto
const renderWithProvider = (ui) => {
  return render(
    <TestProvider>
      {ui}
    </TestProvider>
  );
};

// Pruebas para el contexto TestContext
describe('TestContext', () => {
  // Configuración antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks
    localStorageMock.clear(); // Limpia el mock de localStorage
    // Mock de console.error para probar el manejo de errores
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Prueba para verificar el estado inicial
  test('initial state is correct', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);

    expect(getByTestId('numQuestions').textContent).toBe('0');
    expect(getByTestId('numErrorQuestions').textContent).toBe('0');
  });

  // Prueba para verificar la actualización del estado
  test('state updates correctly', () => {
    const { getByTestId, getByText } = renderWithProvider(<TestComponent />);

    act(() => {
      getByText('Set Values').click();
    });

    expect(getByTestId('numQuestions').textContent).toBe('10');
    expect(getByTestId('numErrorQuestions').textContent).toBe('2');
  });

  // Prueba para verificar el correcto funcionamiento de resetTests
  test('resetTests works correctly', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByTestId, getByText } = renderWithProvider(<TestComponent />);

    // Establece valores iniciales
    act(() => {
      getByText('Set Values').click();
    });

    expect(getByTestId('numQuestions').textContent).toBe('10');
    expect(getByTestId('numErrorQuestions').textContent).toBe('2');

    // Llama a resetTests
    await act(async () => {
      getByText('Reset').click();
    });

    // Verifica que los valores se restablecen
    await waitFor(() => {
      expect(getByTestId('numQuestions').textContent).toBe('0');
      expect(getByTestId('numErrorQuestions').textContent).toBe('0');
    });

    // Verifica que la solicitud POST se haya realizado con la URL correcta
    expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/tests/reset/testUserId`);
  });

  // Prueba para verificar el manejo de errores en resetTests
  test('resetTests handles error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    const { getByText } = renderWithProvider(<TestComponent />);

    // Llama a resetTests y simula un error de red
    await act(async () => {
      getByText('Reset').click();
    });

    // Verifica que console.error se haya llamado con el mensaje de error correcto
    expect(console.error).toHaveBeenCalledWith('Error resetting tests:', expect.any(Error));
  });
});
