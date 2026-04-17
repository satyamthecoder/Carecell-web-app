
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiLock } from 'react-icons/fi';
import useAuthStore from '../context/authStore';

const roles = [
  { value: 'patient', label: 'Patient / मरीज', emoji: '🏥' },
  { value: 'donor', label: 'Blood Donor / रक्तदाता', emoji: '🩸' },
];

const languages = [
  { value: 'hindi', label: 'हिंदी' },
  { value: 'english', label: 'English' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'patient',
    language: 'hindi'
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password)
      return toast.error('Please fill all required fields');

    if (form.phone.length !== 10)
      return toast.error('Enter valid phone number');

    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    if (!acceptTerms)
      return toast.error('Please accept Terms & Conditions');

    try {
      await register({
        ...form,
        acceptTerms
      });

      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9FE] via-white to-[#C4B5FD] flex items-center justify-center px-4">

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
      >

        {/* HEADER */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-purple-700">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Join CareCell Network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-1">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="input-field pl-10"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative mt-1">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                maxLength={10}
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className="input-field pl-10"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="input-field pl-10"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set('role', r.value)}
                  className={`p-3 rounded-xl border ${
                    form.role === r.value
                      ? 'bg-purple-100 border-purple-500'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-xl">{r.emoji}</div>
                  <div className="text-xs">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2 mt-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />

            <p className="text-xs text-gray-600">
              I agree to Terms & Conditions.{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 font-medium underline"
              >
                Read full terms
              </a>
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
}