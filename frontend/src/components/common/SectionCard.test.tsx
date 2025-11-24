import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionCard } from './SectionCard';
import userEvent from '@testing-library/user-event';

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

  it('can render collapsible content closed by default and toggle on title click', async () => {
    const user = userEvent.setup();
    render(
      <SectionCard title="Section fermée" collapsible defaultCollapsed>
        <p>Données</p>
      </SectionCard>
    );

    expect(screen.queryByText('Données')).not.toBeInTheDocument();
    const toggleTitle = screen.getByRole('button', { name: /Section fermée/i });
    await user.click(toggleTitle);
    expect(screen.getByText('Données')).toBeInTheDocument();
  });
});
