// LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="border-t-4 border-blue-500 border-solid w-16 h-16 border-r-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
