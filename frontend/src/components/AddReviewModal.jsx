import React, { useState } from 'react';
import { reviewAPI } from '../services/api';

const AddReviewModal = ({ booking, user, onClose, onSuccess }) => {
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    driverRating: 5,
    driverComment: '',
    jcbRating: 5,
    jcbComment: '',
    reviewType: 'SERVICE_REVIEW'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = (field, currentRating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(field, star)}
            className={`text-3xl transition ${
              star <= currentRating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-500`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        customerId: user.nic,
        bookingId: booking.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        driverRating: reviewData.driverRating,
        driverComment: reviewData.driverComment,
        jcbRating: reviewData.jcbRating,
        jcbComment: reviewData.jcbComment,
        reviewType: reviewData.reviewType
      };

      const response = await reviewAPI.createReview(payload);
      
      if (response.includes('Success') || response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || response);
      }
    } catch (err) {
      console.error('Review error:', err);
      setError(err.response?.data || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Booking Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Booking Details</h3>
            <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
            <p className="text-sm text-gray-600">JCB: {booking.jcbId}</p>
            <p className="text-sm text-gray-600">Driver: {booking.driverEmail}</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Overall Rating */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Overall Experience Rating *
            </label>
            {renderStars('rating', reviewData.rating)}
            <p className="text-sm text-gray-500 mt-1">
              {reviewData.rating} out of 5 stars
            </p>
          </div>

          {/* Overall Comment */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Overall Comments
            </label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Share your overall experience..."
            />
          </div>

          {/* Driver Review Section */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Driver Service Rating</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Driver Rating *
              </label>
              {renderStars('driverRating', reviewData.driverRating)}
              <p className="text-sm text-gray-500 mt-1">
                {reviewData.driverRating} out of 5 stars
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Driver Service Comments
              </label>
              <textarea
                value={reviewData.driverComment}
                onChange={(e) => setReviewData(prev => ({ ...prev, driverComment: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="How was the driver's service? (professionalism, punctuality, etc.)"
              />
            </div>
          </div>

          {/* JCB Review Section */}
          <div className="border-t pt-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">JCB Equipment Rating</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                JCB Equipment Rating *
              </label>
              {renderStars('jcbRating', reviewData.jcbRating)}
              <p className="text-sm text-gray-500 mt-1">
                {reviewData.jcbRating} out of 5 stars
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                JCB Equipment Comments
              </label>
              <textarea
                value={reviewData.jcbComment}
                onChange={(e) => setReviewData(prev => ({ ...prev, jcbComment: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="How was the JCB's condition and performance?"
              />
            </div>
          </div>

          {/* Review Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Review Type *
            </label>
            <select
              value={reviewData.reviewType}
              onChange={(e) => setReviewData(prev => ({ ...prev, reviewType: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="SERVICE_REVIEW">Service Review</option>
              <option value="FEEDBACK">Feedback</option>
              <option value="COMPLAINT">Complaint</option>
            </select>
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
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
