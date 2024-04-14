import React from 'react';
import { NavLink } from 'react-router-dom';

const SideMenu = () => {
  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
        <ul className="space-y-2">
          {/* Link al dashboard */}
          <li>
            <NavLink to="/dashboard" className="text-base font-normal text-gray-900 dark:text-white">Dashboard</NavLink>
          </li>
          {/* Más links aquí */}
          {/* ... */}
          {/* Botón de logout */}
          <li>
            <button /* Agrega aquí la función de logout */>Logout</button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
