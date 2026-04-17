
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { donorAPI } from "../utils/api";
import useAuthStore from "../context/authStore";

export default function DonorProfile() {
  const { user, setUser } = useAuthStore();

  const safeString = (value) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    city: "",
    state: "",
    address: "",
    pinCode: "",
    diseases: "",
    allergies: "",
    surgeries: "",
    canDonatePlatelet: false,
    lastDonationDate: "",
    consent: false,
    location: { lat: null, lng: null },
  });

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    if (user?.donorProfile) {
      setForm((prev) => ({
        ...prev,
        ...user.donorProfile,
        diseases: safeString(user.donorProfile.diseases),
        allergies: safeString(user.donorProfile.allergies),
        surgeries: safeString(user.donorProfile.surgeries),
      }));
    }

    if (user?.location?.coordinates) {
      setForm((prev) => ({
        ...prev,
        location: user.location.coordinates,
      }));
    }

    setIsActive(user?.isActiveDonor || false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
        setLocLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLocLoading(false);
      }
    );
  };

  const getAge = (dob) => {
    if (!dob) return 0;
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const handleSave = async () => {
    try {
      const age = getAge(form.dob);

      if (!form.fullName || !form.dob || !form.gender || !form.bloodGroup) {
        return alert("Fill all required fields");
      }

      if (age < 18 || age > 65) {
        return alert("Only age 18–65 allowed");
      }

      if (!form.location.lat) {
        return alert("Enable location");
      }

      if (!form.consent) {
        return alert("Please accept donor consent");
      }

      setLoading(true);

      const res = await donorAPI.registerDonor(form);

      if (res?.donorProfile) {
        const updatedUser = {
          ...user,
          donorProfile: res.donorProfile,
          role: "donor",
        };

        localStorage.setItem("carecell_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      alert(res.message || "Saved");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async () => {
    try {
      const res = await donorAPI.toggleActive({ isActive: !isActive });

      setIsActive(res.isActiveDonor);

      const updatedUser = {
        ...user,
        isActiveDonor: res.isActiveDonor,
      };

      localStorage.setItem("carecell_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2 className="section-title mb-4">🩸 Donor Registration</h2>

      {/* INFO BOX */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 p-4 rounded-xl text-sm mb-5 shadow-sm">
        <p className="font-semibold mb-2">⚠️ Important Instructions</p>
        <ul className="list-disc ml-4 space-y-1">
          <li>Age must be between 18 – 65</li>
          <li>Donation gap: 90 days (male), 120 days (female)</li>
          <li>Write “none” if no disease/allergy</li>
        </ul>
      </div>

      {/* FORM */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card space-y-4"
      >

        {/* BASIC */}
        <div>
          <p className="font-semibold text-sm mb-1">Full Name</p>
          <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field" placeholder="Enter your full name" />
        </div>

        <div>
          <p className="font-semibold text-sm mb-1">Date of Birth</p>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <p className="font-semibold text-sm mb-1">Gender</p>
          <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <p className="font-semibold text-sm mb-1">Blood Group</p>
          <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field">
            <option value="">Select Blood Group</option>
            <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
            <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
          </select>
        </div>

        {/* ADDRESS */}
        <div className="border-t pt-3">
          <p className="font-semibold text-sm mb-2">📍 Address Details</p>

          <input name="city" value={form.city} onChange={handleChange} className="input-field mb-2" placeholder="City" />
          <input name="state" value={form.state} onChange={handleChange} className="input-field mb-2" placeholder="State" />
          <input name="address" value={form.address} onChange={handleChange} className="input-field mb-2" placeholder="Full Address" />
          <input name="pinCode" value={form.pinCode} onChange={handleChange} className="input-field" placeholder="Pin Code" />
        </div>

        {/* MEDICAL */}
        <div className="border-t pt-3">
          <p className="font-semibold text-sm mb-2">🩺 Medical Info</p>

          <input name="diseases" value={safeString(form.diseases)} onChange={handleChange} className="input-field mb-2" placeholder="Diseases (or write none)" />
          <input name="allergies" value={safeString(form.allergies)} onChange={handleChange} className="input-field mb-2" placeholder="Allergies (or write none)" />
          <input name="surgeries" value={safeString(form.surgeries)} onChange={handleChange} className="input-field mb-2" placeholder="Past surgeries (or none)" />

          <input type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={handleChange} className="input-field" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="canDonatePlatelet" checked={form.canDonatePlatelet} onChange={handleChange} />
          Can donate platelets
        </label>

        {/* LOCATION */}
        <button onClick={getLocation} className="btn-secondary w-full">
          {locLoading ? "Getting location..." : "📍 Enable Location"}
        </button>

        {form.location.lat && (
          <p className="text-green-600 text-sm">✔ Location captured</p>
        )}

        {/* CONSENT */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
          I confirm I am eligible to donate blood
        </label>

        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Profile"}
        </motion.button>

      </motion.div>

      {/* STATUS */}
      <div className="card mt-4 text-center">
        <p>
          Status:
          <span className={isActive ? "text-green-600" : "text-gray-500"}>
            {isActive ? " Active" : " Offline"}
          </span>
        </p>

        <button
          onClick={toggleActive}
          className={`w-full ${isActive ? "bg-red-500" : "bg-green-600"} text-white py-2 rounded-lg`}
        >
          {isActive ? "Go Offline" : "Go Active"}
        </button>
      </div>
    </div>
  );
}