"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Introduction
            </h2>
            <p>
              Poppy Marketing & Consulting ("Company," "we," or "us") respects your privacy and is committed to protecting it through this Privacy Policy. This policy explains how we collect, use, protect, and disclose information when you use our advertising management platform powered by the Meta Graph API.
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
              <li>
                <strong>Facebook Login for Business:</strong> Your Meta/Facebook account information, business identity, and ad account access through the Facebook Login for Business OAuth process
              </li>
              <li>
                <strong>Meta Ad Account Data:</strong> Information accessed through our use of Meta Graph API permissions including:
                <ul className="list-circle list-inside ml-4 space-y-1 mt-1">
                  <li>Ad account details and account status</li>
                  <li>Campaign information including objectives, budgets, and performance data</li>
                  <li>Ad set targeting, budget, and status information</li>
                  <li>Ad creative data and ad performance metrics</li>
                  <li>Automated rule configurations and execution history</li>
                  <li>Business page information and insights</li>
                </ul>
              </li>
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
              <li>Authenticate you and provide access to our ad management services</li>
              <li>Display your Meta ad account data and campaign information</li>
              <li>Create, modify, and manage your ad campaigns, ad sets, and ads</li>
              <li>Set up and execute automated rules for your campaigns</li>
              <li>Respond to your requests and inquiries</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Enforce our Terms of Service and other agreements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Service Fees & Pricing
            </h2>
            <p>
              Poppy Marketing Ads Manager is offered as a service to assist you in managing your Meta advertising campaigns. The cost of using this Service is determined by the agreement between you and Poppy Marketing & Consulting. You are responsible for paying any service fees as specified in your service agreement with us.
            </p>
            <p className="mt-4">
              Please note that our Service fee is separate from and in addition to your Meta advertising spend. You are solely responsible for all costs incurred through your Meta ad accounts, including ad spend, campaign budgets, and any fees imposed by Meta. For specific information about pricing and service fees, please contact us at{" "}
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
              Data We Do Not Store Permanently
            </h2>
            <p>
              We access your Meta ad account data only to display it within our platform and process your requests. We do not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Store copies of your ad account data in our databases for longer than necessary to fulfill your request</li>
              <li>Sell, rent, or share your ad account data with third parties</li>
              <li>Use your data for purposes beyond operating this service</li>
              <li>Use your data to improve Meta's systems (unless required by law)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Meta Graph API Permissions
            </h2>
            <p>
              Our application uses the following Meta Graph API permissions to function:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>ads_management:</strong> To access and manage your ad accounts, campaigns, ad sets, and ads
              </li>
              <li>
                <strong>business_management:</strong> To access your business information and ad account details
              </li>
              <li>
                <strong>pages_show_list:</strong> To display your business pages
              </li>
              <li>
                <strong>pages_read_engagement:</strong> To show page engagement metrics
              </li>
            </ul>
            <p className="mt-4">
              You can revoke these permissions at any time by disconnecting our app from your Meta account in your Facebook Settings (Apps and Websites → Remove).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Data Protection & Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Specifically:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access tokens from Meta are used only for API requests and never stored long-term</li>
              <li>All communications with Meta API are encrypted via HTTPS</li>
              <li>Your authentication sessions are protected with secure session management</li>
              <li>Our server infrastructure is secured and regularly monitored</li>
              <li>We comply with Meta's Platform Policies and data protection requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Data Retention
            </h2>
            <p>
              We retain your data for as long as necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide our services to you</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-4">
              When you request deletion of your account, we will delete all personal information we maintain within 30 days, as detailed in our Data Deletion policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Your Rights & Choices
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (see our Data Deletion page)</li>
              <li>Revoke our app's access to your Meta account at any time</li>
              <li>Opt-out of non-essential communications</li>
              <li>Exercise any other rights provided under applicable privacy laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Third-Party Services
            </h2>
            <p>
              Our service integrates with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Meta (Facebook):</strong> We use Meta's Graph API and authentication services. Your data is subject to Meta's Data Policy, available at{" "}
                <a
                  href="https://www.facebook.com/about/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-poppy-dark-purple hover:underline"
                >
                  facebook.com/about/privacy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:{" "}
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
