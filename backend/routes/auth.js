const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { generateToken } = require('../utils/generateToken');

// 🔥 SIMPLE VALIDATION
const handleValidation = (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({
      success: false,
      message: 'Phone & password required'
    });
    return true;
  }

  return false;
};



// ============================
// 🔥 REGISTER
// ============================


router.post('/register', async (req, res) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { name, phone, password, role, acceptTerms } = req.body;

    // 🔥 TERMS VALIDATION (CORRECT PLACE)
    if (!acceptTerms) {
      return res.status(400).json({
        success: false,
        message: "You must accept Terms & Conditions"
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // ✅ SAFE ROLE
    const safeRole = ['patient', 'donor'].includes(role)
      ? role
      : 'patient';

    const user = new User({
      name,
      phone,
      password,
      role: safeRole,

      // 🔥 SAVE TERMS (CRITICAL)
      acceptedTerms: true,
      acceptedAt: new Date(),
      termsVersion: "v1.0"
    });

    await user.save();

    const token = generateToken(user._id, user.name, user.role);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================
// 🔥 LOGIN
// ============================
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone & password required'
      });
    }

    const user = await User.findOne({ phone }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.name, user.role);

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// ============================
// 🔥 GET CURRENT USER
// ============================
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});



// ============================
// 🔥 UPDATE BASIC PROFILE
// ============================
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, language, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, language, location },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// ============================
// 🔥 DONOR PROFILE UPDATE (IMPORTANT)
// ============================
router.put('/donor-profile', protect, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can update donor profile'
      });
    }

    const {
      bloodGroup,
      availability,
      lastDonationDate,
      city,
      pinCode
    } = req.body;

    const user = await User.findById(req.user.id);

    // 🔥 SAFE MERGE (IMPORTANT FIX)
    user.donorProfile = {
      ...(user.donorProfile || {}),
      bloodGroup,
      availability,
      lastDonationDate,
      city,
      pinCode
    };

    await user.save();

    res.json({
      success: true,
      donorProfile: user.donorProfile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



module.exports = router;