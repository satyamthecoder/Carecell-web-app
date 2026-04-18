import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle, FiMapPin, FiBookOpen,
  FiDollarSign, FiDroplet
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import { treatmentAPI } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isDonor = user?.role === "donor";

  const [hospitals, setHospitals] = useState([]);
  const [treatments, setTreatments] = useState([]);

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
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchHospitals(pos.coords.latitude, pos.coords.longitude),
      () => fetchHospitals(19.076, 72.8777)
    );

    if (!isDonor) {
      treatmentAPI.getAll({ status: 'upcoming' })
        .then(res => setTreatments(res.treatments || []))
        .catch(() => {});
    }
  }, [isDonor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24 space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">CareCell</h1>
        <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">
          🚨 Emergency
        </button>
      </div>

      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-blue-400 to-green-300 text-white p-5 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Hello, {user?.name} 👋</h2>
          <p className="text-sm opacity-80">{user?.phone}</p>
        </div>

        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
          {user?.name?.charAt(0)}
        </div>
      </div>

      {/* 🚨 EMERGENCY PANEL */}
      <div className="bg-red-800 text-purple-200 p-4 rounded-3xl shadow">
        <div className="flex justify-between mb-3">
          <p className="font-semibold text-sm">Emergency Mode</p>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">Active</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white rounded-xl text-black p-2">
            🚑 <p>108</p>
          </div>
          <div className="bg-white rounded-xl text-black p-2">
            🚨 <p>112</p>
          </div>
          <div className="bg-white rounded-xl text-black p-2">
            👮 <p>100</p>
          </div>
          <div className="bg-white rounded-xl text-black p-2">
            ☎️ <p>Helpline</p>
          </div>
        </div>
      </div>

      {/* ⚡ ACTIONS */}
      <div className="grid grid-cols-2 gap-3">

        <Card icon="🚨" title="Emergency" onClick={() => navigate('/emergency')} />
        <Card icon="📍" title="Hospitals" onClick={() => navigate('/hospitals')} />
        <Card icon="🤖" title="AI Help" onClick={() => navigate('/explain')} />
        <Card icon="💰" title="Schemes" onClick={() => navigate('/schemes')} />

        {isDonor ? (
          <Card icon="🩸" title="Donate" onClick={() => navigate('/donor')} />
        ) : (
          <>
            <Card icon="❤️" title="Health Card" onClick={() => navigate('/health-card')} />
            <Card icon="🩸" title="Blood Request" onClick={() => navigate('/blood-request')} />
          </>
        )}
      </div>

      {/* 🏥 HOSPITALS (HORIZONTAL LIKE IMAGE) */}
      <Section title="Nearby Hospitals" onClick={() => navigate('/hospitals')}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hospitals.length === 0 ? (
            <p className="text-sm text-gray-500">No hospitals</p>
          ) : (
            hospitals.slice(0, 5).map((h, i) => (
              <div key={i} className="min-w-[200px] bg-gradient-to-br from-purple-100 to-blue-100 p-3 rounded-2xl shadow">
                <p className="font-semibold text-sm">{h.name}</p>
                <p className="text-xs text-gray-600">{h.address}</p>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* 💡 SCHEME PREVIEW */}
      <Section title="Find Schemes" onClick={() => navigate('/schemes')}>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-white  px-3 py-1 rounded-xl text-xs shadow">State</span>
          <span className="bg-white px-3 py-1 rounded-xl text-xs shadow">Category</span>
          <span className="bg-white px-3 py-1 rounded-xl text-xs shadow">Gender</span>
          <span className="bg-white px-3 py-1 rounded-xl text-xs shadow">Income</span>
        </div>
      </Section>

      {/* 🧾 SCHEME CARDS */}
      <Section title="Available Schemes" onClick={() => navigate('/schemes')}>
        <div className="flex gap-3 overflow-x-auto">
          <div className="min-w-[220px] bg-white p-3 rounded-xl shadow">
            <p className="font-semibold text-sm">Ayushman Bharat</p>
            <p className="text-xs text-gray-500">Free healthcare</p>
            <button className="bg-green-500 text-white w-full mt-2 py-1 rounded">
              Apply Now
            </button>
          </div>

          <div className="min-w-[220px] bg-white p-3 rounded-xl shadow">
            <p className="font-semibold text-sm">MJPJAY</p>
            <p className="text-xs text-gray-500">Low income support</p>
            <button className="bg-green-500 text-white w-full mt-2 py-1 rounded">
              Apply Now
            </button>
          </div>
        </div>
      </Section>

      {/* 🚨 SOS BUTTON */}
      <button
        className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg"
        onClick={() => navigate('/emergency')}
      >
        SOS
      </button>
    </div>
  );
}

/* COMPONENTS */

function Card({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow text-center cursor-pointer"
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm mt-1">{title}</p>
    </div>
  );
}

function Section({ title, children, onClick }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span onClick={onClick} className="text-sm text-blue-500 cursor-pointer">
          See all →
        </span>
      </div>
      {children}
    </div>
  );
}