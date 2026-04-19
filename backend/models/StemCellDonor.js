const mongoose = require('mongoose');

const stemCellSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  donorType: String,
  availability: Boolean,

  hlaA: String,
  hlaB: String,
  hlaC: String,
  hlaDRB1: String,
  hlaDQB1: String,

  donationStatus: {
    type: String,
    default: 'REGISTERED'
  }
});

module.exports = mongoose.model('StemCellDonor', stemCellSchema);