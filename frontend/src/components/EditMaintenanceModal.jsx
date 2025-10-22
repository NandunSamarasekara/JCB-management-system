import React, { useState, useEffect } from 'react';
import { jcbAPI, maintenanceAPI } from '../services/api';

const EditMaintenanceModal = ({ user, maintenanceRecord, onClose, onSuccess }) => {
  const [jcbs, setJcbs] = useState([]);
  const [formData, setFormData] = useState({
    jcbId: '',
    issueType: '',
    severity: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJCBs();
    // Populate form with existing data
    if (maintenanceRecord) {
      setFormData({
        jcbId: maintenanceRecord.jcbId || '',
        issueType: maintenanceRecord.issueType || '',
        severity: maintenanceRecord.severity || '',
        description: maintenanceRecord.description || ''
      });
    }
  }, [maintenanceRecord]);

  const fetchJCBs = async () => {
    try {
      const data = await jcbAPI.getAllJCBs();
      setJcbs(data);
    } catch (error) {
      console.error('Error fetching JCBs:', error);
      setError('Failed to load JCBs');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.jcbId || !formData.issueType || !formData.severity || !formData.description) {
      setError('All fields are required');
      return;
    }

    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        jcbId: formData.jcbId,
        driverId: user.nic,
        issueType: formData.issueType,
        severity: formData.severity,
        description: formData.description
      };

      await maintenanceAPI.updateMaintenance(maintenanceRecord.id, updateData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating maintenance:', error);
      setError(error.response?.data || 'Failed to update maintenance report');
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: 'ENGINE', label: 'Engine Issue', icon: '⚙️' },
    { value: 'HYDRAULIC', label: 'Hydraulic Problem', icon: '💧' },
    { value: 'ELECTRICAL', label: 'Electrical Fault', icon: '⚡' },
    { value: 'STRUCTURAL', label: 'Structural Damage', icon: '🔧' },
    { value: 'OTHER', label: 'Other Issues', icon: '🛠️' }
  ];

  const severityLevels = [
    { value: 'LOW', label: 'Low', icon: '✅', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'MEDIUM', label: 'Medium', icon: '⚠️', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'HIGH', label: 'High', icon: '⚠️⚠️', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'CRITICAL', label: 'Critical', icon: '🚨', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✏️ Edit Maintenance Report</h2>
              <p className="text-blue-100 mt-1">Report ID: #{maintenanceRecord?.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded-full p-2 transition"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* JCB Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              🚜 Select JCB <span className="text-red-500">*</span>
            </label>
            <select
              name="jcbId"
              value={formData.jcbId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose a JCB...</option>
              {jcbs.map(jcb => (
                <option key={jcb.registeredNumber} value={jcb.registeredNumber}>
                  {jcb.jcbType} - {jcb.registeredNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              🔧 Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {issueTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, issueType: type.value }))}
                  className={`p-4 border-2 rounded-lg transition ${
                    formData.issueType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-semibold">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Level */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              ⚡ Severity Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.value }))}
                  className={`p-3 border-2 rounded-lg transition ${
                    formData.severity === level.value
                      ? `${level.color} border-2`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-xl mb-1">{level.icon}</div>
                  <div className="text-xs font-bold">{level.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              📝 Problem Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail (minimum 10 characters)..."
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              required
              minLength="10"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">ℹ️ Note:</span> Updating this report will notify the assigned mechanic of the changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold transition ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Updating...' : '✓ Update Report'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;
