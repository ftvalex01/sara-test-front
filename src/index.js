import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TextContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TestProvider>
        <App />
      </TestProvider>
    </AuthProvider>
  </React.StrictMode>
);
