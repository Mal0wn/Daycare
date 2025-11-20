// Simple wrapper so components can import a semantic hook.
import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => useThemeContext();
