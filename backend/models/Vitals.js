const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  platelets: Number,
  ANC: Number,
  hemoglobin: Number
});

module.exports = mongoose.model('Vitals', vitalsSchema);