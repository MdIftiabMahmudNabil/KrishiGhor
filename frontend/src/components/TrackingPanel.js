import React from 'react';

const TrackingPanel = ({ currentLanguage, trackingData }) => {
  if (!trackingData) {
    return (
      <div className="card">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <h2 className="text-xl font-semibold text-darkText">
            {currentLanguage === 'bn' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
          </h2>
        </div>
        <div className="p-6 text-center text-lightText py-12">
          <i className="fas fa-truck text-4xl mb-4 text-gray-300"></i>
          <p>{currentLanguage === 'bn' ? 'ট্র্যাকিং তথ্য প্রদর্শন করতে ট্র্যাকিং নম্বর লিখুন' : 'Enter a tracking number to display tracking information'}</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending',
          color: 'bg-warning',
          dotColor: 'bg-yellow-500'
        };
      case 'in-transit':
        return {
          text: currentLanguage === 'bn' ? 'পরিবহনে' : 'In Transit',
          color: 'bg-info',
          dotColor: 'bg-blue-500 animate-pulse'
        };
      case 'delivered':
        return {
          text: currentLanguage === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered',
          color: 'bg-success',
          dotColor: 'bg-green-500'
        };
      default:
        return {
          text: status,
          color: 'bg-gray-500',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo(trackingData.status);

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-semibold text-darkText">
          {currentLanguage === 'bn' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusInfo.dotColor}`}></span>
          <span className="text-sm font-medium">{statusInfo.text}</span>
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-r from-primary to-secondary text-white text-center rounded-lg mx-6 mt-6">
        <h4 className="mb-2">{currentLanguage === 'bn' ? 'ট্র্যাকিং নম্বর' : 'Tracking Number'}</h4>
        <div className="text-2xl font-mono font-bold">{trackingData.trackingNumber}</div>
      </div>
      
      <div className="h-64 bg-gray-100 rounded-lg mx-6 my-6 relative overflow-hidden border-2 border-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 opacity-50"></div>
        
        {/* Route line */}
        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full w-3/4"></div>
        
        {/* Truck marker */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-truck"></i>
        </div>
        
        {/* Origin pin */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-danger text-2xl">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        
        {/* Destination pin */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-success text-2xl">
          <i className="fas fa-flag-checkered"></i>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h4 className="text-lg font-semibold text-darkText mb-3">
            {currentLanguage === 'bn' ? 'গাড়ির তথ্য' : 'Vehicle Info'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-lightText">{currentLanguage === 'bn' ? 'নম্বর:' : 'Number:'}</p>
              <p className="font-medium">{trackingData.vehicle}</p>
            </div>
            <div>
              <p className="text-sm text-lightText">{currentLanguage === 'bn' ? 'চালক:' : 'Driver:'}</p>
              <p className="font-medium">{trackingData.driver}</p>
            </div>
            <div>
              <p className="text-sm text-lightText">{currentLanguage === 'bn' ? 'ফোন:' : 'Phone:'}</p>
              <p className="font-medium">{trackingData.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <i className="fas fa-tachometer-alt text-info"></i>
              <span className="font-semibold">{trackingData.speed} {currentLanguage === 'bn' ? 'কিমি/ঘন্টা' : 'km/h'}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <i className="fas fa-route text-info"></i>
              <span className="font-semibold">{trackingData.remaining} {currentLanguage === 'bn' ? 'কিমি বাকি' : 'km left'}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
              <i className="fas fa-clock text-info"></i>
              <span className="font-semibold">{trackingData.eta} {currentLanguage === 'bn' ? 'মিনিট' : 'minutes'}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className={`flex items-center gap-4 p-4 rounded-lg ${trackingData.status !== 'pending' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-100'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trackingData.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              <i className="fas fa-box"></i>
            </div>
            <div>
              <h5 className="font-semibold">{currentLanguage === 'bn' ? 'পিকআপ' : 'Pickup'}</h5>
              <p className="text-sm text-lightText">
                {trackingData.status !== 'pending' ? '১০:৩০ AM' : (currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending')}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-4 p-4 rounded-lg ${trackingData.status === 'in-transit' || trackingData.status === 'delivered' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-100'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trackingData.status === 'in-transit' || trackingData.status === 'delivered' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              <i className="fas fa-truck"></i>
            </div>
            <div>
              <h5 className="font-semibold">{currentLanguage === 'bn' ? 'পরিবহনে' : 'In Transit'}</h5>
              <p className="text-sm text-lightText">
                {trackingData.status === 'in-transit' 
                  ? (currentLanguage === 'bn' ? 'চলমান' : 'In Progress') 
                  : trackingData.status === 'delivered' 
                    ? '১১:১৫ AM' 
                    : (currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending')
                }
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-4 p-4 rounded-lg ${trackingData.status === 'delivered' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-100'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trackingData.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              <i className="fas fa-flag-checkered"></i>
            </div>
            <div>
              <h5 className="font-semibold">{currentLanguage === 'bn' ? 'ডেলিভারি' : 'Delivery'}</h5>
              <p className="text-sm text-lightText">
                {trackingData.status === 'delivered' 
                  ? '১২:৩০ PM' 
                  : trackingData.status === 'in-transit'
                    ? `${trackingData.eta} ${currentLanguage === 'bn' ? 'মিনিট' : 'minutes'}`
                    : (currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending')
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPanel;