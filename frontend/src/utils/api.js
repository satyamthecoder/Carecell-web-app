import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carecell_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('carecell_token');
      localStorage.removeItem('carecell_user');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Patients / Health Card
export const patientAPI = {
  getHealthCard: () => api.get('/patients/health-card'),
  saveHealthCard: (data) => api.post('/patients/health-card', data),
  getQRData: (patientId, fields) => api.get(`/patients/qr/${patientId}?fields=${fields || 'full'}`),
};

// Donors
export const donorAPI = {
  registerDonor: (data) => api.post('/donors/register', data),
  searchDonors: (params) => api.get('/donors/search', { params }),
  updateAvailability: (data) => api.put('/donors/availability', data),
};

// Hospitals
export const hospitalAPI = {
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospital: (id) => api.get(`/hospitals/${id}`),
  getNearestEmergency: (lat, lng) => api.get('/hospitals/emergency/nearest', { params: { lat, lng } }),
};

// Blood Requests
export const bloodAPI = {
  createRequest: (data) => api.post('/blood-requests', data),
  getMyRequests: (params) => api.get('/blood-requests', { params }),
  getActiveRequests: () => api.get('/blood-requests/active'),
  respond: (id, data) => api.post(`/blood-requests/${id}/respond`, data),
};

// Treatments
export const treatmentAPI = {
  create: (data) => api.post('/treatments', data),
  getAll: (params) => api.get('/treatments', { params }),
  update: (id, data) => api.put(`/treatments/${id}`, data),
  delete: (id) => api.delete(`/treatments/${id}`),
};

// Nutrition
export const nutritionAPI = {
  getDietPlan: (cancerType, phase) => api.get('/nutrition/diet', { params: { cancerType, phase } }),
  getHighProteinFoods: () => api.get('/nutrition/high-protein'),
  getGuides: () => api.get('/nutrition/guides'),
};

// Schemes
export const schemeAPI = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getScheme: (id) => api.get(`/schemes/${id}`),
};

// Check-in
export const checkinAPI = {
  submit: (data) => api.post('/checkin', data),
  getHistory: (days) => api.get('/checkin/history', { params: { days } }),
};

// AI
export const aiAPI = {
  explainTerm: (term, language) => api.post('/ai/explain-term', { term, language }),
  explainConsent: (text) => api.post('/ai/explain-consent', { text }),
  buddyAssessment: (checkinData) => api.post('/ai/buddy-assessment', { checkinData }),
};

// Emergency
export const emergencyAPI = {
  getNearest: (lat, lng, city) => api.get('/emergency/nearest', { params: { lat, lng, city } }),
  getHelplines: () => api.get('/emergency/helplines'),
};

export default api;
