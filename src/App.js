import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import QuizForm from './components/test/QuizForm';
import QuizSetupForm from './components/test/QuizSetupForm';
import TestStatistics from './components/test/TestStatistics';
import ErrorQuizForm from './components/test/ErrorQuizForm';
import Dashboard from './pages/Dashboard/Dashboard';
import { AuthContext } from './context/AuthContext';
import SideMenu from './components/sidemenu/SideMenu';

import './index.css';

const App = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <Router>
      <div className={`flex ${isLoggedIn ? 'min-h-screen' : 'justify-center items-center'}`}>
        {isLoggedIn && (
          <div className="w-64 fixed inset-y-0 z-30">
            <SideMenu />
          </div>
        )}
        <div className={`flex-1 ${isLoggedIn ? 'lg:ml-64' : ''}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            {isLoggedIn && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz/setup" element={<QuizSetupForm />} />
                <Route path="/quiz/start" element={<QuizForm />} />
                <Route path="/statistics" element={<TestStatistics />} />
                <Route path="/error-quiz" element={<ErrorQuizForm />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
