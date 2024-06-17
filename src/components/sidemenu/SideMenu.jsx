import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2';
import DarkModeToggle from './DarkModeToggle';

const SideMenu = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { resetTests } = useTest();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
    }
  };

  const handleResetTests = () => {
    if (user && user.userId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de reiniciar tus estadísticas y tus tests. ¿Estás seguro de que deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await resetTests(user.userId);
            if (response === true) {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Tus estadísticas y tests han sido reiniciados correctamente.',
                icon: 'success',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un error al reiniciar tus estadísticas y tests. Por favor, inténtalo de nuevo más tarde.',
                icon: 'error',
              });
            }
          } catch (error) {
            console.error('Error resetting tests:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al reiniciar tus estadísticas y tests. Por favor, inténtalo de nuevo más tarde.',
              icon: 'error',
            });
          }
        }
      });
    } else {
      console.error('El userId es inválido.');
    }
  };

  return (
    <>
      <button
        className="block lg:hidden p-4 focus:outline-none text-gray-800 dark:text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        onTouchStart={() => setMenuOpen(!menuOpen)}
      >
        <span className="material-icons">menu</span>
      </button>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={() => setMenuOpen(false)}
          onTouchStart={() => setMenuOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed h-full inset-y-0 z-50 w-64 bg-gray-800 text-gray-300 dark:bg-gray-900 dark:text-gray-200 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="overflow-y-auto py-4 px-3 rounded h-full flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <DarkModeToggle />
            </div>
            <ul className="space-y-4 mt-10">
              <li>
                <NavLink
                  to="/dashboard"
                  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="material-icons mr-2">dashboard</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quiz/setup"
                  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="material-icons mr-2">article</span> Hacer Test
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/statistics"
                  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="material-icons mr-2">analytics</span> Ver Estadísticas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/error-quiz/setup"
                  className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="material-icons mr-2">error</span> Realizar Test de Errores
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <hr className="border-t border-gray-700 dark:border-gray-600 my-4" />
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => {
                    handleResetTests();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-start w-full text-left px-4 py-3 rounded-md hover:bg-red-800 transition duration-200 text-red-400 dark:hover:bg-red-800"
                >
                  <span className="material-icons mr-2">restart_alt</span> Reiniciar Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-start w-full text-left px-4 py-3 rounded-md hover:bg-red-600 transition duration-200 text-red-300 dark:hover:bg-red-600"
                >
                  <span className="material-icons mr-2">logout</span> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
