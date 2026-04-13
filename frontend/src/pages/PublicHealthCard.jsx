import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";

export default function PublicHealthCard() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const safeArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return [val];
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/healthcard/public/${userId}`);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <LoadingSpinner />;

  if (!data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-red-500 font-semibold">No data found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* HEADER */}
      <div className="bg-red-500 text-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold">{data.name}</h2>
        <p>Blood Group: {data.bloodGroup || "N/A"}</p>
        <p>Phone: {data.phone || "N/A"}</p>
      </div>

      {/* EMERGENCY */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h3 className="font-bold mb-2 text-red-500">🚨 Emergency Contact</h3>
        <p>Name: {data.emergencyContact?.name || "-"}</p>
        <p>Relation: {data.emergencyContact?.relation || "-"}</p>
        <p>Phone: {data.emergencyContact?.phone || "-"}</p>
      </div>

      {/* MEDICAL */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h3 className="font-bold mb-2">🧬 Medical Info</h3>

        <p>
          <b>Diseases:</b>{" "}
          {safeArray(data.diseases).join(", ") || "None"}
        </p>

        <p>
          <b>Allergies:</b>{" "}
          {safeArray(data.allergies).join(", ") || "None"}
        </p>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h3 className="font-bold mb-2">📍 Address</h3>
        <p>{data.address || "Not available"}</p>
      </div>

      {/* DISCLAIMER */}
      <div className="text-xs text-gray-500 mt-6 text-center">
        This information is provided by the patient for emergency use only.
      </div>

    </div>
  );
}