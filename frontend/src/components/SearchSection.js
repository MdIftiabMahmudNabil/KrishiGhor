import React, { useState } from 'react';

const SearchSection = ({ currentLanguage, onSearch }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSearch(trackingNumber);
    }
  };

  return (
    <div className="mb-8">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <i className="fas fa-search text-primary"></i>
          <h3 className="text-xl font-semibold text-primary">
            {currentLanguage === 'bn' ? 'আপনার ট্রাক খুঁজুন' : 'Search Your Truck'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="form-label">
              {currentLanguage === 'bn' ? 'ট্র্যাকিং নম্বর' : 'Tracking Number'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="KG-2025-001234"
                maxLength="15"
                className="form-input pr-10"
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-lightText"></i>
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full md:w-auto">
            <i className="fas fa-search"></i>
            <span>{currentLanguage === 'bn' ? 'খুঁজুন' : 'Search'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;