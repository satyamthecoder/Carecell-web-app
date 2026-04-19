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
// @POST /api/blood-requests
// Create blood request
// ==============================
router.post('/', protect, async (req, res) => {
  try {
    const { bloodGroup, units, urgency, hospitalName, city } = req.body;

    if (!bloodGroup || !units) {
      return res.status(400).json({
        success: false,
        message: "Blood group and units are required"
      });
    }

    const request = await BloodRequest.create({
      patient: req.user.id,
      bloodGroup,
      units,
      urgency: urgency || "normal",
      hospitalName,
      city,
      status: "active",
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==============================
// @GET /api/blood-requests
// Get user's own requests
// ==============================
router.get('/', protect, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      patient: req.user.id
    }).sort('-createdAt');

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==============================
// @GET /api/blood-requests/match
// Get compatible requests for donor
// ==============================
router.get('/match', protect, async (req, res) => {
  try {
    const userBloodGroup = req.user.bloodGroup;

    if (!userBloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Please update your blood group in profile"
      });
    }

    const compatibleGroups = compatibility[userBloodGroup];

    const requests = await BloodRequest.find({
      status: 'active',
      bloodGroup: { $in: compatibleGroups }
    })
      .populate('patient', 'name bloodGroup')
      .sort('-createdAt');

    // 🔥 Priority sorting (same group first)
    const sortedRequests = requests.sort((a, b) => {
      if (a.bloodGroup === userBloodGroup) return -1;
      if (b.bloodGroup === userBloodGroup) return 1;
      return 0;
    });

    res.json({
      success: true,
      requests: sortedRequests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==============================
// @POST /api/blood-requests/:id/respond
// Donor responds to request
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;