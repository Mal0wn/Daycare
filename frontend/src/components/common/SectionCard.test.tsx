import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionCard } from './SectionCard';

describe('SectionCard', () => {
  it('renders title, action and children', () => {
    render(
      <SectionCard title="Capacité" action={<button>Action</button>}>
        <p>Contenu</p>
      </SectionCard>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Capacité' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});
