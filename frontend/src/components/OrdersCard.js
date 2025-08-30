import React from 'react';

const OrdersCard = ({ currentLanguage, orders }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return currentLanguage === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered';
      case 'in-transit':
        return currentLanguage === 'bn' ? 'পরিবহনে' : 'In Transit';
      case 'pending':
        return currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-semibold text-darkText">
          {currentLanguage === 'bn' ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}
        </h2>
        <button className="btn-secondary text-sm">
          {currentLanguage === 'bn' ? 'সব দেখুন' : 'View All'}
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        {orders.map(order => (
          <div key={order.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold text-darkText">{order.crop} - {order.quantity}</h4>
              <p className="text-sm text-lightText mt-1">
                <span>{currentLanguage === 'bn' ? 'গন্তব্য:' : 'Destination:'}</span> {order.destination}
              </p>
              <p className="text-sm text-lightText">
                <span>{currentLanguage === 'bn' ? 'ট্র্যাকিং:' : 'Tracking:'}</span> {order.tracking}
              </p>
              <span className="text-xs text-lightText mt-2 inline-block">{order.date}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`status-badge ${order.status} mb-2`}>
                {getStatusText(order.status)}
              </span>
              <span className="text-lg font-bold text-primary">৳ {order.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersCard;