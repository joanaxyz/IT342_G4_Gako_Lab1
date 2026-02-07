import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useContexts';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <button
            className="theme-toggle-btn"
            type="button"
            aria-label="Toggle theme"
            aria-pressed={isDarkMode}
            onClick={toggleTheme}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px'
            }}
        >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
