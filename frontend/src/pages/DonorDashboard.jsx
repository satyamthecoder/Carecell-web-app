import React from "react";
import { FiDroplet, FiMapPin, FiAlertTriangle } from "react-icons/fi";
import useAuthStore from "../context/authStore";

export default function DonorDashboard() {
  const { user } = useAuthStore();
  const donor = user?.donorProfile || {};

  return (
    <div className="page-container space-y-4">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 rounded-2xl">
        <h2 className="text-lg font-bold">🩸 Donor Dashboard</h2>
        <p className="text-sm opacity-90">Save lives by donating blood</p>
      </div>

      {/* DONOR STATUS */}
      <div className="card p-4 space-y-2">
        <h3 className="font-bold flex items-center gap-2">
          <FiDroplet /> Donation Info
        </h3>

        <p><b>Blood Group:</b> {donor.bloodGroup || "Not set"}</p>
        <p><b>Status:</b> {donor.availability || "available"}</p>
        <p><b>Last Donation:</b> {donor.lastDonationDate || "Not available"}</p>
      </div>

      {/* QUICK ACTION */}
      <button
        onClick={() => window.location.href = "/emergency"}
        className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
      >
        <FiAlertTriangle />
        Emergency Help
      </button>

      {/* HOSPITAL */}
      <button
        onClick={() => window.location.href = "/hospitals"}
        className="w-full bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <FiMapPin />
        Find Hospitals
      </button>

    </div>
  );
}