import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const THEMES = ['light', 'dark', 'nomad'];
const STORAGE_KEY = 'ustazlab-theme';

function readStoredTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(t) ? t : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    // Тақырып ауысқанда түстер бірден емес, жұмсақ ауыссын
    const root = document.documentElement;
    root.classList.add('theme-anim');
    const t = setTimeout(() => root.classList.remove('theme-anim'), 500);
    root.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* жеке терезеде storage жабық болуы мүмкін */
    }
    return () => clearTimeout(t);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Recharts сияқты CSS айнымалыларын оқи алмайтын кітапханаларға арналған түстер
export const chartColors = {
  light: { grid: '#dcd6f2', axis: '#676281', pre: '#b6abe6', post: '#6b4dff' },
  dark: { grid: '#3a3560', axis: '#a39fc4', pre: '#6f6799', post: '#b9a8ff' },
  nomad: { grid: '#cddcd5', axis: '#4e655d', pre: '#a9c4bb', post: '#0f8f86' },
};
