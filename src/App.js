import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import QuizForm from './components/test/QuizForm';
import QuizSetupForm from './components/test/QuizSetupForm';
import TestStatistics from './components/test/TestStatistics';
import ErrorQuizForm from './components/test/ErrorQuizForm';
import ErrorQuizSetupForm from './components/test/ErrorQuizSetupForm'; 
import Dashboard from './pages/Dashboard/Dashboard';
import { AuthContext } from './context/AuthContext';
import SideMenu from './components/sidemenu/SideMenu';
import './index.css';

const App = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <Router>
      <div className={`flex min-h-screen ${isLoggedIn ? '' : 'bg-gray-100'}`}>
        {isLoggedIn && (
          <div className={`fixed inset-y-0 z-30 ${menuOpen ? 'w-64' : 'w-0'}`}>
            <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        )}
        <div className={`flex-1 ${isLoggedIn ? 'lg:ml-64' : 'flex justify-center items-center'}`}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/quiz/setup" element={isLoggedIn ? <QuizSetupForm /> : <Navigate to="/" />} />
            <Route path="/quiz/start" element={isLoggedIn ? <QuizForm /> : <Navigate to="/" />} />
            <Route path="/statistics" element={isLoggedIn ? <TestStatistics /> : <Navigate to="/" />} />
            <Route path="/error-quiz/setup" element={isLoggedIn ? <ErrorQuizSetupForm /> : <Navigate to="/" />} />
            <Route path="/error-quiz/start" element={isLoggedIn ? <ErrorQuizForm /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
