import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, jcbAPI, reviewAPI } from '../services/api';
import Layout from '../components/Layout';
import AddReviewModal from '../components/AddReviewModal';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableJCBs, setAvailableJCBs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [myReviews, setMyReviews] = useState([]);

  const [bookingData, setBookingData] = useState({
    customerNic: user?.nic || '',
    jcbType: '',
    rentalDate: '',
    returnDate: '',
    acceptPrice: false,
    acceptTerms: false
  });

  useEffect(() => {
    fetchCustomerBookings();
    fetchAvailableJCBs();
    fetchMyReviews();
  }, []);

  const fetchCustomerBookings = async () => {
    try {
      if (user?.nic) {
        const data = await bookingAPI.getCustomerBookings(user.nic);
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableJCBs = async () => {
    try {
      const data = await jcbAPI.getAvailableJCBs();
      setAvailableJCBs(data);
    } catch (error) {
      console.error('Error fetching JCBs:', error);
    }
  };

  const fetchMyReviews = async () => {
    try {
      if (user?.nic) {
        const data = await reviewAPI.getCustomerReviews(user.nic);
        setMyReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = (booking) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setMessage({ type: 'success', text: 'Review submitted successfully!' });
    fetchMyReviews();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBookJCB = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!bookingData.jcbType) {
      setMessage({ type: 'error', text: 'Please select a JCB type' });
      return;
    }

    if (!bookingData.rentalDate || !bookingData.returnDate) {
      setMessage({ type: 'error', text: 'Please select both rental and return dates' });
      return;
    }

    const rentalDate = new Date(bookingData.rentalDate);
    const returnDate = new Date(bookingData.returnDate);

    if (rentalDate >= returnDate) {
      setMessage({ type: 'error', text: 'Return date must be after rental date' });
      return;
    }

    if (!bookingData.acceptPrice || !bookingData.acceptTerms) {
      setMessage({ type: 'error', text: 'Please accept both price and terms & conditions' });
      return;
    }

    // Calculate total amount
    const jcb = availableJCBs.find(j => j.jcbType === bookingData.jcbType);
    if (!jcb) {
      setMessage({ type: 'error', text: 'Selected JCB type not available' });
      return;
    }

    const days = Math.ceil((returnDate - rentalDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = jcb.rentalPrice * days;

    // Prepare booking data for payment page
    const paymentBookingData = {
      customerNic: user.nic,
      jcbType: bookingData.jcbType,
      rentalDate: new Date(bookingData.rentalDate).toISOString(),
      returnDate: new Date(bookingData.returnDate).toISOString(),
      acceptPrice: bookingData.acceptPrice,
      acceptTerms: bookingData.acceptTerms
    };

    // Navigate to payment page
    navigate('/payment', {
      state: {
        bookingData: paymentBookingData,
        totalAmount: totalAmount,
        jcbType: bookingData.jcbType
      }
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      setMessage({ type: 'success', text: 'Booking cancelled successfully' });
      fetchCustomerBookings();
      fetchAvailableJCBs();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setMessage({ type: 'error', text: 'Failed to cancel booking' });
    }
  };

  const handleEditBooking = (booking) => {
    setEditMode(true);
    setEditingBookingId(booking.id);
    setShowBookingForm(true);
    
    // Get JCB type from the booking
    const jcbType = booking.jcb?.jcbType || '';
    
    setBookingData({
      customerNic: user.nic,
      jcbType: jcbType,
      rentalDate: new Date(booking.rentalDate).toISOString().split('T')[0],
      returnDate: new Date(booking.returnDate).toISOString().split('T')[0],
      acceptPrice: false,
      acceptTerms: false
    });
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!bookingData.jcbType) {
      setMessage({ type: 'error', text: 'Please select a JCB type' });
      return;
    }

    if (!bookingData.rentalDate || !bookingData.returnDate) {
      setMessage({ type: 'error', text: 'Please select both rental and return dates' });
      return;
    }

    const rentalDate = new Date(bookingData.rentalDate);
    const returnDate = new Date(bookingData.returnDate);

    if (rentalDate >= returnDate) {
      setMessage({ type: 'error', text: 'Return date must be after rental date' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        jcbType: bookingData.jcbType,
        rentalDate: new Date(bookingData.rentalDate).toISOString(),
        returnDate: new Date(bookingData.returnDate).toISOString()
      };

      const response = await bookingAPI.updateBooking(editingBookingId, payload);
      
      if (response.includes('Success') || response.success) {
        setMessage({ type: 'success', text: response.message || response });
        setShowBookingForm(false);
        setEditMode(false);
        setEditingBookingId(null);
        setBookingData({
          customerNic: user.nic,
          jcbType: '',
          rentalDate: '',
          returnDate: '',
          acceptPrice: false,
          acceptTerms: false
        });
        fetchCustomerBookings();
        fetchAvailableJCBs();
      } else {
        setMessage({ type: 'error', text: response.message || response });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Failed to update booking. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingBookingId(null);
    setShowBookingForm(false);
    setBookingData({
      customerNic: user.nic,
      jcbType: '',
      rentalDate: '',
      returnDate: '',
      acceptPrice: false,
      acceptTerms: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique JCB types from available JCBs
  const jcbTypes = [...new Set(availableJCBs.map(jcb => jcb.jcbType))];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Customer Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600 mb-4">
            NIC: {user?.nic} | Email: {user?.email}
          </p>
          
          {!showBookingForm && (
            <button
              onClick={() => setShowBookingForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📅 Book a JCB
            </button>
          )}
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

        {showBookingForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Edit Booking' : 'Book a JCB'}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={editMode ? handleUpdateBooking : handleBookJCB} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Customer NIC *
                </label>
                <input
                  type="text"
                  name="customerNic"
                  value={bookingData.customerNic}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Required JCB Type *
                </label>
                <select
                  name="jcbType"
                  value={bookingData.jcbType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select JCB Type --</option>
                  {jcbTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Available JCB types: {jcbTypes.length > 0 ? jcbTypes.join(', ') : 'None available'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Rental Date *
                  </label>
                  <input
                    type="date"
                    name="rentalDate"
                    value={bookingData.rentalDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={bookingData.returnDate}
                    onChange={handleInputChange}
                    min={bookingData.rentalDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="acceptPrice"
                    checked={bookingData.acceptPrice}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                    required={!editMode}
                  />
                  <label className="text-gray-700">
                    I accept the rental price (calculated based on daily rates and rental duration) {!editMode && '*'}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={bookingData.acceptTerms}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                    required={!editMode}
                  />
                  <label className="text-gray-700">
                    I agree to the terms and conditions {!editMode && '*'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (editMode ? 'Updating...' : 'Submitting...') : (editMode ? 'Update Booking' : 'Submit Booking')}
              </button>
            </form>
          </div>
        )}

        {/* My Bookings Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <p className="text-gray-600">You have no bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JCB ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rental Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.jcbId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.rentalDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.returnDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.driverEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.paymentStatus === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ❌ Cancel
                        </button>
                        <button
                          onClick={() => handleAddReview(booking)}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          ⭐ Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Reviews</h2>
          
          {myReviews.length === 0 ? (
            <p className="text-gray-600">You haven't submitted any reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {myReviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-700">Booking #{review.bookingId}</span>
                      <span className="ml-3 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      review.reviewType === 'SERVICE_REVIEW'
                        ? 'bg-blue-100 text-blue-800'
                        : review.reviewType === 'FEEDBACK'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {review.reviewType}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Overall Rating</p>
                      <p className="text-yellow-500 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </p>
                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                      )}
                    </div>
                    
                    {review.driverRating && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Driver Rating</p>
                        <p className="text-yellow-500 text-lg">
                          {'★'.repeat(review.driverRating)}{'☆'.repeat(5 - review.driverRating)}
                        </p>
                        {review.driverComment && (
                          <p className="text-sm text-gray-600 mt-1">{review.driverComment}</p>
                        )}
                      </div>
                    )}
                    
                    {review.jcbRating && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">JCB Rating</p>
                        <p className="text-yellow-500 text-lg">
                          {'★'.repeat(review.jcbRating)}{'☆'.repeat(5 - review.jcbRating)}
                        </p>
                        {review.jcbComment && (
                          <p className="text-sm text-gray-600 mt-1">{review.jcbComment}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available JCBs Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available JCBs with Prices</h2>
          
          {availableJCBs.length === 0 ? (
            <p className="text-gray-600">No JCBs available at the moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableJCBs.map(jcb => (
                <div key={jcb.registeredNumber} className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-xl transition bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-2xl text-blue-700">{jcb.jcbType}</h3>
                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                      Available
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Reg No:</span> {jcb.registeredNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Engine:</span> {jcb.engineNumber}
                    </p>
                  </div>
                  
                  <div className="border-t-2 border-blue-200 pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">Daily Rental Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      LKR {jcb.rentalPrice.toLocaleString()}
                      <span className="text-sm text-gray-500">/day</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowBookingForm(true);
                      setBookingData(prev => ({ ...prev, jcbType: jcb.jcbType }));
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBookingForReview && (
        <AddReviewModal
          booking={selectedBookingForReview}
          user={user}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBookingForReview(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </Layout>
  );
};

export default CustomerDashboard;
