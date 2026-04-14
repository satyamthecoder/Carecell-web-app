/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiAlertTriangle, FiDroplet, FiMapPin,
  FiCalendar, FiSun, FiBookOpen, FiDollarSign,
  FiCoffee, FiChevronRight
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import { treatmentAPI, checkinAPI } from '../utils/api';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';

const quickActions = [
  { path: '/emergency', icon: FiAlertTriangle, label: 'Emergency', labelH: 'आपात', color: 'bg-red-500', textColor: 'text-white' },
  { path: '/health-card', icon: FiHeart, label: 'Health Card', labelH: 'हेल्थ कार्ड', color: 'bg-rose-100', textColor: 'text-rose-700' },
  { path: '/blood-request', icon: FiDroplet, label: 'Blood', labelH: 'रक्त', color: 'bg-red-100', textColor: 'text-red-700' },
  { path: '/hospitals', icon: FiMapPin, label: 'Hospitals', labelH: 'अस्पताल', color: 'bg-blue-100', textColor: 'text-blue-700' },
  { path: '/explain', icon: FiBookOpen, label: 'AI Help', labelH: 'AI सहायता', color: 'bg-purple-100', textColor: 'text-purple-700' },
  { path: '/nutrition', icon: FiCoffee, label: 'Diet', labelH: 'आहार', color: 'bg-green-100', textColor: 'text-green-700' },
  { path: '/schemes', icon: FiDollarSign, label: 'Schemes', labelH: 'योजनाएं', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { path: '/donor', icon: FiDroplet, label: 'Donate', labelH: 'दान करें', color: 'bg-teal-100', textColor: 'text-teal-700' },
];

const typeColors = {
  chemotherapy: 'bg-purple-100 text-purple-700',
  radiotherapy: 'bg-orange-100 text-orange-700',
  surgery: 'bg-red-100 text-red-700',
  followup: 'bg-blue-100 text-blue-700',
  labtest: 'bg-teal-100 text-teal-700',
  medication: 'bg-green-100 text-green-700',
};

const typeLabels = {
  chemotherapy: 'कीमो', radiotherapy: 'रेडियो', surgery: 'सर्जरी',
  followup: 'फॉलोअप', labtest: 'टेस्ट', medication: 'दवाई',
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [lastCheckin, setLastCheckin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tData, cData] = await Promise.allSettled([
          treatmentAPI.getAll({ status: 'upcoming' }),
          checkinAPI.getHistory(3)
        ]);
        if (tData.status === 'fulfilled') setTreatments(tData.value.treatments?.slice(0, 3) || []);
        if (cData.status === 'fulfilled' && cData.value.history?.length > 0) {
          setLastCheckin(cData.value.history[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatDate = (dt) => {
    const d = new Date(dt);
    if (isToday(d)) return 'Today / आज';
    if (isTomorrow(d)) return 'Tomorrow / कल';
    const diff = differenceInDays(d, new Date());
    if (diff > 0 && diff <= 7) return `${diff} days / दिन में`;
    return format(d, 'dd MMM');
  };

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'सुप्रभात 🌅';
    if (h < 17) return 'नमस्ते 🙏';
    return 'शुभ संध्या 🌙';
  };

  return (
    <div className="page-container">
      {/* Greeting *//*}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="gradient-brand rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-6" />
          <p className="text-white/80 text-sm mb-1">{greetingTime()}</p>
          <h2 className="text-2xl font-display font-bold">{user?.name}</h2>
          <p className="text-white/80 text-sm mt-1 capitalize">{user?.role} • CareCell</p>
          {!lastCheckin || !isToday(new Date(lastCheckin.date)) ? (
            <button onClick={() => navigate('/checkin')}
              className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 w-fit">
              <FiSun size={14} /> आज का चेकइन करें
            </button>
          ) : (
            <div className="mt-3 bg-white/20 text-white text-sm px-4 py-2 rounded-xl w-fit flex items-center gap-2">
              ✅ आज चेकइन हो गया
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions *//*}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h3 className="section-title mb-3">Quick Access / त्वरित पहुंच</h3>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(action.path)}
                className={`${action.color} ${action.textColor} rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all`}
              >
                <Icon size={22} />
                <span className="text-xs font-bold leading-tight text-center">{action.labelH}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Treatments *//*}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Upcoming / आने वाले इलाज</h3>
          <button onClick={() => navigate('/treatments')} className="text-brand-600 text-sm font-semibold flex items-center gap-1">
            All <FiChevronRight size={14} />
          </button>
        </div>
        {loading ? (
          <div className="card text-center py-8 text-gray-400">Loading...</div>
        ) : treatments.length === 0 ? (
          <div className="card text-center py-8">
            <FiCalendar size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No upcoming treatments</p>
            <button onClick={() => navigate('/treatments')} className="btn-primary mt-3 text-sm py-2">
              Add Treatment
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {treatments.map(t => (
              <div key={t.id || t._id} className="card flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${typeColors[t.type] || 'bg-gray-100 text-gray-700'}`}>
                  {typeLabels[t.type] || 'T'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{t.title}</p>
                  <p className="text-gray-500 text-xs">{t.hospital || 'Hospital'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-brand-600 text-sm font-bold">{formatDate(t.dateTime)}</p>
                  <p className="text-gray-400 text-xs">{t.doctor || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Last Checkin Status *//*}
      {lastCheckin && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-5">
          <h3 className="section-title mb-3">Health Status / स्वास्थ्य स्थिति</h3>
          <div className={`p-4 rounded-2xl text-white ${lastCheckin.riskLevel === 'critical' ? 'bg-red-600' : lastCheckin.riskLevel === 'high' ? 'bg-orange-500' : lastCheckin.riskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg capitalize">
                  {lastCheckin.riskLevel === 'low' ? '😊 अच्छा' : lastCheckin.riskLevel === 'moderate' ? '😐 ध्यान दें' : lastCheckin.riskLevel === 'high' ? '😟 डॉक्टर से मिलें' : '🚨 अस्पताल जाएं'}
                </p>
                <p className="text-white/80 text-sm mt-0.5">{lastCheckin.aiAssessment}</p>
              </div>
              <div className="text-4xl font-bold opacity-80">{lastCheckin.wellbeing}/5</div>
            </div>
            {lastCheckin.riskLevel !== 'low' && (
              <button onClick={() => navigate('/emergency')}
                className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                Emergency Help →
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  );
}*/



//new  code for dashbord with remove checkin option 

/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiAlertTriangle, FiDroplet, FiMapPin,
  FiCalendar, FiBookOpen, FiDollarSign,
  FiChevronRight
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import { treatmentAPI } from '../utils/api';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';

const quickActions = [
  { path: '/emergency', icon: FiAlertTriangle, label: 'Emergency', color: 'bg-red-500 text-white' },
  { path: '/health-card', icon: FiHeart, label: 'Card', color: 'bg-indigo-100 text-indigo-700' },
  { path: '/blood-request', icon: FiDroplet, label: 'Blood', color: 'bg-pink-100 text-pink-700' },
  { path: '/hospitals', icon: FiMapPin, label: 'Hospitals', color: 'bg-blue-100 text-blue-700' },
  { path: '/explain', icon: FiBookOpen, label: 'AI', color: 'bg-purple-100 text-purple-700' },
  { path: '/schemes', icon: FiDollarSign, label: 'Schemes', color: 'bg-yellow-100 text-yellow-700' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE
  const [hospitals, setHospitals] = useState([]);

  // ✅ FETCH HOSPITALS
  const fetchHospitals = async (lat, lng) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/hospitals/nearby?lat=${lat}&lng=${lng}`
      );

      const data = await res.json();
      console.log("Hospitals:", data);

      setHospitals(data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tData = await treatmentAPI.getAll({ status: 'upcoming' });
        setTreatments(tData.treatments?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // ✅ GET LOCATION + FETCH HOSPITALS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fetchHospitals(lat, lng);
      },
      () => {
        // fallback (Mumbai)
        fetchHospitals(19.076, 72.8777);
      }
    );

  }, []);

  const formatDate = (dt) => {
    const d = new Date(dt);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    const diff = differenceInDays(d, new Date());
    if (diff > 0 && diff <= 7) return `${diff} days`;
    return format(d, 'dd MMM');
  };

  return (
    <div className="page-container">

  //   {/* HEADER *//*}
      <motion.div className="mb-5">
        <div className="bg-gradient-to-r from-indigo-500 to-teal-400 rounded-3xl p-5 text-white shadow">
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm opacity-80 capitalize">{user?.role}</p>
        </div>
      </motion.div>

  //    {/* SCHEMES *//*}
      <div className="mb-5">
        <div className="bg-yellow-50 p-4 rounded-2xl shadow">
          <div className="flex justify-between">
            <h3 className="font-bold">Schemes</h3>
            <button onClick={() => navigate('/schemes')}>
              <FiChevronRight />
            </button>
          </div>
          <button
            onClick={() => navigate('/schemes')}
            className="mt-3 w-full bg-blue-500 text-white py-2 rounded-xl"
          >
            Explore
          </button>
        </div>
      </div>

  //    {/* QUICK ACTIONS *//*}
      <div className="mb-5">
        <h3 className="font-bold mb-3">Quick Access</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`${action.color} p-4 rounded-2xl flex flex-col items-center`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-semibold">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

   //   {/* TREATMENTS *//*}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-bold">Treatments</h3>
          <button onClick={() => navigate('/treatments')}>
            <FiChevronRight />
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-4 rounded-xl shadow text-center">
            Loading...
          </div>
        ) : treatments.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <FiCalendar className="mx-auto mb-2" />
            <p>No treatments</p>
          </div>
        ) : (
          treatments.map((t) => (
            <div key={t._id} className="bg-white p-3 rounded-xl shadow mb-2 flex justify-between">
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-xs text-gray-500">{t.hospital}</p>
              </div>
              <span className="text-blue-600 text-sm">
                {formatDate(t.dateTime)}
              </span>
            </div>
          ))
        )}
      </div>

  //    {/* 🏥 HOSPITALS *//*}
      <div className="mt-5">
        <div className="flex justify-between mb-2">
          <h3 className="font-bold">Nearby Hospitals</h3>
          <button onClick={() => navigate('/hospitals')}>
            <FiChevronRight />
          </button>
        </div>

        {hospitals.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow text-center">
            Loading hospitals...
          </div>
        ) : (
          hospitals.slice(0, 3).map((h, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow mb-2">
              <p className="font-semibold">{h.name}</p>
              <p className="text-xs text-gray-500">
                {h.address || "No address"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}*/


//new code with logo and branding
// 🔥 ONLY UI CHANGED — LOGIC SAME

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiAlertTriangle, FiDroplet, FiMapPin,
  FiCalendar, FiBookOpen, FiDollarSign,
  FiChevronRight
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import { treatmentAPI } from '../utils/api';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import bgImage from "../assets/bg.png";

const baseActions = [
  { path: '/emergency', icon: FiAlertTriangle, label: 'Emergency', desc: '24/7 critical help', color: 'bg-red-500' },
  { path: '/hospitals', icon: FiMapPin, label: 'Hospitals', desc: 'Find nearby hospitals', color: 'bg-blue-500' },
  { path: '/explain', icon: FiBookOpen, label: 'AI Help', desc: 'Get AI assistance', color: 'bg-purple-500' },
  { path: '/schemes', icon: FiDollarSign, label: 'Schemes', desc: 'View schemes', color: 'bg-orange-500' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isDonor = user?.role === "donor";

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);

  const quickActions = [
    ...baseActions,
    ...(isDonor
      ? [{ path: '/donor', icon: FiDroplet, label: 'Donate', desc: 'Help save lives', color: 'bg-green-500' }]
      : [
          { path: '/health-card', icon: FiHeart, label: 'Card', desc: 'View health card', color: 'bg-teal-500' },
          { path: '/blood-request', icon: FiDroplet, label: 'Blood', desc: 'Request blood', color: 'bg-red-500' },
          { path: '/request-help', icon: FiHeart, label: 'Help', desc: 'Financial help', color: 'bg-pink-500' },
        ]),
  ];

  const fetchHospitals = async (lat, lng) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/hospitals/nearby?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();
      setHospitals(Array.isArray(data) ? data : data?.hospitals || []);
    } catch {
      setHospitals([]);
    }
  };

  useEffect(() => {
    if (!isDonor) {
      const loadData = async () => {
        try {
          const tData = await treatmentAPI.getAll({ status: 'upcoming' });
          setTreatments(tData.treatments?.slice(0, 3) || []);
        } catch {}
        finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
      () => fetchHospitals(19.076, 72.8777)
    );
  }, [isDonor]);

  const formatDate = (dt) => {
    const d = new Date(dt);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    const diff = differenceInDays(d, new Date());
    if (diff > 0 && diff <= 7) return `${diff} days`;
    return format(d, 'dd MMM');
  };

  return (
    <motion.div className="relative min-h-screen p-4 pb-24">

      {/* BACKGROUND */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
      }} />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />

      <div className="relative z-10 space-y-6">

        {/* HERO */}
        <div className={`rounded-3xl p-5 text-white shadow-lg flex items-center justify-between ${
          isDonor
            ? "bg-gradient-to-r from-red-500 to-pink-500"
            : "bg-gradient-to-r from-teal-500 to-blue-600"
        }`}>
          <div>
            <h2 className="text-lg font-semibold">Hello, {user?.name} 👋</h2>
            <p className="text-sm opacity-80">
              {isDonor ? "Donor Dashboard" : "Patient Dashboard"}
            </p>
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>

        {/* ACTION LIST (🔥 MAIN CHANGE) */}
        <div className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.path}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className="bg-white/80 backdrop-blur rounded-2xl p-4 flex items-center justify-between shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3">

                  {/* ICON */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${action.color}`}>
                    <Icon size={18} />
                  </div>

                  {/* TEXT */}
                  <div>
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                </div>

                <FiChevronRight />
              </motion.div>
            );
          })}
        </div>

        {/* PATIENT ONLY */}
        {!isDonor && (
          <div className="bg-white/80 rounded-2xl p-4 shadow-md">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Treatments</h3>
              <FiChevronRight onClick={() => navigate('/treatments')} />
            </div>

            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : treatments.length === 0 ? (
              <div className="text-center text-gray-500">No treatments</div>
            ) : (
              treatments.map((t) => (
                <div key={t._id} className="border rounded-xl p-3 mb-2 flex justify-between">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.hospital}</p>
                  </div>
                  <span className="text-blue-600 text-sm">
                    {formatDate(t.dateTime)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* HOSPITALS */}
        <div className="bg-white/80 rounded-2xl p-4 shadow-md">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Nearby Hospitals</h3>
            <FiChevronRight onClick={() => navigate('/hospitals')} />
          </div>

          {hospitals.length === 0 ? (
            <div className="text-center text-gray-500">
              No hospitals found
            </div>
          ) : (
            hospitals.slice(0, 3).map((h, i) => (
              <div key={i} className="border rounded-xl p-3 mb-2">
                <p className="font-medium">{h.name}</p>
                <p className="text-xs text-gray-500">
                  {h.address || "No address"}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

      {/* EMERGENCY BUTTON */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2">
        <button
          className="w-16 h-16 rounded-full bg-red-500 text-white text-2xl shadow-lg"
          onClick={() => navigate('/emergency')}
        >
          ⚠️
        </button>
      </div>

    </motion.div>
  );
}