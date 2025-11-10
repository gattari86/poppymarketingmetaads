"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-poppy-white">
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 text-2xl font-poppins font-bold text-poppy-dark-purple">
            <img src="/logo.png" alt="Poppy Logo" className="w-8 h-8" />
            <span>Poppy</span>
          </a>
          <Link href="/auth/signin" className="btn-primary text-sm">
            Back to Poppy Marketing Ads Manager
          </Link>
        </div>
      </nav>

      <Breadcrumb />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Poppy Marketing Ads Manager ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              2. License and Restrictions
            </h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for managing your Meta advertising accounts. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Reproduce, distribute, or transmit any content from the Service</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Use the service for illegal purposes or to violate any applicable laws</li>
              <li>Interfere with or disrupt the operation of the Service</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Remove or obscure any proprietary notices from the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              3. Meta API Usage & Compliance
            </h2>
            <p>
              This Service integrates with Meta's APIs to manage your advertising accounts. By using our Service, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Comply with Meta's Platform Policies available at{" "}
                <a
                  href="https://www.facebook.com/policies/platforms/apps-websites/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-poppy-dark-purple hover:underline"
                >
                  facebook.com/policies/platforms
                </a>
              </li>
              <li>Comply with Meta's Data Policy at{" "}
                <a
                  href="https://www.facebook.com/about/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-poppy-dark-purple hover:underline"
                >
                  facebook.com/about/privacy
                </a>
              </li>
              <li>Not use our Service to engage in spam, fraud, harassment, or deceptive practices</li>
              <li>Not violate any intellectual property rights</li>
              <li>Not create ads that violate Meta's ad policies</li>
              <li>Maintain the security of your Meta account credentials and access tokens</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mt-4">
              <strong>We are not responsible for any violations of Meta's policies</strong>. You are solely responsible for ensuring your use of our Service and your advertising campaigns comply with all applicable Meta policies and legal requirements. Violations may result in your Meta ad account being suspended or disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              4. Your Responsibilities
            </h2>
            <p>
              As a user of our Service, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>Restricting access to your computer or device used to access the Service</li>
              <li>Ensuring all information you provide is accurate and up-to-date</li>
              <li>Creating lawful and ethical advertising campaigns</li>
              <li>Complying with all applicable laws, regulations, and Meta policies</li>
              <li>Having appropriate rights to advertise products or services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              5. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" and "as available" without warranty of any kind, express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Specific results or outcomes from your advertising campaigns</li>
              <li>Accuracy of campaign analytics or performance data</li>
            </ul>
            <p className="mt-4">
              We make no warranty that the Service will meet your requirements, be available at all times, or be free of errors or viruses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, in no event shall Poppy Marketing & Consulting be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Suspension or termination of your Meta ad accounts</li>
              <li>Poor advertising performance or campaign results</li>
              <li>Changes to Meta's APIs or policies affecting the Service</li>
              <li>Any issues arising from Meta's systems or services</li>
            </ul>
            <p className="mt-4">
              Regardless of the cause and whether or not we have been advised of the possibility of such damage, our total liability to you shall not exceed the amount you have paid us in the past 12 months for using the Service (or $100 USD, whichever is less).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              7. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to the Service at any time, with or without cause, and with or without notice. You may terminate your account at any time by disconnecting the Service from your Meta account. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Your access to the Service will be immediately revoked</li>
              <li>Any data we maintain will be deleted within 30 days (see Data Deletion policy)</li>
              <li>You remain responsible for any campaigns or ads created during your use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              8. Changes to Terms & Service
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes become effective immediately upon posting to the Service. Your continued use of the Service following any modifications constitutes your acceptance of the modified Terms. We will notify users of any material changes via email when possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              9. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the state and federal courts located in the jurisdiction where we operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              10. Entire Agreement
            </h2>
            <p>
              These Terms, along with our Privacy Policy and Data Deletion Policy, constitute the entire agreement between you and Poppy Marketing & Consulting regarding your use of the Service and supersede all prior or contemporaneous communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              11. Pricing & Costs
            </h2>
            <p>
              Poppy Marketing Ads Manager is offered as a service to assist you in managing your Meta advertising campaigns. The cost of using this Service is determined by the agreement between you and Poppy Marketing & Consulting. You are responsible for paying any fees as specified in your service agreement with Poppy Marketing & Consulting.
            </p>
            <p className="mt-4">
              The Service does not include the cost of your Meta advertising spend itself. You are solely responsible for all ad spend costs incurred through your Meta ad accounts. Our Service fee is separate from and in addition to any advertising budgets you allocate to your campaigns.
            </p>
            <p className="mt-4">
              For specific information about pricing, including Service fees, renewal terms, or payment details, please refer to your separate service agreement with Poppy Marketing & Consulting or contact our sales team at{" "}
              <a
                href="mailto:support@poppymarketingandconsulting.com"
                className="text-poppy-dark-purple hover:underline"
              >
                support@poppymarketingandconsulting.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              12. Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact us at:{" "}
              <a
                href="mailto:support@poppymarketingandconsulting.com"
                className="text-poppy-dark-purple hover:underline"
              >
                support@poppymarketingandconsulting.com
              </a>
            </p>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
