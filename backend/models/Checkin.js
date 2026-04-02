const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  wellbeing: { type: Number, min: 1, max: 5, required: true },
  symptoms: {
    fever: { present: Boolean, severity: { type: String, enum: ['mild', 'moderate', 'high'] } },
    pain: { present: Boolean, location: String, severity: { type: String, enum: ['mild', 'moderate', 'severe'] } },
    bleeding: { present: Boolean },
    vomiting: { present: Boolean },
    confusion: { present: Boolean },
    fatigue: { present: Boolean, severity: { type: String, enum: ['mild', 'moderate', 'severe'] } },
    nausea: { present: Boolean },
    breathingDifficulty: { present: Boolean }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'low'
  },
  aiAssessment: String,
  actionTaken: String,
  notes: String
}, { timestamps: true });

// Auto-calculate risk level
checkinSchema.pre('save', function(next) {
  const s = this.symptoms;
  let score = 0;
  if (this.wellbeing <= 2) score += 2;
  if (s.fever?.present && s.fever.severity === 'high') score += 3;
  if (s.fever?.present) score += 1;
  if (s.bleeding?.present) score += 3;
  if (s.confusion?.present) score += 3;
  if (s.breathingDifficulty?.present) score += 3;
  if (s.vomiting?.present) score += 2;
  if (s.pain?.present && s.pain.severity === 'severe') score += 2;

  if (score >= 7) this.riskLevel = 'critical';
  else if (score >= 4) this.riskLevel = 'high';
  else if (score >= 2) this.riskLevel = 'moderate';
  else this.riskLevel = 'low';

  next();
});

module.exports = mongoose.model('Checkin', checkinSchema);
