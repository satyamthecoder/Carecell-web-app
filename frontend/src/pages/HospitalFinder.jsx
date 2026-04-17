
///2nd improvements 
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin, FiFilter, FiNavigation, FiStar
} from 'react-icons/fi';
import { hospitalAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const cache = useRef({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ lat: 19.076, lng: 72.8777 });
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const delay = setTimeout(() => {
      fetchHospitals();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, location]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);

      if (cache.current[search]) {
        setHospitals(cache.current[search]);
        setVisibleCount(10);
        setLoading(false);
        return;
      }

      const data = await hospitalAPI.getHospitals({
        lat: location.lat,
        lng: location.lng,
        search
      });

      const result = data.hospitals || [];
      cache.current[search] = result;

      setHospitals(result);
      setVisibleCount(10);

    } catch (err) {
      console.error(err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (h) => {
    const q = encodeURIComponent(`${h.name}, ${h.address}`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  };

  return (
   // <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-150 pb-24">
<div className="min-h-screen bg-gradient-to-br from-[#c5c5f5] via-white to-[#dec7f7] pb-24">
      {/* 🔥 HEADER WITH GRADIENT */}
        <div className="bg-gradient-to-r from-[#C4B5FD] via-[#D8B4FE] to-[#EDE9FE] p-4 pb-6 rounded-b-3xl shadow-md">

        <h2 className="text-purple-900 font-semibold text-lg mb-3">
          Hospital Finder
        </h2>

        {/* SEARCH BAR */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city, hospital..."
              className="w-full pl-9 p-3 rounded-xl border-0 shadow outline-none"
            />
          </div>

          <button className="px-3 rounded-xl bg-white text-blue-600">
            <FiFilter />
          </button>

          {/* UI Search Button */}
          <button className="px-4 rounded-xl bg-white text-blue-600 font-semibold">
            Search
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {loading ? (
          <LoadingSpinner text="Finding hospitals..." />
        ) : (
          <>
            <p className="text-gray-500 text-sm">
              {hospitals.length} hospitals found
            </p>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3">

              {hospitals.slice(0, visibleCount).map((h, i) => (
                <motion.div
                  key={h._id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-3 shadow-md border"
                >

                  {/* HEADER */}
                  <div className="flex justify-between items-start">

                    <div>
                      <h4 className="text-sm font-semibold line-clamp-1">
                        {h.name}
                      </h4>

                      <p className="text-xs text-gray-500">
                        {h.city}
                      </p>

                      <p className="text-xs mt-1 text-gray-400">
                        📍 {h.distance?.toFixed(1)} km away
                      </p>
                    </div>

                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      🏥
                    </div>
                  </div>

                  {/* RATING */}
                  {h.rating && (
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mt-2">
                      <FiStar size={12} />
                      {h.rating}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`tel:${h.phone || ""}`}
                      className="flex-1 bg-blue-100 text-blue-600 py-1 rounded-lg text-xs text-center"
                    >
                      Call
                    </a>

                    <button
                      onClick={() => openMaps(h)}
                      className="flex-1 bg-green-500 text-white py-1 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <FiNavigation size={12} />
                      Go
                    </button>
                  </div>

                </motion.div>
              ))}

            </div>

            {/* LOAD MORE */}
            {visibleCount < hospitals.length && (
              <button
                onClick={() => setVisibleCount(visibleCount + 10)}
                className="w-full bg-purple-400 text-white py-3 rounded-xl mt-4"
              >
                Load More
              </button>
            )}

          </>
        )}
      </div>

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-6 right-4 z-30">
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="w-14 h-14 bg-purple-500 text-white rounded-full shadow-xl flex items-center justify-center"
        >
          <FiFilter size={20} />
        </motion.button>
      </div>
    </div>
  );
}