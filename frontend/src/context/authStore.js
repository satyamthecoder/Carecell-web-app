import { create } from 'zustand';
import { authAPI } from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('carecell_user') || 'null'),
  token: localStorage.getItem('carecell_token') || null,
  isLoading: false,
  error: null,

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.login({ phone, password });
      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.register(formData);
      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('carecell_token');
    localStorage.removeItem('carecell_user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };
    localStorage.setItem('carecell_user', JSON.stringify(updated));
    set({ user: updated });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
