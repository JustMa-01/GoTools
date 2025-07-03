import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackToHomeButton = () => {
  return (
    <div className="mb-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to All Tools
      </Link>
    </div>
  );
};

export default BackToHomeButton;