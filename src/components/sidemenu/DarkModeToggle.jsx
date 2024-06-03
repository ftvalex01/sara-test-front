import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <div className="flex items-center justify-center my-4">
      <div
        className="flex items-center cursor-pointer p-1 bg-gray-300 dark:bg-gray-600 rounded-full w-14 h-8"
        onClick={() => setDarkMode(!darkMode)}
      >
        <div
          className={`w-6 h-6 rounded-full transition-transform transform ${darkMode ? 'translate-x-6' : 'translate-x-0'} flex items-center justify-center bg-white dark:bg-black shadow-md`}
        >
          {darkMode ? (
            <FaMoon className="text-yellow-300" />
          ) : (
            <FaSun className="text-yellow-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DarkModeToggle;
