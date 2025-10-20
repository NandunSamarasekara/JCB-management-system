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
  }
};

// Customer APIs
export const customerAPI = {
  bookJCB: async (bookingData) => {
    const response = await api.post('/dashboard/customer/book', bookingData);
    return response.data;
  }
};

export default api;
