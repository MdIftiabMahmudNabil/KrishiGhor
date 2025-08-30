import React, { useState } from 'react';
import TransportForm from './TransportForm';
import TrackingPanel from './TrackingPanel';

const ContentGrid = ({ currentLanguage, trackingData, onVoiceInput, onSubmitForm, marketData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <TransportForm 
        currentLanguage={currentLanguage} 
        onVoiceInput={onVoiceInput}
        onSubmitForm={onSubmitForm}
        marketData={marketData}
      />
      <TrackingPanel 
        currentLanguage={currentLanguage}
        trackingData={trackingData}
      />
    </div>
  );
};

export default ContentGrid;