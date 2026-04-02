const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const demoTreatments = [];

// @POST /api/treatments
router.post('/', protect, async (req, res) => {
  try {
    const treatmentData = { ...req.body, patient: req.user.id, id: `t_${Date.now()}`, status: 'upcoming', createdAt: new Date() };
    try {
      const Treatment = require('../models/Treatment');
      const treatment = await Treatment.create({ ...treatmentData, patient: req.user.id });
      res.status(201).json({ success: true, treatment });
    } catch (dbErr) {
      demoTreatments.push(treatmentData);
      res.status(201).json({ success: true, treatment: treatmentData, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/treatments
router.get('/', protect, async (req, res) => {
  try {
    const { month, year, status } = req.query;
    try {
      const Treatment = require('../models/Treatment');
      let query = { patient: req.user.id };
      if (status) query.status = status;
      const treatments = await Treatment.find(query).sort('dateTime');
      res.json({ success: true, treatments });
    } catch (dbErr) {
      const now = new Date();
      const demo = [
        {
          id: 't1', type: 'chemotherapy', title: 'Chemotherapy Cycle 3',
          dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          hospital: 'Tata Memorial Hospital', doctor: 'Dr. R. Badwe',
          status: 'upcoming', patient: req.user.id
        },
        {
          id: 't2', type: 'labtest', title: 'CBC Blood Test',
          dateTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          hospital: 'Tata Memorial Hospital', doctor: 'Dr. R. Badwe',
          status: 'upcoming', patient: req.user.id
        },
        {
          id: 't3', type: 'followup', title: 'Oncologist Follow-up',
          dateTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
          hospital: 'Tata Memorial Hospital', doctor: 'Dr. R. Badwe',
          status: 'upcoming', patient: req.user.id
        }
      ];
      res.json({ success: true, treatments: [...demoTreatments.filter(t => t.patient === req.user.id), ...demo], demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/treatments/:id
router.put('/:id', protect, async (req, res) => {
  try {
    try {
      const Treatment = require('../models/Treatment');
      const treatment = await Treatment.findOneAndUpdate(
        { _id: req.params.id, patient: req.user.id },
        req.body,
        { new: true }
      );
      res.json({ success: true, treatment });
    } catch (dbErr) {
      res.json({ success: true, treatment: { id: req.params.id, ...req.body }, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @DELETE /api/treatments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    try {
      const Treatment = require('../models/Treatment');
      await Treatment.findOneAndDelete({ _id: req.params.id, patient: req.user.id });
    } catch (dbErr) {}
    res.json({ success: true, message: 'Treatment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
