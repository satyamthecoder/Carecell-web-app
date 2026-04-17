
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiSave, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../context/authStore";
import { authAPI, patientProfileAPI } from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bloodGroup: "",
    diseases: [],
    allergies: [],
    medications: [],
    surgeries: "",
    emergencyContact: { name: "", relation: "", phone: "" },
    consent: false
  });

  const safeArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string")
      return val.split(",").map(i => i.trim()).filter(Boolean);
    return [];
  };

  // 🔥 FIXED: Proper sync
  useEffect(() => {
    if (!user?._id) return;

    const load = async () => {
      try {
        const res = await patientProfileAPI.getProfile(user._id);

        if (res?.patient) {
          const p = res.patient;

          setForm(prev => ({
            ...prev,
            ...p,
            name: user?.name || "",
            phone: user?.phone || "",
            diseases: safeArray(p.diseases),
            allergies: safeArray(p.allergies),
            medications: safeArray(p.medications),
            emergencyContact: p.emergencyContact || {
              name: "",
              relation: "",
              phone: ""
            }
          }));
        } else {
          // fallback if no patient profile yet
          setForm(prev => ({
            ...prev,
            name: user?.name || "",
            phone: user?.phone || ""
          }));
        }
      } catch {
        // fallback if API fails
        setForm(prev => ({
          ...prev,
          name: user?.name || "",
          phone: user?.phone || ""
        }));
      }
    };

    load();
  }, [user]);

  const handleSave = async () => {
    if (!form.consent) return toast.error("Accept declaration");

    setSaving(true);

    try {
      await authAPI.updateProfile({
        name: form.name,
        phone: form.phone
      });

      updateUser({
        ...user,
        name: form.name,
        phone: form.phone
      });

      await patientProfileAPI.saveProfile({
        ...form,
        userId: user._id
      });

      toast.success("Profile saved");
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4 flex justify-center">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 text-white flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{user?.name}</h2>
            <p className="text-sm opacity-80">{user?.phone}</p>
            <p className="text-xs opacity-70">patient</p>
          </div>
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0)}
          </div>
        </div>

        <div className="p-5 space-y-5">

          <h2 className="text-center font-semibold text-lg">
            welcome to CareCell
          </h2>

          {/* PROFILE CARD */}
          <div className="bg-gray-50 rounded-2xl p-4 relative shadow">

            <button
              onClick={() => setEditing(!editing)}
              className="absolute right-3 top-3 text-blue-500"
            >
              <FiEdit2 />
            </button>

            {editing ? (
              <div className="space-y-3">

                <Field label="Name">
                  <input value={form.name} disabled className="input-field bg-gray-100" />
                </Field>

                <Field label="Phone">
                  <input value={form.phone} disabled className="input-field bg-gray-100" />
                </Field>

                <Field label="Date of Birth">
                  <input
                    type="date"
                    value={form.dob || ""}
                    onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                <Field label="Blood Group">
                  <select
                    value={form.bloodGroup}
                    onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>O+</option>
                    <option>AB+</option>
                    <option>A-</option>
                    <option>B-</option>
                    <option>O-</option>
                    <option>AB-</option>
                  </select>
                </Field>

                <Field label="Address">
                  <input value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="City">
                  <input value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="State">
                  <input value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="Pincode">
                  <input value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="Diseases">
                  <input value={form.diseases.join(", ")}
                    onChange={e => setForm({
                      ...form,
                      diseases: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                    })}
                    className="input-field"
                  />
                </Field>

                <Field label="Allergies">
                  <input value={form.allergies.join(", ")}
                    onChange={e => setForm({
                      ...form,
                      allergies: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                    })}
                    className="input-field"
                  />
                </Field>

                <Field label="Medications">
                  <input value={form.medications.join(", ")}
                    onChange={e => setForm({
                      ...form,
                      medications: e.target.value.split(",").map(i => i.trim()).filter(Boolean)
                    })}
                    className="input-field"
                  />
                </Field>

                <Field label="Past Surgeries">
                  <input value={form.surgeries}
                    onChange={e => setForm({ ...form, surgeries: e.target.value })}
                    className="input-field"
                  />
                </Field>

                <Field label="Emergency Contact Name">
                  <input value={form.emergencyContact.name}
                    onChange={e => setForm({
                      ...form,
                      emergencyContact: { ...form.emergencyContact, name: e.target.value }
                    })}
                    className="input-field"
                  />
                </Field>

                <Field label="Emergency Contact Phone">
                  <input value={form.emergencyContact.phone}
                    onChange={e => setForm({
                      ...form,
                      emergencyContact: { ...form.emergencyContact, phone: e.target.value }
                    })}
                    className="input-field"
                  />
                </Field>

                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={e => setForm({ ...form, consent: e.target.checked })}
                  />
                  I agree to share medical info
                </label>

                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white py-2 rounded-xl flex justify-center gap-2"
                >
                  <FiSave /> {saving ? "Saving..." : "Save"}
                </button>

              </div>
            ) : (
              <div className="text-sm space-y-2">
                <p><b>Name:</b> {form.name}</p>
                <p><b>Phone:</b> {form.phone}</p>
                <p><b>Gender:</b> {form.gender}</p>
                <p><b>City:</b> {form.city}</p>
                <p><b>Blood Group:</b> {form.bloodGroup}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Action title="Health Card" onClick={() => navigate("/health-card")} />
            <Action title="Emergency" onClick={() => navigate("/emergency")} />
          </div>

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-gray-100 text-red-500 font-semibold flex justify-center gap-2"
          >
            <FiLogOut /> Logout
          </button>

        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function Action({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl text-center shadow cursor-pointer"
    >
      {title}
    </div>
  );
}
