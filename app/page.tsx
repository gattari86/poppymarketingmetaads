"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-poppy-light-purple/5 via-white to-poppy-light-purple/10">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-poppins font-bold text-poppy-dark-purple hover:text-poppy-purple transition-colors"
          >
            <span className="w-8 h-8 bg-gradient-to-br from-poppy-light-purple to-poppy-dark-purple rounded-lg flex items-center justify-center text-white text-sm font-bold">
              P
            </span>
            <span>Poppy</span>
          </Link>

          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="btn-primary"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="btn-primary"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-gray-900 mb-6">
            Welcome to Poppy Marketing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Thank you for visiting our platform. Poppy Marketing Ads Manager is your all-in-one solution for managing Meta/Facebook advertising campaigns with ease and efficiency.
          </p>

          {status !== "authenticated" && (
            <Link
              href="/auth/signin"
              className="inline-block btn-primary text-lg px-8 py-4"
            >
              Sign In to Get Started
            </Link>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-poppins font-bold text-gray-900 mb-12 text-center">
            What You Can Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-soft transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
                Campaign Management
              </h3>
              <p className="text-gray-600">
                Create, manage, and optimize your Meta advertising campaigns from a centralized dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-soft transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
                Automated Rules
              </h3>
              <p className="text-gray-600">
                Set up intelligent automation rules to manage your campaigns and respond to performance metrics automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-soft transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your data is protected with industry-standard security practices and full compliance with Meta's policies.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="mb-20">
          <div className="bg-poppy-light-purple/10 border border-poppy-light-purple/30 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-6">
              About This Platform
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Poppy Marketing Ads Manager is built to simplify your advertising workflow. Whether you're managing a single campaign or multiple ad accounts, our platform provides the tools you need to succeed.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              With seamless integration with Meta's Graph API, you can manage all aspects of your advertising campaigns directly from our intuitive interface.
            </p>
            <p className="text-lg text-gray-700">
              Sign in with your Meta Business account to access the full power of Poppy Marketing Ads Manager.
            </p>
          </div>
        </section>

        {/* Legal Links */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
            Important Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/privacy-policy"
              className="card text-center hover:shadow-soft transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors">
                Privacy Policy
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn how we protect your data
              </p>
            </Link>

            <Link
              href="/terms"
              className="card text-center hover:shadow-soft transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors">
                Terms of Service
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Read our terms and conditions
              </p>
            </Link>

            <Link
              href="/support"
              className="card text-center hover:shadow-soft transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors">
                Support
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Contact us with your questions
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-24">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-poppins font-semibold text-gray-800 mb-4">
                Poppy
              </p>
              <p className="text-sm text-gray-600">
                Marketing Ads Manager
              </p>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-800 mb-4">
                Product
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/auth/signin" className="hover:text-poppy-dark-purple">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-800 mb-4">
                Legal
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-poppy-dark-purple">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-poppy-dark-purple">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/data-deletion" className="hover:text-poppy-dark-purple">
                    Data Deletion
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-800 mb-4">
                Support
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="mailto:support@poppymarketingandconsulting.com"
                    className="hover:text-poppy-dark-purple"
                  >
                    support@poppymarketingandconsulting.com
                  </a>
                </li>
                <li>
                  <Link href="/support" className="hover:text-poppy-dark-purple">
                    Contact Form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Poppy Marketing & Consulting. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
