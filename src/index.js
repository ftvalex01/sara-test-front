import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TextContext';
import { DarkModeProvider } from './context/DarkModeContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TestProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
      </TestProvider>
    </AuthProvider>
  </React.StrictMode>
);
