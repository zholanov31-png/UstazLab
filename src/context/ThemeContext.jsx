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
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* жеке терезеде storage жабық болуы мүмкін */
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Recharts сияқты CSS айнымалыларын оқи алмайтын кітапханаларға арналған түстер
export const chartColors = {
  light: { grid: '#e2e8f0', axis: '#64748b', pre: '#94a3b8', post: '#10b981' },
  dark: { grid: '#334155', axis: '#94a3b8', pre: '#64748b', post: '#34d399' },
  nomad: { grid: '#ccdbd5', axis: '#4e655d', pre: '#94a3b8', post: '#0d9488' },
};
