/*import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiLogOut, FiEdit2, FiSave, FiHeart, FiDroplet, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { authAPI } from '../utils/api';

const langs = [
  { value: 'hindi', label: 'हिंदी' },
  { value: 'english', label: 'English' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'bengali', label: 'বাংলা' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', language: user?.language || 'hindi' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      updateUser(form);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally { setSaving(false); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out / लॉगआउट हो गए');
  };

  const quickLinks = [
    { icon: FiHeart, label: 'Health Card / हेल्थ कार्ड', path: '/health-card' },
    { icon: FiDroplet, label: 'Donor Profile / डोनर', path: '/donor' },
    { icon: FiShield, label: 'Emergency Mode / आपात', path: '/emergency' },
  ];

  const roleEmoji = { patient: '🏥', donor: '🩸', caregiver: '🤝', admin: '👑' };

  return (
    <div className="page-container">
      {/* Profile Card *//*}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="gradient-brand rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm border border-white/30">
              {roleEmoji[user?.role] || '👤'}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">{user?.name}</h2>
              <p className="text-white/80 text-sm capitalize">{user?.role} • CareCell</p>
              <p className="text-white/70 text-xs">{user?.phone}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Form *//*}
      {editing ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card mb-5 space-y-3">
          <h3 className="font-bold text-gray-900">Edit Profile / प्रोफाइल संपादित करें</h3>
          <div>
            <label className="label">Name / नाम</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">Email (optional)</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" className="input-field" />
          </div>
          <div>
            <label className="label">Language / भाषा</label>
            <div className="flex gap-2">
              {langs.map(l => (
                <button key={l.value} onClick={() => setForm(f => ({ ...f, language: l.value }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.language === l.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiSave size={15} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary px-5">Cancel</button>
          </div>
        </motion.div>
      ) : (
        <div className="card mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Account Details</h3>
            <button onClick={() => setEditing(true)} className="text-brand-600 font-semibold text-sm flex items-center gap-1">
              <FiEdit2 size={14} /> Edit
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Phone', value: user?.phone },
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email || 'Not provided' },
              { label: 'Role', value: user?.role },
              { label: 'Language', value: user?.language },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{row.label}</span>
                <span className="font-medium text-gray-900 text-sm capitalize">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links *//*}
      <div className="card mb-5">
        <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
        <div className="space-y-2">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <button key={link.path} onClick={() => navigate(link.path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-brand-700" />
                </div>
                <span className="font-medium text-gray-800 text-sm">{link.label}</span>
                <span className="ml-auto text-gray-400">›</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Info *//*}
      <div className="card mb-5 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-3">About CareCell</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          CareCell Network is an AI-powered, offline-friendly cancer care companion for patients in India.
          Available in Hindi, English, Marathi & Bengali.
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Version 1.0.0</span>
          <span>© 2025 CareCell Network</span>
        </div>
      </div>

      {/* Logout *//*}
      <button onClick={handleLogout}
        className="w-full py-3.5 text-red-600 font-bold rounded-2xl border-2 border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
        <FiLogOut size={18} /> Logout / लॉगआउट
      </button>

      <div className="h-4" />
    </div>
  );
}
*/


//new code for profile .jsx  with better ui option

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUser, FiLogOut, FiEdit2, FiSave,
  FiHeart, FiDroplet, FiShield, FiUpload
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { authAPI } from '../utils/api';

const langs = [
  { value: 'hindi', label: 'हिंदी' },
  { value: 'english', label: 'English' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'bengali', label: 'বাংলা' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.language || 'hindi'
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      updateUser(form);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  const quickLinks = [
    { icon: FiHeart, label: 'Health Card', path: '/health-card' },
    { icon: FiDroplet, label: 'Donor Profile', path: '/donor' },
    { icon: FiShield, label: 'Emergency Mode', path: '/emergency' },
  ];

  const roleEmoji = { patient: '🏥', donor: '🩸', caregiver: '🤝', admin: '👑' };

  return (
    <div className="page-container">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-3xl p-5 shadow-lg">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/30 bg-white/20 flex items-center justify-center">
                {image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{roleEmoji[user?.role] || '👤'}</span>
                )}
              </div>

              <label className="absolute -bottom-2 -right-2 bg-white text-gray-700 p-1 rounded-full cursor-pointer shadow">
                <FiUpload size={14} />
                <input type="file" hidden onChange={handleImage} />
              </label>
            </div>

            <div>
              <h2 className="text-lg font-bold">{user?.name}</h2>
              <p className="text-sm opacity-80">{user?.phone}</p>
              <p className="text-xs opacity-70 capitalize">{user?.role}</p>
            </div>

          </div>
        </div>
      </motion.div>

      {/* EDIT FORM */}
      {editing ? (
        <div className="card mt-5 space-y-3">
          <h3 className="font-bold">Edit Profile</h3>

          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Name"
          />

          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="Email"
          />

          <div className="flex gap-2">
            {langs.map(l => (
              <button
                key={l.value}
                onClick={() => setForm({ ...form, language: l.value })}
                className={`flex-1 py-2 rounded-xl text-sm ${
                  form.language === l.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1">
              <FiSave /> Save
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card mt-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-bold">Account</h3>
            <button onClick={() => setEditing(true)} className="text-blue-600 flex items-center gap-1">
              <FiEdit2 /> Edit
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p><b>Name:</b> {user?.name}</p>
            <p><b>Phone:</b> {user?.phone}</p>
            <p><b>Email:</b> {user?.email || 'N/A'}</p>
            <p><b>Language:</b> {user?.language}</p>
          </div>
        </div>
      )}

      {/* QUICK LINKS */}
      <div className="card mt-5">
        <h3 className="font-bold mb-3">Quick Actions</h3>

        {quickLinks.map(link => {
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >
              <Icon />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full mt-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2"
      >
        <FiLogOut /> Logout
      </button>

    </div>
  );
}