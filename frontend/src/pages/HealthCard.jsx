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

  const frontRef = useRef();
  const backRef = useRef();

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
    const front = await html2canvas(frontRef.current, { scale: 3 });
    const back = await html2canvas(backRef.current, { scale: 3 });

    const pdf = new jsPDF("landscape", "mm", [85.6, 54]);

    pdf.addImage(front.toDataURL(), "PNG", 0, 0, 85.6, 54);
    pdf.addPage([85.6, 54], "landscape");
    pdf.addImage(back.toDataURL(), "PNG", 0, 0, 85.6, 54);

    pdf.save("HealthCard.pdf");
  };

  if (loading) return <LoadingSpinner />;

  if (!card) {
    return <p className="text-center mt-10">Complete profile first</p>;
  }

  return (
    <div className="p-4 space-y-4">

      {/* FRONT */}
      <div
        ref={frontRef}
        className="rounded-2xl p-4 text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #0f172a, #0d9488)"
        }}
      >
        <h2 className="text-lg font-bold">{card.name}</h2>
        <p>Age: {calculateAge(card.dob)}</p>
        <p>Blood: {card.bloodGroup}</p>
        <p>Phone: {card.phone}</p>
        <p className="text-xs">{card.address}</p>

        <div className="mt-2 text-xs">
          🚨 {card.emergencyContact?.name}  
          ({card.emergencyContact?.phone})
        </div>
      </div>

      {/* BACK */}
      <div
        ref={backRef}
        className="rounded-2xl p-4 bg-white shadow flex flex-col items-center"
      >
        <QRCodeSVG value={qrValue} size={120} />

        <p className="text-xs mt-2 text-center">
          Scan for full details
        </p>

        <p><b>Allergies:</b> {safeArray(card.allergies).join(", ") || "None"}</p>
        <p><b>Diseases:</b> {safeArray(card.diseases).join(", ") || "None"}</p>
      </div>

      <button onClick={downloadPDF} className="btn-primary w-full">
        <FiDownload /> Download Card
      </button>

    </div>
  );
}