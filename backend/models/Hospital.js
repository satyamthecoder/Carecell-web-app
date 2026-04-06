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

//above code working try new thing

/*const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },

  phone: String,
  emergency: Boolean
});

hospitalSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hospital", hospitalSchema);*/