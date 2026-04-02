import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiExternalLink, FiPhone, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { schemeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const states = ['All India', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat'];
const coverageTypes = [
  { value: 'all', label: 'All' },
  { value: 'free', label: '💚 Free' },
  { value: 'partial', label: '🟡 Partial' },
];

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('all');
  const [coverage, setCoverage] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { loadSchemes(); }, [state, coverage]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await schemeAPI.getSchemes({ state: state === 'all' ? undefined : state, coverage: coverage === 'all' ? undefined : coverage });
      setSchemes(data.schemes || []);
    } catch { setSchemes([]); }
    finally { setLoading(false); }
  };

  const coverageBadge = { free: 'badge-green', partial: 'badge-yellow', paid: 'badge-gray' };
  const coverageLabel = { free: '🟢 Free', partial: '🟡 Partial', paid: '💰 Paid' };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="section-title">Financial Help / वित्तीय सहायता</h2>
        <p className="text-gray-500 text-sm">Government schemes & NGO support for cancer</p>
      </div>

      {/* Banner */}
      <div className="gradient-teal rounded-2xl p-4 mb-5 text-white">
        <p className="font-bold text-lg">💰 Free Treatment Available</p>
        <p className="text-white/80 text-sm mt-0.5">Many government schemes provide free or subsidized cancer treatment. Check eligibility below.</p>
      </div>

      {/* Filters */}
      <div className="card mb-5 space-y-3">
        <div>
          <p className="label">State / राज्य</p>
          <div className="flex flex-wrap gap-2">
            {states.map(s => (
              <button key={s} onClick={() => setState(s === 'All India' ? 'all' : s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${(state === 'all' && s === 'All India') || state === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Coverage / सहायता</p>
          <div className="flex gap-2">
            {coverageTypes.map(c => (
              <button key={c.value} onClick={() => setCoverage(c.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${coverage === c.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes List */}
      {loading ? <LoadingSpinner text="Loading schemes..." /> : (
        <div className="space-y-3">
          <p className="text-gray-500 text-sm">{schemes.length} schemes available</p>
          {schemes.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card cursor-pointer hover:shadow-md transition-all ${expanded === s.id ? 'border-teal-300 bg-teal-50/20' : ''}`}
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge ${coverageBadge[s.coverage]}`}>{coverageLabel[s.coverage]}</span>
                    <span className="badge badge-blue text-xs">{s.state?.split(',')[0]}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{s.name}</h4>
                  <p className="text-teal-700 text-xs font-medium mt-0.5">{s.nameHindi}</p>
                </div>
                {expanded === s.id ? <FiChevronUp size={18} className="text-gray-400 flex-shrink-0 mt-1" /> : <FiChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-1" />}
              </div>

              <p className="text-gray-600 text-xs mt-2 leading-relaxed">{s.description}</p>

              <AnimatePresence>
                {expanded === s.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-teal-200 space-y-3">
                    {/* Eligibility */}
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-bold text-gray-700 mb-2">📋 Eligibility / पात्रता</p>
                      <p className="text-xs text-gray-600">Cancer Types: {s.cancerTypes}</p>
                      <p className="text-xs text-gray-600">Age: {s.ageGroup}</p>
                      <p className="text-xs text-gray-600">Income: {s.incomeLimit}</p>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-bold text-gray-700 mb-2">📄 Documents Needed / जरूरी दस्तावेज</p>
                      {s.documents?.map((doc, di) => (
                        <p key={di} className="text-xs text-gray-600 flex items-center gap-1 mb-0.5">
                          <span className="text-green-500">•</span> {doc}
                        </p>
                      ))}
                    </div>

                    {/* How to apply */}
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-800 mb-1">⏱️ Approval Time: {s.approvalTime}</p>
                      <p className="text-xs text-amber-700">{s.contactInfo}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <a href={`tel:${s.contactInfo?.match(/\d[\d\-]+/)?.[0]}`}
                        className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm">
                        <FiPhone size={14} /> Contact
                      </a>
                      {s.website && (
                        <a href={s.website} target="_blank" rel="noopener noreferrer"
                          className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 text-sm">
                          <FiExternalLink size={14} /> Website
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {schemes.length === 0 && (
            <div className="card text-center py-10">
              <p className="text-4xl mb-3">💰</p>
              <p className="text-gray-500">No schemes found for selected filters.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-blue-800 font-semibold text-sm mb-1">Need Help Applying? / आवेदन में मदद?</p>
        <p className="text-blue-700 text-xs">Contact your nearest ASHA worker, district hospital social worker, or the Cancer Helpline at <strong>1800-11-1234</strong> for assistance.</p>
      </div>
      <div className="h-4" />
    </div>
  );
}
