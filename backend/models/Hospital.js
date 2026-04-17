
//new code
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },

  city: { 
    type: String,
    trim: true,
    index: true
  },

  state: { 
    type: String,
    trim: true,
    index: true
  },

  address: { 
    type: String,
    trim: true
  },

  phone: { 
    type: String,
    default: ""
  },

  type: { 
    type: String,
    default: "General"
  },

  rating: { 
    type: Number,
    default: 0
  },

  location: {
    lat: { type: Number },
    lng: { type: Number }
  }

}, { timestamps: true });


// 🔥 TEXT SEARCH INDEX (MAIN UPGRADE)
hospitalSchema.index({
  name: "text",
  city: "text",
  address: "text"
});

// 🔥 COMPOUND INDEX (FILTER SPEED)
hospitalSchema.index({ city: 1, state: 1 });


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