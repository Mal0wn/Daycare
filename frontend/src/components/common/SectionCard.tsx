import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

// Consistent card wrapper for each dashboard/page section.
export const SectionCard = ({ title, action, children }: SectionCardProps) => (
  <section className="section-card">
    <header>
      <h2>{title}</h2>
      {action && <div>{action}</div>}
    </header>
    <div className="section-card__body">{children}</div>
  </section>
);
