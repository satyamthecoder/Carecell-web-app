
/*
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bloodAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../context/authStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequest() {
  const { user } = useAuthStore();

  const [tab, setTab] = useState('request');

  const [form, setForm] = useState({
    bloodGroup: 'A+',
    units: 1,
    hospitalName: '',
    type: 'whole_blood',
    urgency: 'routine'
  });

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
  // SUBMIT REQUEST
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
  // RESPOND
  // =========================
  const respond = async (id, status) => {
    try {
      await bloodAPI.respond(id, { status });
      toast.success("Response sent");
      loadMatches();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // =========================
  // SAVE VITALS
  // =========================
  const saveVitals = async () => {
    if (!user?._id) return toast.error("User missing");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/vitals/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vitals,
          patientId: user._id
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

  // =========================
  // UI HELPERS
  // =========================
  const urgencyColor = (u) => {
    if (u === 'emergency') return 'bg-red-500';
    if (u === 'urgent') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        CareCell Health System
      </h2>

      {/* Tabs *//*
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

      {/* REQUEST *//*
      {tab === 'request' && (
        <div className="space-y-5">

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-2">Blood Request</p>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2 rounded-xl border ${
                    form.bloodGroup === bg ? 'bg-green-500 text-white' : 'bg-gray-50'
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

            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="whole_blood">Whole Blood</option>
              <option value="platelets">Platelets</option>
              <option value="plasma">Plasma</option>
            </select>

            <select
              value={form.urgency}
              onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-3"
            >
              <option value="emergency">Emergency</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
            </select>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </div>

          {/* VITALS *//*
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

            <button onClick={saveVitals} className="w-full bg-green-500 text-white py-2 rounded-xl">
              Save Vitals
            </button>

            <div className="mt-3 space-y-2 text-sm">
              {alerts.platelet && <p className="text-red-600">⚠️ Platelets critically low</p>}
              {alerts.anc && <p className="text-red-600">⚠️ Infection risk</p>}
              {alerts.engraftment && <p className="text-green-600">🎉 Engraftment detected!</p>}
            </div>
          </div>

        </div>
      )}

      {/* MATCHES *//*
      {tab === 'matches' && (
        <div>
          {loadingMatches ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {matches.map((r, i) => (
                <div key={r._id} className={`bg-white p-4 rounded-2xl shadow-lg ${i === 0 ? 'border-2 border-green-500' : ''}`}>

                  <div className="flex justify-between items-center">
                    <p className="font-bold text-green-700">{r.bloodGroup}</p>
                    <span className={`text-white px-2 py-1 rounded text-xs ${urgencyColor(r.urgency)}`}>
                      {r.urgency}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{r.hospitalName}</p>

                  {/* ✅ DISTANCE *//*
                  <p className="text-xs text-gray-400 mt-1">
                    {r.distance ? `${r.distance.toFixed(1)} km away` : "Distance unknown"}
                  </p>

                  {/* ✅ ACTION *//*
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => respond(r._id, "accepted")}
                      className="flex-1 bg-green-500 text-white py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => respond(r._id, "rejected")}
                      className="flex-1 bg-red-500 text-white py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY *//*
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

*/


// new code 



import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bloodAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../context/authStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequest() {
  const { user } = useAuthStore();

  const [tab, setTab] = useState('request');

  const [form, setForm] = useState({
    bloodGroup: 'A+',
    units: 1,
    hospitalName: '',
    type: 'whole_blood',
    urgency: 'medium' // ✅ FIX
  });

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
  // SUBMIT REQUEST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hospitalName) {
      return toast.error("Hospital name required");
    }

    setSubmitting(true);

    try {
      await bloodAPI.createRequest({
        ...form,
        units: Number(form.units), // ✅ FIX
        urgency: form.urgency // must be valid enum
      });

      toast.success("Request created");
      setTab('history');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RESPOND
  // =========================
  const respond = async (id, status) => {
    try {
      await bloodAPI.respond(id, {
        status,
        message: "Available to donate" // ✅ FIX
      });

      toast.success("Response sent");
      loadMatches();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // =========================
  // SAVE VITALS
  // =========================
  const saveVitals = async () => {
    if (!user?._id) return toast.error("User missing");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/vitals/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user._id,
          platelets: Number(vitals.platelets), // ✅ FIX
          ANC: Number(vitals.ANC),             // ✅ FIX
          hemoglobin: Number(vitals.hemoglobin) // ✅ FIX
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

  // =========================
  // UI HELPERS
  // =========================
  const urgencyColor = (u) => {
    if (u === 'emergency') return 'bg-red-500';
    if (u === 'high') return 'bg-orange-500';
    if (u === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        CareCell Health System
      </h2>

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

      {tab === 'request' && (
        <div className="space-y-5">

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-2">Blood Request</p>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {bloodGroups.map(bg => (
                <button
                  key={bg}
                  onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2 rounded-xl border ${
                    form.bloodGroup === bg ? 'bg-green-500 text-white' : 'bg-gray-50'
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

            <input
              type="number"
              placeholder="Units"
              value={form.units}
              onChange={e => setForm(f => ({ ...f, units: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-3"
            />

            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="whole_blood">Whole Blood</option>
              <option value="platelets">Platelets</option>
            </select>

            <select
              value={form.urgency}
              onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
              className="w-full p-2 border rounded-lg mb-3"
            >
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </div>

          {/* VITALS */}
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

            <button onClick={saveVitals} className="w-full bg-green-500 text-white py-2 rounded-xl">
              Save Vitals
            </button>

            <div className="mt-3 space-y-2 text-sm">
              {alerts.platelet && <p className="text-red-600">⚠️ Platelets critically low</p>}
              {alerts.anc && <p className="text-red-600">⚠️ Infection risk</p>}
              {alerts.engraftment && <p className="text-green-600">🎉 Engraftment detected!</p>}
            </div>
          </div>

        </div>
      )}

      {tab === 'matches' && (
        <div>
          {loadingMatches ? <LoadingSpinner /> : (
            <div className="space-y-3">
              {matches.map((r, i) => (
                <div key={r._id} className={`bg-white p-4 rounded-2xl shadow-lg ${i === 0 ? 'border-2 border-green-500' : ''}`}>
                  <div className="flex justify-between">
                    <p className="font-bold text-green-700">{r.bloodGroup}</p>
                    <span className={`text-white px-2 py-1 rounded text-xs ${urgencyColor(r.urgency)}`}>
                      {r.urgency}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">{r.hospitalName}</p>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => respond(r._id, "accepted")} className="flex-1 bg-green-500 text-white py-1 rounded">
                      Accept
                    </button>
                    <button onClick={() => respond(r._id, "rejected")} className="flex-1 bg-red-500 text-white py-1 rounded">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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