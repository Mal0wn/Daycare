import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders all navigation links and highlights the active one', () => {
    render(
      <MemoryRouter initialEntries={['/activites']}>
        <Sidebar />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
    expect(screen.getByText('Crèche Arc-en-Ciel')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Activités/i })).toHaveClass('active');
  });
});
