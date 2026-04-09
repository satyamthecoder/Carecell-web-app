import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import {
  FiDownload, FiEdit2, FiSave, FiPlus, FiX
} from "react-icons/fi";
import { patientAPI } from "../utils/api";
import useAuthStore from "../context/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

const bloodGroups = ["A", "B", "AB", "O"];
const rhFactors = ["+", "-"];

export default function HealthCard() {
  const { user } = useAuthStore();

  const [card, setCard] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cardRef = useRef();

  const [form, setForm] = useState({
    name: "",
    bloodGroup: "A",
    rhFactor: "+",
    allergies: [],
    medications: [],
    address: "",
    gender: "",
    dob: "",
    healthId: "",
    diabetes: { has: false, type: "", sugarLevel: "" },
    emergencyContacts: [{ name: "", phone: "", relation: "" }]
  });

  // ✅ SAFE FETCH
  useEffect(() => {
    patientAPI.getHealthCard()
      .then(d => {
        if (d.healthCard) {
          const safe = {
            name: d.healthCard.name || "",
            bloodGroup: d.healthCard.bloodGroup || "A",
            rhFactor: d.healthCard.rhFactor || "+",
            allergies: d.healthCard.allergies || [],
            medications: d.healthCard.medications || [],
            address: d.healthCard.address || "",
            gender: d.healthCard.gender || "",
            dob: d.healthCard.dob || "",
            healthId: d.healthCard.healthId || "",
            diabetes: d.healthCard.diabetes || { has: false, type: "", sugarLevel: "" },
            emergencyContacts:
              d.healthCard.emergencyContacts?.length
                ? d.healthCard.emergencyContacts
                : [{ name: "", phone: "", relation: "" }]
          };

          setCard(d.healthCard);
          setForm(safe);
        } else {
          setEditing(true);
        }
      })
      .catch(() => setEditing(true))
      .finally(() => setLoading(false));
  }, []);

  // SAVE
  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await patientAPI.saveHealthCard(form);
      setCard(data.healthCard);
      setEditing(false);
      toast.success("Saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // CONTACT
  const addContact = () => {
    setForm({
      ...form,
      emergencyContacts: [...form.emergencyContacts, { name: "", phone: "", relation: "" }]
    });
  };

  const removeContact = (i) => {
    const arr = form.emergencyContacts.filter((_, idx) => idx !== i);
    setForm({ ...form, emergencyContacts: arr });
  };

  const updateContact = (i, key, value) => {
    const arr = [...form.emergencyContacts];
    arr[i][key] = value;
    setForm({ ...form, emergencyContacts: arr });
  };

  // DOWNLOAD
  const downloadCard = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement("a");
    link.download = "HealthCard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) return <LoadingSpinner />;

  // ✅ REAL QR LINK
  const qrValue = `${window.location.origin}/public-healthcard/${user?.id}`;

  return (
    <div className="p-4 bg-gray-50 min-h-screen space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Health Card</h2>

        {card && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-200 px-3 py-1 rounded-lg flex gap-1 items-center"
          >
            <FiEdit2 size={14} /> Edit
          </button>
        )}
      </div>

      {/* 🔥 CARD */}
      {card && !editing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            ref={cardRef}
            className="rounded-3xl p-5 text-white shadow-xl"
            style={{
              background: "linear-gradient(135deg,#6366f1,#14b8a6)"
            }}
          >

            {/* TOP */}
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{card.name}</h3>
                <p className="text-sm opacity-80">
                  {card.gender} • {card.dob}
                </p>
              </div>

              <QRCodeSVG value={qrValue} size={70} bgColor="white" />
            </div>

            {/* EMERGENCY */}
            <div className="bg-white/20 rounded-xl p-3 mb-3">
              <p className="text-xs opacity-80">Emergency Info</p>

              <p className="text-xl font-bold">
                {card.bloodGroup}{card.rhFactor}
              </p>

              {(card.allergies || []).length > 0 && (
                <p className="text-yellow-200 text-sm">
                  ⚠️ {(card.allergies || []).join(", ")}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            {card.address && (
              <p className="text-sm opacity-90">
                📍 {card.address}
              </p>
            )}

            {/* DIABETES */}
            {card.diabetes?.has && (
              <p className="text-sm mt-2">
                🩺 {card.diabetes.type} ({card.diabetes.sugarLevel})
              </p>
            )}

            {/* CONTACT */}
            {card.emergencyContacts?.[0] && (
              <div className="mt-3">
                <p className="text-xs opacity-70">Emergency Contact</p>
                <p className="font-semibold">
                  {card.emergencyContacts[0].name}
                </p>
                <p>{card.emergencyContacts[0].phone}</p>
              </div>
            )}
          </div>

          <button
            onClick={downloadCard}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl flex justify-center gap-2"
          >
            <FiDownload /> Download
          </button>
        </motion.div>
      )}

      {/* ✏️ EDIT FORM */}
      {editing && (
        <div className="space-y-4">

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />

          <input
            type="date"
            value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })}
            className="input-field"
          />

          <input
            placeholder="Gender"
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
            className="input-field"
          />

          <input
            placeholder="Health ID"
            value={form.healthId}
            onChange={e => setForm({ ...form, healthId: e.target.value })}
            className="input-field"
          />

          {/* BLOOD */}
          <div className="flex gap-2 flex-wrap">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setForm({ ...form, bloodGroup: bg })}
                className={`px-3 py-1 rounded ${
                  form.bloodGroup === bg ? "bg-indigo-500 text-white" : "bg-gray-200"
                }`}
              >
                {bg}
              </button>
            ))}
            {rhFactors.map(rh => (
              <button
                key={rh}
                onClick={() => setForm({ ...form, rhFactor: rh })}
                className={`px-3 py-1 rounded ${
                  form.rhFactor === rh ? "bg-teal-500 text-white" : "bg-gray-200"
                }`}
              >
                {rh}
              </button>
            ))}
          </div>

          <input
            placeholder="Allergies"
            value={(form.allergies || []).join(",")}
            onChange={e =>
              setForm({ ...form, allergies: e.target.value.split(",") })
            }
            className="input-field"
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="input-field"
          />

          {/* DIABETES */}
          <div className="card">
            <select
              value={form.diabetes?.has}
              onChange={e =>
                setForm({
                  ...form,
                  diabetes: { ...form.diabetes, has: e.target.value === "true" }
                })
              }
            >
              <option value="false">No Diabetes</option>
              <option value="true">Has Diabetes</option>
            </select>

            {form.diabetes?.has && (
              <>
                <input
                  placeholder="Type"
                  className="input-field"
                  onChange={e =>
                    setForm({
                      ...form,
                      diabetes: { ...form.diabetes, type: e.target.value }
                    })
                  }
                />
                <input
                  placeholder="Sugar Level"
                  className="input-field"
                  onChange={e =>
                    setForm({
                      ...form,
                      diabetes: { ...form.diabetes, sugarLevel: e.target.value }
                    })
                  }
                />
              </>
            )}
          </div>

          {/* CONTACT */}
          {(form.emergencyContacts || []).map((c, i) => (
            <div key={i} className="card space-y-2 relative">
              {i > 0 && (
                <button
                  onClick={() => removeContact(i)}
                  className="absolute right-2 top-2 text-red-500"
                >
                  <FiX />
                </button>
              )}

              <input
                placeholder="Name"
                value={c.name}
                onChange={e => updateContact(i, "name", e.target.value)}
                className="input-field"
              />

              <input
                placeholder="Phone"
                value={c.phone}
                onChange={e => updateContact(i, "phone", e.target.value)}
                className="input-field"
              />

              <input
                placeholder="Relation"
                value={c.relation}
                onChange={e => updateContact(i, "relation", e.target.value)}
                className="input-field"
              />
            </div>
          ))}

          <button onClick={addContact} className="text-indigo-600 flex gap-1 items-center">
            <FiPlus /> Add Contact
          </button>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl flex justify-center gap-2"
          >
            <FiSave /> Save
          </button>
        </div>
      )}

    </div>
  );
}