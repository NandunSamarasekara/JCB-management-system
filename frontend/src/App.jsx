import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import PaymentPage from './pages/PaymentPage';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Placeholder dashboards for other roles
const DriverDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Driver Dashboard</h1>
    <p>Driver features coming soon...</p>
  </div>
);

const MechanicDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Mechanic Dashboard</h1>
    <p>Mechanic features coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/customer" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/driver" 
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <DriverDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/mechanic" 
            element={
              <ProtectedRoute allowedRoles={['MECHANIC']}>
                <MechanicDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/owner" 
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
