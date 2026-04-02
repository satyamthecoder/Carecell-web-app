const express = require('express');
const router = express.Router();

// @GET /api/emergency/nearest
router.get('/nearest', async (req, res) => {
  try {
    const { lat, lng, city = 'Mumbai' } = req.query;

    const emergencyData = {
      oncologyHospital: {
        name: 'Tata Memorial Hospital',
        address: 'Dr. E. Borges Road, Parel, Mumbai',
        phone: '022-24177000',
        distance: '2.3 km',
        travelTime: '8-12 minutes',
        isOpen24x7: true,
        directions: [
          'अपने घर से मुख्य सड़क पर आएं | Come to the main road from your home',
          'Parel की तरफ जाएं | Go towards Parel',
          'Dr. E. Borges Road पर मुड़ें | Turn on Dr. E. Borges Road',
          'अस्पताल दाईं तरफ है | Hospital is on the right side'
        ],
        landmarks: ['Parel Station', 'King Edward Memorial Hospital', 'Bombay Cotton Exchange']
      },
      bloodBank: {
        name: 'Central Blood Bank - KEM Hospital',
        address: 'Acharya Donde Marg, Parel, Mumbai',
        phone: '022-24136051',
        distance: '1.8 km',
        travelTime: '6-10 minutes',
        isOpen24x7: true,
        directions: [
          'KEM Hospital जाएं | Go to KEM Hospital',
          'Blood Bank building का साइन देखें | Look for Blood Bank sign',
          'Emergency wing के पास है | Near emergency wing'
        ]
      },
      generalHospital: {
        name: 'KEM Hospital',
        address: 'Acharya Donde Marg, Parel, Mumbai',
        phone: '022-24136051',
        distance: '1.8 km',
        travelTime: '6-10 minutes',
        isOpen24x7: true,
        hasEmergencyWard: true,
        directions: [
          'Parel station के पास है | Near Parel station',
          'Acharya Donde Marg पर है | On Acharya Donde Marg'
        ]
      },
      ambulance: {
        number: '108',
        description: 'राष्ट्रीय एम्बुलेंस सेवा | National Ambulance Service',
        isFree: true
      },
      emergencyNumbers: [
        { name: 'Ambulance / एम्बुलेंस', number: '108', icon: '🚑' },
        { name: 'Police / पुलिस', number: '100', icon: '🚔' },
        { name: 'National Emergency', number: '112', icon: '🆘' },
        { name: 'Cancer Helpline', number: '1800-11-1234', icon: '🏥' }
      ]
    };

    res.json({ success: true, data: emergencyData, city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/emergency/helplines
router.get('/helplines', (req, res) => {
  res.json({
    success: true,
    helplines: [
      { name: 'Ambulance', number: '108', available: '24/7', free: true },
      { name: 'National Emergency', number: '112', available: '24/7', free: true },
      { name: 'Police', number: '100', available: '24/7', free: true },
      { name: 'Fire', number: '101', available: '24/7', free: true },
      { name: 'National Cancer Grid Helpline', number: '1800-11-1234', available: '24/7', free: true },
      { name: 'iCall Mental Health', number: '9152987821', available: 'Mon-Sat 8am-10pm', free: false },
      { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7', free: true }
    ]
  });
});

module.exports = router;
