const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const Match = require('../models/Match');

// ==============================
// 🧠 GET PATIENT MATCHES
// ==============================
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.find()
      .populate({
        path: 'request',
        match: { patient: userId },
        populate: {
          path: 'patient',
          select: 'name phone'
        }
      })
      .populate({
        path: 'donor',
        select: 'name phone donorProfile'
      })
      .sort('-createdAt');

    // remove null (important)
    const filtered = matches.filter(m => m.request !== null);

    // 🔒 privacy control
    const result = filtered.map(m => {
      return {
        matchId: m._id,
        status: m.status,
        distance: m.distance,

        donor: {
          name: m.donor.name,
          bloodGroup: m.donor?.donorProfile?.bloodGroup,

          // 🔥 ONLY SHOW PHONE IF ACCEPTED
          phone: m.status === 'accepted' ? m.donor.phone : null
        }
      };
    });

    res.json({
      success: true,
      matches: result
    });

  } catch (error) {
    console.error("PATIENT MATCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;