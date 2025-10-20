import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }
};

// Booking APIs
export const bookingAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },
  
  getCustomerBookings: async (customerNic) => {
    const response = await api.get(`/api/bookings/customer/${customerNic}`);
    return response.data;
  },
  
  updateBooking: async (bookingId, bookingData) => {
    const response = await api.put(`/api/bookings/${bookingId}`, bookingData);
    return response.data;
  },
  
  deleteBooking: async (bookingId) => {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  }
};

// JCB APIs
export const jcbAPI = {
  getAvailableJCBs: async () => {
    const response = await api.get('/dashboard/customer/jcbs/available');
    return response.data;
  },
  
  getAllJCBs: async () => {
    const response = await api.get('/api/jcbs');
    return response.data;
  },
  
  addJCB: async (jcbData) => {
    const response = await api.post('/api/jcbs', jcbData);
    return response.data;
  },
  
  getOwnerJCBs: async (ownerNic) => {
    const response = await api.get(`/api/jcbs/owner/${ownerNic}`);
    return response.data;
  },
  
  updateJCBAvailability: async (registeredNumber, isAvailable) => {
    const response = await api.put(`/api/jcbs/${registeredNumber}/availability`, { isAvailable });
    return response.data;
  }
};

// Customer APIs
export const customerAPI = {
  bookJCB: async (bookingData) => {
    const response = await api.post('/dashboard/customer/book', bookingData);
    return response.data;
  }
};

// Review APIs
export const reviewAPI = {
  createReview: async (reviewData) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },
  
  getCustomerReviews: async (customerNic) => {
    const response = await api.get(`/api/reviews/customer/${customerNic}`);
    return response.data;
  },
  
  getAllReviews: async () => {
    const response = await api.get('/api/reviews/all');
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/api/reviews/stats');
    return response.data;
  },
  
  deleteReview: async (reviewId, customerId) => {
    const response = await api.delete(`/api/reviews/${reviewId}?customerId=${customerId}`);
    return response.data;
  }
};

// Admin APIs
export const adminAPI = {
  getAllCustomers: async () => {
    const response = await api.get('/api/admin/customers');
    return response.data;
  },
  
  getAllDrivers: async () => {
    const response = await api.get('/api/admin/drivers');
    return response.data;
  },
  
  getAllMechanics: async () => {
    const response = await api.get('/api/admin/mechanics');
    return response.data;
  },
  
  getAllOwners: async () => {
    const response = await api.get('/api/admin/owners');
    return response.data;
  },
  
  getAllBookings: async () => {
    const response = await api.get('/api/admin/bookings');
    return response.data;
  }
};

export default api;
