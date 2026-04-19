
const express = require('express');
const router = express.Router();
const StemCellDonor = require('../models/StemCellDonor');
const User = require('../models/User');


// ==============================
// REGISTER DONOR
// ==============================
router.post('/register', async (req, res) => {
  try {
    // ✅ ADDED HLA FIELDS
    const { userId, donorType, hlaA, hlaB, hlaC, hlaDRB1, hlaDQB1 } = req.body;

    if (!userId || !donorType) {
      return res.status(400).json({
        success: false,
        message: "userId and donorType are required"
      });
    }

    const donor = await StemCellDonor.create({
      userId,
      donorType,
      availability: true,

      // ✅ ADDED (CRITICAL)
      hlaA,
      hlaB,
      hlaC,
      hlaDRB1,
      hlaDQB1
    });

    res.json({
      success: true,
      donor
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ==============================
// MATCH
// ==============================
router.get('/match/:patientId', async (req, res) => {
  try {
    const patient = await User.findById(req.params.patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    if (!patient.hlaA || !patient.hlaB || !patient.hlaC || !patient.hlaDRB1 || !patient.hlaDQB1) {
      return res.status(400).json({
        success: false,
        message: "Patient HLA data incomplete"
      });
    }

    const donors = await StemCellDonor.find({ availability: true });

    const results = donors.map(d => {
      let score = 0;

      if (d.hlaA === patient.hlaA) score += 2;
      if (d.hlaB === patient.hlaB) score += 2;
      if (d.hlaC === patient.hlaC) score += 2;
      if (d.hlaDRB1 === patient.hlaDRB1) score += 2;
      if (d.hlaDQB1 === patient.hlaDQB1) score += 2;

      return {
        donorId: d._id,
        score
      };
    });

    const filtered = results
      .filter(r => r.score >= 8)
      .sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      matches: filtered
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
