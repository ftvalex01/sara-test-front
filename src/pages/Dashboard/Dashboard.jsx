import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SideMenu from '../../components/sidemenu/SideMenu';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidemenu */}
      <SideMenu />

      {/* Contenido del Dashboard */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* Aquí podrías agregar un componente header si lo deseas */}
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {/* Aquí va el contenido principal de cada sección del dashboard */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
