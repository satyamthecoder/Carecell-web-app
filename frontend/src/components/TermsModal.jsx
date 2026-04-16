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

        {/* HEADER */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-purple-700">
            Terms & Conditions
          </h2>
        </div>

        {/* CONTENT */}
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

          {/* simulate long content */}
          <div className="h-40"></div>
        </div>

        {/* FOOTER */}
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
}