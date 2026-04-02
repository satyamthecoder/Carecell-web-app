const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const dietPlans = {
  'breast_cancer': {
    'during_chemo': {
      breakfast: ['दलिया (Oatmeal) with banana', 'Curd (दही) + fruit', 'Boiled eggs + toast'],
      lunch: ['Dal + rice + sabzi', 'Khichdi with ghee', 'Roti + paneer sabzi + dal'],
      dinner: ['Light soup + bread', 'Moong dal khichdi', 'Daliya + curd'],
      snacks: ['Banana', 'Almonds (10-12)', 'Coconut water', 'Boiled potato'],
      tips: ['High protein foods: eggs, dal, paneer, fish', 'Small meals every 2-3 hours', 'Stay hydrated 8-10 glasses water', 'Avoid spicy and oily food during chemo'],
      avoid: ['Spicy food', 'Raw vegetables', 'Street food', 'Alcohol']
    },
    'recovery': {
      breakfast: ['Idli + sambar', 'Poha', 'Upma', 'Whole wheat bread + peanut butter'],
      lunch: ['Brown rice + rajma + salad', 'Roti + chicken curry + dal', 'Quinoa + dal'],
      dinner: ['Soup + roti', 'Grilled fish + vegetables', 'Dal + roti + sabzi'],
      snacks: ['Fruits (papaya, apple, pomegranate)', 'Mixed nuts', 'Lassi'],
      tips: ['Eat colorful vegetables', 'Include turmeric in diet', 'Regular meals schedule'],
      avoid: ['Processed food', 'High sugar items', 'Red meat in excess']
    }
  },
  'blood_cancer': {
    'during_chemo': {
      breakfast: ['Soft boiled rice', 'Banana + milk', 'Curd rice'],
      lunch: ['Khichdi', 'Soft dal + rice', 'Vegetable soup'],
      dinner: ['Light moong dal soup', 'Soft roti + dal', 'Rice + boiled vegetables'],
      snacks: ['Coconut water', 'Fruit juice', 'Banana'],
      tips: ['Soft foods preferred', 'High calorie foods', 'Avoid infection risk foods', 'Boil all vegetables'],
      avoid: ['Raw salads', 'Unpeeled fruits', 'Street food', 'Dairy if platelet low']
    },
    'recovery': {
      breakfast: ['Eggs + whole wheat toast', 'Oatmeal + nuts + fruits', 'Paneer paratha'],
      lunch: ['Chicken + rice + dal', 'Fish curry + rice', 'Protein-rich meals'],
      dinner: ['Dal + chapati + sabzi', 'Soup + bread', 'Rice + lentils'],
      snacks: ['Pomegranate juice', 'Dates + milk', 'Protein shake'],
      tips: ['Iron-rich foods: spinach, beets, pomegranate', 'Vitamin C with iron foods', 'Plenty of protein'],
      avoid: ['Alcohol', 'High sugar', 'Processed meats']
    }
  }
};

// Get diet plan by cancer type and phase
router.get('/diet', protect, (req, res) => {
  const { cancerType = 'breast_cancer', phase = 'during_chemo' } = req.query;
  const normalized = cancerType.toLowerCase().replace(/\s+/g, '_');
  const plan = dietPlans[normalized]?.[phase] || dietPlans['breast_cancer']['during_chemo'];

  res.json({ success: true, cancerType, phase, plan });
});

// Get high protein foods list
router.get('/high-protein', protect, (req, res) => {
  res.json({
    success: true,
    foods: [
      { name: 'Eggs / अंडे', protein: '6g per egg', icon: '🥚', tips: 'Best source, easy to digest' },
      { name: 'Paneer / पनीर', protein: '18g per 100g', icon: '🧀', tips: 'Good vegetarian source' },
      { name: 'Dal (all types)', protein: '9g per 100g', icon: '🫘', tips: 'Affordable and nutritious' },
      { name: 'Chicken / मुर्गा', protein: '25g per 100g', icon: '🍗', tips: 'Lean protein, grilled preferred' },
      { name: 'Fish / मछली', protein: '22g per 100g', icon: '🐟', tips: 'Omega-3 also beneficial' },
      { name: 'Milk / दूध', protein: '8g per glass', icon: '🥛', tips: 'Calcium + protein' },
      { name: 'Curd / दही', protein: '10g per cup', icon: '🥣', tips: 'Good for gut health' },
      { name: 'Peanuts / मूंगफली', protein: '25g per 100g', icon: '🥜', tips: 'Affordable, good for energy' },
      { name: 'Soybean / सोयाबीन', protein: '36g per 100g', icon: '🌱', tips: 'Best vegetarian protein' },
      { name: 'Almonds / बादाम', protein: '21g per 100g', icon: '🌰', tips: 'Soak overnight for best absorption' }
    ]
  });
});

// Get offline diet guides
router.get('/guides', protect, (req, res) => {
  res.json({
    success: true,
    guides: [
      { id: 1, title: 'Chemo Diet Guide', titleHindi: 'कीमो के दौरान आहार', pages: 5, downloadable: true },
      { id: 2, title: 'Platelet Diet Guide', titleHindi: 'प्लेटलेट बढ़ाने के लिए आहार', pages: 3, downloadable: true },
      { id: 3, title: 'Recovery Foods', titleHindi: 'ठीक होने के लिए खाना', pages: 4, downloadable: true },
      { id: 4, title: 'Affordable Nutrition', titleHindi: 'सस्ता और पौष्टिक भोजन', pages: 6, downloadable: true }
    ]
  });
});

module.exports = router;
