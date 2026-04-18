/*
import React, { useEffect, useState } from "react";

export default function Donations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => setDonations(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Donate</h2>

      {donations.map((d) => (
        <div key={d._id} className="bg-white p-3 rounded shadow mb-3">
          <h3>{d.title}</h3>
          <p>{d.description}</p>
          <p>₹{d.raisedAmount} / ₹{d.requiredAmount}</p>
        </div>
      ))}
    </div>
  );
}*/


//new code for deployment 


import React, { useEffect, useState } from "react";

export default function Donations() {
  const [donations, setDonations] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL; // ✅ ADDED

  useEffect(() => {
    fetch(`${API_BASE}/donations`) // ✅ FIXED
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error("Fetch donations error:", err)); // ✅ optional safety
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Donate</h2>

      {donations.map((d) => (
        <div key={d._id} className="bg-white p-3 rounded shadow mb-3">
          <h3>{d.title}</h3>
          <p>{d.description}</p>
          <p>₹{d.raisedAmount} / ₹{d.requiredAmount}</p>
        </div>
      ))}
    </div>
  );
}