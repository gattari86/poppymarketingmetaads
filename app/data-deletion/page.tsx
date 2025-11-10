"use client";

import { useState } from "react";

export default function DataDeletion() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, requestedAt: new Date().toISOString() }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-poppy-white">
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-poppins font-bold text-poppy-dark-purple">
            Poppy
          </a>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-8">
          Data Deletion Request
        </h1>

        <div className="card mb-8">
          <p className="text-gray-700 mb-6">
            We take your privacy seriously. You have the right to request deletion of your personal data from our systems.
          </p>
          <p className="text-gray-700 mb-6">
            Submitting a request below will initiate the data deletion process. We will process your request within 30 days and confirm via email.
          </p>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-xl font-poppins font-semibold text-green-800 mb-2">
                Request Submitted
              </h2>
              <p className="text-green-700 mb-4">
                We have received your data deletion request. You will receive a confirmation email shortly.
              </p>
              <p className="text-sm text-green-600">
                Your data will be deleted within 30 days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This must be the email associated with your account
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Request Data Deletion"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Alternative Methods
            </h2>
            <p className="text-gray-700 mb-4">
              You can also request data deletion by emailing us directly:
            </p>
            <a
              href="mailto:support@poppymarketingandconsulting.com?subject=Data%20Deletion%20Request"
              className="inline-block px-6 py-3 bg-poppy-light-purple text-white rounded-lg font-semibold hover:bg-poppy-purple transition-colors"
            >
              Email Support
            </a>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-poppins font-semibold text-blue-900 mb-3">
              Data Deletion Information
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Processing time: within 30 days of request</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>You will receive a confirmation email</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Includes all personal data associated with your account</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">•</span>
                <span>Does not include data required by law to retain</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
