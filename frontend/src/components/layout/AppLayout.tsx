import { useEffect, useState } from 'react';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
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
      const mobile = window.innerWidth < 960;
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
      <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebarOnMobile} />
      {isMobile && sidebarOpen && <div className="sidebar__backdrop" onClick={closeSidebarOnMobile} />}
      <main className="layout__content">
        <div className="layout__topbar">
          <div className="layout__topbar-left">
            <button className="layout__menu-btn" aria-label="Ouvrir la navigation" onClick={toggleSidebar}>
              <FiMenu />
              Menu
            </button>
            <div>
              <p className="layout__subtitle">Aujourd'hui est une belle journée pour apprendre 🌼</p>
              <h1>Centre Arc-en-Ciel</h1>
            </div>
          </div>
          <div className="layout__topbar-actions">
            <button className="ghost-btn" onClick={toggleMode}>
              {mode === 'light' ? <FiMoon /> : <FiSun />} Mode {mode === 'light' ? 'sombre' : 'clair'}
            </button>
            <div className="user-chip">
              <span className="user-chip__avatar">{user?.name?.[0] ?? '?'}</span>
              <div className="user-chip__meta">
                <strong>{user?.name ?? 'Invité'}</strong>
                <small>{user?.email ?? 'Non connecté'}</small>
              </div>
              <button className="ghost-btn" onClick={logout}>
                Déconnexion
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
