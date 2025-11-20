import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('shows the metric, title and optional highlight', () => {
    render(<StatCard title="Enfants présents" value="12" highlight="+2 vs hier" icon={<span>★</span>} />);
    expect(screen.getByText('Enfants présents')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('+2 vs hier')).toBeInTheDocument();
  });
});
