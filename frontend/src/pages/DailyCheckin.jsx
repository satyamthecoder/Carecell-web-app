import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { checkinAPI, aiAPI } from '../utils/api';

const wellbeingEmojis = ['😫', '😟', '😐', '🙂', '😊'];
const wellbeingLabels = ['बहुत बुरा', 'बुरा', 'ठीक', 'अच्छा', 'बहुत अच्छा'];

export default function DailyCheckin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [wellbeing, setWellbeing] = useState(3);
  const [symptoms, setSymptoms] = useState({
    fever: { present: false, severity: 'mild' },
    pain: { present: false, location: '', severity: 'mild' },
    bleeding: { present: false },
    vomiting: { present: false },
    confusion: { present: false },
    fatigue: { present: false, severity: 'mild' },
    nausea: { present: false },
    breathingDifficulty: { present: false },
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSymptom = (key) => {
    setSymptoms(s => ({ ...s, [key]: { ...s[key], present: !s[key].present } }));
  };
  const setSeverity = (key, severity) => {
    setSymptoms(s => ({ ...s, [key]: { ...s[key], severity } }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const checkinData = { wellbeing, symptoms, notes };
      const [ciRes] = await Promise.allSettled([
        checkinAPI.submit(checkinData),
        aiAPI.buddyAssessment(checkinData)
      ]);

      if (ciRes.status === 'fulfilled') {
        const r = ciRes.value;
        setResult({
          riskLevel: r.riskLevel,
          aiAssessment: r.aiAssessment,
          actions: r.actions || []
        });
        setStep(3);
        toast.success('Check-in submitted!');
      }
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    } finally { setLoading(false); }
  };

  const symptomItems = [
    { key: 'fever', label: 'Fever / बुखार', emoji: '🌡️', hasSeverity: true },
    { key: 'pain', label: 'Pain / दर्द', emoji: '🤕', hasSeverity: true },
    { key: 'vomiting', label: 'Vomiting / उल्टी', emoji: '🤢', hasSeverity: false },
    { key: 'bleeding', label: 'Bleeding / रक्तस्राव', emoji: '🩸', hasSeverity: false },
    { key: 'fatigue', label: 'Fatigue / थकान', emoji: '😴', hasSeverity: true },
    { key: 'nausea', label: 'Nausea / जी मिचलाना', emoji: '🤮', hasSeverity: false },
    { key: 'confusion', label: 'Confusion / भ्रम', emoji: '😵', hasSeverity: false },
    { key: 'breathingDifficulty', label: 'Breathing Difficulty / सांस लेने में तकलीफ', emoji: '😮‍💨', hasSeverity: false },
  ];

  const riskColors = { critical: 'bg-red-600', high: 'bg-orange-500', moderate: 'bg-yellow-500', low: 'bg-green-500' };
  const riskLabels = {
    critical: '🚨 अभी अस्पताल जाएं',
    high: '😟 डॉक्टर से मिलें',
    moderate: '⚠️ ध्यान दें',
    low: '✅ आप ठीक हैं'
  };

  return (
    <div className="page-container">
      <div className="mb-5">
        <h2 className="section-title">Daily Check-in</h2>
        <p className="text-gray-500 text-sm">आज आप कैसा महसूस कर रहे हैं?</p>
      </div>

      {/* Step indicator */}
      {step < 3 && (
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-600' : 'bg-gray-200'}`} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 0: Wellbeing */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card text-center mb-4">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">आज का मूड</h3>
              <p className="text-gray-500 text-sm mb-6">1 से 5 में बताएं आप कैसा महसूस कर रहे हैं</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {wellbeingEmojis.map((e, i) => (
                  <button key={i} onClick={() => setWellbeing(i + 1)}
                    className={`w-14 h-14 text-3xl rounded-2xl transition-all ${wellbeing === i + 1 ? 'bg-brand-50 border-2 border-brand-500 scale-110' : 'hover:bg-gray-50 border-2 border-transparent'}`}>
                    {e}
                  </button>
                ))}
              </div>
              <p className="text-lg font-bold text-gray-700">{wellbeingLabels[wellbeing - 1]}</p>
              <p className="text-gray-400 text-sm">{wellbeing}/5</p>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Next →</button>
          </motion.div>
        )}

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-display font-bold text-gray-900 text-lg mb-3">Symptoms / लक्षण</h3>
            <p className="text-gray-500 text-sm mb-4">कोई भी लक्षण हो तो चुनें</p>
            <div className="space-y-2 mb-5">
              {symptomItems.map(({ key, label, emoji, hasSeverity }) => (
                <div key={key} className={`card transition-all ${symptoms[key].present ? 'border-brand-300 bg-brand-50/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <span className="flex-1 font-medium text-gray-800 text-sm">{label}</span>
                    <button onClick={() => toggleSymptom(key)}
                      className={`w-12 h-6 rounded-full transition-all relative ${symptoms[key].present ? 'bg-brand-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${symptoms[key].present ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {symptoms[key].present && hasSeverity && (
                    <div className="flex gap-2 mt-2 pl-10">
                      {['mild', 'moderate', 'severe'].map(sev => (
                        <button key={sev} onClick={() => setSeverity(key, sev)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${symptoms[key].severity === sev ? 'bg-brand-100 border-brand-400 text-brand-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                          {sev === 'mild' ? 'हल्का' : sev === 'moderate' ? 'मध्यम' : 'गंभीर'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary px-6">← Back</button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Next →</button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Notes */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Any notes? / कोई बात?</h3>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="कुछ और बताना चाहते हैं? (optional)"
                rows={4} className="input-field resize-none" />
            </div>
            <div className="card mb-4 bg-gray-50">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Summary / सारांश</h4>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{wellbeingEmojis[wellbeing - 1]}</span>
                <span className="text-sm text-gray-700">Wellbeing: {wellbeing}/5 – {wellbeingLabels[wellbeing - 1]}</span>
              </div>
              {Object.entries(symptoms).filter(([, v]) => v.present).length > 0 ? (
                <p className="text-sm text-gray-600">
                  Symptoms: {Object.entries(symptoms).filter(([, v]) => v.present).map(([k]) => k).join(', ')}
                </p>
              ) : (
                <p className="text-sm text-green-600">No symptoms reported ✅</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary px-6">← Back</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3">
                {loading ? 'Submitting...' : 'Submit / जमा करें'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`${riskColors[result.riskLevel]} text-white rounded-3xl p-6 text-center mb-5 shadow-lg`}>
              <p className="text-4xl mb-3">{result.riskLevel === 'low' ? '✅' : result.riskLevel === 'moderate' ? '⚠️' : result.riskLevel === 'high' ? '😟' : '🚨'}</p>
              <h3 className="text-xl font-display font-bold mb-2">{riskLabels[result.riskLevel]}</h3>
              <p className="text-white/90 text-sm">{result.aiAssessment}</p>
            </div>

            {(result.riskLevel === 'critical' || result.riskLevel === 'high') && (
              <button onClick={() => navigate('/emergency')}
                className="btn-emergency w-full mb-3 flex items-center justify-center gap-2">
                🚑 Go to Emergency / आपात मोड
              </button>
            )}

            <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full py-3">
              Back to Home / होम पर जाएं
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
