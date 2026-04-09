const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

// CREATE
router.post("/", async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET (approved only OR all for admin)
router.get("/", async (req, res) => {
  try {
    if (req.query.all === "true") {
      const all = await Donation.find();
      return res.json(all);
    }

    const approved = await Donation.find({ status: "approved" });
    res.json(approved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APPROVE
router.patch("/:id/approve", async (req, res) => {
  try {
    const updated = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;