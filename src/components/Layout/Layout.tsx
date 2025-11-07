import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import './Layout.scss';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
