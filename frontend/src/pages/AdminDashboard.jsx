import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewAPI, adminAPI, jcbAPI } from '../services/api';
import Layout from '../components/Layout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [owners, setOwners] = useState([]);
  const [jcbs, setJcbs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [customersData, driversData, mechanicsData, ownersData, jcbsData, bookingsData, reviewsData, statsData] = await Promise.all([
        adminAPI.getAllCustomers(),
        adminAPI.getAllDrivers(),
        adminAPI.getAllMechanics(),
        adminAPI.getAllOwners(),
        jcbAPI.getAllJCBs(),
        adminAPI.getAllBookings(),
        reviewAPI.getAllReviews(),
        reviewAPI.getStats()
      ]);
      
      setCustomers(customersData);
      setDrivers(driversData);
      setMechanics(mechanicsData);
      setOwners(ownersData);
      setJcbs(jcbsData);
      setBookings(bookingsData);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <span className="text-yellow-500">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'drivers', name: 'Drivers', icon: '🚗' },
    { id: 'mechanics', name: 'Mechanics', icon: '🔧' },
    { id: 'owners', name: 'Owners', icon: '👔' },
    { id: 'jcbs', name: 'JCBs', icon: '🚜' },
    { id: 'bookings', name: 'Bookings', icon: '📋' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard - System Management
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600">Email: {user?.email} | Role: {user?.userRole}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-center transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading data...</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-blue-100 text-sm">Total Customers</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">🚗</div>
                <p className="text-green-100 text-sm">Total Drivers</p>
                <p className="text-3xl font-bold">{drivers.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">👔</div>
                <p className="text-purple-100 text-sm">Total Owners</p>
                <p className="text-3xl font-bold">{owners.length}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">🔧</div>
                <p className="text-yellow-100 text-sm">Total Mechanics</p>
                <p className="text-3xl font-bold">{mechanics.length}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">🚜</div>
                <p className="text-red-100 text-sm">Total JCBs</p>
                <p className="text-3xl font-bold">{jcbs.length}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-indigo-100 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-pink-100 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-teal-100 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}⭐</p>
              </div>
            </div>

            <button
              onClick={fetchAllData}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Refresh All Data
            </button>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Customers ({customers.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map(customer => (
                    <tr key={customer.nic}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.nic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.firstName} {customer.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Drivers ({drivers.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.map(driver => (
                    <tr key={driver.nic}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.nic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.firstName} {driver.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          driver.isAvailable || driver.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {driver.isAvailable || driver.available ? 'Available' : 'Busy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mechanics Tab */}
        {activeTab === 'mechanics' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Mechanics ({mechanics.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mechanics.map(mechanic => (
                    <tr key={mechanic.nic}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{mechanic.nic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{mechanic.firstName} {mechanic.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{mechanic.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Owners Tab */}
        {activeTab === 'owners' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Owners ({owners.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Fee</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {owners.map(owner => (
                    <tr key={owner.nic}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{owner.nic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{owner.firstName} {owner.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{owner.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          owner.subscriptionPlan === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                          owner.subscriptionPlan === 'NORMAL' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {owner.subscriptionPlan || 'BASIC'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">LKR {owner.monthlyFee || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JCBs Tab */}
        {activeTab === 'jcbs' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All JCBs ({jcbs.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jcbs.map(jcb => (
                <div key={jcb.registeredNumber} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{jcb.jcbType}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      jcb.isAvailable || jcb.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {jcb.isAvailable || jcb.available ? 'Available' : 'Rented'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Reg: {jcb.registeredNumber}</p>
                  <p className="text-sm text-gray-600">Engine: {jcb.engineNumber}</p>
                  <p className="text-sm text-gray-600">Owner: {jcb.owner?.nic || 'N/A'}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">LKR {jcb.rentalPrice}/day</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Bookings ({bookings.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">JCB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rental Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">#{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.customerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.jcbId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.driverEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(booking.rentalDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(booking.returnDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentMethod || 'N/A'} - {booking.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Reviews ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Review #{review.id} - Customer: {review.customerId}</p>
                      <p className="text-sm text-gray-600">Booking #{review.bookingId} - {formatDate(review.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      review.reviewType === 'SERVICE_REVIEW' ? 'bg-blue-100 text-blue-800' :
                      review.reviewType === 'FEEDBACK' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {review.reviewType}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-semibold">Overall: {renderStars(review.rating)}</p>
                      {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Driver: {review.driverRating ? renderStars(review.driverRating) : 'N/A'}</p>
                      {review.driverComment && <p className="text-sm text-gray-600 mt-1">{review.driverComment}</p>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">JCB: {review.jcbRating ? renderStars(review.jcbRating) : 'N/A'}</p>
                      {review.jcbComment && <p className="text-sm text-gray-600 mt-1">{review.jcbComment}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
