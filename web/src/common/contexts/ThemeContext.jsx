import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const applyTheme = useCallback((newTheme) => {
    if (newTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    if (window.MessageBox && typeof window.MessageBox.setThemeMode === 'function') {
      window.MessageBox.setThemeMode(newTheme);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
