import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppLayout } from './AppLayout';
import { useTheme } from '../../hooks/useTheme';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn()
}));
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

const mockedUseTheme = vi.mocked(useTheme);
const mockedUseAuth = vi.mocked(useAuth);

describe('AppLayout', () => {
  it('renders children and toggles theme mode', async () => {
    const toggleMode = vi.fn();
    mockedUseTheme.mockReturnValue({
      mode: 'light', toggleMode,
      setAccent: function (color: string): void {
        throw new Error('Function not implemented.');
      },
      accent: ''
    });
    mockedUseAuth.mockReturnValue({
      user: { name: 'Admin', email: 'admin@test.fr' },
      isAuthenticated: true,
      token: 'token',
      login: vi.fn(),
      logout: vi.fn()
    });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<p>Données</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Centre Arc-en-Ciel')).toBeInTheDocument();
    expect(screen.getByText('Données')).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /Mode sombre/i });
    await user.click(toggleButton);
    expect(toggleMode).toHaveBeenCalled();
  });
});
