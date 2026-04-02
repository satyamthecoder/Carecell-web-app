import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiFilter, FiNavigation, FiClock, FiStar } from 'react-icons/fi';
import { hospitalAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const typeOpts = [
  { value: 'all', label: 'All / सभी' },
  { value: 'government', label: 'Govt / सरकारी' },
  { value: 'private', label: 'Private / निजी' },
];
const costOpts = [
  { value: 'all', label: 'Any Cost' },
  { value: 'low', label: '💚 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🔴 High' },
];
const radiusOpts = [5, 10, 25, 50];

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'all', costLevel: 'all', radius: 50, opdToday: false });
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, [filters]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (search) params.search = search;
      const data = await hospitalAPI.getHospitals(params);
      setHospitals(data.hospitals || []);
    } catch { setHospitals([]); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  const openMaps = (h) => {
    const q = encodeURIComponent(`${h.name}, ${h.address}`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  };

  const costColor = { low: 'text-green-600 bg-green-100', medium: 'text-yellow-700 bg-yellow-100', high: 'text-red-600 bg-red-100' };
  const costLabel = { low: 'Low Cost', medium: 'Medium', high: 'High' };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="section-title">Hospital Finder</h2>
        <p className="text-gray-500 text-sm">नजदीकी अस्पताल खोजें</p>
      </div>

      {/* Search + Filter Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <FiMapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search city, hospital... / शहर, अस्पताल"
            className="input-field pl-9 text-sm py-2.5"
          />
        </div>
        <button type="button" onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-xl border-2 font-semibold text-sm flex items-center gap-2 transition-colors ${showFilters ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
          <FiFilter size={15} /> Filters
        </button>
        <button type="submit" className="btn-primary px-4 py-2.5 text-sm">Search</button>
      </form>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="card mb-4 space-y-3">
            <div>
              <p className="label">Type / प्रकार</p>
              <div className="flex gap-2">
                {typeOpts.map(o => (
                  <button key={o.value} onClick={() => setFilters(f => ({ ...f, type: o.value }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filters.type === o.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Cost / लागत</p>
              <div className="flex gap-2">
                {costOpts.map(o => (
                  <button key={o.value} onClick={() => setFilters(f => ({ ...f, costLevel: o.value }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${filters.costLevel === o.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label">Radius / दूरी: {filters.radius} km</p>
              <div className="flex gap-2">
                {radiusOpts.map(r => (
                  <button key={r} onClick={() => setFilters(f => ({ ...f, radius: r }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filters.radius === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {r}km
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setFilters(f => ({ ...f, opdToday: !f.opdToday }))}
                className={`w-12 h-6 rounded-full transition-all relative ${filters.opdToday ? 'bg-brand-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${filters.opdToday ? 'left-6' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">OPD Open Today / आज OPD खुला</span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {loading ? <LoadingSpinner text="Searching hospitals..." /> : (
        <>
          <p className="text-gray-500 text-sm mb-3">{hospitals.length} hospitals found</p>
          <div className="space-y-3">
            {hospitals.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className={`card cursor-pointer hover:shadow-md transition-all ${selected?.id === h.id ? 'border-brand-300 bg-brand-50/20' : ''}`}
                  onClick={() => setSelected(selected?.id === h.id ? null : h)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`badge ${h.type === 'government' ? 'badge-green' : 'badge-blue'}`}>
                          {h.type === 'government' ? '🏛️ Govt' : '🏥 Private'}
                        </span>
                        {h.isFree && <span className="badge badge-green">Free/मुफ्त</span>}
                        {h.isOpdOpenToday && <span className="badge badge-blue">OPD Open</span>}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{h.name}</h4>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <FiMapPin size={11} /> {h.city}, {h.state}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-brand-600 text-sm">{h.distance} km</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <FiStar size={11} className="text-yellow-500" />
                        <span className="text-xs text-gray-600">{h.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock size={12} />
                    <span>{h.opdTimings} ({h.opdDays})</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${costColor[h.costLevel]}`}>
                      {costLabel[h.costLevel]}
                    </span>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selected?.id === h.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">{h.address}</p>
                        {h.facilities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {h.facilities.map(f => (
                              <span key={f} className="badge badge-gray text-xs">{f}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <a href={`tel:${h.phone}`} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2 text-sm">
                            <FiPhone size={14} /> {h.phone}
                          </a>
                          <button onClick={(e) => { e.stopPropagation(); openMaps(h); }}
                            className="flex-1 btn-teal py-2 flex items-center justify-center gap-2 text-sm">
                            <FiNavigation size={14} /> Directions
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
            {hospitals.length === 0 && (
              <div className="card text-center py-10">
                <p className="text-4xl mb-3">🏥</p>
                <p className="text-gray-500">No hospitals found. Try changing filters.</p>
              </div>
            )}
          </div>
        </>
      )}
      <div className="h-4" />
    </div>
  );
}
