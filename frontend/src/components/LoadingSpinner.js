import React from 'react';

const LoadingSpinner = ({ currentLanguage }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-darkText font-semibold">
        {currentLanguage === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
      </p>
    </div>
  );
};

export default LoadingSpinner;