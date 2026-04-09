const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  patientName: String,
  title: String,
  description: String,
  requiredAmount: Number,
  raisedAmount: { type: Number, default: 0 },

  proof: String,

  bankDetails: {
    accountNumber: String,
    ifsc: String,
    upi: String
  },

  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Donation", donationSchema);