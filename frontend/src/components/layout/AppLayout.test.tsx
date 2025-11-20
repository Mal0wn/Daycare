import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppLayout } from './AppLayout';
import { useTheme } from '../../hooks/useTheme';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn()
}));

const mockedUseTheme = vi.mocked(useTheme);

describe('AppLayout', () => {
  it('renders children and toggles theme mode', async () => {
    const toggleMode = vi.fn();
    mockedUseTheme.mockReturnValue({ mode: 'light', toggleMode });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppLayout>
          <p>Données</p>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Centre Arc-en-Ciel')).toBeInTheDocument();
    expect(screen.getByText('Données')).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /Mode sombre/i });
    await user.click(toggleButton);
    expect(toggleMode).toHaveBeenCalled();
  });
});
