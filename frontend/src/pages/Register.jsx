import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiLock } from 'react-icons/fi';
import useAuthStore from '../context/authStore';

const roles = [
  { value: 'patient', label: 'Patient / मरीज', emoji: '🏥' },
  { value: 'donor', label: 'Blood Donor / रक्तदाता', emoji: '🩸' },
  { value: 'caregiver', label: 'Caregiver / देखभाल करने वाले', emoji: '🤝' },
];

const languages = [
  { value: 'hindi', label: 'हिंदी' },
  { value: 'english', label: 'English' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'bengali', label: 'বাংলা' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: 'patient', language: 'hindi' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) return toast.error('Please fill all required fields');
    if (form.phone.length !== 10) return toast.error('Enter valid 10-digit phone number');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await register(form);
      toast.success('Registration successful! / पंजीकरण सफल!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-brand pt-10 pb-16 px-6 text-center">
        <h1 className="text-2xl font-display font-bold text-white">Register / पंजीकरण</h1>
        <p className="text-white/80 text-sm mt-1">CareCell Network में शामिल हों</p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="-mt-6 bg-white rounded-t-3xl shadow-xl px-6 pt-7 pb-16"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full Name / पूरा नाम *</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your name" className="input-field pl-10" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone / फोन *</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input type="tel" value={form.phone} maxLength={10}
                onChange={e => set('phone', e.target.value)}
                placeholder="10-digit number" className="input-field pl-10" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">Password / पासवर्ड *</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
              <input type="password" value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Minimum 6 characters" className="input-field pl-10" />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="label">I am a / मैं हूँ</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button type="button" key={r.value}
                  onClick={() => set('role', r.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${form.role === r.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-xl mb-1">{r.emoji}</div>
                  <div className="text-xs font-medium text-gray-700 leading-tight">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="label">Preferred Language / पसंदीदा भाषा</label>
            <div className="grid grid-cols-4 gap-2">
              {languages.map(l => (
                <button type="button" key={l.value}
                  onClick={() => set('language', l.value)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${form.language === l.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base mt-2">
            {isLoading ? 'Registering...' : 'Register / पंजीकरण करें'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Login / लॉगिन</Link>
        </p>
      </motion.div>
    </div>
  );
}
