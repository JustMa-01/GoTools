import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon, FiMonitor, FiZap } from 'react-icons/fi';
import { FaPaintBrush } from 'react-icons/fa';

const themes = [
    { name: 'light', icon: <FiSun/> },
    { name: 'dark', icon: <FiMoon/> },
    { name: 'system', icon: <FiMonitor/> },
    { name: 'soft', icon: <FaPaintBrush/> },
    { name: 'neon', icon: <FiZap/> },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-1 bg-secondary p-1 rounded-full">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`p-2 rounded-full transition-colors duration-300 ${
            theme === t.name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-background/50'
          }`}
          aria-label={`Switch to ${t.name} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;