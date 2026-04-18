import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';
//import { nutritionAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const cancerTypes = [
  { value: 'breast_cancer', label: 'Breast Cancer', labelH: 'स्तन कैंसर', emoji: '🎗️' },
  { value: 'blood_cancer', label: 'Blood Cancer', labelH: 'रक्त कैंसर', emoji: '🩸' },
  { value: 'lung_cancer', label: 'Lung Cancer', labelH: 'फेफड़ों का कैंसर', emoji: '🫁' },
  { value: 'cervical_cancer', label: 'Cervical Cancer', labelH: 'सर्वाइकल', emoji: '🔵' },
];

const phases = [
  { value: 'during_chemo', label: 'During Chemo', labelH: 'कीमो के दौरान', emoji: '💊' },
  { value: 'recovery', label: 'Recovery', labelH: 'ठीक होने पर', emoji: '🌱' },
];

const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };
const mealLabels = { breakfast: 'Breakfast / सुबह', lunch: 'Lunch / दोपहर', dinner: 'Dinner / रात', snacks: 'Snacks / नाश्ता' };

export default function Nutrition() {
  const [tab, setTab] = useState('diet');
  const [cancerType, setCancerType] = useState('breast_cancer');
  const [phase, setPhase] = useState('during_chemo');
  const [plan, setPlan] = useState(null);
  const [proteins, setProteins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'diet') loadDiet();
    if (tab === 'protein') loadProteins();
  }, [tab, cancerType, phase]);

  const loadDiet = async () => {
    setLoading(true);
    try {
      const data = await nutritionAPI.getDietPlan(cancerType, phase);
      setPlan(data.plan);
    } catch { setPlan(null); }
    finally { setLoading(false); }
  };

  const loadProteins = async () => {
    setLoading(true);
    try {
      const data = await nutritionAPI.getHighProteinFoods();
      setProteins(data.foods || []);
    } catch { setProteins([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="section-title">Nutrition Guide / आहार गाइड</h2>
        <p className="text-gray-500 text-sm">Cancer-specific diet in Hindi</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
        {[{ key: 'diet', label: '🍽️ Diet Plan' }, { key: 'protein', label: '💪 High Protein' }, { key: 'tips', label: '💡 Tips' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Diet Plan Tab */}
      {tab === 'diet' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Cancer Type */}
          <div className="mb-4">
            <p className="label">Cancer Type / कैंसर प्रकार</p>
            <div className="grid grid-cols-2 gap-2">
              {cancerTypes.map(c => (
                <button key={c.value} onClick={() => setCancerType(c.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${cancerType === c.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-lg">{c.emoji}</span>
                  <div className="text-xs font-semibold text-gray-800 mt-1">{c.label}</div>
                  <div className="text-xs text-gray-500">{c.labelH}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Phase */}
          <div className="mb-5">
            <p className="label">Phase / अवस्था</p>
            <div className="flex gap-2">
              {phases.map(p => (
                <button key={p.value} onClick={() => setPhase(p.value)}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${phase === p.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <p className="text-xs font-semibold text-gray-800 mt-1">{p.label}</p>
                  <p className="text-xs text-gray-500">{p.labelH}</p>
                </button>
              ))}
            </div>
          </div>

          {loading ? <LoadingSpinner text="Loading diet plan..." /> : plan && (
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                plan[meal] && (
                  <div key={meal} className="card">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{mealIcons[meal]}</span>
                      <h4 className="font-bold text-gray-900">{mealLabels[meal]}</h4>
                    </div>
                    <div className="space-y-1">
                      {plan[meal].map((item, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Avoid List */}
              {plan.avoid?.length > 0 && (
                <div className="card border-red-200 bg-red-50">
                  <h4 className="font-bold text-red-800 mb-2">❌ Avoid / इनसे बचें</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.avoid.map((a, i) => (
                      <span key={i} className="badge badge-red">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {plan.tips?.length > 0 && (
                <div className="card border-teal-200 bg-teal-50">
                  <h4 className="font-bold text-teal-800 mb-2">💡 Tips / सुझाव</h4>
                  {plan.tips.map((t, i) => (
                    <p key={i} className="text-sm text-teal-800 flex items-start gap-2 mb-1">
                      <span className="flex-shrink-0">✓</span> {t}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* High Protein Tab */}
      {tab === 'protein' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 font-semibold text-sm mb-1">💡 Why Protein? / प्रोटीन क्यों?</p>
            <p className="text-amber-700 text-xs">During cancer treatment, your body needs extra protein to repair tissue and fight infection. अधिक प्रोटीन खाएं।</p>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="space-y-2">
              {proteins.map((food, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="card flex items-center gap-3">
                  <span className="text-2xl">{food.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{food.name}</p>
                    <p className="text-gray-500 text-xs">{food.tips}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-green font-bold">{food.protein}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tips Tab */}
      {tab === 'tips' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {[
            { title: 'Small Meals / छोटे भोजन', emoji: '🍽️', color: 'bg-blue-50 border-blue-200', tips: ['हर 2-3 घंटे में थोड़ा खाएं', 'Eat every 2-3 hours in small portions', 'बड़ा भोजन न करें दोपहर में'] },
            { title: 'Stay Hydrated / पानी पिएं', emoji: '💧', color: 'bg-cyan-50 border-cyan-200', tips: ['रोज 8-10 गिलास पानी पिएं', 'Coconut water is excellent', 'नींबू पानी भी अच्छा है'] },
            { title: 'Iron-rich Foods / आयरन', emoji: '🥬', color: 'bg-green-50 border-green-200', tips: ['पालक, चुकंदर खाएं', 'Pomegranate / अनार', 'Dates / खजूर रोज खाएं'] },
            { title: 'During Nausea / उल्टी जैसा लगे', emoji: '🤢', color: 'bg-yellow-50 border-yellow-200', tips: ['Cold/room temp food is easier', 'ठंडा या सामान्य खाना खाएं', 'Dry toast or crackers / सूखी रोटी'] },
            { title: 'Immunity Boosters / इम्युनिटी', emoji: '🌟', color: 'bg-orange-50 border-orange-200', tips: ['Turmeric milk / हल्दी वाला दूध', 'Ginger tea / अदरक की चाय', 'Garlic / लहसुन रोज खाएं'] },
          ].map((section, i) => (
            <div key={i} className={`card border ${section.color}`}>
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>{section.emoji}</span> {section.title}
              </h4>
              {section.tips.map((tip, j) => (
                <p key={j} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">•</span> {tip}
                </p>
              ))}
            </div>
          ))}
        </motion.div>
      )}

      <div className="mt-4 bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 flex items-start gap-2">
          <FiInfo size={14} className="mt-0.5 flex-shrink-0" />
          Dietary advice here is general guidance. Always consult your oncologist or dietitian for personalized diet plan. / यह सामान्य जानकारी है। अपने डॉक्टर से जरूर पूछें।
        </p>
      </div>
      <div className="h-4" />
    </div>
  );
}
