import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Light mode is the default theme across the application.
  // The user can still toggle dark mode anytime via the theme switcher in the navigation bar.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Clean up legacy key if present so it doesn't force old auto-dark setting
        localStorage.removeItem('excel_practice_theme');
        const stored = localStorage.getItem('excel_practice_theme_preference') as Theme | null;
        if (stored === 'light' || stored === 'dark') {
          return stored;
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('excel_practice_theme_preference', theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      theme: isDark ? 'dark' : 'light',
      isDark,
      toggleTheme: () => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark');
        }
      },
      setTheme: () => {},
    };
  }
  return context;
};
