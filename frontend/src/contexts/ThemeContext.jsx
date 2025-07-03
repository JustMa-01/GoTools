import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    // For 'system' theme
    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const systemTheme = mediaQuery.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        };
        mediaQuery.addEventListener('change', handleChange);
        handleChange(); // set initial system theme
        return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

  }, [theme]);

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };