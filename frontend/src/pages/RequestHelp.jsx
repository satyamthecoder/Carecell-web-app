import React, { useState } from "react";

export default function RequestHelp() {
  const [form, setForm] = useState({
    patientName: "",
    title: "",
    description: "",
    requiredAmount: "",
    proof: "",
    accountNumber: "",
    ifsc: "",
    upi: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {
    if (!form.patientName || !form.title || !form.requiredAmount) {
      alert("Fill required fields");
      return;
    }

    const payload = {
      patientName: form.patientName,
      title: form.title,
      description: form.description,
      requiredAmount: Number(form.requiredAmount),

      proof: form.proof,

      bankDetails: {
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        upi: form.upi
      }
    };

    try {
      await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      alert("Request submitted (Pending approval)");

      setForm({
        patientName: "",
        title: "",
        description: "",
        requiredAmount: "",
        proof: "",
        accountNumber: "",
        ifsc: "",
        upi: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    }
  };

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">Request Help</h2>

      {/* NAME */}
      <input
        name="patientName"
        placeholder="Patient Name"
        value={form.patientName}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* TITLE */}
      <input
        name="title"
        placeholder="Title (e.g. Surgery Help)"
        value={form.title}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* DESCRIPTION */}
      <textarea
        name="description"
        placeholder="Describe the problem"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* AMOUNT */}
      <input
        name="requiredAmount"
        type="number"
        placeholder="Required Amount"
        value={form.requiredAmount}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* PROOF (URL for now) */}
      <input
        name="proof"
        placeholder="Proof Image URL"
        value={form.proof}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <h3 className="font-bold mt-4 mb-2">Bank Details</h3>

      {/* ACCOUNT */}
      <input
        name="accountNumber"
        placeholder="Account Number"
        value={form.accountNumber}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* IFSC */}
      <input
        name="ifsc"
        placeholder="IFSC Code"
        value={form.ifsc}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* UPI */}
      <input
        name="upi"
        placeholder="UPI ID"
        value={form.upi}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={submit}
        className="bg-red-500 text-white px-4 py-2 w-full"
      >
        Submit Request
      </button>
    </div>
  );
}