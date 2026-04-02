import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiHeart, FiAlertTriangle, FiDroplet,
  FiMapPin, FiCalendar, FiUser, FiMenu, FiX,
  FiSun, FiBookOpen, FiDollarSign, FiCoffee
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Home', labelHindi: 'होम' },
  { path: '/checkin', icon: FiSun, label: 'Check-in', labelHindi: 'चेकइन' },
  { path: '/emergency', icon: FiAlertTriangle, label: 'Emergency', labelHindi: 'आपात', highlight: true },
  { path: '/treatments', icon: FiCalendar, label: 'Treatment', labelHindi: 'इलाज' },
  { path: '/profile', icon: FiUser, label: 'Profile', labelHindi: 'प्रोफाइल' },
];

const menuItems = [
  { path: '/health-card', icon: FiHeart, label: 'Health Card', labelHindi: 'हेल्थ कार्ड' },
  { path: '/blood-request', icon: FiDroplet, label: 'Blood Request', labelHindi: 'रक्त आवश्यकता' },
  { path: '/donor', icon: FiDroplet, label: 'Donor Profile', labelHindi: 'डोनर प्रोफाइल' },
  { path: '/hospitals', icon: FiMapPin, label: 'Hospitals', labelHindi: 'अस्पताल' },
  { path: '/explain', icon: FiBookOpen, label: 'AI Explainer', labelHindi: 'AI सहायक' },
  { path: '/nutrition', icon: FiCoffee, label: 'Nutrition', labelHindi: 'आहार' },
  { path: '/schemes', icon: FiDollarSign, label: 'Financial Help', labelHindi: 'वित्तीय सहायता' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path) => { navigate(path); setDrawerOpen(false); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="font-display font-bold text-gray-900 text-lg">CareCell</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <FiAlertTriangle size={12} />
              आपात
            </button>
            <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <FiMenu size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="gradient-brand p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-lg">🏥 CareCell</span>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <FiX size={18} />
                  </button>
                </div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-white/80 text-sm capitalize">{user?.role}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Features</p>
                <div className="space-y-1">
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNav(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${active ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <Icon size={18} />
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.labelHindi}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => { logout(); setDrawerOpen(false); }}
                  className="w-full py-2.5 text-center text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Logout / लॉगआउट
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white border-t border-gray-100 z-40 shadow-lg">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            if (item.highlight) {
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="flex flex-col items-center gap-0.5 relative -mt-4"
                >
                  <div className="w-14 h-14 gradient-brand rounded-full flex items-center justify-center shadow-lg shadow-red-200 border-4 border-white">
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-brand-600">{item.labelHindi}</span>
                </button>
              );
            }
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Icon size={20} className={active ? 'text-brand-600' : ''} />
                <span className="text-xs font-medium">{item.labelHindi}</span>
                {active && <div className="w-1 h-1 rounded-full bg-brand-600 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
