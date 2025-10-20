import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nic: '',
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    subscriptionPlan: 'BASIC'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.nic || !formData.email || !formData.username || 
        !formData.firstName || !formData.lastName || 
        !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate owner subscription plan
    if (formData.role === 'OWNER' && !formData.subscriptionPlan) {
      setError('Please select a subscription plan for owner registration');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nic: formData.nic,
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role: formData.role,
        subscriptionPlan: formData.role === 'OWNER' ? formData.subscriptionPlan : null
      };

      const response = await register(userData);
      
      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Register
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                NIC Number *
              </label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your NIC number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-enter password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                User Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CUSTOMER">Customer</option>
                <option value="DRIVER">Driver</option>
                <option value="MECHANIC">Mechanic</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Subscription Plan for Owners */}
            {formData.role === 'OWNER' && (
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <label className="block text-gray-700 font-semibold mb-3">
                  Select Subscription Plan *
                </label>
                <div className="space-y-3">
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: 'BASIC' }))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.subscriptionPlan === 'BASIC'
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg">Basic Plan</h4>
                        <p className="text-sm text-gray-600">No charge - No additional services</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">FREE</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: 'NORMAL' }))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.subscriptionPlan === 'NORMAL'
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg">Normal Plan</h4>
                        <p className="text-sm text-gray-600">Maintenance services included</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">LKR 500<span className="text-sm">/month</span></div>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: 'PREMIUM' }))}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.subscriptionPlan === 'PREMIUM'
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg text-purple-600">Premium Plan ⭐</h4>
                        <p className="text-sm text-gray-600">Maintenance + Priority support + Analytics dashboard + Insurance assistance</p>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">LKR 750<span className="text-sm">/month</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
