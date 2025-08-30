import React, { useState } from 'react';

const TransportForm = ({ currentLanguage, onVoiceInput, onSubmitForm, marketData }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    vehicleType: '',
    origin: '',
    district: '',
    market: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm(formData);
  };

  const cropOptions = [
    { value: 'rice', label: currentLanguage === 'bn' ? 'ধান' : 'Rice' },
    { value: 'wheat', label: currentLanguage === 'bn' ? 'গম' : 'Wheat' },
    { value: 'potato', label: currentLanguage === 'bn' ? 'আলু' : 'Potato' },
    { value: 'onion', label: currentLanguage === 'bn' ? 'পেঁয়াজ' : 'Onion' },
    { value: 'tomato', label: currentLanguage === 'bn' ? 'টমেটো' : 'Tomato' }
  ];

  const vehicleOptions = [
    { value: 'truck', label: currentLanguage === 'bn' ? 'ট্রাক' : 'Truck' },
    { value: 'pickup', label: currentLanguage === 'bn' ? 'পিকআপ' : 'Pickup' }
  ];

  const districtOptions = [
    { value: 'dhaka', label: currentLanguage === 'bn' ? 'ঢাকা' : 'Dhaka' },
    { value: 'chittagong', label: currentLanguage === 'bn' ? 'চট্টগ্রাম' : 'Chittagong' },
    { value: 'sylhet', label: currentLanguage === 'bn' ? 'সিলেট' : 'Sylhet' },
    { value: 'rajshahi', label: currentLanguage === 'bn' ? 'রাজশাহী' : 'Rajshahi' }
  ];

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-semibold text-darkText">
          {currentLanguage === 'bn' ? 'নতুন পরিবহন অনুরোধ' : 'New Transport Request'}
        </h2>
        <button 
          onClick={onVoiceInput}
          className="bg-accent text-darkText p-3 rounded-full hover:bg-yellow-400 transition-colors"
        >
          <i className="fas fa-microphone"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label className="form-label">
            {currentLanguage === 'bn' ? 'ফসলের ধরন' : 'Crop Type'}
          </label>
          <select 
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">{currentLanguage === 'bn' ? 'ফসল নির্বাচন করুন' : 'Select Crop'}</option>
            {cropOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">
              {currentLanguage === 'bn' ? 'পরিমাণ (কেজি)' : 'Quantity (kg)'}
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">
              {currentLanguage === 'bn' ? 'গাড়ির ধরন' : 'Vehicle Type'}
            </label>
            <select 
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">{currentLanguage === 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Vehicle'}</option>
              {vehicleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">
            {currentLanguage === 'bn' ? 'শুরুর স্থান' : 'Origin Location'}
          </label>
          <div className="relative">
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder={currentLanguage === 'bn' ? 'আপনার বর্তমান অবস্থান' : 'Your current location'}
              className="form-input pr-12"
              required
            />
            <button 
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full"
            >
              <i className="fas fa-map-marker-alt"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">
              {currentLanguage === 'bn' ? 'গন্তব্য জেলা' : 'Destination District'}
            </label>
            <select 
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">{currentLanguage === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
              {districtOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">
              {currentLanguage === 'bn' ? 'বাজার' : 'Market'}
            </label>
            <select 
              name="market"
              value={formData.market}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={!formData.district}
            >
              <option value="">
                {formData.district 
                  ? (currentLanguage === 'bn' ? 'বাজার নির্বাচন করুন' : 'Select Market') 
                  : (currentLanguage === 'bn' ? 'প্রথমে জেলা নির্বাচন করুন' : 'Select district first')
                }
              </option>
              {formData.district && marketData[formData.district]?.map(market => (
                <option key={market.value} value={market.name}>{market.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <i className="fas fa-robot"></i>
            {currentLanguage === 'bn' ? 'এআই সুপারিশ' : 'AI Recommendations'}
          </h4>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg border-l-4 border-primary cursor-pointer hover:shadow-md transition-shadow">
              {currentLanguage === 'bn' ? '🏆 সর্বোচ্চ দাম: কাওরান বাজার (৳৫০/কেজি)' : '🏆 Highest Price: Kawran Bazar (৳50/kg)'}
            </div>
            <div className="bg-white p-3 rounded-lg border-l-4 border-primary cursor-pointer hover:shadow-md transition-shadow">
              {currentLanguage === 'bn' ? '🚛 দ্রুততম পরিবহন: ট্রাক (২৫ মিনিট)' : '🚛 Fastest Transport: Truck (25 minutes)'}
            </div>
            <div className="bg-white p-3 rounded-lg border-l-4 border-primary cursor-pointer hover:shadow-md transition-shadow">
              {currentLanguage === 'bn' ? '💰 সাশ্রয়ী বিকল্প: সাহেব বাজার, রাজশাহী' : '💰 Cost-effective: Saheb Bazar, Rajshahi'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-warning mb-3 flex items-center gap-2">
            <i className="fas fa-coins"></i>
            {currentLanguage === 'bn' ? 'আনুমানিক খরচ' : 'Estimated Cost'}
          </h4>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span>{currentLanguage === 'bn' ? 'দূরত্ব' : 'Distance'}</span>
              <span className="font-semibold">-- {currentLanguage === 'bn' ? 'কিমি' : 'km'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-200">
              <span>{currentLanguage === 'bn' ? 'পরিবহন খরচ' : 'Transport Cost'}</span>
              <span className="font-semibold">৳ --</span>
            </div>
            <div className="flex justify-between items-center py-2 font-bold text-lg border-t-2 border-amber-300">
              <span>{currentLanguage === 'bn' ? 'মোট খরচ' : 'Total Cost'}</span>
              <span className="text-warning">৳ --</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-warning font-semibold">
            <i className="fas fa-clock"></i>
            <span>{currentLanguage === 'bn' ? 'আনুমানিক সময়:' : 'Estimated Time:'}</span>
            <span>-- {currentLanguage === 'bn' ? 'মিনিট' : 'minutes'}</span>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <i className="fas fa-paper-plane"></i>
          <span>{currentLanguage === 'bn' ? 'পরিবহন অনুরোধ করুন' : 'Request Transport'}</span>
        </button>
      </form>
    </div>
  );
};

export default TransportForm;