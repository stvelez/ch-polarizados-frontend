import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import './Layout.scss';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previousValue) => !previousValue);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="layout__content">
        <header className="layout__mobile-bar">
          <button
            type="button"
            className="layout__menu-button"
            onClick={handleToggleSidebar}
            aria-label={isSidebarOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="layout__mobile-title">CH Polarizados</span>
        </header>
        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
