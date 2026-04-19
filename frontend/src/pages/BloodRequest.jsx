import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bloodAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../context/authStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequest() {
  const { user } = useAuthStore(); // ✅ FIXED

  const [tab, setTab] = useState('request');

  // 🩸 Blood Request
  const [form, setForm] = useState({
    bloodGroup: 'A+',
    units: 1,
    hospitalName: ''
  });

  // 🩺 Vitals
  const [vitals, setVitals] = useState({
    platelets: '',
    ANC: '',
    hemoglobin: ''
  });

  const [alerts, setAlerts] = useState({
    platelet: false,
    anc: false,
    engraftment: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  useEffect(() => {
    if (tab === 'matches') loadMatches();
    if (tab === 'history') loadRequests();
  }, [tab]);

  // =========================
  // LOAD MATCHES
  // =========================
  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await bloodAPI.getMatches();
      setMatches(data.requests || []);
    } catch {
      toast.error("Failed to load matches");
      setMatches([]);
    } finally {
      setLoadingMatches(false);
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

  // =========================
  // BLOOD REQUEST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hospitalName) {
      return toast.error("Hospital name required");
    }

    setSubmitting(true);
    try {
      await bloodAPI.createRequest(form);
      toast.success("Request created");
      setTab('history');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // SAVE VITALS
  // =========================
  const saveVitals = async () => {
    if (!user?.id) {
      return toast.error("User not found");
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/vitals/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vitals,
          patientId: user.id
        })
      });

      const data = await res.json();

      setAlerts({
        platelet: data.plateletAlert,
        anc: data.ancAlert,
        engraftment: data.engraftment
      });

    } catch {
      toast.error("Failed to save vitals");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        CareCell Health System
      </h2>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow mb-5">
        {['request', 'matches', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              tab === t ? 'bg-green-500 text-white' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* REQUEST TAB */}
      {tab === 'request' && (
        <div className="space-y-5">

          {/* 🩸 Blood Request */}
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-2">Blood Request</p>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2 rounded-xl border ${
                    form.bloodGroup === bg
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            <input
              placeholder="Hospital Name"
              value={form.hospitalName}
              onChange={e => setForm(f => ({ ...f, hospitalName: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-3"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </div>

          {/* 🩺 Vitals */}
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-3">Daily Vitals</p>

            <input
              placeholder="Platelets"
              value={vitals.platelets}
              onChange={e => setVitals(v => ({ ...v, platelets: e.target.value }))}
              className="input-field mb-2"
            />

            <input
              placeholder="ANC"
              value={vitals.ANC}
              onChange={e => setVitals(v => ({ ...v, ANC: e.target.value }))}
              className="input-field mb-2"
            />

            <input
              placeholder="Hemoglobin"
              value={vitals.hemoglobin}
              onChange={e => setVitals(v => ({ ...v, hemoglobin: e.target.value }))}
              className="input-field mb-3"
            />

            <button
              onClick={saveVitals}
              className="w-full bg-green-500 text-white py-2 rounded-xl"
            >
              Save Vitals
            </button>

            {/* Alerts */}
            <div className="mt-3 space-y-2 text-sm">
              {alerts.platelet && <p className="text-red-600 font-semibold">⚠️ Platelets critically low</p>}
              {alerts.anc && <p className="text-red-600 font-semibold">⚠️ Infection risk</p>}
              {alerts.engraftment && <p className="text-green-600 font-bold">🎉 Engraftment detected!</p>}
            </div>
          </div>

        </div>
      )}

      {/* MATCHES */}
      {tab === 'matches' && (
        <div>
          {loadingMatches ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {matches.map(r => (
                <div key={r._id} className="bg-white p-4 rounded-2xl shadow-lg">
                  <p className="font-bold text-green-700">{r.bloodGroup}</p>
                  <p className="text-sm text-gray-500">{r.hospitalName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div>
          {loadingReqs ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r._id} className="bg-white p-4 rounded-2xl shadow">
                  <p className="font-bold">{r.bloodGroup}</p>
                  <p className="text-sm">{r.hospitalName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}