import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Homepage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to JCB Management System
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Your one-stop solution for managing JCB equipment rentals efficiently and effectively.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link 
              to="/login"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">🚜</div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Book JCB equipment online with just a few clicks. Select your preferred type, dates, and confirm.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Choose rental and return dates that suit your project timeline. View real-time availability.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">
              Know the exact cost upfront. No hidden charges. Multiple payment options available.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Different dashboards for Customers, Drivers, Mechanics, Owners, and Admins.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security measures and encryption.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
            <p className="text-gray-600">
              Track your bookings, view equipment status, and manage your rentals in real-time.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg">Register Your Account</h4>
                <p className="text-gray-600">
                  Create an account by providing your NIC, email, username, password, and selecting your role.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg">Sign In to Your Dashboard</h4>
                <p className="text-gray-600">
                  Login with your credentials and access your role-specific dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg">Book Your JCB</h4>
                <p className="text-gray-600">
                  Select the JCB type you need, choose rental and return dates, and submit your booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg">Get Confirmation</h4>
                <p className="text-gray-600">
                  Receive instant confirmation with details of your assigned JCB and driver.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;
