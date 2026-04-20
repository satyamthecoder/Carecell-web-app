/*nst express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// In-memory store for demo
const requests = [];

// @POST /api/blood-requests
router.post('/', protect, async (req, res) => {
  try {
    const requestData = { ...req.body, patient: req.user.id, createdAt: new Date(), status: 'active', id: `req_${Date.now()}` };

    try {
      const BloodRequest = require('../models/BloodRequest');
      const req_ = await BloodRequest.create({ ...requestData, patient: req.user.id });
      res.status(201).json({ success: true, request: req_ });
    } catch (dbErr) {
      requests.push(requestData);
      res.status(201).json({ success: true, request: requestData, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/blood-requests
router.get('/', protect, async (req, res) => {
  try {
    const { status, bloodGroup, urgency } = req.query;
    try {
      const BloodRequest = require('../models/BloodRequest');
      let query = { patient: req.user.id };
      if (status) query.status = status;
      const reqs = await BloodRequest.find(query).sort('-createdAt');
      res.json({ success: true, requests: reqs });
    } catch (dbErr) {
      let filtered = requests.filter(r => r.patient === req.user.id);
      if (status) filtered = filtered.filter(r => r.status === status);
      res.json({ success: true, requests: filtered, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/blood-requests/active - for donors to see active requests
router.get('/active', protect, async (req, res) => {
  try {
    const demoActive = [
      {
        id: 'r1', bloodGroup: 'A+', type: 'whole_blood', urgency: 'emergency',
        units: 2, hospitalName: 'Tata Memorial Hospital', distance: 3.2,
        city: 'Mumbai', createdAt: new Date(Date.now() - 3600000), status: 'active'
      },
      {
        id: 'r2', bloodGroup: 'B+', type: 'platelets', urgency: 'routine',
        units: 1, hospitalName: 'AIIMS', distance: 8.5,
        city: 'Mumbai', createdAt: new Date(Date.now() - 7200000), status: 'active'
      }
    ];
    try {
      const BloodRequest = require('../models/BloodRequest');
      const reqs = await BloodRequest.find({ status: 'active' }).populate('patient', 'name').sort('-createdAt').limit(20);
      res.json({ success: true, requests: reqs });
    } catch (dbErr) {
      res.json({ success: true, requests: demoActive, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/blood-requests/:id/respond
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { status, message } = req.body;
    try {
      const BloodRequest = require('../models/BloodRequest');
      const bloodReq = await BloodRequest.findById(req.params.id);
      if (!bloodReq) return res.status(404).json({ success: false, message: 'Request not found' });
      bloodReq.responses.push({ donor: req.user.id, status, message, respondedAt: new Date() });
      await bloodReq.save();
      res.json({ success: true, message: `Response recorded: ${status}` });
    } catch (dbErr) {
      res.json({ success: true, message: `Response recorded: ${status} (demo)`, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
*/


// new code  for blodd request 


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const BloodRequest = require('../models/BloodRequest');

// 🧠 Blood compatibility map
const compatibility = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+", "A+", "B+", "O+", "AB-", "A-", "B-", "O-"]
};


// ==============================
// CREATE REQUEST
// ==============================
router.post('/', protect, async (req, res) => {
  try {
    const { bloodGroup, units, urgency, hospitalName, city, type } = req.body;

    if (!bloodGroup || !units || !type) {
      return res.status(400).json({
        success: false,
        message: "Blood group, units and type are required"
      });
    }

    const request = await BloodRequest.create({
      patient: req.user.id,
      bloodGroup,
      units,
      type,
      urgency: urgency || "routine",
      hospitalName,
      city,
      status: "active",
      createdAt: new Date()
    });

    res.status(201).json({ success: true, request });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==============================
// GET MY REQUESTS
// ==============================
router.get('/', protect, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      patient: req.user.id
    }).sort('-createdAt');

    res.json({ success: true, requests });

  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==============================
// 🔥 SMART MATCH SYSTEM
// ==============================
router.get('/match', protect, async (req, res) => {
  try {
    const userBloodGroup = req.user?.donorProfile?.bloodGroup;

    if (!userBloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Update blood group in profile"
      });
    }

    const compatibleGroups = compatibility[userBloodGroup] || [];

    const donorLat = req.user?.location?.coordinates?.lat || 0;
    const donorLng = req.user?.location?.coordinates?.lng || 0;

    const requests = await BloodRequest.find({
      status: 'active',
      bloodGroup: { $in: compatibleGroups }
    }).populate('patient');

    // 🔥 Distance calculator
    const getDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat2 || !lon2) return 9999;

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

    const urgencyScore = {
      emergency: 3,
      urgent: 2,
      routine: 1
    };

    const enriched = requests.map(r => {
      const patientLat = r.patient?.location?.coordinates?.lat || 0;
      const patientLng = r.patient?.location?.coordinates?.lng || 0;

      return {
        ...r.toObject(),
        distance: getDistance(donorLat, donorLng, patientLat, patientLng),
        urgencyRank: urgencyScore[r.urgency] || 0
      };
    });

    // 🔥 SORTING LOGIC
    enriched.sort((a, b) => {
      if (b.urgencyRank !== a.urgencyRank) {
        return b.urgencyRank - a.urgencyRank;
      }

      if (a.bloodGroup === userBloodGroup) return -1;
      if (b.bloodGroup === userBloodGroup) return 1;

      return a.distance - b.distance;
    });

    res.json({
      success: true,
      requests: enriched
    });

  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==============================
// RESPOND (ANTI-SPAM)
// ==============================
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { status, message } = req.body;

    const bloodReq = await BloodRequest.findById(req.params.id);

    if (!bloodReq) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // 🔥 prevent duplicate response
    const already = bloodReq.responses.find(
      r => r.donor.toString() === req.user.id
    );

    if (already) {
      return res.status(400).json({
        success: false,
        message: "Already responded"
      });
    }

    bloodReq.responses.push({
      donor: req.user.id,
      status,
      message,
      respondedAt: new Date()
    });

    await bloodReq.save();

    res.json({
      success: true,
      message: `Response recorded: ${status}`
    });

  } catch (error) {
    console.error("RESPOND ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;