

import React, { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiDownload } from "react-icons/fi";
import { patientAPI } from "../utils/api";
import useAuthStore from "../context/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function HealthCard() {
  const { user } = useAuthStore();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef();

  const safeArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birth = new Date(dob);
    return new Date().getFullYear() - birth.getFullYear();
  };

  useEffect(() => {
    if (!user?._id) return;

    patientAPI.getHealthCard(user._id)
      .then(res => setCard(res.healthCard))
      .finally(() => setLoading(false));
  }, [user]);

  const qrValue = `${window.location.origin}/public-healthcard/${user?._id}`;

  const downloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 3 });

    const pdf = new jsPDF("landscape", "mm", [85.6, 54]);
    pdf.addImage(canvas.toDataURL(), "PNG", 0, 0, 85.6, 54);

    pdf.save("HealthCard.pdf");
  };

  if (loading) return <LoadingSpinner />;

  if (!card) {
    return <p className="text-center mt-10">Complete profile first</p>;
  }

  return (
    <div className="p-4 space-y-6 flex flex-col items-center">

      {/* 🔥 SINGLE CARD */}
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-2xl p-4 text-white shadow-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #b91c1c, #ef4444)"
        }}
      >
        {/* design circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />

        {/* header */}
        <p className="text-xs opacity-80">CARECELL NETWORK</p>

        <h2 className="text-lg font-bold mt-1">{card.name}</h2>

        {/* QR */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow">
          <QRCodeSVG value={qrValue} size={60} />
        </div>

        {/* BASIC INFO */}
        <div className="mt-4 space-y-1 text-sm">
          <p>Age: {calculateAge(card.dob)}</p>
          <p>Phone: {card.phone}</p>
        </div>

        {/* BLOOD */}
        <div className="mt-4 bg-white/20 rounded-lg p-2 text-xs w-fit">
          <p className="opacity-80">Blood Group</p>
          <p className="font-semibold">{card.bloodGroup || "N/A"}</p>
        </div>

        {/* ADDRESS */}
        <div className="mt-3 text-xs">
          <b>Address:</b> {card.address || "N/A"}
        </div>

        {/* MEDICAL */}
        <div className="mt-2 text-xs">
          <p><b>Allergies:</b> {safeArray(card.allergies).join(", ") || "None"}</p>
          <p><b>Diseases:</b> {safeArray(card.diseases).join(", ") || "None"}</p>
        </div>

        {/* EMERGENCY */}
        <div className="mt-3 text-xs">
          🚨 {card.emergencyContact?.name} ({card.emergencyContact?.phone})
        </div>
      </div>

      {/* DOWNLOAD */}
      <button onClick={downloadPDF} className="btn-primary w-full max-w-sm">
        <FiDownload /> Download Card
      </button>

    </div>
  );
}