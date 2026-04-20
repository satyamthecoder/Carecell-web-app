import React, { useState, useEffect } from "react";
import { donorAPI } from "../utils/api";
import useAuthStore from "../context/authStore";

export default function DonorProfile() {
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    city: "",
    state: "",
    address: "",
    pinCode: "",

    // STEM
    isStemDonor: false,
    donorType: "BONE_MARROW",
    hlaA: "",
    hlaB: "",
    hlaC: "",
    hlaDRB1: "",
    hlaDQB1: ""
  });

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.donorProfile) {
      setForm((prev) => ({
        ...prev,
        ...user.donorProfile
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // =========================
  // SAVE BLOOD DONOR
  // =========================
  const handleSave = async () => {
    try {
      setLoading(true);

      // ✅ VALIDATION
      if (!form.fullName || !form.dob || !form.gender || !form.bloodGroup) {
        return alert("Fill all required fields");
      }

      const payload = {
        fullName: form.fullName,
        dob: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        rhFactor: "positive",

        city: form.city,
        state: form.state,
        address: form.address,
        pinCode: form.pinCode,

        diseases: [],
        allergies: [],
        surgeries: [],

        canDonatePlatelet: false,
        lastDonationDate: null,

        consent: true
      };

      console.log("DONOR PAYLOAD:", payload);

      const res = await donorAPI.registerDonor(payload);

      setUser({
        ...user,
        donorProfile: res.donorProfile
      });

      alert("Saved successfully");

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER STEM DONOR
  // =========================
  const registerStem = async () => {
    try {
      if (!user?._id) {
        return alert("User not loaded. Please login again.");
      }

      const payload = {
        userId: user._id,
        donorType: form.donorType,
        hlaA: form.hlaA,
        hlaB: form.hlaB,
        hlaC: form.hlaC,
        hlaDRB1: form.hlaDRB1,
        hlaDQB1: form.hlaDQB1
      };

      console.log("STEM PAYLOAD:", payload);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/stemcell/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Stem cell donor registered");

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // =========================
  // GET MATCHES
  // =========================
  const getMatches = async () => {
    try {
      if (!user?._id) {
        return alert("User missing");
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/stemcell/match/${user._id}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMatches(data.matches || []);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">

      <h2 className="text-xl font-bold text-green-700 mb-4">
        Donor Profile
      </h2>

      {/* BLOOD DONOR */}
      <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
        <p className="font-semibold mb-3">🩸 Blood Donor</p>

        <input name="fullName" placeholder="Name" value={form.fullName} onChange={handleChange} className="input-field mb-2" />

        <input name="dob" type="date" value={form.dob} onChange={handleChange} className="input-field mb-2" />

        <select name="gender" value={form.gender} onChange={handleChange} className="input-field mb-2">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field mb-2">
          <option value="">Blood Group</option>
          <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
          <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
        </select>

        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input-field mb-2" />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="input-field mb-2" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="input-field mb-2" />
        <input name="pinCode" placeholder="Pin Code" value={form.pinCode} onChange={handleChange} className="input-field mb-2" />

        <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded-xl">
          {loading ? "Saving..." : "Save Blood Profile"}
        </button>
      </div>

      {/* STEM CELL */}
      <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
        <p className="font-semibold mb-3">🧬 Stem Cell Donor</p>

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            name="isStemDonor"
            checked={form.isStemDonor}
            onChange={handleChange}
          />
          Register as Stem Cell Donor
        </label>

        {form.isStemDonor && (
          <div className="space-y-2">
            <select name="donorType" value={form.donorType} onChange={handleChange} className="input-field">
              <option value="BONE_MARROW">Bone Marrow</option>
              <option value="PERIPHERAL_BLOOD">Peripheral Blood</option>
            </select>

            <input name="hlaA" placeholder="HLA-A" value={form.hlaA} onChange={handleChange} className="input-field" />
            <input name="hlaB" placeholder="HLA-B" value={form.hlaB} onChange={handleChange} className="input-field" />
            <input name="hlaC" placeholder="HLA-C" value={form.hlaC} onChange={handleChange} className="input-field" />
            <input name="hlaDRB1" placeholder="HLA-DRB1" value={form.hlaDRB1} onChange={handleChange} className="input-field" />
            <input name="hlaDQB1" placeholder="HLA-DQB1" value={form.hlaDQB1} onChange={handleChange} className="input-field" />

            <button onClick={registerStem} className="w-full bg-blue-600 text-white py-2 rounded-xl">
              Register Stem Donor
            </button>

            <button onClick={getMatches} className="w-full bg-purple-600 text-white py-2 rounded-xl">
              Find Matches
            </button>
          </div>
        )}
      </div>

      {/* MATCH RESULTS */}
      {matches.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <p className="font-semibold mb-3">🧬 Matches</p>

          {matches.map((m, i) => (
            <div key={i} className="border p-2 rounded mb-2">
              Score: {m.score}/10
            </div>
          ))}
        </div>
      )}
    </div>
  );
}