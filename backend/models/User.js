/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['patient', 'donor', 'caregiver', 'admin'], default: 'patient' },
  language: { type: String, enum: ['hindi', 'english', 'marathi', 'bengali'], default: 'hindi' },

  // Patient Health Card
  healthCard: {
    bloodGroup: String,
    rhFactor: String,
    cancerType: String,
    cancerStage: String,
    allergies: [String],
    emergencyContacts: [{
      name: String,
      phone: String,
      relation: String
    }],
    hospitalName: String,
    doctorName: String,
    qrCode: String,
    generatedAt: Date
  },

  // Donor Profile
  donorProfile: {
    bloodGroup: String,
    rhFactor: String,
    canDonatePlatelet: { type: Boolean, default: false },
    lastDonationDate: Date,
    availability: {
      type: String,
      enum: ['available', 'routine_only', 'unavailable'],
      default: 'available'
    },
    unavailableUntil: Date,
    village: String,
    city: String,
    pinCode: String,
    totalDonations: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  },

  // Caregiver
  caregiverFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

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

  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  fcmToken: String, // for push notifications
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);*/


//new  code with otp 
/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },

  role: { 
    type: String, 
    enum: ['patient', 'donor', 'caregiver', 'admin'], 
    default: 'patient' 
  },

  language: { 
    type: String, 
    enum: ['hindi', 'english', 'marathi', 'bengali'], 
    default: 'hindi' 
  },

  // 🔥 OTP VERIFICATION (NEW)
  otp: String,
  otpExpire: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },

  // 🏥 Patient Health Card
  healthCard: {
    bloodGroup: String,
    rhFactor: String,
    cancerType: String,
    cancerStage: String,
    allergies: [String],
    emergencyContacts: [{
      name: String,
      phone: String,
      relation: String
    }],
    hospitalName: String,
    doctorName: String,
    qrCode: String,
    generatedAt: Date
  },

  // 🩸 Donor Profile
  donorProfile: {
    bloodGroup: String,
    rhFactor: String,
    canDonatePlatelet: { type: Boolean, default: false },
    lastDonationDate: Date,
    availability: {
      type: String,
      enum: ['available', 'routine_only', 'unavailable'],
      default: 'available'
    },
    unavailableUntil: Date,
    village: String,
    city: String,
    pinCode: String,
    totalDonations: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  },

  // 👨‍⚕️ Caregiver
  caregiverFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // 📍 Location
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

  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  fcmToken: String,

  createdAt: { type: Date, default: Date.now }

}, { timestamps: true });


// 🔐 Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


// 🔑 Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// 🔒 Remove sensitive fields from response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();

  delete obj.password;
  delete obj.otp;          // 🔥 hide OTP
  delete obj.otpExpire;    // 🔥 hide expiry

  return obj;
};

module.exports = mongoose.model('User', userSchema);
*/


//above code working as per paitent logic 

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

  // 🔥 FIX (CRITICAL)
    isActiveDonor: { type: Boolean, default: false },

 isActiveDonor: {type: Boolean, default:true},
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

module.exports = mongoose.model('User', userSchema);