/*const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const schemes = [
  {
    id: 's1', name: 'Ayushman Bharat - PM-JAY',
    nameHindi: 'आयुष्मान भारत - पीएम जन आरोग्य योजना',
    description: 'Free health coverage up to Rs. 5 lakh per family per year for secondary and tertiary care',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'free', state: 'All India',
    incomeLimit: 'Below poverty line / low income',
    documents: ['Aadhaar Card', 'Ration Card / BPL Certificate', 'Income Certificate'],
    contactInfo: 'Helpline: 14555 | www.pmjay.gov.in',
    approvalTime: '1-2 weeks', website: 'https://pmjay.gov.in'
  },
  {
    id: 's2', name: 'Rashtriya Arogya Nidhi (RAN)',
    nameHindi: 'राष्ट्रीय आरोग्य निधि',
    description: 'Financial assistance for BPL patients for life-threatening diseases at central government hospitals',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'partial', state: 'All India',
    incomeLimit: 'Below Rs. 1 lakh per month',
    documents: ['BPL Certificate', 'Medical records', 'Income certificate', 'Aadhaar'],
    contactInfo: 'Ministry of Health: 011-23061703',
    approvalTime: '2-4 weeks', website: 'https://health.gov.in'
  },
  {
    id: 's3', name: 'Maharashtra Chief Minister Cancer Relief Fund',
    nameHindi: 'महाराष्ट्र मुख्यमंत्री कैंसर राहत निधि',
    description: 'Financial assistance for cancer patients in Maharashtra',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'partial', state: 'Maharashtra',
    incomeLimit: 'Below Rs. 50,000 per month',
    documents: ['Domicile Certificate', 'Income Certificate', 'Medical Records', 'Aadhaar'],
    contactInfo: 'Collector office of respective district',
    approvalTime: '3-6 weeks', website: 'https://maharashtra.gov.in'
  },
  {
    id: 's4', name: 'Cancer Aid Society Free Treatment',
    nameHindi: 'कैंसर एड सोसायटी मुफ्त उपचार',
    description: 'NGO providing free medicines, financial support and counselling for cancer patients',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'free', state: 'Maharashtra, Delhi, Karnataka',
    incomeLimit: 'Any income level',
    documents: ['Medical records', 'Doctor referral'],
    contactInfo: 'Phone: 022-24116000 | canceraidsociety.com',
    approvalTime: '1 week', website: 'https://canceraidsociety.com'
  },
  {
    id: 's5', name: 'Tata Memorial Free Treatment',
    nameHindi: 'टाटा मेमोरियल मुफ्त उपचार',
    description: 'Free cancer treatment for BPL patients at Tata Memorial Hospital Mumbai',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'free', state: 'Maharashtra',
    incomeLimit: 'BPL certificate required',
    documents: ['BPL Certificate', 'Aadhaar', 'Medical records'],
    contactInfo: 'TMC Helpline: 022-24177000',
    approvalTime: '1-2 weeks', website: 'https://tmc.gov.in'
  },
  {
    id: 's6', name: 'Delhi Arogya Kosh',
    nameHindi: 'दिल्ली आरोग्य कोश',
    description: 'Financial assistance for Delhi residents for serious illness treatment',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'partial', state: 'Delhi',
    incomeLimit: 'Below Rs. 1 lakh per year',
    documents: ['Delhi domicile', 'Income proof', 'Medical records'],
    contactInfo: 'Delhi Health Department: 011-23380274',
    approvalTime: '2-3 weeks', website: 'https://health.delhigovt.nic.in'
  },
  {
    id: 's7', name: 'Indian Cancer Society Patient Support',
    nameHindi: 'इंडियन कैंसर सोसायटी सहायता',
    description: 'Free medicines, financial aid and transport support for cancer patients',
    cancerTypes: 'All cancers', ageGroup: 'All ages',
    coverage: 'partial', state: 'All India',
    incomeLimit: 'Low income',
    documents: ['Doctor letter', 'Income proof'],
    contactInfo: 'ICS Helpline: 1800-222-1-555 | indiancancersociety.org',
    approvalTime: '1-2 weeks', website: 'https://indiancancersociety.org'
  }
];

// @GET /api/schemes
router.get('/', protect, (req, res) => {
  const { state, cancerType, incomeBelow, coverage } = req.query;
  let filtered = [...schemes];

  if (state && state !== 'all') {
    filtered = filtered.filter(s => s.state.includes('All India') || s.state.toLowerCase().includes(state.toLowerCase()));
  }
  if (coverage && coverage !== 'all') filtered = filtered.filter(s => s.coverage === coverage);

  res.json({ success: true, count: filtered.length, schemes: filtered });
});

// @GET /api/schemes/:id
router.get('/:id', protect, (req, res) => {
  const scheme = schemes.find(s => s.id === req.params.id);
  if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
  res.json({ success: true, scheme });
});

module.exports = router;*/


// work on real data 

/*const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");

router.get("/", async (req, res) => {
  const { search, category, state } = req.query;

  let query = {};
  let andConditions = [];

  // 🔍 SEARCH
  if (search) {
    andConditions.push({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    });
  }

  // 🏷 CATEGORY
  if (category) {
    andConditions.push({ category: category });
  }

  // 📍 STATE
  if (state && state !== "") {
    andConditions.push({
      $or: [
        { state: state },
        { state: "All" }
      ]
    });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  try {
    const schemes = await Scheme.find(query);
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;*/


// above code working but some failu
const express = require("express");
const router = express.Router();

// ✅ FIXED IMPORT (CRITICAL)
const Scheme = require("../models/Scheme").default;


// 🔥 GET SCHEMES
router.get("/", async (req, res) => {
  try {
    let {
      search,
      state,
      category,
      gender,
      income,
      age,
      occupation,
      disability,
      bpl
    } = req.query;

    console.log("REQ QUERY:", req.query);

    let query = {};
    let andConditions = [];

    // 🔍 SEARCH (SAFE)
    if (search && search.trim() !== "") {
      query.$text = { $search: search.trim() };
    }

    // 📍 STATE
    if (state && state !== "") {
      andConditions.push({
        $or: [{ state: state }, { state: "All" }]
      });
    }

    // 🏷 CATEGORY
    if (category && category !== "") {
      query.category = category;
    }

    // 👤 GENDER
    if (gender && gender !== "") {
      andConditions.push({
        $or: [{ gender: gender }, { gender: "all" }]
      });
    }

    // 💰 INCOME
    if (income && income !== "") {
      query.incomeLimit = { $gte: Number(income) };
    }

    // 🎂 AGE
   // if (age && age !== "") {
     // andConditions.push({
       // ageMin: { $lte: Number(age) }
      //});
      //andConditions.push({
        //ageMax: { $gte: Number(age) }
      //});
    //}

    //new age logic
if (age !== undefined && age !== "") {
  const ageNum = Number(age);

  if (!isNaN(ageNum)) {
    andConditions.push({
      $and: [
        { ageMin: { $lte: ageNum } },
        { ageMax: { $gte: ageNum } }
      ]
    });
  }
}


    // 👨‍🌾 OCCUPATION
    if (occupation && occupation !== "") {
      query.occupation = { $in: [occupation] };
    }

    // ♿ DISABILITY
    if (disability === "true") {
      query.disability = true;
    }

    // 📉 BPL
    if (bpl === "true") {
      query.bplRequired = true;
    }

    // 🔗 MERGE CONDITIONS
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    console.log("FINAL QUERY:", query);

    let schemes = await Scheme.find(query);

    // 🔥 RANKING
    schemes = schemes.map((scheme) => {
      let score = 0;

      if (state && (scheme.state === state || scheme.state === "All")) score += 2;
      if (gender && (scheme.gender === gender || scheme.gender === "all")) score += 2;
      if (income && Number(income) <= scheme.incomeLimit) score += 3;
      if (age && Number(age) >= scheme.ageMin && Number(age) <= scheme.ageMax) score += 2;
      if (occupation && scheme.occupation.includes(occupation)) score += 2;

      score += scheme.popularityScore || 0;

      return { ...scheme._doc, matchScore: score };
    });

    schemes.sort((a, b) => b.matchScore - a.matchScore);

    res.json(schemes);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 ELIGIBILITY API
router.post("/check-eligibility", async (req, res) => {
  try {
    const { state, income, age, gender, occupation, disability, bpl } = req.body;

    const schemes = await Scheme.find({});

    const results = schemes.map((scheme) => {
      let score = 0;

      if (scheme.state === state || scheme.state === "All") score += 2;
      if (gender && (scheme.gender === gender || scheme.gender === "all")) score += 2;
      if (income && income <= scheme.incomeLimit) score += 3;
      if (age && age >= scheme.ageMin && age <= scheme.ageMax) score += 2;
      if (occupation && scheme.occupation.includes(occupation)) score += 2;
      if (disability && scheme.disability) score += 2;
      if (bpl && scheme.bplRequired) score += 2;

      let eligibility = "Not Eligible";
      if (score >= 7) eligibility = "Eligible";
      else if (score >= 4) eligibility = "Maybe";

      return {
        ...scheme._doc,
        matchScore: score,
        eligibility
      };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json(results);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;