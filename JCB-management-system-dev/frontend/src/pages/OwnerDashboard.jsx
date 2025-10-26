import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jcbAPI, maintenanceAPI } from '../services/api';
import Layout from '../components/Layout';
import AddJCBModal from '../components/AddJCBModal';
import EditMaintenanceModal from '../components/EditMaintenanceModal';
import EditJCBModal from '../components/EditJCBModal';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [jcbs, setJcbs] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddJCBModal, setShowAddJCBModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditJCBModal, setShowEditJCBModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedJCB, setSelectedJCB] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOwnerJCBs();
    fetchOwnerMaintenance();
  }, []);

  const fetchOwnerJCBs = async () => {
    setLoading(true);
    try {
      if (user?.nic) {
        const data = await jcbAPI.getOwnerJCBs(user.nic);
        setJcbs(data);
      }
    } catch (error) {
      console.error('Error fetching JCBs:', error);
      setMessage({ type: 'error', text: 'Failed to fetch JCBs' });
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerMaintenance = async () => {
    try {
      if (user?.nic) {
        const data = await maintenanceAPI.getOwnerMaintenance(user.nic);
        setMaintenance(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const handleAddJCBSuccess = () => {
    setMessage({ type: 'success', text: 'JCB added successfully!' });
    fetchOwnerJCBs();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditSuccess = () => {
    setMessage({ type: 'success', text: 'Maintenance record updated successfully!' });
    fetchOwnerMaintenance();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditJCBSuccess = () => {
    setMessage({ type: 'success', text: 'JCB updated successfully!' });
    fetchOwnerJCBs();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditJCB = (jcb) => {
    setSelectedJCB(jcb);
    setShowEditJCBModal(true);
  };

  const handleToggleAvailability = async (registeredNumber, currentStatus) => {
    try {
      await jcbAPI.updateJCBAvailability(registeredNumber, !currentStatus);
      setMessage({ type: 'success', text: 'JCB availability updated!' });
      fetchOwnerJCBs();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating JCB:', error);
      setMessage({ type: 'error', text: 'Failed to update JCB availability' });
    }
  };

  const getSubscriptionBadge = (plan) => {
    const badges = {
      'BASIC': 'bg-gray-100 text-gray-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'PREMIUM': 'bg-purple-100 text-purple-800'
    };
    return badges[plan] || 'bg-gray-100 text-gray-800';
  };

  const getSubscriptionIcon = (plan) => {
    const icons = {
      'BASIC': '📦',
      'NORMAL': '⭐',
      'PREMIUM': '👑'
    };
    return icons[plan] || '📦';
  };

  const getIssueIcon = (issueType) => {
    const icons = {
      'ENGINE': '⚙️',
      'HYDRAULIC': '💧',
      'ELECTRICAL': '⚡',
      'STRUCTURAL': '🔧',
      'OTHER': '🛠️'
    };
    return icons[issueType] || '🛠️';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': 'bg-gray-100 text-gray-800',
      'ASSIGNED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    };
    return badges[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Owner Dashboard
        </h1>

        {/* Owner Info Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.firstName} {user?.lastName}!</h2>
              <p className="text-blue-100 mb-4">
                NIC: {user?.nic} | Email: {user?.email}
              </p>
            </div>
            <div className="text-right">
              <p className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getSubscriptionBadge(user?.subscriptionPlan)}`}>
                {getSubscriptionIcon(user?.subscriptionPlan)} {user?.subscriptionPlan} Plan
              </p>
              <p className="text-2xl font-bold mt-2">
                LKR {user?.monthlyFee || 0}/month
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total JCBs</p>
                <p className="text-3xl font-bold mt-1">{jcbs.length}</p>
              </div>
              <div className="text-5xl opacity-50">🚜</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available JCBs</p>
                <p className="text-3xl font-bold mt-1">
                  {jcbs.filter(j => j.isAvailable).length}
                </p>
              </div>
              <div className="text-5xl opacity-50">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Rented Out</p>
                <p className="text-3xl font-bold mt-1">
                  {jcbs.filter(j => !j.isAvailable).length}
                </p>
              </div>
              <div className="text-5xl opacity-50">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Maintenance Reports</p>
                <p className="text-3xl font-bold mt-1">{maintenance.length}</p>
              </div>
              <div className="text-5xl opacity-50">🔧</div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add JCB Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Manage Your JCBs</h3>
              <p className="text-gray-600 mt-1">Add new equipment to expand your fleet</p>
            </div>
            <button
              onClick={() => setShowAddJCBModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span className="text-xl">➕</span> Add New JCB
            </button>
          </div>
        </div>

        {/* JCBs List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Registered JCBs ({jcbs.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading JCBs...</p>
            </div>
          ) : jcbs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚜</div>
              <p className="text-gray-600 text-lg mb-4">No JCBs registered yet</p>
              <button
                onClick={() => setShowAddJCBModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First JCB
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jcbs.map(jcb => (
                <div key={jcb.registeredNumber} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-xl transition">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800">{jcb.jcbType}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        jcb.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {jcb.isAvailable ? '✅ Available' : '🚫 Rented'}
                      </span>
                      <button
                        onClick={() => handleEditJCB(jcb)}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* JCB Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold w-24">Reg No:</span>
                      <span className="text-gray-800">{jcb.registeredNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold w-24">Engine:</span>
                      <span className="text-gray-800">{jcb.engineNumber}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">Daily Rental Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      LKR {jcb.rentalPrice.toLocaleString()}
                      <span className="text-sm text-gray-500">/day</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleToggleAvailability(jcb.registeredNumber, jcb.isAvailable)}
                      className={`w-full px-4 py-2 rounded-lg transition font-semibold ${
                        jcb.isAvailable
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {jcb.isAvailable ? '🔒 Mark as Rented' : '🔓 Mark as Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Records Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔧</span> Maintenance Records ({maintenance.length})
          </h2>

          {maintenance.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-gray-600 text-lg">No maintenance reports for your JCBs yet</p>
              <p className="text-gray-500 text-sm mt-2">All maintenance requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenance.map(record => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getIssueIcon(record.issueType)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {record.issueType} Issue - Report #{record.id}
                        </h3>
                        <p className="text-sm text-gray-600">JCB: {record.jcbId}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge(record.severity)}`}>
                        {record.severity}
                      </span>
                      {record.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedMaintenance(record);
                            setShowEditModal(true);
                          }}
                          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Problem Description:</p>
                    <p className="text-gray-800">{record.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {/* Assigned Mechanic */}
                    {record.mechanic && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-semibold mb-1">👨‍🔧 Assigned Mechanic</p>
                        <p className="text-sm font-bold text-gray-800">{record.mechanic.firstName} {record.mechanic.lastName}</p>
                        <p className="text-xs text-gray-600">{record.mechanic.email}</p>
                        <p className="text-xs text-gray-600">{record.mechanic.phone}</p>
                      </div>
                    )}

                    {/* Driver Info */}
                    {record.driver && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-600 font-semibold mb-1">🚗 Reported By</p>
                        <p className="text-sm font-bold text-gray-800">{record.driver.firstName} {record.driver.lastName}</p>
                        <p className="text-xs text-gray-600">{record.driver.email}</p>
                        <p className="text-xs text-gray-600">{record.driver.phone}</p>
                      </div>
                    )}

                    {/* JCB Details */}
                    {record.jcb && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-xs text-yellow-600 font-semibold mb-1">🚜 JCB Details</p>
                        <p className="text-sm font-bold text-gray-800">{record.jcb.jcbType}</p>
                        <p className="text-xs text-gray-600">Reg: {record.jcb.registeredNumber}</p>
                        <p className="text-xs text-gray-600">Engine: {record.jcb.engineNumber}</p>
                      </div>
                    )}
                  </div>

                  {/* Mechanic Notes */}
                  {record.mechanicNotes && (
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-purple-700 mb-1">📝 Mechanic Notes:</p>
                      <p className="text-gray-800">{record.mechanicNotes}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2 font-semibold">🕒 Timeline</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      {record.reportedDate && (
                        <div>
                          <span className="font-semibold">Reported:</span>{' '}
                          {new Date(record.reportedDate).toLocaleString()}
                        </div>
                      )}
                      {record.assignedDate && (
                        <div>
                          <span className="font-semibold">Assigned:</span>{' '}
                          {new Date(record.assignedDate).toLocaleString()}
                        </div>
                      )}
                      {record.completedDate && (
                        <div>
                          <span className="font-semibold text-green-600">Completed:</span>{' '}
                          {new Date(record.completedDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Features (for Premium/Normal users) */}
        {user?.subscriptionPlan !== 'BASIC' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {user?.subscriptionPlan} Plan Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {user?.subscriptionPlan === 'NORMAL' && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <p className="font-semibold text-gray-800">Maintenance Services</p>
                      <p className="text-sm text-gray-600">Regular equipment maintenance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold text-gray-800">Basic Support</p>
                      <p className="text-sm text-gray-600">Email and phone support</p>
                    </div>
                  </div>
                </>
              )}
              {user?.subscriptionPlan === 'PREMIUM' && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="font-semibold text-gray-800">Priority Support</p>
                      <p className="text-sm text-gray-600">24/7 dedicated support line</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-semibold text-gray-800">Analytics Dashboard</p>
                      <p className="text-sm text-gray-600">Real-time usage statistics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="font-semibold text-gray-800">Insurance Assistance</p>
                      <p className="text-sm text-gray-600">Help with equipment insurance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-semibold text-gray-800">Performance Reports</p>
                      <p className="text-sm text-gray-600">Monthly insights and analytics</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add JCB Modal */}
      {showAddJCBModal && (
        <AddJCBModal
          user={user}
          onClose={() => setShowAddJCBModal(false)}
          onSuccess={handleAddJCBSuccess}
        />
      )}

      {/* Edit Maintenance Modal */}
      {showEditModal && selectedMaintenance && (
        <EditMaintenanceModal
          maintenance={selectedMaintenance}
          user={user}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMaintenance(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Edit JCB Modal */}
      {showEditJCBModal && selectedJCB && (
        <EditJCBModal
          jcb={selectedJCB}
          user={user}
          onClose={() => {
            setShowEditJCBModal(false);
            setSelectedJCB(null);
          }}
          onSuccess={handleEditJCBSuccess}
        />
      )}
    </Layout>
  );
};

export default OwnerDashboard;
