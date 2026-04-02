import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMapPin, FiNavigation, FiAlertTriangle, FiDroplet } from 'react-icons/fi';
import { emergencyAPI } from '../utils/api';

const helplines = [
  { name: 'Ambulance / एम्बुलेंस', number: '108', emoji: '🚑', color: 'bg-red-500' },
  { name: 'National Emergency', number: '112', emoji: '🆘', color: 'bg-orange-500' },
  { name: 'Police / पुलिस', number: '100', emoji: '🚔', color: 'bg-blue-500' },
  { name: 'Cancer Helpline', number: '1800-11-1234', emoji: '🏥', color: 'bg-teal-600' },
];

export default function EmergencyMode() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDirections, setShowDirections] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        emergencyAPI.getNearest(pos.coords.latitude, pos.coords.longitude).then(r => {
          setData(r.data); setLoading(false);
        }).catch(() => loadDefault());
      },
      () => loadDefault()
    );
    function loadDefault() {
      emergencyAPI.getNearest(null, null, 'Mumbai').then(r => {
        setData(r.data); setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);

  const callNumber = (num) => {
    window.location.href = `tel:${num.replace(/-/g, '')}`;
  };

  const openMaps = (address) => {
    const q = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  };

  return (
    <div className="page-container">
      {/* Big Emergency Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-red-600 rounded-3xl p-6 text-center text-white mb-6 shadow-xl shadow-red-200"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
          <FiAlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-display font-bold mb-1">Emergency Mode</h2>
        <p className="text-white/80">आपातकाल सहायता</p>
        <button
          onClick={() => callNumber('108')}
          className="mt-4 bg-white text-red-700 font-bold text-lg px-8 py-3 rounded-2xl hover:bg-red-50 transition-colors shadow-md w-full"
        >
          📞 Call Ambulance: 108
        </button>
      </motion.div>

      {/* Quick Call Buttons */}
      <div className="mb-6">
        <h3 className="section-title mb-3">Emergency Numbers / आपात नंबर</h3>
        <div className="grid grid-cols-2 gap-3">
          {helplines.map(h => (
            <button
              key={h.number}
              onClick={() => callNumber(h.number)}
              className={`${h.color} text-white rounded-2xl p-4 text-left hover:opacity-90 active:scale-95 transition-all shadow-sm`}
            >
              <span className="text-2xl block mb-2">{h.emoji}</span>
              <p className="font-bold text-lg">{h.number}</p>
              <p className="text-white/80 text-xs">{h.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nearest Hospitals */}
      {loading ? (
        <div className="card text-center py-8 text-gray-400">Finding nearest hospitals...</div>
      ) : data && (
        <div className="space-y-4">
          <h3 className="section-title">Nearest Hospitals / नजदीकी अस्पताल</h3>

          {/* Oncology Hospital */}
          {data.oncologyHospital && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="card border-l-4 border-brand-500">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-red">🏥 Oncology</span>
                    {data.oncologyHospital.isOpen24x7 && <span className="badge badge-green">24/7</span>}
                  </div>
                  <h4 className="font-bold text-gray-900">{data.oncologyHospital.name}</h4>
                  <p className="text-gray-500 text-sm">{data.oncologyHospital.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-600">{data.oncologyHospital.distance}</p>
                  <p className="text-gray-400 text-xs">{data.oncologyHospital.travelTime}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => callNumber(data.oncologyHospital.phone)}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm">
                  <FiPhone size={14} /> Call
                </button>
                <button onClick={() => openMaps(data.oncologyHospital.address)}
                  className="flex-1 btn-teal py-2.5 flex items-center justify-center gap-2 text-sm">
                  <FiNavigation size={14} /> Directions
                </button>
                <button onClick={() => setShowDirections(showDirections === 'onco' ? null : 'onco')}
                  className="px-4 py-2.5 bg-gray-100 rounded-xl text-gray-700 text-sm font-semibold">
                  Steps
                </button>
              </div>
              {showDirections === 'onco' && data.oncologyHospital.directions && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-amber-50 rounded-xl p-3 space-y-1">
                  {data.oncologyHospital.directions.map((d, i) => (
                    <p key={i} className="text-sm text-amber-900 flex items-start gap-2">
                      <span className="bg-amber-400 text-white text-xs font-bold w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center">{i + 1}</span>
                      {d}
                    </p>
                  ))}
                  {data.oncologyHospital.landmarks?.length > 0 && (
                    <p className="text-xs text-amber-700 mt-2">📍 Landmarks: {data.oncologyHospital.landmarks.join(' → ')}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Blood Bank */}
          {data.bloodBank && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card border-l-4 border-red-400">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-red">🩸 Blood Bank</span>
                    {data.bloodBank.isOpen24x7 && <span className="badge badge-green">24/7</span>}
                  </div>
                  <h4 className="font-bold text-gray-900">{data.bloodBank.name}</h4>
                  <p className="text-gray-500 text-sm">{data.bloodBank.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">{data.bloodBank.distance}</p>
                  <p className="text-gray-400 text-xs">{data.bloodBank.travelTime}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => callNumber(data.bloodBank.phone)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                  <FiPhone size={14} /> Call Blood Bank
                </button>
                <button onClick={() => openMaps(data.bloodBank.address)}
                  className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 text-sm">
                  <FiMapPin size={14} /> Map
                </button>
              </div>
            </motion.div>
          )}

          {/* General Hospital */}
          {data.generalHospital && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card border-l-4 border-blue-400">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-blue">🏨 General Hospital</span>
                    {data.generalHospital.hasEmergencyWard && <span className="badge badge-green">Emergency Ward</span>}
                  </div>
                  <h4 className="font-bold text-gray-900">{data.generalHospital.name}</h4>
                  <p className="text-gray-500 text-sm">{data.generalHospital.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-500">{data.generalHospital.distance}</p>
                  <p className="text-gray-400 text-xs">{data.generalHospital.travelTime}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => callNumber(data.generalHospital.phone)}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm">
                  <FiPhone size={14} /> Call
                </button>
                <button onClick={() => openMaps(data.generalHospital.address)}
                  className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 text-sm">
                  <FiNavigation size={14} /> Directions
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Offline note */}
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-amber-800 text-sm font-semibold mb-1">📵 No Internet? बिना इंटरनेट?</p>
        <p className="text-amber-700 text-sm">Call 108 for free ambulance anywhere in India / भारत में कहीं भी 108 पर कॉल करें</p>
      </div>

      <div className="h-4" />
    </div>
  );
}
