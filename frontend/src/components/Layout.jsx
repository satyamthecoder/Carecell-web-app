/*import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiHeart, FiAlertTriangle, FiDroplet,
  FiMapPin, FiCalendar, FiUser, FiMenu, FiX,
  FiBookOpen, FiDollarSign, FiCoffee
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';

// ✅ UPDATED NAV (checkin removed → schemes added)
const navItems = [
  { path: '/dashboard', icon: FiHome, labelHindi: 'होम' },
  { path: '/schemes', icon: FiDollarSign, labelHindi: 'योजना' }, // ✅ replaced
  { path: '/emergency', icon: FiAlertTriangle, labelHindi: 'आपात', highlight: true },
  { path: '/treatments', icon: FiCalendar, labelHindi: 'इलाज' },
  { path: '/profile', icon: FiUser, labelHindi: 'प्रोफाइल' },
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

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto relative">

//      {/* 🔥 TOP BAR (clean + less red) *//*}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">

          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-gray-900 text-lg">CareCell</span>
          </button>

          <div className="flex items-center gap-3">

  //          {/* 🚨 ONLY RED BUTTON *//*}
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <FiAlertTriangle size={12} />
              आपात
            </button>

            <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-xl hover:bg-gray-100">
              <FiMenu size={20} />
            </button>

          </div>
        </div>
      </header>

 //     {/* SIDE DRAWER *//*}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl flex flex-col"
            >
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-5 text-white">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">CareCell</span>
                  <button onClick={() => setDrawerOpen(false)}>
                    <FiX />
                  </button>
                </div>
                <p>{user?.name}</p>
                <p className="text-sm opacity-80">{user?.role}</p>
              </div>

              <div className="flex-1 p-4 space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon />
                      <span>{item.labelHindi}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={() => { logout(); setDrawerOpen(false); }}
                  className="w-full py-2 text-red-600 font-semibold rounded-xl hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

 //     {/* PAGE CONTENT *//*}
      <main className="flex-1">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Outlet />
        </motion.div>
      </main>

//      {/* 🔥 NEW BOTTOM NAV *//*}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">

          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            if (item.highlight) {
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <Icon size={22} className="text-white" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center text-xs ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                {item.labelHindi}
              </button>
            );
          })}

        </div>
      </nav>

    </div>
  );
}*/



//above code working new code for the user and donde


import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiHeart, FiAlertTriangle, FiDroplet,
  FiMapPin, FiCalendar, FiUser, FiMenu, FiX,
  FiBookOpen, FiDollarSign
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';

// 🔥 NAV (BOTTOM)
const navItems = [
  { path: '/dashboard', icon: FiHome, labelHindi: 'होम' },
  { path: '/schemes', icon: FiDollarSign, labelHindi: 'योजना' },
  { path: '/emergency', icon: FiAlertTriangle, labelHindi: 'आपात', highlight: true },
  { path: '/treatments', icon: FiCalendar, labelHindi: 'इलाज' }, // hidden for donor
  { path: '/profile', icon: FiUser, labelHindi: 'प्रोफाइल' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isDonor = user?.role === "donor";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // 🔥 CLEAN ROLE MENU
  const menuItems = [
    // 🟢 PATIENT ONLY
    ...(!isDonor ? [
      { path: '/health-card', icon: FiHeart, labelHindi: 'हेल्थ कार्ड' },
      { path: '/blood-request', icon: FiDroplet, labelHindi: 'रक्त आवश्यकता' },
      { path: '/treatments', icon: FiCalendar, labelHindi: 'इलाज' },
      { path: '/request-help', icon: FiDollarSign, labelHindi: 'वित्तीय सहायता' },
    ] : []),

    // 🔵 DONOR ONLY
    ...(isDonor ? [
      { path: '/profile', icon: FiDroplet, labelHindi: 'डोनर प्रोफाइल' },
    ] : []),

    // ⚪ COMMON
    { path: '/hospitals', icon: FiMapPin, labelHindi: 'अस्पताल' },
    { path: '/explain', icon: FiBookOpen, labelHindi: 'AI सहायक' },
    { path: '/schemes', icon: FiDollarSign, labelHindi: 'योजना' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto relative">

      {/* 🔥 TOP BAR */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">

          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-bold text-gray-900 text-lg">CareCell</span>
          </button>

          <div className="flex items-center gap-3">

            {/* 🔥 EMERGENCY */}
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <FiAlertTriangle size={12} />
              आपात
            </button>

            {/* MENU */}
            <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-xl hover:bg-gray-100">
              <FiMenu size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* 🔥 SIDE DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl flex flex-col"
            >
              {/* 🔥 HEADER */}
              <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-5 text-white">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">CareCell</span>
                  <button onClick={() => setDrawerOpen(false)}>
                    <FiX />
                  </button>
                </div>

                <p className="font-semibold">{user?.name}</p>

                {/* 🔥 ROLE BADGE (IMPORTANT UX) */}
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {isDonor ? "Donor" : "Patient"}
                </span>
              </div>

              {/* 🔥 MENU */}
              <div className="flex-1 p-4 space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon />
                      <span>{item.labelHindi}</span>
                    </button>
                  );
                })}
              </div>

              {/* 🔥 LOGOUT */}
              <div className="p-4 border-t">
                <button
                  onClick={() => { logout(); setDrawerOpen(false); }}
                  className="w-full py-2 text-red-600 font-semibold rounded-xl hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🔥 PAGE */}
      <main className="flex-1 pb-20">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Outlet />
        </motion.div>
      </main>

      {/* 🔥 BOTTOM NAV */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">

          {navItems.map(item => {
            const Icon = item.icon;

            // ❌ HIDE FOR DONOR
            if (isDonor && item.path === '/treatments') return null;

            const active = location.pathname === item.path;

            if (item.highlight) {
              return (
                <button key={item.path} onClick={() => handleNav(item.path)} className="relative -mt-6">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <Icon size={22} className="text-white" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center text-xs ${
                  active ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                {item.labelHindi}
              </button>
            );
          })}

        </div>
      </nav>

    </div>
  );
}