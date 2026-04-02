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
      toast.success('Welcome back! / वापस आने पर स्वागत है!');
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
      // Create demo session
      localStorage.setItem('carecell_token', 'demo_token_xyz');
      localStorage.setItem('carecell_user', JSON.stringify({
        id: 'demo1', name: 'Ramesh Kumar', phone: '9999999999',
        role: 'patient', language: 'hindi'
      }));
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #fff0f0 0%, #ffffff 60%)' }}>
      {/* Header */}
      <div className="gradient-brand pt-16 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: `${(i+1)*100}px`, height: `${(i+1)*100}px`,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">CareCell</h1>
          <p className="text-white/80">कैंसर केयर साथी</p>
        </motion.div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
        className="flex-1 -mt-8 bg-white rounded-t-3xl shadow-xl px-6 pt-8 pb-10"
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-1">Login / लॉगिन</h2>
        <p className="text-gray-500 text-sm mb-6">अपने खाते में प्रवेश करें</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Phone Number / फोन नंबर</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="10-digit mobile number"
                className="input-field pl-10"
                maxLength={10}
              />
            </div>
          </div>
          <div>
            <label className="label">Password / पासवर्ड</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input
                type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter password"
                className="input-field pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-3.5 text-gray-400">
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2 py-3 text-base">
            {isLoading ? 'Logging in...' : 'Login / लॉगिन'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-gray-400 text-sm">या / or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <button onClick={demoLogin}
          className="w-full py-3 border-2 border-dashed border-teal-400 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors">
          🎯 Try Demo / डेमो देखें
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          New user? {' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Register / रजिस्टर करें
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
