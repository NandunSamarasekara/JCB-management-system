import React, { useState, useEffect } from 'react';
import { maintenanceAPI } from '../services/api';

const EditMaintenanceModal = ({ maintenanceRecord, user, onClose, onSuccess }) => {
  const [maintenanceData, setMaintenanceData] = useState({
    issueType: '',
    severity: '',
    description: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (maintenanceRecord) {
      setMaintenanceData({
        issueType: maintenanceRecord.issueType || '',
        severity: maintenanceRecord.severity || '',
        description: maintenanceRecord.description || '',
        status: maintenanceRecord.status || ''
      });
    }
  }, [maintenanceRecord]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Only send the fields that can be updated by the driver
      const payload = {};
      
      if (maintenanceData.issueType) {
        payload.issueType = maintenanceData.issueType;
      }
      
      if (maintenanceData.severity) {
        payload.severity = maintenanceData.severity;
      }
      
      if (maintenanceData.description) {
        payload.description = maintenanceData.description;
      }

      const response = await maintenanceAPI.updateMaintenance(maintenanceRecord.id, payload);
      
      if (response.includes('Success')) {
        onSuccess();
        onClose();
      } else {
        setError(response);
      }
    } catch (err) {
      console.error('Maintenance update error:', err);
      setError(err.response?.data || 'Failed to update maintenance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) {
      return;
    }

    try {
      const response = await maintenanceAPI.deleteMaintenance(maintenanceRecord.id);
      
      if (response.includes('Success')) {
        onSuccess();
        onClose();
      } else {
        setError(response);
      }
    } catch (err) {
      console.error('Maintenance delete error:', err);
      setError(err.response?.data || 'Failed to delete maintenance record. Please try again.');
    }
  };

  if (!maintenanceRecord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Maintenance Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Maintenance Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Maintenance Details</h3>
            <p className="text-sm text-gray-600">Record ID: #{maintenanceRecord.id}</p>
            <p className="text-sm text-gray-600">JCB ID: {maintenanceRecord.jcbId}</p>
            <p className="text-sm text-gray-600">
              Reported Date: {new Date(maintenanceRecord.reportedDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Status: {maintenanceRecord.status}</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Issue Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Issue Type *
            </label>
            <select
              name="issueType"
              value={maintenanceData.issueType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Issue Type</option>
              <option value="ENGINE">Engine Problem</option>
              <option value="HYDRAULIC">Hydraulic System</option>
              <option value="ELECTRICAL">Electrical System</option>
              <option value="STRUCTURAL">Structural Damage</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Severity *
            </label>
            <select
              name="severity"
              value={maintenanceData.severity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Severity</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={maintenanceData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe the issue in detail..."
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Record
            </button>
            <div className="flex-1 flex gap-4">
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
                {loading ? 'Updating...' : 'Update Record'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;