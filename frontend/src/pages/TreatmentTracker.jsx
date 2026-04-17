import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiPlus, FiTrash2, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { treatmentAPI } from '../utils/api';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const types = [
  { value: 'chemotherapy', label: 'Chemotherapy', labelH: 'कीमोथेरेपी', emoji: '💊', color: 'bg-purple-100 text-purple-700' },
  { value: 'radiotherapy', label: 'Radiotherapy', labelH: 'रेडियोथेरेपी', emoji: '☢️', color: 'bg-orange-100 text-orange-700' },
  { value: 'surgery', label: 'Surgery', labelH: 'सर्जरी', emoji: '🔪', color: 'bg-red-100 text-red-700' },
  { value: 'followup', label: 'Follow-up Visit', labelH: 'फॉलोअप', emoji: '👨‍⚕️', color: 'bg-blue-100 text-blue-700' },
  { value: 'labtest', label: 'Lab Test', labelH: 'लैब टेस्ट', emoji: '🧪', color: 'bg-teal-100 text-teal-700' },
  { value: 'medication', label: 'Medication', labelH: 'दवाई', emoji: '💉', color: 'bg-green-100 text-green-700' },
  { value: 'other', label: 'Other', labelH: 'अन्य', emoji: '📋', color: 'bg-gray-100 text-gray-700' },
];

const defaultForm = {
  type: 'chemotherapy', title: '', dateTime: '', hospital: '', doctor: '',
  isRecurring: false, recurringInterval: '', notes: '',
  reminders: { oneDayBefore: true, oneHourBefore: true, onTheDay: true }
};

export default function TreatmentTracker() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => { loadTreatments(); }, []);

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const data = await treatmentAPI.getAll();
      setTreatments(data.treatments || []);
    } catch { setTreatments([]); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.dateTime) return toast.error('Please fill title and date');
    setSaving(true);
    try {
      await treatmentAPI.create(form);
      toast.success('Treatment added! / इलाज जोड़ा गया!');
      setShowForm(false);
      setForm(defaultForm);
      loadTreatments();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const markComplete = async (id) => {
    try {
      await treatmentAPI.update(id, { status: 'completed' });
      setTreatments(ts => ts.map(t => (t.id || t._id) === id ? { ...t, status: 'completed' } : t));
      toast.success('Marked as completed ✅');
    } catch (err) { toast.error(err.message); }
  };

  const deleteTreatment = async (id) => {
    try {
      await treatmentAPI.delete(id);
      setTreatments(ts => ts.filter(t => (t.id || t._id) !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  const getTypeInfo = (type) => types.find(t => t.value === type) || types[6];

  const formatDate = (dt) => {
    const d = new Date(dt);
    if (isToday(d)) return '🔴 Today';
    if (isTomorrow(d)) return '🟡 Tomorrow';
    if (isPast(d)) return `⏰ ${format(d, 'dd MMM')}`;
    const diff = differenceInDays(d, new Date());
    return `${diff}d • ${format(d, 'dd MMM')}`;
  };

  const upcoming = treatments.filter(t => t.status === 'upcoming');
  const completed = treatments.filter(t => t.status === 'completed');

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title">Treatment Tracker</h2>
          <p className="text-gray-500 text-sm">इलाज का शेड्यूल / Schedule</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-brand-600">{upcoming.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Upcoming</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-green-600">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Completed</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-orange-500">{treatments.filter(t => isPast(new Date(t.dateTime)) && t.status === 'upcoming').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Missed</p>
        </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-amber-500 border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
                <h3 className="font-display font-bold text-gray-900">Add Treatment / इलाज जोड़ें</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><FiX size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                {/* Type picker */}
                <div>
                  <label className="label">Type / प्रकार</label>
                  <div className="grid grid-cols-4 gap-2">
                    {types.map(t => (
                      <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, type: t.value }))}
                        className={`p-2 rounded-xl border-2 text-center transition-all ${form.type === t.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="text-xl">{t.emoji}</div>
                        <div className="text-xs font-medium text-gray-700 mt-0.5 leading-tight">{t.labelH}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Title / शीर्षक *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Chemotherapy Cycle 3" className="input-field" />
                </div>
                <div>
                  <label className="label">Date & Time / तारीख और समय *</label>
                  <input type="datetime-local" value={form.dateTime} onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))}
                    className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Hospital</label>
                    <input value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}
                      placeholder="Hospital name" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="label">Doctor</label>
                    <input value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}
                      placeholder="Dr. Name" className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="label">Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2} className="input-field resize-none text-sm" placeholder="Any special notes..." />
                </div>
                {/* Reminders */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Reminders / याद दिलाएं</p>
                  {[['oneDayBefore', '1 day before / 1 दिन पहले'], ['oneHourBefore', '1 hour before / 1 घंटा पहले'], ['onTheDay', 'On the day / उस दिन']].map(([key, lbl]) => (
                    <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" checked={form.reminders[key]}
                        onChange={e => setForm(f => ({ ...f, reminders: { ...f.reminders, [key]: e.target.checked } }))}
                        className="w-4 h-4 accent-brand-600" />
                      <span className="text-sm text-gray-700">{lbl}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                  {saving ? 'Saving...' : 'Save Treatment / सेव करें'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Treatment List */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {upcoming.length === 0 && completed.length === 0 && (
            <div className="card text-center py-10">
              <FiCalendar size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No treatments yet.</p>
              <button onClick={() => setShowForm(true)} className="btn-primary mt-3">
                <FiPlus size={14} className="inline mr-1" /> Add First Treatment
              </button>
            </div>
          )}

          {upcoming.length > 0 && (
            <>
              <p className="font-semibold text-gray-700 text-sm">Upcoming / आने वाले</p>
              {upcoming.map((t, i) => {
                const typeInfo = getTypeInfo(t.type);
                return (
                  <motion.div key={t.id || t._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="card flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${typeInfo.color}`}>
                      {typeInfo.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                      <p className="text-gray-500 text-xs">{t.hospital} {t.doctor && `• ${t.doctor}`}</p>
                      <p className="text-xs text-gray-400">{t.dateTime && format(new Date(t.dateTime), 'hh:mm a')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-xs font-bold text-brand-600">{t.dateTime && formatDate(t.dateTime)}</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => markComplete(t.id || t._id)} className="w-7 h-7 bg-green-100 text-green-700 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors">
                          <FiCheck size={13} />
                        </button>
                        <button onClick={() => deleteTreatment(t.id || t._id)} className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}

          {completed.length > 0 && (
            <>
              <p className="font-semibold text-gray-500 text-sm mt-4">Completed / पूर्ण</p>
              {completed.slice(0, 5).map(t => {
                const typeInfo = getTypeInfo(t.type);
                return (
                  <div key={t.id || t._id} className="card flex items-center gap-3 opacity-60">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${typeInfo.color}`}>
                      {typeInfo.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700 text-sm line-through">{t.title}</p>
                      <p className="text-gray-400 text-xs">{t.dateTime && format(new Date(t.dateTime), 'dd MMM yyyy')}</p>
                    </div>
                    <span className="badge badge-green">✓ Done</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
      <div className="h-4" />
    </div>
  );
}
