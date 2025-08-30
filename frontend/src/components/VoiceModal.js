import React from 'react';

const VoiceModal = ({ currentLanguage, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-darkText">
            {currentLanguage === 'bn' ? 'ভয়েস ইনপুট' : 'Voice Input'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary border-opacity-20 rounded-full animate-ping"></div>
            <div className="absolute inset-4 border-4 border-primary border-opacity-30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-8 border-4 border-primary border-opacity-40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl">
              <i className="fas fa-microphone"></i>
            </div>
          </div>
          
          <p className="text-primary font-semibold mb-2">
            {currentLanguage === 'bn' ? 'কথা বলুন...' : 'Speak now...'}
          </p>
          <p className="text-lightText italic min-h-12 mb-6">
            {currentLanguage === 'bn' ? 'ভয়েস শনাক্ত করা হচ্ছে...' : 'Voice recognition in progress...'}
          </p>
          
          <button 
            onClick={onClose}
            className="bg-danger text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-stop"></i>
            <span>{currentLanguage === 'bn' ? 'বন্ধ করুন' : 'Stop'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;