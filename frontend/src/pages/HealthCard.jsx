import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiEdit2, FiSave, FiX, FiPlus } from 'react-icons/fi';
import { patientAPI } from '../utils/api';
import useAuthStore from '../context/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const bloodGroups = ['A', 'B', 'AB', 'O'];
const rhFactors = ['+', '-'];
const cancerStages = ['Stage I', 'Stage II', 'Stage III', 'Stage IV', 'Not specified'];

export default function HealthCard() {
  const { user } = useAuthStore();
  const [card, setCard] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef();
  const [form, setForm] = useState({
    bloodGroup: 'A', rhFactor: '+', cancerType: '', cancerStage: 'Stage I',
    allergies: [], emergencyContacts: [{ name: '', phone: '', relation: '' }],
    hospitalName: '', doctorName: ''
  });

  useEffect(() => {
    patientAPI.getHealthCard().then(d => {
      if (d.healthCard) { setCard(d.healthCard); setForm(d.healthCard); }
      else setEditing(true);
    }).catch(() => setEditing(true)).finally(() => setLoading(false));
  }, []);

  const addContact = () => setForm(f => ({ ...f, emergencyContacts: [...f.emergencyContacts, { name: '', phone: '', relation: '' }] }));
  const removeContact = (i) => setForm(f => ({ ...f, emergencyContacts: f.emergencyContacts.filter((_, idx) => idx !== i) }));
  const updateContact = (i, k, v) => setForm(f => {
    const arr = [...f.emergencyContacts];
    arr[i] = { ...arr[i], [k]: v };
    return { ...f, emergencyContacts: arr };
  });

  const handleSave = async () => {
    if (!form.cancerType) return toast.error('Please enter cancer type');
    setSaving(true);
    try {
      const data = await patientAPI.saveHealthCard(form);
      setCard(data.healthCard);
      setEditing(false);
      toast.success('Health card saved! / हेल्थ कार्ड सेव हुआ!');
    } catch (err) {
      toast.error(err.message);
    } finally { setSaving(false); }
  };

  const downloadCard = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = 'CareCell_Health_Card.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Card downloaded!');
    } catch { toast.error('Download failed. Try screenshot.'); }
  };

  if (loading) return <LoadingSpinner />;

  const qrValue = card ? JSON.stringify({
    pid: user?.id, bg: card.bloodGroup, rh: card.rhFactor,
    ct: card.cancerType, cs: card.cancerStage, al: card.allergies,
    ec: card.emergencyContacts?.map(c => ({ n: c.name, p: c.phone }))
  }) : '';

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title">Health Card / हेल्थ कार्ड</h2>
          <p className="text-gray-500 text-sm">Digital ID with QR Code</p>
        </div>
        {card && !editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <FiEdit2 size={14} /> Edit
          </button>
        )}
      </div>

      {/* Card Preview */}
      {card && !editing && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div ref={cardRef} className="relative overflow-hidden rounded-3xl shadow-xl mb-4" style={{ background: 'linear-gradient(135deg, #c80d0d 0%, #881414 100%)' }}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-12 -translate-x-8" />

            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">CareCell Network</p>
                  <h3 className="text-white text-xl font-display font-bold">{user?.name}</h3>
                  <p className="text-white/80 text-sm">🏥 {card.cancerType} • {card.cancerStage}</p>
                </div>
                <div className="bg-white p-2 rounded-2xl shadow-lg">
                  <QRCodeSVG value={qrValue || 'carecell'} size={80} fgColor="#881414" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/70 text-xs mb-1">Blood Group / रक्त समूह</p>
                  <p className="text-white text-2xl font-display font-bold">{card.bloodGroup}{card.rhFactor}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/70 text-xs mb-1">Doctor / डॉक्टर</p>
                  <p className="text-white font-semibold text-sm">{card.doctorName || 'Not specified'}</p>
                  <p className="text-white/70 text-xs">{card.hospitalName || ''}</p>
                </div>
              </div>

              {/* Allergies */}
              {card.allergies?.length > 0 && (
                <div className="bg-yellow-500/30 backdrop-blur-sm rounded-2xl p-3 mb-3">
                  <p className="text-yellow-100 text-xs font-semibold mb-1">⚠️ Allergies / एलर्जी</p>
                  <p className="text-white text-sm">{card.allergies.join(', ')}</p>
                </div>
              )}

              {/* Emergency Contacts */}
              {card.emergencyContacts?.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/70 text-xs mb-2">Emergency Contact / आपात संपर्क</p>
                  {card.emergencyContacts.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">{c.name} ({c.relation})</p>
                      <p className="text-white/80 text-sm">{c.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={downloadCard} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiDownload size={16} /> Download Card
            </button>
            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center justify-center gap-2 px-4">
              <FiEdit2 size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Edit Form */}
      {editing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Blood Group */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 mb-3">Blood Group / रक्त समूह *</h4>
            <div className="flex gap-2 flex-wrap">
              {bloodGroups.map(bg => (
                <button key={bg} onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                  className={`w-12 h-12 rounded-xl font-bold text-lg border-2 transition-all ${form.bloodGroup === bg ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {bg}
                </button>
              ))}
              {rhFactors.map(rh => (
                <button key={rh} onClick={() => setForm(f => ({ ...f, rhFactor: rh }))}
                  className={`w-12 h-12 rounded-xl font-bold text-xl border-2 transition-all ${form.rhFactor === rh ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {rh}
                </button>
              ))}
            </div>
            <p className="mt-2 text-gray-500 text-sm">Selected: <strong>{form.bloodGroup}{form.rhFactor}</strong></p>
          </div>

          {/* Cancer Info */}
          <div className="card space-y-3">
            <h4 className="font-semibold text-gray-800">Cancer Info / कैंसर जानकारी</h4>
            <div>
              <label className="label">Cancer Type / कैंसर का प्रकार *</label>
              <input value={form.cancerType} onChange={e => setForm(f => ({ ...f, cancerType: e.target.value }))}
                placeholder="e.g. Breast Cancer, Blood Cancer" className="input-field" />
            </div>
            <div>
              <label className="label">Stage / स्तर</label>
              <div className="flex flex-wrap gap-2">
                {cancerStages.map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, cancerStage: s }))}
                    className={`px-3 py-1.5 rounded-xl text-sm border-2 transition-all font-medium ${form.cancerStage === s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="card">
            <h4 className="font-semibold text-gray-800 mb-3">Allergies / एलर्जी</h4>
            <input
              placeholder="Comma separated: penicillin, shellfish, contrast dye"
              value={form.allergies?.join(', ') || ''}
              onChange={e => setForm(f => ({ ...f, allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean) }))}
              className="input-field"
            />
          </div>

          {/* Hospital & Doctor */}
          <div className="card space-y-3">
            <h4 className="font-semibold  text-gray-800">Hospital & Doctor</h4>
            <input value={form.hospitalName || ''} onChange={e => setForm(f => ({ ...f, hospitalName: e.target.value }))}
              placeholder="Hospital name / अस्पताल का नाम" className="input-field" />
            <input value={form.doctorName || ''} onChange={e => setForm(f => ({ ...f, doctorName: e.target.value }))}
              placeholder="Doctor's name / डॉक्टर का नाम" className="input-field" />
          </div>

          {/* Emergency Contacts */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Emergency Contacts / आपात संपर्क</h4>
              <button onClick={addContact} className="text-brand-600 flex items-center gap-1 text-sm font-semibold">
                <FiPlus size={14} /> Add
              </button>
            </div>
            {form.emergencyContacts?.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 mb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Contact {i + 1}</span>
                  {i > 0 && <button onClick={() => removeContact(i)} className="text-red-500"><FiX size={16} /></button>}
                </div>
                <input value={c.name} onChange={e => updateContact(i, 'name', e.target.value)}
                  placeholder="Name / नाम" className="input-field text-sm py-2" />
                <input value={c.phone} type="tel" onChange={e => updateContact(i, 'phone', e.target.value)}
                  placeholder="Phone / फोन" className="input-field text-sm py-2" maxLength={10} />
                <input value={c.relation} onChange={e => updateContact(i, 'relation', e.target.value)}
                  placeholder="Relation / रिश्ता (e.g. wife, son)" className="input-field text-sm py-2" />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Card / सेव करें'}
            </button>
            {card && <button onClick={() => setEditing(false)} className="btn-secondary px-4">Cancel</button>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
