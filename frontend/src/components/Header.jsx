import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Reverted back to the original text-based logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          GoTools
        </Link>
        <ThemeSwitcher />
      </nav>
    </header>
  );
};

export default Header;