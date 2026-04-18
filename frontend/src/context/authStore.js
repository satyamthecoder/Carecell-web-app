

/*import { create } from 'zustand';
import { authAPI } from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('carecell_user') || 'null'),
  token: localStorage.getItem('carecell_token') || null,
  isLoading: false,
  error: null,

  // 🔥 LOGIN (FIXED)
  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      // ✅ CLEAR OLD DATA (CRITICAL FIX)
      localStorage.removeItem('carecell_token');
      localStorage.removeItem('carecell_user');

      const data = await authAPI.login({ phone, password });

      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });

      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // 🔥 REGISTER (FIXED)
  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      // ✅ CLEAR OLD DATA (CRITICAL FIX)
      localStorage.removeItem('carecell_token');
      localStorage.removeItem('carecell_user');

      const data = await authAPI.register(formData);

      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });

      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // 🔥 LOGOUT
  logout: () => {
    localStorage.removeItem('carecell_token');
    localStorage.removeItem('carecell_user');

    set({
      user: null,
      token: null
    });
  },

  // 🔥 UPDATE USER (ALREADY GOOD)
  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };

    localStorage.setItem('carecell_user', JSON.stringify(updated));

    set({ user: updated });
  },

  // 🔥 ADD THIS (CRITICAL FOR DONOR SYNC)
  setUser: (user) => {
    localStorage.setItem('carecell_user', JSON.stringify(user));
    set({ user });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;*/




//new code after deployment


import { create } from 'zustand';
import { authAPI } from '../utils/api';

// ✅ SAFE PARSE FUNCTION (FIX ADDED)
const safeParse = (value) => {
  try {
    if (!value || value === "undefined") return null; // ✅ FIX
    return JSON.parse(value);
  } catch (err) {
    console.error("Invalid JSON in localStorage:", err);
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  // ✅ FIXED (SAFE PARSE)
  user: safeParse(localStorage.getItem('carecell_user')), // ✅ FIX
  token: localStorage.getItem('carecell_token') || null,
  isLoading: false,
  error: null,

  // 🔥 LOGIN (NO LOGIC CHANGE)
  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      // ✅ CLEAR OLD DATA
      localStorage.removeItem('carecell_token');
      localStorage.removeItem('carecell_user');

      const data = await authAPI.login({ phone, password });

      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });

      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // 🔥 REGISTER (NO LOGIC CHANGE)
  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      localStorage.removeItem('carecell_token');
      localStorage.removeItem('carecell_user');

      const data = await authAPI.register(formData);

      localStorage.setItem('carecell_token', data.token);
      localStorage.setItem('carecell_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isLoading: false
      });

      return data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // 🔥 LOGOUT (NO CHANGE)
  logout: () => {
    localStorage.removeItem('carecell_token');
    localStorage.removeItem('carecell_user');

    set({
      user: null,
      token: null
    });
  },

  // 🔥 UPDATE USER (NO CHANGE)
  updateUser: (userData) => {
    const updated = { ...get().user, ...userData };

    localStorage.setItem('carecell_user', JSON.stringify(updated));

    set({ user: updated });
  },

  // 🔥 SET USER (NO CHANGE)
  setUser: (user) => {
    localStorage.setItem('carecell_user', JSON.stringify(user));
    set({ user });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;