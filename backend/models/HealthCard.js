const mongoose = require("mongoose");

const healthCardSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🔴 CORE
  name: String,
  bloodGroup: String,
  rhFactor: String,
  allergies: [String],
  medications: [String],

  emergencyContacts: [
    {
      name: String,
      phone: String,
      relation: String
    }
  ],

  // 🟡 IDENTITY
  photo: String,
  dob: String,
  gender: String,
  healthId: String,

  // 🟢 MEDICAL
  diabetes: {
    has: { type: Boolean, default: false },
    type: String,
    sugarLevel: Number
  },

  // 🔵 CONTACT
  phone: String,
  email: String,
  address: String

}, { timestamps: true });

module.exports = mongoose.model("HealthCard", healthCardSchema);