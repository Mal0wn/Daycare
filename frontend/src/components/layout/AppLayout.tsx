import { useEffect, useState, type ReactNode } from 'react';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { Sidebar } from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

// Main layout wires sidebar + contextual toolbar with theme toggle.
export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { mode, toggleMode } = useTheme();
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
          <button className="ghost-btn" onClick={toggleMode}>
            {mode === 'light' ? <FiMoon /> : <FiSun />} Mode {mode === 'light' ? 'sombre' : 'clair'}
          </button>
        </div>
        <div className="layout__inner">{children}</div>
      </main>
    </div>
  );
};
