import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

// Main layout wires sidebar + contextual toolbar with theme toggle.
export const AppLayout = () => {
  const { mode, toggleMode } = useTheme();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.innerWidth < 1000;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={closeSidebarOnMobile}
        user={user}
        onLogout={logout}
      />
      {isMobile && sidebarOpen && <div className="sidebar__backdrop" onClick={closeSidebarOnMobile} />}
      <main className="layout__content">
        <div className="layout__topbar">
          <div className="layout__topbar-row">
            <div className="layout__topbar-left">
              <button className="layout__menu-btn" aria-label="Ouvrir la navigation" onClick={toggleSidebar}>
                <span className="layout__menu-icon" aria-hidden="true">🧸</span>
                <span className="layout__menu-label">Menu</span>
              </button>
              <div className="layout__branding">
                <h1>Centre Arc-en-Ciel</h1>
                <p className="layout__subtitle">Aujourd'hui est une belle journée pour apprendre 🌼</p>
              </div>
            </div>
            <div className="layout__topbar-actions">
              <button className="ghost-btn layout__theme-toggle" onClick={toggleMode}>
              {mode === 'light' ? <FiMoon /> : <FiSun />} Mode {mode === 'light' ? 'sombre' : 'clair'}
              </button>
            </div>
          </div>
        </div>
        <div className="layout__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
