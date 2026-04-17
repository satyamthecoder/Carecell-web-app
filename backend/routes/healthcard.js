const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// 🔥 GET HEALTH CARD (FROM PATIENT)
router.get("/:userId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.params.userId
    });

    if (!patient) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({ healthCard: patient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 PUBLIC QR DATA
router.get("/public/:userId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.params.userId
    });

    if (!patient) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      name: patient.name,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      address: patient.address,

      diseases: patient.diseases || [],
      allergies: patient.allergies || [],

      emergencyContact: patient.emergencyContact || {}
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;