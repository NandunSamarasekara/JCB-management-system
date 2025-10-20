import React, { useState } from 'react';
import { jcbAPI } from '../services/api';

const AddJCBModal = ({ user, onClose, onSuccess }) => {
  const [jcbData, setJcbData] = useState({
    registeredNumber: '',
    engineNumber: '',
    jcbType: '',
    rentalPrice: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jcbTypes = [
    'Excavator',
    'Backhoe Loader',
    'Skid Steer Loader',
    'Bulldozer',
    'Wheel Loader',
    'Compactor',
    'Trencher'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJcbData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        registeredNumber: jcbData.registeredNumber,
        engineNumber: jcbData.engineNumber,
        jcbType: jcbData.jcbType,
        rentalPrice: parseFloat(jcbData.rentalPrice),
        isAvailable: jcbData.isAvailable,
        ownerNic: user.nic
      };

      const response = await jcbAPI.addJCB(payload);
      
      if (response.includes('Success') || response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || response);
      }
    } catch (err) {
      console.error('Add JCB error:', err);
      setError(err.response?.data || 'Failed to add JCB. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New JCB</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Owner Info (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Owner: {user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">NIC: {user.nic}</p>
          </div>

          {/* Registered Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Registered Number *
            </label>
            <input
              type="text"
              name="registeredNumber"
              value={jcbData.registeredNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., JCB-001"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Unique registration number for the JCB</p>
          </div>

          {/* Engine Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Engine Number *
            </label>
            <input
              type="text"
              name="engineNumber"
              value={jcbData.engineNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ENG-12345"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Unique engine number</p>
          </div>

          {/* JCB Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              JCB Type *
            </label>
            <select
              name="jcbType"
              value={jcbData.jcbType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select JCB Type --</option>
              {jcbTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Rental Price */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Daily Rental Price (LKR) *
            </label>
            <input
              type="number"
              name="rentalPrice"
              value={jcbData.rentalPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5000"
              min="0"
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Price per day in Sri Lankan Rupees</p>
          </div>

          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={jcbData.isAvailable}
              onChange={handleInputChange}
              className="mr-2 w-4 h-4"
            />
            <label className="text-gray-700">
              Mark as available for rent immediately
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding JCB...' : 'Add JCB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJCBModal;
