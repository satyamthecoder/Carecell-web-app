/*
import React, { useState } from "react";

export default function TermsModal({ isOpen, onClose, onAccept }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) setScrolledToBottom(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">

        {/* HEADER *//*
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-purple-700">
            Terms & Conditions
          </h2>
        </div>

        {/* CONTENT *//*
        <div
          onScroll={handleScroll}
          className="h-64 overflow-y-auto p-4 text-sm text-gray-600 space-y-2"
        >
          <p><b>Acceptance of Terms:</b> By using CareCell, you agree to all conditions.</p>
          <p><b>Eligibility:</b> Must be 18+ or under guardian supervision.</p>
          <p><b>Medical Disclaimer:</b> Not a substitute for professional advice.</p>
          <p><b>Data Privacy:</b> Your data is securely stored and confidential.</p>
          <p><b>AI Disclaimer:</b> AI may provide inaccurate info.</p>
          <p><b>Prohibited:</b> No misuse, false data, or illegal activity.</p>

          {/* simulate long content *//*
          <div className="h-40"></div>
        </div>

        {/* FOOTER *//*
        <div className="p-4 border-t flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-500"
          >
            Cancel
          </button>

          <button
            disabled={!scrolledToBottom}
            onClick={onAccept}
            className={`px-4 py-2 rounded-lg text-white ${
              scrolledToBottom
                ? "bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}*/

//w term and condition 

import React, { useState } from "react";

export default function TermsModal({ isOpen, onClose, onAccept }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;

    if (bottom) setScrolledToBottom(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-green-700">
            CareCell Terms & Conditions
          </h2>
        </div>

        {/* CONTENT */}
        <div
          onScroll={handleScroll}
          className="h-72 overflow-y-auto p-4 text-sm text-gray-700 space-y-4"
        >

          <p>
            By using CareCell, you agree to these Terms. If you do not agree, stop using the platform immediately.
          </p>

          <h3 className="font-semibold">1. Eligibility</h3>
          <ul className="list-disc ml-5">
            <li>Must be 18+ or under guardian supervision</li>
            <li>Donors must be medically fit (18–65)</li>
            <li>Platform is intended for use in India</li>
          </ul>

          <h3 className="font-semibold">2. User Roles</h3>
          <p>
            Users register as Patient or Donor. Your role determines access to features.
          </p>

          <h3 className="font-semibold">3. Medical Disclaimer</h3>
          <p className="text-red-600 font-medium">
            CareCell is NOT a medical provider. Always consult a licensed doctor.
          </p>

          <h3 className="font-semibold">4. Emergency Warning</h3>
          <p className="text-red-600">
            In life-threatening emergencies, call 108 immediately. Do NOT rely on the app.
          </p>

          <h3 className="font-semibold">5. Data Usage</h3>
          <ul className="list-disc ml-5">
            <li>We collect personal and medical data for matching and emergency use</li>
            <li>We DO NOT sell your data</li>
            <li>Location is used only for emergency features</li>
          </ul>

          <h3 className="font-semibold">6. Donor Responsibility</h3>
          <p>
            Donors must ensure eligibility and update availability accurately.
          </p>

          <h3 className="font-semibold">7. Platform Limitations</h3>
          <ul className="list-disc ml-5">
            <li>No guarantee of donor availability</li>
            <li>No guarantee of scheme approval</li>
            <li>AI responses may be inaccurate</li>
          </ul>

          <h3 className="font-semibold">8. Prohibited Activities</h3>
          <ul className="list-disc ml-5">
            <li>No false data or impersonation</li>
            <li>No misuse of donor alerts</li>
            <li>No data scraping</li>
          </ul>

          <h3 className="font-semibold">9. Liability</h3>
          <p>
            CareCell is not responsible for medical outcomes, delays, or donor actions.
          </p>

          <h3 className="font-semibold">10. Governing Law</h3>
          <p>
            Governed by Indian law. Jurisdiction: Vadodara, Gujarat.
          </p>

          <h3 className="font-semibold">11. Contact</h3>
          <p>
            Team Elite7 – IIIT Vadodara <br />
            Email: (add your email)
          </p>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-between items-center">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          <button
            disabled={!scrolledToBottom}
            onClick={onAccept}
            className={`px-4 py-2 rounded-lg text-white ${
              scrolledToBottom
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}