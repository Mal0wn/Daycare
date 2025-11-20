import type { ReactNode } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Sidebar } from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

// Main layout wires sidebar + contextual toolbar with theme toggle.
export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">
        <div className="layout__topbar">
          <div>
            <p className="layout__subtitle">Aujourd'hui est une belle journée pour apprendre 🌼</p>
            <h1>Centre Arc-en-Ciel</h1>
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
