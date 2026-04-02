import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiDroplet, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { bloodAPI, donorAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const types = [
  { value: 'whole_blood', label: 'Whole Blood / पूरा रक्त', emoji: '🩸' },
  { value: 'platelets', label: 'Platelets / प्लेटलेट्स', emoji: '💊' },
  { value: 'plasma', label: 'Plasma / प्लाज्मा', emoji: '💉' },
];

export default function BloodRequest() {
  const [tab, setTab] = useState('request');
  const [form, setForm] = useState({ bloodGroup: 'A+', type: 'whole_blood', urgency: 'routine', units: 1, hospitalName: '', radius: 25, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  useEffect(() => {
    if (tab === 'donors') loadDonors();
    if (tab === 'history') loadRequests();
  }, [tab]);

  const loadDonors = async () => {
    setLoadingDonors(true);
    try {
      const data = await donorAPI.searchDonors({ bloodGroup: form.bloodGroup, radius: form.radius });
      setDonors(data.donors || []);
    } catch { setDonors([]); }
    finally { setLoadingDonors(false); }
  };

  const loadRequests = async () => {
    setLoadingReqs(true);
    try {
      const data = await bloodAPI.getMyRequests();
      setRequests(data.requests || []);
    } catch { setRequests([]); }
    finally { setLoadingReqs(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hospitalName) return toast.error('Please enter hospital name');
    setSubmitting(true);
    try {
      await bloodAPI.createRequest(form);
      toast.success('Blood request sent! Donors will be notified. / रक्त अनुरोध भेजा गया!');
      setTab('history');
    } catch (err) {
      toast.error(err.message);
    } finally { setSubmitting(false); }
  };

  const availColor = { available: 'badge-green', routine_only: 'badge-yellow', unavailable: 'badge-gray' };
  const availLabel = { available: 'Available', routine_only: 'Routine Only', unavailable: 'Unavailable' };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="section-title">Blood Request / रक्त अनुरोध</h2>
        <p className="text-gray-500 text-sm">Blood & platelet donors near you</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
        {[
          { key: 'request', label: '+ New Request' },
          { key: 'donors', label: '👥 Find Donors' },
          { key: 'history', label: '📋 My Requests' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* New Request Tab */}
      {tab === 'request' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
          {/* Blood Group */}
          <div className="card">
            <label className="label">Blood Group / रक्त समूह *</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map(bg => (
                <button key={bg} type="button" onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${form.bloodGroup === bg ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="card">
            <label className="label">Type / प्रकार *</label>
            <div className="space-y-2">
              {types.map(t => (
                <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${form.type === t.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-xl">{t.emoji}</span>
                  <span className="font-medium text-gray-800 text-sm">{t.label}</span>
                  {form.type === t.value && <FiCheck size={16} className="ml-auto text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency + Units */}
          <div className="card space-y-3">
            <div>
              <label className="label">Urgency / जरूरत</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, urgency: 'emergency' }))}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${form.urgency === 'emergency' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>
                  🚨 Emergency / आपात
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, urgency: 'routine' }))}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${form.urgency === 'routine' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                  📅 Routine / सामान्य
                </button>
              </div>
            </div>
            <div>
              <label className="label">Units needed / इकाई</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, units: Math.max(1, f.units - 1) }))}
                  className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors">-</button>
                <span className="text-2xl font-bold text-gray-800 w-8 text-center">{form.units}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, units: Math.min(10, f.units + 1) }))}
                  className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors">+</button>
                <span className="text-gray-500 text-sm">unit(s)</span>
              </div>
            </div>
          </div>

          {/* Hospital + Radius */}
          <div className="card space-y-3">
            <div>
              <label className="label">Hospital Name / अस्पताल *</label>
              <input value={form.hospitalName} onChange={e => setForm(f => ({ ...f, hospitalName: e.target.value }))}
                placeholder="Hospital name" className="input-field" />
            </div>
            <div>
              <label className="label">Search Radius / खोज क्षेत्र: {form.radius} km</label>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map(r => (
                  <button key={r} type="button" onClick={() => setForm(f => ({ ...f, radius: r }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.radius === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'}`}>
                    {r}km
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any special requirements..." className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <FiDroplet size={16} />
            {submitting ? 'Sending...' : 'Send Blood Request / अनुरोध भेजें'}
          </button>
        </motion.form>
      )}

      {/* Donors Tab */}
      {tab === 'donors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex gap-2 mb-4">
            <select value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
              className="input-field flex-1">
              <option value="">Any Blood Group</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <button onClick={loadDonors} className="btn-primary px-4">Search</button>
          </div>
          {loadingDonors ? <LoadingSpinner text="Finding donors..." /> : (
            <div className="space-y-3">
              {donors.map((d, i) => (
                <motion.div key={d.id || d._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card flex items-center gap-3">
                  <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {d.bloodGroup?.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{d.name}</p>
                    <p className="text-gray-500 text-xs">{d.city} • {d.distance} km away</p>
                    {d.canDonatePlatelet && <span className="badge badge-blue text-xs mt-0.5">Platelets ✓</span>}
                  </div>
                  <div className="text-right">
                    <span className={`badge ${availColor[d.availability] || 'badge-gray'}`}>
                      {availLabel[d.availability] || d.availability}
                    </span>
                    {d.lastDonation && <p className="text-xs text-gray-400 mt-1">Last: {new Date(d.lastDonation).toLocaleDateString('en-IN')}</p>}
                  </div>
                </motion.div>
              ))}
              {donors.length === 0 && (
                <div className="card text-center py-10">
                  <p className="text-4xl mb-3">🩸</p>
                  <p className="text-gray-500">No donors found. Try increasing search radius.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {loadingReqs ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.id || r._id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`badge ${r.urgency === 'emergency' ? 'badge-red' : 'badge-blue'} mb-1`}>
                        {r.urgency === 'emergency' ? '🚨 Emergency' : '📅 Routine'}
                      </span>
                      <p className="font-bold text-gray-900">{r.bloodGroup} • {r.type?.replace('_', ' ')} • {r.units} unit(s)</p>
                      <p className="text-gray-500 text-sm">{r.hospitalName}</p>
                    </div>
                    <span className={`badge ${r.status === 'active' ? 'badge-green' : r.status === 'fulfilled' ? 'badge-blue' : 'badge-gray'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="card text-center py-10">
                  <p className="text-gray-500">No requests yet. Create your first blood request!</p>
                  <button onClick={() => setTab('request')} className="btn-primary mt-3 text-sm">
                    <FiPlus size={14} className="inline mr-1" /> New Request
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  );
}
