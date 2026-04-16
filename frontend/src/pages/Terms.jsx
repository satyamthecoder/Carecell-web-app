import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-white to-[#E0E7FF] px-4 py-6">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-purple-700 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please read carefully before using CareCell
        </p>

        {/* SECTION */}
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

          {/* I */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              I. User Agreement & Eligibility
            </h2>

            <p><b>1. Acceptance:</b> By using CareCell, you agree to all terms.</p>
            <p><b>2. Eligibility:</b> Must be 18+ or under guardian supervision.</p>
            <p><b>3. User Roles:</b> Register as Patient or Donor correctly.</p>
          </section>

          {/* II */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              II. Data Collection & Privacy
            </h2>

            <p><b>4. Data Collection:</b> Personal, medical & location data may be collected.</p>
            <p><b>5. Privacy:</b> Data is encrypted and kept confidential.</p>
          </section>

          {/* III */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              III. Medical & AI Disclaimer
            </h2>

            <p><b>6. Medical Disclaimer:</b> Not a substitute for professional advice.</p>
            <p><b>7. AI Disclaimer:</b> AI may provide incorrect information.</p>
          </section>

          {/* IV */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              IV. Features Usage
            </h2>

            <p><b>8. QR Code:</b> You are responsible for shared data.</p>
            <p><b>9. Reports:</b> Uploaded voluntarily and securely.</p>
            <p><b>10. Location:</b> Optional, used for nearby services.</p>
            <p><b>11. Schemes:</b> No guarantee of approval.</p>
          </section>

          {/* V */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              V. Prohibited Activities
            </h2>

            <ul className="list-disc ml-5 space-y-1">
              <li>Providing false information</li>
              <li>Misusing the platform</li>
              <li>Unauthorized system access</li>
              <li>Illegal activities</li>
            </ul>
          </section>

          {/* VI */}
          <section>
            <h2 className="font-semibold text-purple-600 mb-2">
              VI. Liability & Security
            </h2>

            <p><b>13. Liability:</b> Not responsible for medical decisions.</p>
            <p><b>14. Security:</b> You are responsible for your account.</p>
            <p><b>15. Termination:</b> Accounts may be suspended if rules violated.</p>
            <p><b>16. Updates:</b> Terms may change anytime.</p>
            <p><b>17. Law:</b> Governed by Indian law.</p>
          </section>

          {/* FOOTER */}
          <div className="border-t pt-4 text-xs text-gray-400">
            CareCell – Team Elite 7
          </div>

        </div>
      </div>
    </div>
  );
}