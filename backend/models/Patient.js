const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    // 🪪 BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    // 📞 CONTACT
    phone: {
      type: String,
      required: true,
    },

    // 📍 ADDRESS (IMPROVED)
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // 📍 LOCATION
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    // 💼 CONTEXT
    occupation: {
      type: String,
      default: "",
    },

    incomeRange: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    familySize: {
      type: Number,
      default: 0,
    },

    maritalStatus: {
      type: String,
      default: "",
    },

    // 🧬 MEDICAL INFO (FIXED STRUCTURE)
    bloodGroup: {
      type: String,
      default: "",
    },

    diseases: {
      type: [String], // ✅ ARRAY FIX
      default: [],
    },

    allergies: {
      type: [String], // ✅ ARRAY FIX
      default: [],
    },

    medications: {
      type: [String], // ✅ ARRAY FIX
      default: [],
    },

    diseaseStage: {
      type: String,
      default: "",
    },

    currentTreatment: {
      type: String,
      default: "",
    },

    hospitalName: {
      type: String,
      default: "",
    },

    hasSurgeries: {
      type: Boolean,
      default: false,
    },

    surgeries: {
      type: String,
      default: "",
    },

    // 🚨 EMERGENCY (STRUCTURED)
    emergencyContact: {
      name: { type: String, default: "" },
      relation: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    // 📄 LEGAL
    consent: {
      type: Boolean,
      required: true,
    },

    // ⚙️ SYSTEM
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


// 🔥 PROFILE COMPLETENESS (VIRTUAL)
patientSchema.virtual("profileCompleteness").get(function () {
  let total = 10;
  let filled = 0;

  if (this.name) filled++;
  if (this.phone) filled++;
  if (this.dob) filled++;
  if (this.gender) filled++;
  if (this.address) filled++;
  if (this.bloodGroup) filled++;
  if (this.diseases.length) filled++;
  if (this.allergies.length) filled++;
  if (this.emergencyContact?.phone) filled++;
  if (this.consent) filled++;

  return Math.round((filled / total) * 100);
});

module.exports = mongoose.model("Patient", patientSchema);