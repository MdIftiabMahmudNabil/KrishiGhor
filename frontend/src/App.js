import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import StatsGrid from './components/StatsGrid';
import ContentGrid from './components/ContentGrid';
import OrdersCard from './components/OrdersCard';
import VoiceModal from './components/VoiceModal';
import LoadingSpinner from './components/LoadingSpinner';

// Tracking data storage
const trackingDatabase = {
  'KG-2025-001230': {
    status: 'delivered',
    crop: 'ধান',
    quantity: '৫০০ কেজি',
    destination: 'কাওরান বাজার, ঢাকা',
    vehicle: 'ঢাকা-মেট্রো-গ-১২৩৪৫৬',
    driver: 'মোঃ করিম আলী',
    phone: '০১৭১২৩৪৫৬৭৮',
    speed: 0,
    remaining: 0,
    eta: 0,
    progress: 100
  },
  'KG-2025-001231': {
    status: 'in-transit',
    crop: 'আলু',
    quantity: '৩০০ কেজি',
    destination: 'চট্টগ্রাম',
    vehicle: 'চট্ট-গা-১১২২৩৩',
    driver: 'মোঃ রহিম উদ্দিন',
    phone: '০১৮১২৩৪৫৬৭৮',
    speed: 45,
    remaining: 85,
    eta: 120,
    progress: 60
  },
  'KG-2025-001232': {
    status: 'delivered',
    crop: 'টমেটো',
    quantity: '২০০ কেজি',
    destination: 'সিলেট',
    vehicle: 'সিলে-গা-৯৯৮৮৭৭',
    driver: 'মোঃ আহমদ হোসেন',
    phone: '০১৯১২৩৪৫৬৭৮',
    speed: 0,
    remaining: 0,
    eta: 0,
    progress: 100
  }
};

// Market Data
const marketData = {
  dhaka: [
    { name: 'কাওরান বাজার', value: 'kawran', price: 45 },
    { name: 'শাহবাগ বাজার', value: 'shahbag', price: 42 },
    { name: 'ফার্মগেট বাজার', value: 'farmgate', price: 48 },
    { name: 'নিউমার্কেট', value: 'newmarket', price: 50 }
  ],
  chittagong: [
    { name: 'রিয়াজউদ্দিন বাজার', value: 'riazuddin', price: 38 },
    { name: 'চকবাজার', value: 'chokbazar', price: 40 },
    { name: 'কদমতলী বাজার', value: 'kadamtoli', price: 36 }
  ],
  sylhet: [
    { name: 'সুবিদবাজার', value: 'subidbazar', price: 44 },
    { name: 'বন্দরবাজার', value: 'bondorbazar', price: 42 },
    { name: 'আম্বরখানা', value: 'amborkhana', price: 46 }
  ],
  rajshahi: [
    { name: 'সাহেব বাজার', value: 'saheb', price: 35 },
    { name: 'তালাইমারি বাজার', value: 'talaimari', price: 37 },
    { name: 'বরেন্দ্র পার্ক বাজার', value: 'borendro', price: 39 }
  ]
};

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('bn');
  const [isLoading, setIsLoading] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      crop: 'ধান',
      quantity: '৫০০ কেজি',
      destination: 'কাওরান বাজার, ঢাকা',
      tracking: 'KG-2025-001230',
      date: '২৮ জুলাই, ২০২৫',
      status: 'delivered',
      cost: '৬৫০'
    },
    {
      id: 2,
      crop: 'আলু',
      quantity: '৩০০ কেজি',
      destination: 'চট্টগ্রাম',
      tracking: 'KG-2025-001231',
      date: '২৬ জুলাই, ২০২৫',
      status: 'in-transit',
      cost: '৮২০'
    },
    {
      id: 3,
      crop: 'টমেটো',
      quantity: '২০০ কেজি',
      destination: 'সিলেট',
      tracking: 'KG-2025-001232',
      date: '২৪ জুলাই, ২০২৫',
      status: 'delivered',
      cost: '৪৫০'
    }
  ]);

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'bn' ? 'en' : 'bn');
  };

  const startVoiceInput = () => {
    setShowVoiceModal(true);
  };

  const closeVoiceModal = () => {
    setShowVoiceModal(false);
  };

  const searchTracking = (trackingNumber) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (trackingDatabase[trackingNumber]) {
        setTrackingData({
          ...trackingDatabase[trackingNumber],
          trackingNumber: trackingNumber
        });
      } else {
        alert(currentLanguage === 'bn' 
          ? 'ট্র্যাকিং নম্বর পাওয়া যায়নি' 
          : 'Tracking number not found');
      }
    }, 1500);
  };

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    
    // Generate new tracking number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const newTrackingNumber = `KG-${year}-${randomNum}`;
    
    // Create new tracking entry
    const newTracking = {
      status: 'pending',
      crop: formData.crop,
      quantity: formData.quantity + ' কেজি',
      destination: formData.market + ', ' + formData.district,
      vehicle: 'ঢাকা-মেট্রো-গ-' + Math.floor(Math.random() * 900000 + 100000),
      driver: 'মোঃ ' + ['করিম', 'রহিম', 'সালাম', 'জামাল'][Math.floor(Math.random() * 4)] + ' আলী',
      phone: '০১৭' + Math.floor(Math.random() * 90000000 + 10000000),
      speed: 0,
      remaining: 0,
      eta: 0,
      progress: 0
    };
    
    // Add to tracking database
    trackingDatabase[newTrackingNumber] = newTracking;
    
    // Add to recent orders
    const newOrder = {
      id: recentOrders.length + 1,
      crop: formData.crop,
      quantity: formData.quantity + ' কেজি',
      destination: formData.market + ', ' + formData.district,
      tracking: newTrackingNumber,
      date: new Date().toLocaleDateString('bn-BD'),
      status: 'pending',
      cost: Math.floor(Math.random() * 500 + 300)
    };
    
    setRecentOrders([newOrder, ...recentOrders]);
    
    // Show tracking info
    setTimeout(() => {
      setIsLoading(false);
      setTrackingData({
        ...newTracking,
        trackingNumber: newTrackingNumber
      });
      
      // Start pickup simulation after 3 seconds
      setTimeout(() => {
        const updatedTracking = {
          ...newTracking,
          status: 'in-transit',
          speed: 45,
          remaining: 85,
          eta: 120
        };
        
        trackingDatabase[newTrackingNumber] = updatedTracking;
        setTrackingData({
          ...updatedTracking,
          trackingNumber: newTrackingNumber
        });
      }, 3000);
    }, 2000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-green-100 ${currentLanguage === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Header 
        currentLanguage={currentLanguage} 
        toggleLanguage={toggleLanguage} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <SearchSection 
          currentLanguage={currentLanguage} 
          onSearch={searchTracking} 
        />
        
        <StatsGrid currentLanguage={currentLanguage} />
        
        <ContentGrid 
          currentLanguage={currentLanguage}
          trackingData={trackingData}
          onVoiceInput={startVoiceInput}
          onSubmitForm={handleFormSubmit}
          marketData={marketData}
        />
        
        <OrdersCard 
          currentLanguage={currentLanguage} 
          orders={recentOrders}
        />
      </main>
      
      {showVoiceModal && (
        <VoiceModal 
          currentLanguage={currentLanguage}
          onClose={closeVoiceModal}
        />
      )}
      
      {isLoading && <LoadingSpinner currentLanguage={currentLanguage} />}
    </div>
  );
}

export default App;