import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiDroplet, FiPlus, FiCheck } from 'react-icons/fi';
import { bloodAPI, donorAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequest() {
  const [tab, setTab] = useState('request');
  const [form, setForm] = useState({
    bloodGroup: 'A+',
    type: 'whole_blood',
    urgency: 'routine',
    units: 1,
    hospitalName: '',
    radius: 25,
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  useEffect(() => {
    if (tab === 'donors') loadDonors();
    if (tab === 'history') loadRequests();
  }, [tab]);

  // ✅ FIXED DONOR FETCH
  const loadDonors = async () => {
    setLoadingDonors(true);
    try {
      const user = JSON.parse(localStorage.getItem('carecell_user') || '{}');

      const data = await donorAPI.searchDonors({
        bloodGroup: form.bloodGroup,
        city: user?.location?.city || ''
      });

      setDonors(data.donors || []);
    } catch {
      setDonors([]);
    } finally {
      setLoadingDonors(false);
    }
  };

  const loadRequests = async () => {
    setLoadingReqs(true);
    try {
      const data = await bloodAPI.getMyRequests();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoadingReqs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hospitalName) return toast.error('Please enter hospital name');

    setSubmitting(true);
    try {
      await bloodAPI.createRequest(form);
      toast.success('Blood request sent!');
      setTab('history');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const availColor = {
    available: 'badge-green',
    routine_only: 'badge-yellow',
    unavailable: 'badge-gray'
  };

  const availLabel = {
    available: 'Available',
    routine_only: 'Routine Only',
    unavailable: 'Unavailable'
  };

  return (
    <div className="page-container">

      <h2 className="section-title mb-4">Blood Request</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
        {['request', 'donors', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              tab === t ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* REQUEST TAB */}
      {tab === 'request' && (
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="card">
            <label className="label">Blood Group</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2 rounded-xl border ${
                    form.bloodGroup === bg ? 'bg-blue-100' : ''
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <input
              placeholder="Hospital Name"
              value={form.hospitalName}
              onChange={e => setForm(f => ({ ...f, hospitalName: e.target.value }))}
              className="input-field"
            />
          </div>

          <button className="btn-primary w-full">
            {submitting ? 'Sending...' : 'Send Request'}
          </button>

        </form>
      )}

      {/* DONOR TAB */}
      {tab === 'donors' && (
        <div>

          <div className="flex gap-2 mb-4">
            <select
              value={form.bloodGroup}
              onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
              className="input-field flex-1"
            >
              <option value="">Any</option>
              {bloodGroups.map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <button onClick={loadDonors} className="btn-primary">
              Search
            </button>
          </div>

          {loadingDonors ? <LoadingSpinner /> : (

            <div className="space-y-3">

              {donors.map((d, i) => {
                const profile = d.donorProfile || {};

                return (
                  <motion.div
                    key={d._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card flex items-center gap-3"
                  >

                    <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-xl font-bold">
                      {profile.bloodGroup || 'NA'}
                    </div>

                    <div className="flex-1">
                      <p className="font-bold">{d.name}</p>
                      <p className="text-xs text-gray-500">{profile.city}</p>

                      {profile.canDonatePlatelet && (
                        <span className="text-xs text-blue-600">
                          Platelets ✓
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`badge ${availColor[profile.availability]}`}>
                        {availLabel[profile.availability]}
                      </span>

                      {d.phone && (
                        <a href={`tel:${d.phone}`} className="block text-blue-600 text-xs">
                          Call
                        </a>
                      )}
                    </div>

                  </motion.div>
                );
              })}

              {donors.length === 0 && (
                <div className="text-center text-gray-500">
                  No donors found
                </div>
              )}

            </div>

          )}

        </div>
      )}

      {/* HISTORY TAB */}
      {tab === 'history' && (
        <div>
          {loadingReqs ? <LoadingSpinner /> : (
            <div>
              {requests.map(r => (
                <div key={r._id} className="card">
                  <p>{r.bloodGroup}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}