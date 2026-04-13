/*const express = require('express');
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

module.exports = router;*/

//new code



// above code is working with have issue in disese saving 

/*const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// 🔥 CREATE / UPDATE PROFILE
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    console.log("PATIENT SAVE REQUEST:", req.body);

    // 🔥 🔥 CRITICAL FIX: DATA NORMALIZATION
    const normalizedData = {
      ...req.body,

      gender: (req.body.gender || "").toLowerCase(),
      hasSurgeries: !!req.body.hasSurgeries,
      consent: !!req.body.consent,

      // ✅ FIX ARRAYS
      diseases: typeof req.body.diseases === "string"
        ? req.body.diseases.split(",").map(i => i.trim()).filter(Boolean)
        : req.body.diseases || [],

      allergies: typeof req.body.allergies === "string"
        ? req.body.allergies.split(",").map(i => i.trim()).filter(Boolean)
        : req.body.allergies || [],

      medications: typeof req.body.medications === "string"
        ? req.body.medications.split(",").map(i => i.trim()).filter(Boolean)
        : req.body.medications || [],

      surgeries: typeof req.body.surgeries === "string"
        ? req.body.surgeries.split(",").map(i => i.trim()).filter(Boolean)
        : req.body.surgeries || [],

      // ✅ FIX EMERGENCY CONTACT
      emergencyContacts: [
        {
          name: req.body.emergencyName || "",
          phone: req.body.emergencyPhone || ""
        }
      ]
    };

    console.log("NORMALIZED DATA:", normalizedData);

    // 🔥 VALIDATION
    if (!normalizedData.name || !normalizedData.phone) {
      return res.status(400).json({
        error: "Name and phone required"
      });
    }

    if (!normalizedData.consent) {
      return res.status(400).json({
        error: "Consent is required"
      });
    }

    // 🔥 UPSERT (BEST PRACTICE)
    const patient = await Patient.findOneAndUpdate(
      { userId },
      { $set: normalizedData },
      { new: true, upsert: true }
    );

    console.log("PATIENT SAVED:", patient._id);

    res.json({
      success: true,
      patient
    });

  } catch (err) {
    console.error("PATIENT ERROR:", err);

    res.status(500).json({
      error: err.message || "Server error"
    });
  }
});


// 🔥 GET PROFILE
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("GET PATIENT:", userId);

    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    res.json({
      success: true,
      patient
    });

  } catch (err) {
    console.error("GET PATIENT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;*/   



///new code   with hole chamges 

const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// 🔥 HELPER → STRING → ARRAY
const toArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    return value
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);
  }

  return [];
};

// 🔥 CREATE / UPDATE PROFILE
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    console.log("PATIENT SAVE REQUEST:", req.body);

    // 🔥 NORMALIZE DATA (IMPORTANT)
    const data = {
      ...req.body,

      // normalize gender
      gender: (req.body.gender || "").toLowerCase(),

      // 🔥 FIX ARRAYS
      diseases: toArray(req.body.diseases),
      allergies: toArray(req.body.allergies),
      medications: toArray(req.body.medications),

      // 🔥 BOOLEAN FIX
      hasSurgeries: !!req.body.hasSurgeries,
      consent: !!req.body.consent,

      // 🔥 EMERGENCY STRUCTURE
      emergencyContact: {
        name: req.body.emergencyContact?.name || "",
        relation: req.body.emergencyContact?.relation || "",
        phone: req.body.emergencyContact?.phone || ""
      },

      // 🔥 SYSTEM FIELD
      lastUpdated: new Date()
    };

    // 🔥 VALIDATION
    if (!data.name || !data.phone) {
      return res.status(400).json({
        error: "Name and phone required"
      });
    }

    if (!data.consent) {
      return res.status(400).json({
        error: "Consent is required"
      });
    }

    // 🔥 FIND EXISTING
    const existing = await Patient.findOne({ userId });

    if (existing) {
      const updated = await Patient.findOneAndUpdate(
        { userId },
        data,
        { new: true }
      );

      console.log("PATIENT UPDATED:", updated._id);

      return res.json({
        success: true,
        patient: updated
      });
    }

    // 🔥 CREATE NEW
    const newPatient = new Patient(data);
    await newPatient.save();

    console.log("PATIENT CREATED:", newPatient._id);

    res.json({
      success: true,
      patient: newPatient
    });

  } catch (err) {
    console.error("PATIENT ERROR:", err);

    res.status(500).json({
      error: err.message || "Server error"
    });
  }
});


// 🔥 GET PROFILE
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("GET PATIENT:", userId);

    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    res.json({
      success: true,
      patient
    });

  } catch (err) {
    console.error("GET PATIENT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;