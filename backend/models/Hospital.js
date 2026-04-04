const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  state: String,
  address: String,
  phone: String,
  type: String,
  rating: Number,
  location: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);