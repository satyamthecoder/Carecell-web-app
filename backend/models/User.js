
//new code with terms and condition

/*
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // 🪪 BASIC INFO
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  // 🔥 ROLE
  role: {
    type: String,
    enum: ['patient', 'donor'],
    default: 'patient'
  },

  language: {
    type: String,
    enum: ['hindi', 'english', 'marathi', 'bengali'],
    default: 'hindi'
  },

  // 🩸 DONOR PROFILE
  donorProfile: {
    fullName: String,
    dob: Date,
    gender: String,

    bloodGroup: String,
    rhFactor: String,

    city: String,
    state: String,
    address: String,
    pinCode: String,


    diseases: [String],
    allergies: [String],
    surgeries: [String],

    canDonatePlatelet: { type: Boolean, default: false },

    lastDonationDate: Date,

    consent: { type: Boolean, default: false },

    isEligible: { type: Boolean, default: false },

    availability: {
      type: String,
      enum: ['available', 'routine_only', 'unavailable'],
      default: 'unavailable'
    }
  },

  // 📜 TERMS & CONDITIONS (NEW)
  acceptedTerms: {
    type: Boolean,
    default: false
  },

  acceptedAt: {
    type: Date
  },

  termsVersion: {
    type: String,
    default: "v1.0"
  },

  // 📍 LOCATION
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

  // 🔥 DONOR ACTIVE STATUS
  isActiveDonor: { type: Boolean, default: false },

  lastLogin: Date,
  fcmToken: String

}, { timestamps: true });


// 🔐 HASH PASSWORD
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


// 🔑 MATCH PASSWORD
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// 🔒 CLEAN RESPONSE
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);*/



//new code for add hla type and etc 

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // 🪪 BASIC INFO
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  // 🔥 ROLE
  role: {
    type: String,
    enum: ['patient', 'donor'],
    default: 'patient'
  },

  language: {
    type: String,
    enum: ['hindi', 'english', 'marathi', 'bengali'],
    default: 'hindi'
  },

  // 🩸 DONOR PROFILE
  donorProfile: {
    fullName: String,
    dob: Date,
    gender: String,

    bloodGroup: String,
    rhFactor: String,

    city: String,
    state: String,
    address: String,
    pinCode: String,

    diseases: [String],
    allergies: [String],
    surgeries: [String],

    canDonatePlatelet: { type: Boolean, default: false },

    lastDonationDate: Date,

    consent: { type: Boolean, default: false },

    isEligible: { type: Boolean, default: false },

    availability: {
      type: String,
      enum: ['available', 'routine_only', 'unavailable'],
      default: 'unavailable'
    }
  },

  // 📜 TERMS & CONDITIONS (NEW)
  acceptedTerms: {
    type: Boolean,
    default: false
  },

  acceptedAt: {
    type: Date
  },

  termsVersion: {
    type: String,
    default: "v1.0"
  },

  // 📍 LOCATION
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

  // 🔥 DONOR ACTIVE STATUS
  isActiveDonor: { type: Boolean, default: false },

  lastLogin: Date,
  fcmToken: String,

  // 🧬 STEM CELL HLA FIELDS (ADDED ONLY — NO CHANGE)
  hlaA: String,
  hlaB: String,
  hlaC: String,
  hlaDRB1: String,
  hlaDQB1: String

}, { timestamps: true });


// 🔐 HASH PASSWORD
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


// 🔑 MATCH PASSWORD
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// 🔒 CLEAN RESPONSE
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);