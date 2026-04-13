/*const express = require("express");
const router = express.Router();
const HealthCard = require("../models/HealthCard");


// 🔥 VALIDATION FUNCTION
const validateHealthCard = (data) => {
  if (!data.name) return "Name required";
  if (!data.dob) return "DOB required";

  const age =
    new Date().getFullYear() - new Date(data.dob).getFullYear();

  if (age < 18 || age > 65)
    return "Age must be between 18–65";

  if (!data.gender) return "Gender required";
  if (!data.bloodGroup) return "Blood group required";
  if (!data.address) return "Address required";
  if (!data.phone) return "Phone required";

  return null;
};


// ✅ CREATE / UPDATE
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    // 🔥 VALIDATE
    const error = validateHealthCard(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const existing = await HealthCard.findOne({ userId });

    if (existing) {
      const updated = await HealthCard.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );

      return res.json({ healthCard: updated });
    }

    const newCard = new HealthCard(req.body);
    await newCard.save();

    res.json({ healthCard: newCard });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 PUBLIC (QR)
router.get("/public/:userId", async (req, res) => {
  try {
    const card = await HealthCard.findOne({
      userId: req.params.userId
    });

    if (!card) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 SAFE + COMPLETE DATA
    res.json({
      name: card.name,
      bloodGroup: card.bloodGroup,
      rhFactor: card.rhFactor,

      phone: card.phone,
      address: card.address,

      allergies: card.allergies || [],
      diseases: card.diseases || [],
      medications: card.medications || [],
      surgeries: card.surgeries || [],

      diabetes: card.diabetes || null,

      emergencyContacts: card.emergencyContacts || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET USER CARD
router.get("/:userId", async (req, res) => {
  try {
    const card = await HealthCard.findOne({
      userId: req.params.userId
    });

    res.json({ healthCard: card });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;*/



//new code with sone changes 

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