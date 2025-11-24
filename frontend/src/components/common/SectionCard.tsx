import { ReactNode, useEffect, useState } from 'react';

interface SectionCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapseBelow?: number;
}

// Consistent card wrapper for each dashboard/page section.
export const SectionCard = ({
  title,
  action,
  children,
  collapsible = false,
  defaultCollapsed = false,
  collapseBelow
}: SectionCardProps) => {
  const initialBelow =
    collapseBelow && typeof window !== 'undefined' ? window.innerWidth < collapseBelow : false;
  const initialCollapsibleActive = collapsible && (!collapseBelow || initialBelow);

  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(initialBelow);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [wasCollapsibleActive, setWasCollapsibleActive] = useState(initialCollapsibleActive);

  useEffect(() => {
    if (!collapseBelow) return;
    const onResize = () => setIsBelowBreakpoint(window.innerWidth < collapseBelow);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [collapseBelow]);

  const collapsibleActive = collapsible && (!collapseBelow || isBelowBreakpoint);

  useEffect(() => {
    if (!collapsibleActive && collapsed) {
      setCollapsed(false);
    }
    if (collapsibleActive && !wasCollapsibleActive) {
      setCollapsed(defaultCollapsed);
    }
    setWasCollapsibleActive(collapsibleActive);
  }, [collapsibleActive, collapsed, defaultCollapsed, wasCollapsibleActive]);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <section
      className={`section-card ${collapsibleActive ? 'section-card--collapsible' : ''} ${
        collapsed ? 'is-collapsed' : ''
      }`}
    >
      <header>
        {collapsibleActive ? (
          <button
            type="button"
            className="section-card__title-button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? `Ouvrir ${title}` : `Replier ${title}`}
            onClick={toggle}
          >
            {title}
          </button>
        ) : (
          <h2>{title}</h2>
        )}
        <div className="section-card__header-actions">
          {action && <div>{action}</div>}
        </div>
      </header>
      {!collapsed && <div className="section-card__body">{children}</div>}
    </section>
  );
};
