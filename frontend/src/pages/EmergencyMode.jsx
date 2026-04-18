/*
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone, FiNavigation, FiAlertTriangle
} from 'react-icons/fi';

const helplines = [
  { name: 'Ambulance / एम्बुलेंस', number: '108', emoji: '🚑', color: 'bg-red-500' },
  { name: 'Emergency / आपातकाल', number: '112', emoji: '🆘', color: 'bg-orange-500' },
];

export default function EmergencyMode() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  // 📍 GET LOCATION
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        setLocation({ lat: 19.076, lng: 72.8777 });
      }
    );
  }, []);

  // 🔥 FETCH NEAREST HOSPITALS
  useEffect(() => {
    if (!location) return;

    const fetchHospitals = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/hospitals/nearby?lat=${location.lat}&lng=${location.lng}`
        );

        const data = await res.json();

        const nearest = (data.hospitals || []).slice(0, 3);

        setHospitals(nearest);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [location]);

  const callNumber = (num) => {
    window.location.href = `tel:${num}`;
  };

  const openMaps = (h) => {
    const q = encodeURIComponent(`${h.name}, ${h.address}`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-4">

      {/* 🚨 EMERGENCY BANNER *//*
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-red-600 text-white rounded-3xl p-6 text-center shadow-lg"
      >
        <FiAlertTriangle size={32} className="mx-auto mb-2" />

        <h2 className="text-xl font-bold">
          Emergency Mode / आपातकाल मोड
        </h2>

        <button
          onClick={() => callNumber('108')}
          className="mt-4 w-full bg-white text-red-600 font-bold py-3 rounded-xl"
        >
          📞 Call Ambulance / एम्बुलेंस कॉल करें (108)
        </button>
      </motion.div>

      {/* QUICK NUMBERS *//*
      <div className="grid grid-cols-2 gap-3">
        {helplines.map(h => (
          <button
            key={h.number}
            onClick={() => callNumber(h.number)}
            className={`${h.color} text-white rounded-2xl p-4`}
          >
            <div className="text-xl">{h.emoji}</div>
            <p className="font-bold">{h.number}</p>
            <p className="text-xs">{h.name}</p>
          </button>
        ))}
      </div>

      {/* 🔥 NEAREST HOSPITALS *//*
      {loading ? (
        <div className="bg-white p-6 rounded-2xl text-center">
          Finding nearest hospitals... <br />
          <span className="text-sm text-gray-400">
            नजदीकी अस्पताल खोज रहे हैं...
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700">
            Nearest Hospitals / नजदीकी अस्पताल
          </h3>

          {hospitals.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-2xl shadow"
            >
              <h4 className="font-semibold">{h.name}</h4>

              <p className="text-sm text-gray-500">
                {h.city}, {h.state}
              </p>

              <p className="text-red-600 font-bold">
                🚑 {h.distance?.toFixed(2)} km दूर
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => callNumber(h.phone || "108")}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                >
                  Call / कॉल
                </button>

                <button
                  onClick={() => openMaps(h)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <FiNavigation size={14} />
                  Go / जाएं
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* OFFLINE *//*
      <div className="bg-yellow-50 p-4 rounded-2xl text-sm text-yellow-700">
        📵 No Internet? Call 108 <br />
        बिना इंटरनेट? 108 पर कॉल करें
      </div>

    </div>
  );
}*/




//new code for  emergany  for deployment 


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone, FiNavigation, FiAlertTriangle
} from 'react-icons/fi';

const helplines = [
  { name: 'Ambulance / एम्बुलेंस', number: '108', emoji: '🚑', color: 'bg-red-500' },
  { name: 'Emergency / आपातकाल', number: '112', emoji: '🆘', color: 'bg-orange-500' },
];

export default function EmergencyMode() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL; // ✅ ADDED

  // 📍 GET LOCATION
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        setLocation({ lat: 19.076, lng: 72.8777 });
      }
    );
  }, []);

  // 🔥 FETCH NEAREST HOSPITALS
  useEffect(() => {
    if (!location) return;

    const fetchHospitals = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE}/hospitals/nearby?lat=${location.lat}&lng=${location.lng}` // ✅ FIXED
        );

        const data = await res.json();

        const nearest = (data.hospitals || []).slice(0, 3);

        setHospitals(nearest);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [location]);

  const callNumber = (num) => {
    window.location.href = `tel:${num}`;
  };

  const openMaps = (h) => {
    const q = encodeURIComponent(`${h.name}, ${h.address}`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-4">

      {/* 🚨 EMERGENCY BANNER */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-red-600 text-white rounded-3xl p-6 text-center shadow-lg"
      >
        <FiAlertTriangle size={32} className="mx-auto mb-2" />

        <h2 className="text-xl font-bold">
          Emergency Mode / आपातकाल मोड
        </h2>

        <button
          onClick={() => callNumber('108')}
          className="mt-4 w-full bg-white text-red-600 font-bold py-3 rounded-xl"
        >
          📞 Call Ambulance / एम्बुलेंस कॉल करें (108)
        </button>
      </motion.div>

      {/* QUICK NUMBERS */}
      <div className="grid grid-cols-2 gap-3">
        {helplines.map(h => (
          <button
            key={h.number}
            onClick={() => callNumber(h.number)}
            className={`${h.color} text-white rounded-2xl p-4`}
          >
            <div className="text-xl">{h.emoji}</div>
            <p className="font-bold">{h.number}</p>
            <p className="text-xs">{h.name}</p>
          </button>
        ))}
      </div>

      {/* 🔥 NEAREST HOSPITALS */}
      {loading ? (
        <div className="bg-white p-6 rounded-2xl text-center">
          Finding nearest hospitals... <br />
          <span className="text-sm text-gray-400">
            नजदीकी अस्पताल खोज रहे हैं...
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700">
            Nearest Hospitals / नजदीकी अस्पताल
          </h3>

          {hospitals.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-2xl shadow"
            >
              <h4 className="font-semibold">{h.name}</h4>

              <p className="text-sm text-gray-500">
                {h.city}, {h.state}
              </p>

              <p className="text-red-600 font-bold">
                🚑 {h.distance?.toFixed(2)} km दूर
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => callNumber(h.phone || "108")}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl"
                >
                  Call / कॉल
                </button>

                <button
                  onClick={() => openMaps(h)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <FiNavigation size={14} />
                  Go / जाएं
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* OFFLINE */}
      <div className="bg-yellow-50 p-4 rounded-2xl text-sm text-yellow-700">
        📵 No Internet? Call 108 <br />
        बिना इंटरनेट? 108 पर कॉल करें
      </div>

    </div>
  );
}