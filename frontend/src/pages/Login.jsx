import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuthStore from '../context/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) return toast.error('Please fill all fields');

    try {
      await login(form.phone, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const demoLogin = async () => {
    setForm({ phone: '9999999999', password: 'demo123' });
    try {
      await login('9999999999', 'demo123');
      navigate('/dashboard');
    } catch {
      localStorage.setItem('carecell_token', 'demo_token_xyz');
      localStorage.setItem('carecell_user', JSON.stringify({
        id: 'demo1',
        name: 'Ramesh Kumar',
        phone: '9999999999',
        role: 'patient',
        language: 'hindi'
      }));
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-indigo-200 via-white to-blue-200">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.15),transparent)]" />

      {/* HEADER */}
      <div className="pt-16 pb-6 px-6 text-center relative z-10">

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* ✅ FIXED LOGO */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 rounded-full"></div>

            <div className="relative bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg">
              <img
                src="/logo.png"
                alt="CareCell"
                className="w-29 h-28 object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            CareCell
          </h1>

          <p className="text-sm text-gray-500">
            Connecting Lives. Saving Time.
          </p>
        </motion.div>
      </div>

      {/* FORM CARD */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 bg-white/90 backdrop-blur-xl rounded-t-[40px] shadow-2xl shadow-indigo-100 px-6 pt-8 pb-10 max-w-md mx-auto w-full relative z-10"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Login
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PHONE */}
          <div>
            <label className="text-xs text-gray-500">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Enter mobile number"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 
                hover:border-indigo-300 
                bg-white/80 backdrop-blur-md 
                outline-none transition-all duration-200"
                maxLength={10}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-500">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 
                hover:border-indigo-300 
                bg-white/80 backdrop-blur-md 
                outline-none transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl 
            bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 
            text-white font-semibold 
            shadow-lg shadow-indigo-200 
            hover:scale-[1.03] active:scale-[0.97] 
            transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : "Login"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* DEMO */}
        <button
          onClick={demoLogin}
          className="w-full py-3 border border-dashed border-indigo-400 text-indigo-600 rounded-xl hover:bg-indigo-50 transition font-medium"
        >
          🎯 Try Demo
        </button>

        {/* REGISTER */}
        <p className="text-center text-gray-600 text-sm mt-6">
          New user?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register
          </Link>
        </p>

      </motion.div>
    </div>
  );
}