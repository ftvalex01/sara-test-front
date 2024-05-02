import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTest } from '../../context/TextContext';
import Swal from 'sweetalert2';
const SideMenu = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { resetTests } = useTest();
  const navigate = useNavigate();

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
    <aside className="w-64 h-full bg-gray-800 text-gray-300" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 rounded ">
        <ul className="space-y-12 mt-20">
          <li>
            <NavLink to="/dashboard" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz/setup" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Hacer Test
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistics" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Ver Estadísticas
            </NavLink>
          </li>
          <li>
            <NavLink to="/error-quiz/setup" className="flex items-center px-4 py-3 rounded-md hover:bg-gray-700 transition duration-200">
              Realizar Test de Errores
            </NavLink>
          </li>
          <li className="mt-auto">
            <button onClick={handleLogout} className="flex items-center justify-start w-full text-left px-4 py-3 rounded-md hover:bg-red-600 transition duration-200 text-red-300">
            Logout
            </button>
          </li>
          <li>
            <button onClick={handleResetTests} className="flex items-center justify-start w-full text-left px-4 py-5 rounded-md hover:bg-red-800 transition duration-200 text-red-400">
              Reiniciar Tests
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
