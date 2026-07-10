import React, { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">BOSS Benchmark App</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">{darkMode ? 'Dark' : 'Light'}</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'bg-blue-600 focus:ring-blue-500' : 'bg-gray-300 focus:ring-gray-400'}`}
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
      <footer className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-auto`}>
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2024 BOSS Benchmark App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
