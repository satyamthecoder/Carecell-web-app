/*
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
    const diseaseText = (diseases || "");

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

module.exports = router;*/




// new code with new logic 





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

// 🔥 HELPER: DISTANCE
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};



// ==============================
// 🔥 NEW: QUICK ACTIVATE DONOR (NO BREAK)
// ==============================
router.post('/activate', protect, async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      fullAddress,
      pinCode,
      coordinates,
      canDonatePlatelet
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.role = 'donor';
    user.isActiveDonor = true;

    user.donorProfile = {
      ...user.donorProfile,
      bloodGroup,
      city,
      state,
      address: fullAddress,
      pinCode,
      canDonatePlatelet,
      availability: 'available',
      isEligible: true
    };

    if (coordinates) {
      user.location = {
        ...user.location,
        city,
        state,
        pinCode,
        coordinates
      };
    }

    await user.save();

    res.json({
      success: true,
      message: "Donor activated successfully"
    });

  } catch (error) {
    console.error("ACTIVATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// 🔥 REGISTER (UNCHANGED)
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
    const diseaseText = (diseases || "");

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


// 🔥 SEARCH (UNCHANGED)
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