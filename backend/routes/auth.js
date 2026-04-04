/*const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateToken, protect } = require('../middleware/auth');

// Demo users (fallback when no MongoDB)
const demoUsers = new Map();

// Helper
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

// @POST /api/auth/register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'donor', 'caregiver'])
], async (req, res) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { name, phone, password, email, role = 'patient', language = 'hindi' } = req.body;

    try {
      const User = require('../models/User');
      const existing = await User.findOne({ phone });
      if (existing) return res.status(400).json({ success: false, message: 'Phone already registered' });

      const user = await User.create({ name, phone, password, email, role, language });
      const token = generateToken(user._id, user.name, user.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: { id: user._id, name, phone, email, role, language }
      });
    } catch (dbErr) {
      // Demo mode
      if (demoUsers.has(phone)) {
        return res.status(400).json({ success: false, message: 'Phone already registered' });
      }
      const id = `demo_${Date.now()}`;
      demoUsers.set(phone, { id, name, phone, password, email, role, language });
      const token = generateToken(id, name, role);
      res.status(201).json({
        success: true,
        message: 'Registration successful (demo mode)',
        token,
        user: { id, name, phone, email, role, language }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/auth/login
router.post('/login', [
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { phone, password } = req.body;

    try {
      const User = require('../models/User');
      const user = await User.findOne({ phone }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid phone or password' });
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
      const token = generateToken(user._id, user.name, user.role);
      res.json({ success: true, token, user: user.toJSON() });
    } catch (dbErr) {
      // Demo mode - accept any password for demo users
      const demo = demoUsers.get(phone);
      if (!demo || demo.password !== password) {
        // Create demo user on the fly if not found
        const id = `demo_${Date.now()}`;
        const user = { id, name: 'Demo User', phone, role: 'patient', language: 'hindi' };
        const token = generateToken(id, user.name, user.role);
        return res.json({ success: true, token, user, demo: true });
      }
      const token = generateToken(demo.id, demo.name, demo.role);
      res.json({ success: true, token, user: demo, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, language, location } = req.body;
    try {
      const User = require('../models/User');
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, language, location },
        { new: true, runValidators: true }
      );
      res.json({ success: true, user });
    } catch (dbErr) {
      res.json({ success: true, user: { ...req.user, name, email, language, location } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;*/



//new code for auth otp verification


const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { generateToken, protect } = require('../middleware/auth');
const { generateOTP } = require('../utils/otp');
const sendEmail = require('../utils/sendEmail');

// Helper
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

// @POST /api/auth/register
router.post('/register', [
  body('name').notEmpty(),
  body('phone').notEmpty(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { name, phone, password, email, role = 'patient', language = 'hindi' } = req.body;

    const User = require('../models/User');

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Phone already registered' });
    }

    // 🔥 Generate OTP
    const otp = generateOTP();

    const user = await User.create({
      name,
      phone,
      password,
      email,
      role,
      language,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000, // 5 min
      isVerified: false
    });

    // 🔥 Send OTP
    if (email) {
      await sendEmail(email, otp);
    }

    res.status(201).json({
      success: true,
      message: 'OTP sent. Please verify your account.',
      email
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// @POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const User = require('../models/User');

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // ✅ Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    const token = generateToken(user._id, user.name, user.role);

    res.json({
      success: true,
      message: 'Account verified successfully',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// @POST /api/auth/login
router.post('/login', [
  body('phone').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const err = handleValidation(req, res);
    if (err) return;

    const { phone, password } = req.body;

    const User = require('../models/User');

    const user = await User.findOne({ phone }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }

    // ❌ Block if not verified
   // if (!user.isVerified) {
     // return res.status(400).json({ success: false, message: 'Please verify OTP first' });
    //}

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.name, user.role);

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});


// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, language, location } = req.body;

    const User = require('../models/User');

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, language, location },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

