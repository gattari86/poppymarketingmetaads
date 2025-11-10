"use client";

import { useState } from "react";
import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

const FORMSPREE_ID = "mzzybzwr";

export default function DataDeletion() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: `Data Deletion Request\n\nEmail: ${email}\nRequested at: ${new Date().toISOString()}\n\nThis user has requested deletion of their personal data from the Poppy Marketing Ads Manager system.`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Failed to submit request. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setError("An error occurred. Please try again or email support@poppymarketingandconsulting.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-poppy-white">
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-poppins font-bold text-poppy-dark-purple">
            Poppy
          </a>
          <Link href="/auth/signin" className="btn-primary text-sm">
            Back to Poppy Marketing Ads Manager
          </Link>
        </div>
      </nav>

      <Breadcrumb />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-8">
          Data Deletion Request
        </h1>

        <div className="card mb-8">
          <p className="text-gray-700 mb-6">
            We take your privacy seriously. You have the right to request deletion of your personal data from our systems. This form provides an easy way to submit your data deletion request.
          </p>
          <p className="text-gray-700 mb-6">
            Submitting your email below will initiate our data deletion process. We will contact you at your provided email address within 2-5 business days to verify your identity and confirm the deletion request before proceeding.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>📧 Important:</strong> You must be able to access the email address you provide, as we will send a verification message to confirm your identity before deleting your data.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-xl font-poppins font-semibold text-green-800 mb-2">
                Request Submitted Successfully
              </h2>
              <p className="text-green-700 mb-4">
                We have received your data deletion request and sent it to our support team.
              </p>
              <p className="text-sm text-green-600 mb-4">
                <strong>Next steps:</strong> Please check your email for a verification message. We will contact you within 2-5 business days to confirm your identity before proceeding with deletion. Your data will be permanently deleted within 30 days of verification.
              </p>
              <p className="text-xs text-green-500 mt-4">
                If you don't receive an email within 24 hours, please contact us at support@poppymarketingandconsulting.com
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
                  This must be the email associated with your Poppy account
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Data Deletion Request"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Data Deletion Process
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poppy-light-purple text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Submit Request</h4>
                  <p className="text-gray-600 text-sm">
                    Fill out the form above or email us directly with your email address
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poppy-light-purple text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Verification (2-5 business days)</h4>
                  <p className="text-gray-600 text-sm">
                    We will send a confirmation email to verify your identity and confirm the deletion request
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-poppy-light-purple text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Processing (Up to 30 days)</h4>
                  <p className="text-gray-600 text-sm">
                    We will delete all your data from our systems. You will receive a final confirmation email
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              What Gets Deleted
            </h2>
            <p className="text-gray-700 mb-4">
              When you request data deletion, we will remove:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-poppy-light-purple font-bold">•</span>
                <span>Your account information and authentication data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-poppy-light-purple font-bold">•</span>
                <span>Any session tokens or access credentials</span>
              </li>
              <li className="flex gap-3">
                <span className="text-poppy-light-purple font-bold">•</span>
                <span>Request logs and audit trails associated with your account</span>
              </li>
              <li className="flex gap-3">
                <span className="text-poppy-light-purple font-bold">•</span>
                <span>Support communications and inquiries</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4 text-sm">
              <strong>Note:</strong> Data deletion does NOT affect your Meta/Facebook ad accounts. You must manage those separately through Meta's systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              What We Cannot Delete
            </h2>
            <p className="text-gray-700 mb-4">
              We are legally required to retain certain data:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span>Legal and compliance records (for tax, audit, or legal purposes)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span>Financial transaction records (for accounting purposes)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400 font-bold">•</span>
                <span>Data required by applicable law or court order</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Alternative Methods
            </h2>
            <p className="text-gray-700 mb-4">
              You can also request data deletion directly by emailing:
            </p>
            <a
              href="mailto:support@poppymarketingandconsulting.com?subject=Data%20Deletion%20Request"
              className="inline-block px-6 py-3 bg-poppy-light-purple text-white rounded-lg font-semibold hover:bg-poppy-purple transition-colors"
            >
              Email Data Deletion Request
            </a>
            <p className="text-gray-600 text-sm mt-3">
              Include "Data Deletion Request" in your subject line and your account email address in the message body.
            </p>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-poppins font-semibold text-blue-900 mb-3">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-sm text-blue-900">
              <div>
                <p className="font-semibold mb-1">How long does deletion take?</p>
                <p>
                  We aim to complete deletion within 30 days of your verified request. Most deletions are completed within 2 weeks.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Can I undo a deletion request?</p>
                <p>
                  You can cancel a request during the verification period (2-5 business days). After processing begins, deletion is permanent.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">What about my Meta ad accounts?</p>
                <p>
                  Your Meta ad account data is not affected by our deletion. To delete that data, manage it directly through Meta's settings.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">How do I verify my identity?</p>
                <p>
                  We will send a verification link to your email address. Simply click the link to confirm your deletion request.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Questions or Concerns?
            </h2>
            <p className="text-gray-700">
              If you have any questions about the data deletion process, please contact us at:{" "}
              <a
                href="mailto:support@poppymarketingandconsulting.com"
                className="text-poppy-dark-purple hover:underline font-semibold"
              >
                support@poppymarketingandconsulting.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
