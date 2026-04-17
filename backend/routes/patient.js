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