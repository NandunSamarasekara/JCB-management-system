import React, { useState, useEffect } from 'react';
import { maintenanceAPI, jcbAPI } from '../services/api';

const ReportMaintenanceModal = ({ user, onClose, onSuccess }) => {
  const [maintenanceData, setMaintenanceData] = useState({
    jcbId: '',
    issueType: 'ENGINE',
    severity: 'MEDIUM',
    description: ''
  });
  const [availableJCBs, setAvailableJCBs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    { value: 'ENGINE', label: 'Engine Problem', icon: '⚙️' },
    { value: 'HYDRAULIC', label: 'Hydraulic System', icon: '💧' },
    { value: 'ELECTRICAL', label: 'Electrical Issue', icon: '⚡' },
    { value: 'STRUCTURAL', label: 'Structural Damage', icon: '🔧' },
    { value: 'OTHER', label: 'Other', icon: '🛠️' }
  ];

  const severityLevels = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800', icon: '✓' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800', icon: '⚠⚠' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-800', icon: '🚨' }
  ];

  useEffect(() => {
    fetchAvailableJCBs();
  }, []);

  const fetchAvailableJCBs = async () => {
    try {
      const data = await jcbAPI.getAllJCBs();
      setAvailableJCBs(data);
    } catch (error) {
      console.error('Error fetching JCBs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        jcbId: maintenanceData.jcbId,
        driverId: user.nic,
        issueType: maintenanceData.issueType,
        severity: maintenanceData.severity,
        description: maintenanceData.description
      };

      const response = await maintenanceAPI.createMaintenance(payload);
      
      if (response.includes('Success') || response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || response);
      }
    } catch (err) {
      console.error('Maintenance report error:', err);
      setError(err.response?.data || 'Failed to submit maintenance report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">🔧 Report Maintenance Issue</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Driver Info (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Driver: {user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">NIC: {user.nic}</p>
          </div>

          {/* JCB Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select JCB Equipment *
            </label>
            <select
              name="jcbId"
              value={maintenanceData.jcbId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select JCB --</option>
              {availableJCBs.map(jcb => (
                <option key={jcb.registeredNumber} value={jcb.registeredNumber}>
                  {jcb.jcbType} - {jcb.registeredNumber} (Engine: {jcb.engineNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Issue Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {issueTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setMaintenanceData(prev => ({ ...prev, issueType: type.value }))}
                  className={`p-3 rounded-lg border-2 transition ${
                    maintenanceData.issueType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-semibold">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setMaintenanceData(prev => ({ ...prev, severity: level.value }))}
                  className={`p-3 rounded-lg border-2 transition ${
                    maintenanceData.severity === level.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-lg mb-1">{level.icon}</div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${level.color}`}>
                    {level.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Problem Description *
            </label>
            <textarea
              name="description"
              value={maintenanceData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Describe the issue in detail... (e.g., Engine making unusual noise, hydraulic system leaking, etc.)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be as specific as possible to help the mechanic diagnose the issue
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="font-semibold text-green-800">Auto-Assignment</p>
                <p className="text-sm text-green-700">
                  A mechanic will be automatically assigned to your report upon submission.
                  You will receive the mechanic's details once assigned.
                </p>
              </div>
            </div>
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
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportMaintenanceModal;
