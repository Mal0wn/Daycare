// ThemeContext centralizes persisted UI preferences (mode + accent color).
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemePreferences {
  mode: ThemeMode;
  accent: string;
}

interface ThemeContextValue extends ThemePreferences {
  toggleMode: () => void;
  setAccent: (color: string) => void;
}

const STORAGE_KEY = 'daycare-theme';
const defaultPreferences: ThemePreferences = {
  mode: 'light',
  accent: '#f6b2c0'
};

// Palette definitions allow us to update CSS variables depending on the mode.
const palette = {
  light: {
    '--bg-color': '#fdf7ff',
    '--surface-color': '#ffffff',
    '--text-color': '#312f44',
    '--border-color': '#e5d7ff',
    '--muted-text': '#6d6780'
  },
  dark: {
    '--bg-color': '#1f1b2e',
    '--surface-color': '#2b243d',
    '--text-color': '#f5f0ff',
    '--border-color': '#3a3352',
    '--muted-text': '#ada7c9'
  }
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
  });

  // Persist and reflect preferences any time they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    const themeVariables = palette[preferences.mode];
    Object.entries(themeVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    document.documentElement.style.setProperty('--accent-color', preferences.accent);
    document.documentElement.dataset.theme = preferences.mode;
  }, [preferences]);

  // Memoized context value exposes helpers + state.
  const value = useMemo<ThemeContextValue>(() => ({
    ...preferences,
    toggleMode: () =>
      setPreferences((prev) => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' })),
    setAccent: (color: string) => setPreferences((prev) => ({ ...prev, accent: color }))
  }), [preferences]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Helper hook avoids duplicating the undefined guard.
export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('ThemeContext missing');
  return ctx;
};
