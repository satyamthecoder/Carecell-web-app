/*port React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiDroplet, FiCheck, FiMapPin } from 'react-icons/fi';
import { donorAPI, bloodAPI } from '../utils/api';
import useAuthStore from '../context/authStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorProfile() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    bloodGroup: user?.donorProfile?.bloodGroup || 'O+',
    canDonatePlatelet: user?.donorProfile?.canDonatePlatelet || false,
    lastDonationDate: user?.donorProfile?.lastDonationDate?.slice(0, 10) || '',
    availability: user?.donorProfile?.availability || 'available',
    village: user?.donorProfile?.village || '',
    city: user?.donorProfile?.city || '',
    pinCode: user?.donorProfile?.pinCode || '',
  });
  const [saving, setSaving] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  const loadActiveRequests = async () => {
    setLoadingReqs(true);
    try {
      const data = await bloodAPI.getActiveRequests();
      setActiveRequests(data.requests || []);
    } catch { setActiveRequests([]); }
    finally { setLoadingReqs(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await donorAPI.registerDonor(form);
      updateUser({ donorProfile: form, role: 'donor' });
      toast.success('Donor profile saved! / डोनर प्रोफाइल सेव हुई!');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleRespond = async (id, status) => {
    try {
      await bloodAPI.respond(id, { status });
      toast.success(status === 'accepted' ? '✅ You accepted to donate!' : '❌ Declined');
      setActiveRequests(rs => rs.filter(r => (r.id || r._id) !== id));
    } catch (err) { toast.error(err.message); }
  };

  const availOpts = [
    { value: 'available', label: '✅ Available / उपलब्ध', color: 'border-green-500 bg-green-50 text-green-700' },
    { value: 'routine_only', label: '📅 Routine Only', color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
    { value: 'unavailable', label: '❌ Unavailable / अनुपलब्ध', color: 'border-red-300 bg-red-50 text-red-600' },
  ];

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="section-title">Donor Profile / डोनर प्रोफाइल</h2>
        <p className="text-gray-500 text-sm">Register as blood & platelet donor</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
        {[{ key: 'profile', label: '👤 My Profile' }, { key: 'requests', label: '🩸 Active Needs', action: loadActiveRequests }].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); t.action?.(); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSave} className="space-y-4">
//        {/* Blood Group *//*
          <div className="card">
            <label className="label">Blood Group / रक्त समूह *</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map(bg => (
                <button key={bg} type="button" onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${form.bloodGroup === bg ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-700'}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

//        {/* Platelet Donation *//*
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Platelet Donation / प्लेटलेट दान</p>
                <p className="text-gray-500 text-xs mt-0.5">Can you donate platelets too?</p>
              </div>
              <button type="button" onClick={() => setForm(f => ({ ...f, canDonatePlatelet: !f.canDonatePlatelet }))}
                className={`w-14 h-7 rounded-full relative transition-colors ${form.canDonatePlatelet ? 'bg-brand-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${form.canDonatePlatelet ? 'left-8' : 'left-1'}`} />
              </button>
            </div>
          </div>

   //     {/* Availability *//*
          <div className="card">
            <label className="label">Availability / उपलब्धता</label>
            <div className="space-y-2">
              {availOpts.map(a => (
                <button key={a.value} type="button" onClick={() => setForm(f => ({ ...f, availability: a.value }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${form.availability === a.value ? a.color : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  <span className="font-semibold text-sm">{a.label}</span>
                  {form.availability === a.value && <FiCheck size={16} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Last Donation *//*
          <div className="card">
            <label className="label">Last Donation Date / आखिरी दान की तारीख</label>
            <input type="date" value={form.lastDonationDate} onChange={e => setForm(f => ({ ...f, lastDonationDate: e.target.value }))}
              className="input-field" max={new Date().toISOString().slice(0, 10)} />
            <p className="text-gray-400 text-xs mt-1">Minimum 56 days gap between whole blood donations</p>
          </div>

          {/* Location *//*
          <div className="card space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2"><FiMapPin size={16} /> Location / स्थान</h4>
            <input value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
              placeholder="Village / गाँव (optional)" className="input-field text-sm" />
            <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              placeholder="City / शहर *" className="input-field text-sm" />
            <input value={form.pinCode} onChange={e => setForm(f => ({ ...f, pinCode: e.target.value }))}
              placeholder="PIN Code" className="input-field text-sm" maxLength={6} />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <FiDroplet size={16} />
            {saving ? 'Saving...' : 'Save Donor Profile / सेव करें'}
          </button>
        </motion.form>
      )}

      {tab === 'requests' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {loadingReqs ? (
            <div className="card text-center py-8 text-gray-400">Loading active requests...</div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map(req => (
                <div key={req.id || req._id} className={`card ${req.urgency === 'emergency' ? 'border-red-300 bg-red-50/30' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-brand-700">{req.bloodGroup}</span>
                        {req.urgency === 'emergency' && <span className="badge badge-red animate-pulse">🚨 Emergency</span>}
                      </div>
                      <p className="text-gray-700 font-medium text-sm">{req.type?.replace('_', ' ')} • {req.units} unit(s)</p>
                      <p className="text-gray-500 text-xs">{req.hospitalName} • {req.distance} km away</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{req.city}</p>
                      <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(req.id || req._id, 'accepted')}
                      className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                      ✅ I can donate / मैं दान कर सकता हूँ
                    </button>
                    <button onClick={() => handleRespond(req.id || req._id, 'declined')}
                      className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
                      ❌
                    </button>
                  </div>
                </div>
              ))}
              {activeRequests.length === 0 && (
                <div className="card text-center py-10">
                  <p className="text-4xl mb-3">🩸</p>
                  <p className="text-gray-500">No active blood requests nearby. Check back later.</p>
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
*/


/// new code 
import React, { useState, useEffect } from "react";
import { donorAPI } from "../utils/api";
import useAuthStore from "../context/authStore";

export default function DonorProfile() {
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState({
    bloodGroup: "",
    city: "",
    pinCode: "",
    canDonatePlatelet: false,
    availability: "available",
  });

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD EXISTING DATA (CRITICAL FIX)
  useEffect(() => {
    if (user?.donorProfile) {
      setForm({
        bloodGroup: user.donorProfile.bloodGroup || "",
        city: user.donorProfile.city || "",
        pinCode: user.donorProfile.pinCode || "",
        canDonatePlatelet: user.donorProfile.canDonatePlatelet || false,
        availability: user.donorProfile.availability || "available",
      });
    }

    setIsActive(user?.isActiveDonor || false);
  }, [user]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔥 SAVE PROFILE (FIXED SYNC)
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await donorAPI.registerDonor(form);

      // 🔥 UPDATE GLOBAL USER STATE
      if (res?.user) {
        localStorage.setItem("carecell_user", JSON.stringify(res.user));
        setUser(res.user);
      }

      alert("Donor profile saved");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TOGGLE ACTIVE (FIXED SYNC)
  const toggleActive = async () => {
    try {
      const newStatus = !isActive;

      const res = await donorAPI.toggleActive({ isActive: newStatus });

      setIsActive(res.isActiveDonor);

      // 🔥 UPDATE USER STATE
      const updatedUser = {
        ...user,
        isActiveDonor: res.isActiveDonor
      };

      localStorage.setItem("carecell_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2 className="section-title">🩸 Donor Profile</h2>

      {/* FORM */}
      <div className="card space-y-3">

        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
          <option>A-</option>
          <option>B-</option>
          <option>O-</option>
          <option>AB-</option>
        </select>

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="input-field"
        />

        <input
          name="pinCode"
          placeholder="Pin Code"
          value={form.pinCode}
          onChange={handleChange}
          className="input-field"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="canDonatePlatelet"
            checked={form.canDonatePlatelet}
            onChange={handleChange}
          />
          Can Donate Platelets
        </label>

        <button onClick={handleSave} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* 🔥 ACTIVE BUTTON */}
      <div className="card mt-4 text-center">
        <p className="mb-2">
          Status:
          <span className={isActive ? "text-green-600" : "text-gray-500"}>
            {isActive ? " Active" : " Offline"}
          </span>
        </p>

        <button
          onClick={toggleActive}
          className={`w-full ${
            isActive ? "bg-red-500" : "bg-green-600"
          } text-white py-2 rounded-lg`}
        >
          {isActive ? "Go Offline" : "Go Active"}
        </button>
      </div>
    </div>
  );
}
