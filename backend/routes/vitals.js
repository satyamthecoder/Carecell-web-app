const express = require('express');
const router = express.Router();
const Vitals = require('../models/Vitals');

// SAVE VITALS
router.post('/save', async (req, res) => {
  try {
    const { patientId, platelets, ANC, hemoglobin } = req.body;

    if (!platelets || !ANC || !hemoglobin) {
      return res.status(400).json({ message: 'All fields required' });
    }

    await Vitals.create({ patientId, platelets, ANC, hemoglobin });

    const lastVitals = await Vitals.find({ patientId })
      .sort({ date: -1 })
      .limit(3);

    let engraftment = false;

    if (lastVitals.length === 3) {
      engraftment = lastVitals.every(v => v.ANC >= 500);
    }

    res.json({
      success: true,
      plateletAlert: platelets < 20000,
      ancAlert: ANC < 500,
      engraftment
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET VITALS
router.get('/:patientId', async (req, res) => {
  const data = await Vitals.find({ patientId: req.params.patientId });
  res.json(data);
});

module.exports = router;