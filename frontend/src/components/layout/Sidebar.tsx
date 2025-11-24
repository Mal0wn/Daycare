// Sidebar hosts pastel navigation and playful branding for the daycare.
import { NavLink } from 'react-router-dom';
import { FiCalendar, FiHome, FiSettings, FiUsers } from 'react-icons/fi';
import { MdCelebration, MdInventory2 } from 'react-icons/md';
import { ReactNode } from 'react';

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: <FiHome /> },
  { to: '/plannings', label: 'Plannings', icon: <FiCalendar /> },
  { to: '/activites', label: 'Activités', icon: <MdCelebration /> },
  { to: '/inventaire', label: 'Stock', icon: <MdInventory2 /> },
  { to: '/enfants', label: 'Enfants', icon: <FiUsers /> },
  { to: '/parametres', label: 'Thèmes & préférences', icon: <FiSettings /> }
];

interface SidebarProps {
  isOpen?: boolean;
  onNavigate?: () => void;
  user?: { name?: string; email?: string } | null;
  onLogout?: () => void;
}

export const Sidebar = ({ isOpen = true, onNavigate, user, onLogout }: SidebarProps) => {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__emoji">🌈</span>
        <div>
          <p className="sidebar__title">Crèche Arc-en-Ciel</p>
          <small>Joie & bienveillance</small>
        </div>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__user-card">
        <div className="sidebar__user-meta">
          <strong>{user?.name ?? 'Invité'}</strong>
          <small>{user?.email ?? 'Non connecté'}</small>
        </div>
        <button className="ghost-btn sidebar__logout" onClick={onLogout}>
          Déconnexion
        </button>
      </div>
      <div className="sidebar__footer">
        <p>Fait avec 💛 pour les petits explorateurs.</p>
      </div>
    </aside>
  );
};
