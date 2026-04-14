/*const express = require('express');
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

module.exports = router;*/


///new code 

/*
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');


// 🔥 HELPER: CALCULATE AGE
const calculateAge = (dob) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};


// 🔥 HELPER: CHECK DONATION GAP
const canDonateNow = (lastDonationDate, gender) => {
  if (!lastDonationDate) return true;

  const diffDays =
    (new Date() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24);

  if (gender === 'female') return diffDays >= 120;
  return diffDays >= 90;
};


// 🔥 REGISTER / UPDATE DONOR PROFILE
router.post('/register', protect, async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      bloodGroup,
      rhFactor,
      city,
      state,
      address,
      pinCode,
      diseases,
      allergies,
      surgeries,
      canDonatePlatelet,
      lastDonationDate,
      consent
    } = req.body;

    // 🚨 REQUIRED CHECKS
    if (!fullName || !dob || !gender || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: "Consent is required"
      });
    }

    // 🔥 AGE VALIDATION
    const age = calculateAge(dob);
    if (age < 18 || age > 65) {
      return res.status(400).json({
        success: false,
        message: "Not eligible: Age must be between 18–65"
      });
    }

    // 🔥 DONATION GAP VALIDATION
    const allowedToDonate = canDonateNow(lastDonationDate, gender);

    // 🔥 ELIGIBILITY LOGIC
    const isEligible = allowedToDonate;

    // 🔥 NORMALIZE ARRAYS
    const safeDiseases = Array.isArray(diseases)
      ? diseases
      : diseases ? [diseases] : [];

    const safeAllergies = Array.isArray(allergies)
      ? allergies
      : allergies ? [allergies] : [];

    const safeSurgeries = Array.isArray(surgeries)
      ? surgeries
      : surgeries ? [surgeries] : [];

    const updateData = {
      role: 'donor',

      donorProfile: {
        fullName,
        dob,
        gender,
        bloodGroup,
        rhFactor,

        city,
        state,
        address,
        pinCode,

        diseases: safeDiseases,
        allergies: safeAllergies,
        surgeries: safeSurgeries,

        canDonatePlatelet: !!canDonatePlatelet,
        lastDonationDate,

        consent: !!consent,

        isEligible,
        availability: isEligible ? 'available' : 'unavailable'
      }
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: isEligible
        ? "Donor profile saved (Eligible)"
        : "Saved but NOT eligible to donate",
      donorProfile: user.donorProfile
    });

  } catch (error) {
    console.error("DONOR REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 TOGGLE ACTIVE STATUS
router.post('/toggle-active', protect, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.user.id);

    // 🚨 BLOCK IF NOT ELIGIBLE
    if (!user.donorProfile?.isEligible) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible to donate"
      });
    }

    user.isActiveDonor = !!isActive;
    await user.save();

    res.json({
      success: true,
      isActiveDonor: user.isActiveDonor
    });

  } catch (error) {
    console.error("TOGGLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 SEARCH DONORS
router.get('/search', protect, async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    let query = {
      role: 'donor',
      isActiveDonor: true,
      'donorProfile.isEligible': true,
      'donorProfile.availability': 'available'
    };

    if (bloodGroup && bloodGroup !== 'any') {
      query['donorProfile.bloodGroup'] = bloodGroup;
    }

    if (city) {
      query['donorProfile.city'] = city;
    }

    const donors = await User.find(query).select(
      'name phone donorProfile location'
    );

    res.json({
      success: true,
      count: donors.length,
      donors
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 🔥 UPDATE AVAILABILITY
router.put('/availability', protect, async (req, res) => {
  try {
    const { availability, unavailableUntil } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false });
    }

    user.donorProfile.availability = availability;
    user.donorProfile.unavailableUntil = unavailableUntil;

    await user.save();

    res.json({
      success: true,
      availability: user.donorProfile.availability
    });

  } catch (error) {
    console.error("AVAILABILITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;*/  


/// code above also working 


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// 🔥 HELPER: AGE
const calculateAge = (dob) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};

// 🔥 HELPER: GAP
const canDonateNow = (lastDonationDate, gender) => {
  if (!lastDonationDate) return true;

  const diffDays =
    (new Date() - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24);

  if (gender === 'female') return diffDays >= 120;
  return diffDays >= 90;
};

// 🔥 HELPER: DISTANCE (HAVERSINE)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};



// 🔥 REGISTER (UNCHANGED LOGIC)
router.post('/register', protect, async (req, res) => {
  try {
    const {
      fullName, dob, gender, bloodGroup, rhFactor,
      city, state, address, pinCode,
      diseases, allergies, surgeries,
      canDonatePlatelet, lastDonationDate,
      consent, location
    } = req.body;

    if (!fullName || !dob || !gender || !bloodGroup) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (!consent) {
      return res.status(400).json({ success: false, message: "Consent is required" });
    }

    const age = calculateAge(dob);
    if (age < 18 || age > 65) {
      return res.status(400).json({ success: false, message: "Age must be 18–65" });
    }

    const allowedToDonate = canDonateNow(lastDonationDate, gender);

    const blockedDiseases = ['hiv', 'hepatitis', 'cancer'];
    const diseaseText = (diseases || "").toLowerCase();

    const hasBlockedDisease = blockedDiseases.some(d =>
      diseaseText.includes(d)
    );

    const isEligible = allowedToDonate && !hasBlockedDisease;

    const safeDiseases = diseases ? diseases.split(',').map(d => d.trim()) : [];
    const safeAllergies = allergies ? allergies.split(',').map(a => a.trim()) : [];
    const safeSurgeries = surgeries ? surgeries.split(',').map(s => s.trim()) : [];

    const updateData = {
      role: 'donor',
      donorProfile: {
        fullName, dob, gender, bloodGroup, rhFactor,
        city, state, address, pinCode,
        diseases: safeDiseases,
        allergies: safeAllergies,
        surgeries: safeSurgeries,
        canDonatePlatelet: !!canDonatePlatelet,
        lastDonationDate,
        consent: !!consent,
        isEligible,
        availability: isEligible ? 'available' : 'unavailable'
      }
    };

    if (location?.lat && location?.lng) {
      updateData.location = {
        coordinates: location
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.json({
      success: true,
      message: isEligible ? "Donor registered successfully" : "Saved but NOT eligible",
      donorProfile: user.donorProfile
    });

  } catch (error) {
    console.error("DONOR REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// 🔥 TOGGLE ACTIVE (UNCHANGED)
router.post('/toggle-active', protect, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.donorProfile?.isEligible) {
      return res.status(400).json({
        success: false,
        message: "You are not eligible to donate"
      });
    }

    user.isActiveDonor = !!isActive;
    await user.save();

    res.json({
      success: true,
      isActiveDonor: user.isActiveDonor
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 🔥 🔥 🔥 UPDATED SEARCH (MAIN FEATURE)
router.get('/search', protect, async (req, res) => {
  try {
    const { bloodGroup, city, lat, lng, radius = 25 } = req.query;

    let query = {
      role: 'donor',
      isActiveDonor: true,
      'donorProfile.isEligible': true,
      'donorProfile.availability': 'available'
    };

    if (bloodGroup && bloodGroup !== 'any') {
      query['donorProfile.bloodGroup'] = bloodGroup;
    }

    const donors = await User.find(query).select(
      'name phone donorProfile location'
    );

    let filtered = donors;

    // 🔥 LOCATION FILTER
    if (lat && lng) {
      filtered = donors.map(d => {
        const dLat = d.location?.coordinates?.lat;
        const dLng = d.location?.coordinates?.lng;

        if (!dLat || !dLng) return null;

        const distance = getDistance(
          parseFloat(lat),
          parseFloat(lng),
          dLat,
          dLng
        );

        return { ...d.toObject(), distance };
      })
      .filter(d => d && d.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    } else if (city) {
      // fallback
      filtered = donors.filter(d =>
        d.donorProfile?.city === city
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      donors: filtered
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// 🔥 AVAILABILITY (UNCHANGED)
router.put('/availability', protect, async (req, res) => {
  try {
    const { availability, unavailableUntil } = req.body;

    const user = await User.findById(req.user.id);

    user.donorProfile.availability = availability;
    user.donorProfile.unavailableUntil = unavailableUntil;

    await user.save();

    res.json({
      success: true,
      availability: user.donorProfile.availability
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;