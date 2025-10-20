import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Layout from '../components/Layout';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, totalAmount, jcbType } = location.state || {};
  
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const paymentMethods = [
    {
      id: 'CASH',
      name: 'Cash Payment',
      description: 'Pay in cash upon delivery',
      icon: '💵'
    },
    {
      id: 'CREDIT_CARD',
      name: 'Credit Card',
      description: 'Pay securely with your credit card',
      icon: '💳'
    },
    {
      id: 'PAYPAL',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️'
    }
  ];

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      setMessage({ type: 'error', text: 'Please select a payment method' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...bookingData,
        paymentMethod: selectedPayment
      };

      const response = await bookingAPI.createBooking(payload);
      
      if (response.includes('Success') || response.success) {
        setMessage({ type: 'success', text: response.message || response });
        setTimeout(() => {
          navigate('/dashboard/customer');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || response });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Payment failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            No booking data found. Please start from the booking form.
          </div>
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Complete Your Payment
        </h1>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">JCB Type:</p>
              <p className="font-semibold text-lg">{jcbType}</p>
            </div>
            <div>
              <p className="text-gray-600">Rental Period:</p>
              <p className="font-semibold">
                {new Date(bookingData.rentalDate).toLocaleDateString()} - {new Date(bookingData.returnDate).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <p className="text-gray-600">Total Amount:</p>
              <p className="font-bold text-3xl text-green-600">LKR {totalAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
          
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedPayment === method.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{method.name}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard/customer')}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentSubmit}
            disabled={loading || !selectedPayment}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Payment...' : 'Confirm and Pay'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
