const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const demoCheckins = [];

// @POST /api/checkin
router.post('/', protect, async (req, res) => {
  try {
    const checkinData = { ...req.body, patient: req.user.id, date: new Date(), id: `ci_${Date.now()}` };

    // Calculate risk locally
    const s = checkinData.symptoms || {};
    let score = 0;
    if (checkinData.wellbeing <= 2) score += 2;
    if (s.fever?.present && s.fever?.severity === 'high') score += 3;
    else if (s.fever?.present) score += 1;
    if (s.bleeding?.present) score += 3;
    if (s.confusion?.present) score += 3;
    if (s.breathingDifficulty?.present) score += 3;
    if (s.vomiting?.present) score += 2;
    if (s.pain?.present && s.pain?.severity === 'severe') score += 2;

    let riskLevel = 'low';
    let aiAssessment = 'आप ठीक लग रहे हैं। अपना ख्याल रखें।';
    let actions = [];

    if (score >= 7) {
      riskLevel = 'critical';
      aiAssessment = 'यह गंभीर हो सकता है। कृपया अभी अस्पताल जाएं।';
      actions = ['go_to_hospital', 'call_emergency'];
    } else if (score >= 4) {
      riskLevel = 'high';
      aiAssessment = 'कुछ गंभीर लक्षण हैं। डॉक्टर से संपर्क करें।';
      actions = ['call_doctor'];
    } else if (score >= 2) {
      riskLevel = 'moderate';
      aiAssessment = 'थोड़ी तकलीफ है। आराम करें और नजर रखें।';
      actions = ['rest', 'monitor'];
    }

    checkinData.riskLevel = riskLevel;
    checkinData.aiAssessment = aiAssessment;
    checkinData.recommendedActions = actions;

    try {
      const Checkin = require('../models/Checkin');
      const ci = await Checkin.create({ ...checkinData, patient: req.user.id });
      res.status(201).json({ success: true, checkin: ci, riskLevel, aiAssessment, actions });
    } catch (dbErr) {
      demoCheckins.push(checkinData);
      res.status(201).json({ success: true, checkin: checkinData, riskLevel, aiAssessment, actions, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/checkin/history
router.get('/history', protect, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    try {
      const Checkin = require('../models/Checkin');
      const history = await Checkin.find({ patient: req.user.id, date: { $gte: since } }).sort('-date');
      res.json({ success: true, history });
    } catch (dbErr) {
      const userCheckins = demoCheckins.filter(c => c.patient === req.user.id);
      res.json({ success: true, history: userCheckins, demo: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
