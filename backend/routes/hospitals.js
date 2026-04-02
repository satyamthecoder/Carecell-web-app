const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Comprehensive hospital database (India oncology hospitals)
const hospitals = [
  {
    id: 'h1', name: 'Tata Memorial Hospital', type: 'government', city: 'Mumbai', state: 'Maharashtra',
    address: 'Dr. E. Borges Road, Parel, Mumbai - 400012',
    speciality: 'Oncology', opdTimings: '8:00 AM - 4:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'low', phone: '022-24177000',
    distance: 2.3, coordinates: { lat: 18.9988, lng: 72.8404 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Blood Bank'],
    isFree: true, rating: 4.8
  },
  {
    id: 'h2', name: 'AIIMS New Delhi', type: 'government', city: 'New Delhi', state: 'Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029',
    speciality: 'Oncology', opdTimings: '8:00 AM - 3:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'low', phone: '011-26588500',
    distance: 5.1, coordinates: { lat: 28.5672, lng: 77.2100 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Bone Marrow Transplant'],
    isFree: true, rating: 4.9
  },
  {
    id: 'h3', name: 'Rajiv Gandhi Cancer Institute', type: 'private', city: 'New Delhi', state: 'Delhi',
    address: 'Sector 5, Rohini, New Delhi - 110085',
    speciality: 'Oncology', opdTimings: '9:00 AM - 5:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'high', phone: '011-47022222',
    distance: 8.4, coordinates: { lat: 28.7197, lng: 77.1280 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'PET Scan'],
    isFree: false, rating: 4.7
  },
  {
    id: 'h4', name: 'Adyar Cancer Institute', type: 'government', city: 'Chennai', state: 'Tamil Nadu',
    address: 'East Canal Bank Road, Gandhi Nagar, Adyar, Chennai - 600020',
    speciality: 'Oncology', opdTimings: '7:30 AM - 3:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'low', phone: '044-22350241',
    distance: 3.7, coordinates: { lat: 13.0027, lng: 80.2547 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery'],
    isFree: false, rating: 4.6
  },
  {
    id: 'h5', name: 'HCG Cancer Centre', type: 'private', city: 'Bangalore', state: 'Karnataka',
    address: 'No. 8, HCG Towers, Kalinga Rao Road, Sadashivanagar, Bangalore - 560080',
    speciality: 'Oncology', opdTimings: '8:00 AM - 6:00 PM', opdDays: 'Mon-Sun',
    isOpdOpenToday: true, costLevel: 'high', phone: '080-40206040',
    distance: 6.2, coordinates: { lat: 13.0037, lng: 77.5796 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Proton Therapy'],
    isFree: false, rating: 4.8
  },
  {
    id: 'h6', name: 'Kidwai Memorial Institute', type: 'government', city: 'Bangalore', state: 'Karnataka',
    address: 'Dr. M.H. Marigowda Road, Bangalore - 560029',
    speciality: 'Oncology', opdTimings: '8:00 AM - 3:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: false, costLevel: 'low', phone: '080-26094000',
    distance: 4.5, coordinates: { lat: 12.9411, lng: 77.5926 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery'],
    isFree: true, rating: 4.5
  },
  {
    id: 'h7', name: 'Narayana Health City', type: 'private', city: 'Kolkata', state: 'West Bengal',
    address: '120/1, Andul Road, Howrah, Kolkata - 711103',
    speciality: 'Oncology', opdTimings: '8:00 AM - 5:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'medium', phone: '033-71222222',
    distance: 9.1, coordinates: { lat: 22.5958, lng: 88.2636 },
    facilities: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Blood Bank'],
    isFree: false, rating: 4.7
  },
  {
    id: 'h8', name: 'Bombay Hospital', type: 'private', city: 'Mumbai', state: 'Maharashtra',
    address: 'New Marine Lines, Mumbai - 400020',
    speciality: 'Multi-specialty', opdTimings: '9:00 AM - 5:00 PM', opdDays: 'Mon-Sat',
    isOpdOpenToday: true, costLevel: 'medium', phone: '022-22067676',
    distance: 4.8, coordinates: { lat: 18.9388, lng: 72.8258 },
    facilities: ['Chemotherapy', 'Surgery', 'Blood Bank'],
    isFree: false, rating: 4.4
  }
];

// @GET /api/hospitals
router.get('/', protect, async (req, res) => {
  try {
    const { search, type, costLevel, city, state, radius, opdToday } = req.query;
    let filtered = [...hospitals];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(s) ||
        h.city.toLowerCase().includes(s) ||
        h.speciality.toLowerCase().includes(s) ||
        h.state.toLowerCase().includes(s)
      );
    }
    if (type && type !== 'all') filtered = filtered.filter(h => h.type === type);
    if (costLevel && costLevel !== 'all') filtered = filtered.filter(h => h.costLevel === costLevel);
    if (city) filtered = filtered.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
    if (state) filtered = filtered.filter(h => h.state.toLowerCase().includes(state.toLowerCase()));
    if (radius) filtered = filtered.filter(h => h.distance <= parseFloat(radius));
    if (opdToday === 'true') filtered = filtered.filter(h => h.isOpdOpenToday);

    filtered.sort((a, b) => a.distance - b.distance);

    res.json({ success: true, count: filtered.length, hospitals: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/hospitals/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const hospital = hospitals.find(h => h.id === req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/hospitals/emergency/nearest
router.get('/emergency/nearest', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    // Return top 3 nearest of each type
    const nearest = {
      oncology: hospitals.filter(h => h.speciality === 'Oncology').sort((a, b) => a.distance - b.distance)[0],
      general: hospitals.sort((a, b) => a.distance - b.distance)[0],
      bloodBank: {
        id: 'bb1', name: 'Central Blood Bank', address: 'Near City Center', phone: '1800-11-1234',
        distance: 1.2, isOpen24x7: true, type: 'blood_bank'
      }
    };
    res.json({ success: true, nearest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
