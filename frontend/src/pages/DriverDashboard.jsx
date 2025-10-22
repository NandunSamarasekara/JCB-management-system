import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { maintenanceAPI } from '../services/api';
import Layout from '../components/Layout';
import ReportMaintenanceModal from '../components/ReportMaintenanceModal';
import EditMaintenanceModal from '../components/EditMaintenanceModal';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [maintenanceReports, setMaintenanceReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMaintenanceReports();
  }, []);

  const fetchMaintenanceReports = async () => {
    setLoading(true);
    try {
      if (user?.nic) {
        const data = await maintenanceAPI.getDriverMaintenance(user.nic);
        setMaintenanceReports(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSuccess = () => {
    setMessage({ type: 'success', text: 'Maintenance report submitted successfully! A mechanic has been assigned.' });
    fetchMaintenanceReports();
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setMessage({ type: 'success', text: 'Maintenance report updated successfully!' });
    fetchMaintenanceReports();
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await maintenanceAPI.deleteMaintenance(reportToDelete.id);
      setMessage({ type: 'success', text: 'Maintenance report deleted successfully!' });
      fetchMaintenanceReports();
      setShowDeleteConfirm(false);
      setReportToDelete(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Error deleting maintenance report:', error);
      setMessage({ type: 'error', text: 'Failed to delete maintenance report' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setReportToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-gray-100 text-gray-800',
      'ASSIGNED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getIssueIcon = (issueType) => {
    const icons = {
      'ENGINE': '⚙️',
      'HYDRAULIC': '💧',
      'ELECTRICAL': '⚡',
      'STRUCTURAL': '🔧',
      'OTHER': '🛠️'
    };
    return icons[issueType] || '🔧';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Driver Dashboard
        </h1>

        {/* Driver Info Card */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, {user?.firstName} {user?.lastName}!</h2>
              <p className="text-blue-100 mb-2">
                NIC: {user?.nic} | Email: {user?.email}
              </p>
              <p className="text-lg font-semibold">
                Status: <span className="px-3 py-1 bg-white bg-opacity-20 rounded">
                  {user?.isAvailable || user?.available ? '✅ Available' : '🚫 On Duty'}
                </span>
              </p>
            </div>
            <div className="text-6xl opacity-50">🚗</div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Reports</p>
                <p className="text-3xl font-bold mt-1">{maintenanceReports.length}</p>
              </div>
              <div className="text-5xl opacity-50">📝</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">In Progress</p>
                <p className="text-3xl font-bold mt-1">
                  {maintenanceReports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length}
                </p>
              </div>
              <div className="text-5xl opacity-50">⚙️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold mt-1">
                  {maintenanceReports.filter(r => r.status === 'COMPLETED').length}
                </p>
              </div>
              <div className="text-5xl opacity-50">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Pending</p>
                <p className="text-3xl font-bold mt-1">
                  {maintenanceReports.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
              <div className="text-5xl opacity-50">⏳</div>
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

        {/* Report Maintenance Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Report Maintenance Issues</h3>
              <p className="text-gray-600 mt-1">Found a problem with the JCB? Report it here</p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <span className="text-xl">🔧</span> Report Issue
            </button>
          </div>
        </div>

        {/* Maintenance Reports List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Maintenance Reports ({maintenanceReports.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : maintenanceReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-gray-600 text-lg mb-4">No maintenance reports yet</p>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Report Your First Issue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceReports.map(report => (
                <div key={report.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{getIssueIcon(report.issueType)}</span>
                        <h3 className="font-bold text-xl text-gray-800">
                          {report.issueType} Issue
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Report #{report.id} | JCB: {report.jcbId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reported: {formatDate(report.reportedDate)}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditReport(report)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        title="Edit Report"
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(report)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                        title="Delete Report"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Problem Description:</p>
                    <p className="text-gray-800">{report.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Assigned Mechanic */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-2">👨‍🔧 Assigned Mechanic</p>
                      {report.mechanic ? (
                        <div>
                          <p className="text-gray-800">{report.mechanic.firstName} {report.mechanic.lastName}</p>
                          <p className="text-sm text-gray-600">NIC: {report.mechanic.nic}</p>
                          <p className="text-sm text-gray-600">Email: {report.mechanic.email}</p>
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">Awaiting assignment</p>
                      )}
                    </div>

                    {/* JCB Details */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-2">🚜 JCB Details</p>
                      {report.jcb ? (
                        <div>
                          <p className="text-gray-800">{report.jcb.jcbType}</p>
                          <p className="text-sm text-gray-600">Reg: {report.jcb.registeredNumber}</p>
                          <p className="text-sm text-gray-600">Engine: {report.jcb.engineNumber}</p>
                        </div>
                      ) : (
                        <p className="text-gray-600">{report.jcbId}</p>
                      )}
                    </div>
                  </div>

                  {/* Mechanic Notes */}
                  {report.mechanicNotes && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-2">💬 Mechanic's Notes:</p>
                      <p className="text-gray-800">{report.mechanicNotes}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mt-4 flex gap-4 text-sm text-gray-600 flex-wrap">
                    {report.reportedDate && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Reported:</span>
                        <span>{formatDate(report.reportedDate)}</span>
                      </div>
                    )}
                    {report.assignedDate && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Assigned:</span>
                        <span>{formatDate(report.assignedDate)}</span>
                      </div>
                    )}
                    {report.completedDate && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Completed:</span>
                        <span>{formatDate(report.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Maintenance Modal */}
      {showReportModal && (
        <ReportMaintenanceModal
          user={user}
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
        />
      )}

      {/* Edit Maintenance Modal */}
      {showEditModal && selectedReport && (
        <EditMaintenanceModal
          user={user}
          maintenanceRecord={selectedReport}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReport(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this maintenance report?
            </p>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-gray-800">Report #{reportToDelete.id}</p>
              <p className="text-sm text-gray-600">{reportToDelete.issueType} - {reportToDelete.severity}</p>
              <p className="text-xs text-gray-500 mt-1">{reportToDelete.description.substring(0, 50)}...</p>
            </div>
            <p className="text-sm text-red-600 mb-6">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                🗑️ Yes, Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DriverDashboard;
