const express = require("express");
const router = express.Router();
const HealthCard = require("../models/HealthCard");

// ✅ CREATE / UPDATE
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    const existing = await HealthCard.findOne({ userId });

    if (existing) {
      const updated = await HealthCard.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const newCard = new HealthCard(req.body);
    await newCard.save();

    res.json(newCard);
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

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUBLIC (QR SCAN)
router.get("/public/:userId", async (req, res) => {
  try {
    const card = await HealthCard.findOne({
      userId: req.params.userId
    });

    if (!card) return res.status(404).json({ message: "Not found" });

    // 🔥 only critical data
    res.json({
      name: card.name,
      bloodGroup: card.bloodGroup,
      allergies: card.allergies,
      diseases: card.diseases,
      emergencyContact: card.emergencyContact
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;