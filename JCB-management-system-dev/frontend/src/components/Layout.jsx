import 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, userRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-yellow-400 text-black shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold">
              JCB Management System
            </Link>
            
            <div className="flex gap-4 items-center">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition"
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm">
                    Welcome, {user?.firstName || user?.email} ({userRole})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2025 JCB Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
