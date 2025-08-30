import React from 'react';

const StatsGrid = ({ currentLanguage }) => {
  const stats = [
    {
      icon: 'fas fa-truck',
      value: '১২',
      label: currentLanguage === 'bn' ? 'সক্রিয় পরিবহন' : 'Active Transports'
    },
    {
      icon: 'fas fa-clock',
      value: '২৮ মিনিট',
      label: currentLanguage === 'bn' ? 'গড় ডেলিভারি সময়' : 'Avg Delivery Time'
    },
    {
      icon: 'fas fa-money-bill-wave',
      value: '৳৪৫০',
      label: currentLanguage === 'bn' ? 'গড় খরচ' : 'Avg Cost'
    },
    {
      icon: 'fas fa-star',
      value: '৪.৮',
      label: currentLanguage === 'bn' ? 'গড় রেটিং' : 'Avg Rating'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="bg-gradient-to-r from-primary to-secondary text-white w-14 h-14 rounded-full flex items-center justify-center">
            <i className={`${stat.icon} text-xl`}></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-darkText">{stat.value}</h3>
            <p className="text-lightText">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;