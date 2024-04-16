import React, { useContext } from 'react';
import { NavLink, useNavigate  } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const SideMenu = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isLoggedIn) {
      logout(); // Llama a la función logout del contexto
      navigate('/'); // Redirige al usuario a la página de inicio de sesión
    }
  };
  return (
    <aside className="w-64 h-full bg-gray-800 text-gray-300" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 rounded ">
        <ul className="space-y-12 mt-20">
          {/* Links del menú */}
          <li>
            <NavLink to="/dashboard"  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz"  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Hacer Test
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistics" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Ver Estadísticas
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-quiz"  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Realizar Test de Errores
            </NavLink>
          </li>
          {/* Separador */}
          <li className="mt-auto">
            <button onClick={handleLogout} className="flex items-center justify-start w-full text-left px-4 py-3 rounded-md hover:bg-red-600 transition duration-200 text-red-300">
            Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
