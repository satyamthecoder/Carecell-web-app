const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['chemotherapy', 'radiotherapy', 'surgery', 'followup', 'labtest', 'medication', 'other'],
    required: true
  },
  title: { type: String, required: true },
  description: String,
  dateTime: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
  recurringInterval: String, // "every 2 weeks", "weekly", etc.
  hospital: String,
  doctor: String,
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed', 'cancelled'],
    default: 'upcoming'
  },
  reminders: {
    oneDayBefore: { type: Boolean, default: true },
    oneHourBefore: { type: Boolean, default: true },
    onTheDay: { type: Boolean, default: true }
  },
  notes: String,
  result: String // post-treatment notes
}, { timestamps: true });

module.exports = mongoose.model('Treatment', treatmentSchema);
