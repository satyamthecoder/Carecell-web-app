const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { protect } = require('../middleware/auth');

// @GET /api/patients/health-card
router.get('/health-card', protect, async (req, res) => {
  try {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      res.json({ success: true, healthCard: user.healthCard || null });
    } catch (dbErr) {
      res.json({ success: true, healthCard: null, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/patients/health-card
router.post('/health-card', protect, async (req, res) => {
  try {
    const {
      bloodGroup, rhFactor, cancerType, cancerStage,
      allergies, emergencyContacts, hospitalName, doctorName
    } = req.body;

    const cardData = {
      bloodGroup, rhFactor, cancerType, cancerStage,
      allergies: allergies || [],
      emergencyContacts: emergencyContacts || [],
      hospitalName, doctorName,
      patientId: req.user.id,
      generatedAt: new Date()
    };

    // Generate QR code containing essential info
    const qrData = JSON.stringify({
      pid: req.user.id,
      bg: bloodGroup,
      rh: rhFactor,
      ct: cancerType,
      cs: cancerStage,
      al: allergies,
      ec: emergencyContacts?.map(c => ({ n: c.name, p: c.phone })),
      hn: hospitalName,
      dn: doctorName
    });

    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      width: 256
    });

    cardData.qrCode = qrCode;

    try {
      const User = require('../models/User');
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { healthCard: cardData },
        { new: true }
      );
      res.json({ success: true, healthCard: user.healthCard });
    } catch (dbErr) {
      res.json({ success: true, healthCard: cardData, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/patients/qr/:patientId - Public QR scan endpoint
router.get('/qr/:patientId', async (req, res) => {
  try {
    const { fields } = req.query; // 'basic' or 'full'
    try {
      const User = require('../models/User');
      const user = await User.findById(req.params.patientId);
      if (!user || !user.healthCard) {
        return res.status(404).json({ success: false, message: 'Health card not found' });
      }
      const card = user.healthCard;
      const data = fields === 'basic'
        ? { bloodGroup: card.bloodGroup, cancerType: card.cancerType, cancerStage: card.cancerStage }
        : { ...card, qrCode: undefined };

      res.json({ success: true, data, patientName: user.name });
    } catch (dbErr) {
      res.status(404).json({ success: false, message: 'Database not available' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
