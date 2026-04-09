import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicHealthCard() {
  const { userId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/healthcard/public/${userId}`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-4">

      <h2 className="text-xl font-bold">Emergency Health Info</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <p><b>Name:</b> {data.name}</p>
        <p><b>Blood Group:</b> {data.bloodGroup}</p>

        <p><b>Allergies:</b> {data.allergies?.join(", ") || "None"}</p>
        <p><b>Diseases:</b> {data.diseases?.join(", ") || "None"}</p>

        <p><b>Emergency Contact:</b> {data.emergencyContact?.phone}</p>
      </div>

    </div>
  );
}