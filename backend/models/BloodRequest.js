/*
const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  rhFactor: String,
  type: { type: String, enum: ['whole_blood', 'platelets', 'plasma'], required: true },
  urgency: { type: String, enum: ['emergency', 'routine'], default: 'routine' },
  units: { type: Number, default: 1 },
  hospitalName: String,
  hospitalAddress: String,
  location: {
    city: String,
    district: String,
    state: String,
    pinCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  radius: { type: Number, default: 25 }, // km
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'cancelled', 'expired'],
    default: 'active'
  },
  responses: [{
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['accepted', 'declined', 'maybe'], default: 'maybe' },
    respondedAt: Date,
    message: String
  }],
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
*/

// new code 

const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  bloodGroup: { 
    type: String, 
    required: true 
  },

  rhFactor: String,

  // ✅ FIXED TYPE (no change, just kept correct)
  type: { 
    type: String, 
    enum: ['whole_blood', 'platelets', 'plasma'], 
    required: true 
  },

  // 🔥 FIXED URGENCY (THIS WAS YOUR MAIN BUG)
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'emergency'], 
    default: 'medium' 
  },

  units: { 
    type: Number, 
    default: 1 
  },

  hospitalName: String,
  hospitalAddress: String,

  location: {
    city: String,
    district: String,
    state: String,
    pinCode: String,
    coordinates: { 
      lat: Number, 
      lng: Number 
    }
  },

  radius: { 
    type: Number, 
    default: 25 
  },

  status: {
    type: String,
    enum: ['active', 'fulfilled', 'cancelled', 'expired'],
    default: 'active'
  },

  responses: [{
    donor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },

    status: { 
      type: String, 
      enum: ['accepted', 'declined', 'maybe'], 
      default: 'maybe' 
    },

    respondedAt: Date,
    message: String
  }],

  fulfilledBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },

  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) 
  },

  notes: String

}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);