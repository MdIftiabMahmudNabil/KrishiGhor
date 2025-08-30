import React from 'react';

const Header = ({ currentLanguage, toggleLanguage }) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-secondary text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <i className="fas fa-seedling text-2xl text-accent"></i>
          <span className="text-2xl font-bold">
            {currentLanguage === 'bn' ? 'কৃষিঘর' : 'KrishiGhor'}
          </span>
          <span className="text-sm opacity-90 hidden md:block">
            {currentLanguage === 'bn' ? 'পরিবহন মনিটরিং' : 'Transport Monitor'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleLanguage}
            className="bg-white bg-opacity-20 border border-white border-opacity-30 px-4 py-2 rounded-full flex items-center gap-2 transition hover:bg-opacity-30"
          >
            <i className="fas fa-globe"></i>
            <span>{currentLanguage === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
          
          <button className="bg-white bg-opacity-20 border border-white border-opacity-30 px-4 py-2 rounded-full flex items-center gap-2 transition hover:bg-opacity-30">
            <i className="fas fa-user-circle"></i>
            <span>{currentLanguage === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;