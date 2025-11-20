interface TagProps {
  label: string;
}

const colors: Record<string, string> = {
  Bébés: '#f6b2c0',
  Petits: '#fdd5a5',
  Moyens: '#a0e1d6',
  Grands: '#c7c2ff',
  Tous: '#ffd6f2'
};

// Color-coded pill helps highlight age groups visually.
export const Tag = ({ label }: TagProps) => (
  <span className="tag" style={{ backgroundColor: colors[label] || 'var(--border-color)' }}>
    {label}
  </span>
);
