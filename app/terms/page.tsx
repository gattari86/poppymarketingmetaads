export default function Terms() {
  return (
    <div className="min-h-screen bg-poppy-white">
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/" className="text-2xl font-poppins font-bold text-poppy-dark-purple">
            Poppy
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Poppy Marketing Ads Manager ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              License and Restrictions
            </h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal use. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Reproduce, distribute, or transmit any content</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Use the service for illegal purposes</li>
              <li>Interfere with the service's operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Meta API Usage
            </h2>
            <p>
              This Service integrates with Meta's APIs to manage your advertising accounts. You must comply with Meta's Terms of Service and Platform Policies when using our Service. We are not responsible for any violations of Meta's policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Limitation of Liability
            </h2>
            <p>
              In no event shall Poppy Marketing & Consulting be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Contact Us
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
