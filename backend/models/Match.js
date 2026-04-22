// new file created on 22 aprail
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest',
    required: true
  },

  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },

  distance: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Match', matchSchema);