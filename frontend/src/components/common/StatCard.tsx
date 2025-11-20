import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  highlight?: string;
  icon?: ReactNode;
}

// Displays a big playful stat with optional icon/description.
export const StatCard = ({ title, value, highlight, icon }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div>
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value">{value}</p>
      {highlight && <small>{highlight}</small>}
    </div>
  </div>
);
