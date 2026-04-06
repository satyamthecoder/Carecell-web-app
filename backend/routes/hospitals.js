


//new code with better expireance

const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// ✅ HAVERSINE (ACCURATE)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ✅ FIXED ROUTE → /nearby
router.get('/nearby', async (req, res) => {
  try {
    let { lat, lng, radius = 50, search = '' } = req.query;

    // 🔴 VALIDATION
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "lat & lng required"
      });
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    radius = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates"
      });
    }

    // 📦 FETCH DATA
    let hospitals = await Hospital.find();

    // 🔍 SEARCH
    if (search) {
      const s = search.toLowerCase();
      hospitals = hospitals.filter(h =>
        (h.name && h.name.toLowerCase().includes(s)) ||
        (h.city && h.city.toLowerCase().includes(s))
      );
    }

    // 📏 DISTANCE CALC
    const result = hospitals
      .filter(h => h.location?.lat && h.location?.lng)
      .map(h => {
        const distance = getDistance(
          lat,
          lng,
          h.location.lat,
          h.location.lng
        );

        return {
          _id: h._id,
          name: h.name,
          city: h.city,
          state: h.state,
          address: h.address,
          distance: Number(distance.toFixed(2))
        };
      })
      .filter(h => h.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // ✅ RESPONSE
    res.json({
      success: true,
      count: result.length,
      hospitals: result
    });

  } catch (error) {
    console.error("HOSPITAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;

//above code working try new thing

