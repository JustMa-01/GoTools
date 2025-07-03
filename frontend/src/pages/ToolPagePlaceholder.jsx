import React from 'react';
import { useLocation } from 'react-router-dom';
import BackToHomeButton from '../components/BackToHomeButton';

// This helper function turns a URL path like "/merge-pdf" into a title like "Merge Pdf"
const formatTitle = (pathname) => {
  const path = pathname.replace('/', '').replace(/-/g, ' ');
  return path.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const ToolPagePlaceholder = () => {
  const location = useLocation();
  const title = formatTitle(location.pathname);

  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <BackToHomeButton />
      <h2 className="text-4xl font-bold text-primary">{title}</h2>
      <p className="text-lg text-muted-foreground mt-4">
        This tool is currently under construction.
      </p>
      <div className="mt-12 text-5xl animate-pulse" role="img" aria-label="tools">
        🛠️
      </div>
      <p className="mt-4 font-semibold text-accent-foreground text-2xl">
        Coming Soon!
      </p>
    </div>
  );
};

export default ToolPagePlaceholder;