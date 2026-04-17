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