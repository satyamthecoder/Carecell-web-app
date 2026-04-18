/*
import React, { useEffect, useState } from "react";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:5000/api/donations?all=true")
      .then(res => res.json())
      .then(data => setDonations(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id) => {
    await fetch(`http://localhost:5000/api/donations/${id}/approve`, {
      method: "PATCH"
    });
    fetchData();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Admin Approval</h2>

      {donations.map((d) => (
        <div key={d._id} className="border p-3 mb-3">
          <h3>{d.title}</h3>
          <p>Status: {d.status}</p>

          {d.status === "pending" && (
            <button
              onClick={() => approve(d._id)}
              className="bg-green-500 text-white px-3 py-1"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}*/


//new code for deployment 

import React, { useEffect, useState } from "react";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL; // ✅ ADDED

  const fetchData = () => {
    fetch(`${API_BASE}/donations?all=true`) // ✅ FIXED
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error("Fetch error:", err)); // ✅ optional safety
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id) => {
    await fetch(`${API_BASE}/donations/${id}/approve`, { // ✅ FIXED
      method: "PATCH"
    }).catch(err => console.error("Approve error:", err)); // ✅ optional

    fetchData();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Admin Approval</h2>

      {donations.map((d) => (
        <div key={d._id} className="border p-3 mb-3">
          <h3>{d.title}</h3>
          <p>Status: {d.status}</p>

          {d.status === "pending" && (
            <button
              onClick={() => approve(d._id)}
              className="bg-green-500 text-white px-3 py-1"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}