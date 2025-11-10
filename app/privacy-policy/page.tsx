export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Introduction
            </h2>
            <p>
              Poppy Marketing & Consulting ("Company," "we," or "us") respects your privacy and is committed to protecting it through this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly through:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Facebook Login for Business authentication</li>
              <li>Forms on our website</li>
              <li>Support requests and inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Authenticate you and provide access to our services</li>
              <li>Respond to your requests and inquiries</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Data Protection
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:{" "}
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
