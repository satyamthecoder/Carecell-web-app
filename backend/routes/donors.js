const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Mock donors for demo
const mockDonors = [
  { id: 'd1', name: 'Rajesh Kumar', bloodGroup: 'A+', city: 'Mumbai', distance: 3.2, lastDonation: '2024-10-15', availability: 'available', canDonatePlatelet: true },
  { id: 'd2', name: 'Priya Sharma', bloodGroup: 'B+', city: 'Mumbai', distance: 5.8, lastDonation: '2024-09-20', availability: 'available', canDonatePlatelet: false },
  { id: 'd3', name: 'Amit Singh', bloodGroup: 'O+', city: 'Thane', distance: 12.1, lastDonation: '2024-11-01', availability: 'available', canDonatePlatelet: true },
  { id: 'd4', name: 'Sunita Devi', bloodGroup: 'AB+', city: 'Pune', distance: 18.5, lastDonation: '2024-08-10', availability: 'routine_only', canDonatePlatelet: false },
  { id: 'd5', name: 'Vikram Patel', bloodGroup: 'O-', city: 'Mumbai', distance: 7.3, lastDonation: '2024-10-28', availability: 'available', canDonatePlatelet: true },
];

// @POST /api/donors/register
router.post('/register', protect, async (req, res) => {
  try {
    const { bloodGroup, rhFactor, canDonatePlatelet, lastDonationDate, availability, village, city, pinCode } = req.body;
    const profile = { bloodGroup, rhFactor, canDonatePlatelet, lastDonationDate, availability, village, city, pinCode };

    try {
      const User = require('../models/User');
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { donorProfile: profile, role: 'donor' },
        { new: true }
      );
      res.json({ success: true, message: 'Donor profile created', donorProfile: user.donorProfile });
    } catch (dbErr) {
      res.json({ success: true, message: 'Donor profile created (demo)', donorProfile: profile, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/donors/search
router.get('/search', protect, async (req, res) => {
  try {
    const { bloodGroup, type, urgency, radius = 25, city } = req.query;

    try {
      const User = require('../models/User');
      let query = { role: 'donor', isActive: true };
      if (bloodGroup) query['donorProfile.bloodGroup'] = bloodGroup;
      if (type === 'platelets') query['donorProfile.canDonatePlatelet'] = true;
      query['donorProfile.availability'] = { $ne: 'unavailable' };

      const donors = await User.find(query).select('name donorProfile location phone createdAt');
      res.json({ success: true, count: donors.length, donors });
    } catch (dbErr) {
      // Return mock donors
      let filtered = mockDonors;
      if (bloodGroup) filtered = filtered.filter(d => d.bloodGroup === bloodGroup || bloodGroup === 'any');
      filtered = filtered.filter(d => parseFloat(d.distance) <= parseFloat(radius));
      res.json({ success: true, count: filtered.length, donors: filtered, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/donors/availability
router.put('/availability', protect, async (req, res) => {
  try {
    const { availability, unavailableUntil } = req.body;
    try {
      const User = require('../models/User');
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { 'donorProfile.availability': availability, 'donorProfile.unavailableUntil': unavailableUntil },
        { new: true }
      );
      res.json({ success: true, availability: user.donorProfile.availability });
    } catch (dbErr) {
      res.json({ success: true, availability, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
