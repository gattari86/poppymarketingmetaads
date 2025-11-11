"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChartBar, Gear, Lock } from "@phosphor-icons/react";

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
            <img src="/logo.png" alt="Poppy Logo" className="w-8 h-8" />
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

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-32">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <h1 className="text-5xl md:text-7xl font-poppins font-bold text-gray-900 mb-8 leading-tight">
            Welcome to Poppy Marketing
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one solution for managing Meta/Facebook advertising campaigns with ease and efficiency.
          </p>

          {status !== "authenticated" && (
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              Sign In to Get Started
            </Link>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-32 py-12">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-16 text-center">
            What You Can Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="card p-8 hover:shadow-md transition-shadow duration-300">
              <div className="mb-6">
                <ChartBar size={56} weight="duotone" className="text-poppy-dark-purple" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                Campaign Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create, manage, and optimize your Meta advertising campaigns from a centralized dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 hover:shadow-md transition-shadow duration-300">
              <div className="mb-6">
                <Gear size={56} weight="duotone" className="text-poppy-dark-purple" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                Automated Rules
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Set up intelligent automation rules to manage your campaigns and respond to performance metrics automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 hover:shadow-md transition-shadow duration-300">
              <div className="mb-6">
                <Lock size={56} weight="duotone" className="text-poppy-dark-purple" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with industry-standard security practices and full compliance with Meta's policies.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="mb-32 py-12">
          <div className="bg-poppy-light-purple/10 border border-poppy-light-purple/30 rounded-xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-8">
              About This Platform
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Poppy Marketing Ads Manager is built to simplify your advertising workflow. Whether you're managing a single campaign or multiple ad accounts, our platform provides the tools you need to succeed.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With seamless integration with Meta's Graph API, you can manage all aspects of your advertising campaigns directly from our intuitive interface.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sign in with your Meta Business account to access the full power of Poppy Marketing Ads Manager.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Links */}
        <section className="border-t border-gray-200 pt-16 mt-16 mb-16">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 mb-12">
            Important Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Link
              href="/privacy-policy"
              className="card p-8 text-center hover:shadow-md transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors mb-3">
                Privacy Policy
              </h3>
              <p className="text-sm text-gray-600">
                Learn how we protect your data
              </p>
            </Link>

            <Link
              href="/terms"
              className="card p-8 text-center hover:shadow-md transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors mb-3">
                Terms of Service
              </h3>
              <p className="text-sm text-gray-600">
                Read our terms and conditions
              </p>
            </Link>

            <Link
              href="/support"
              className="card p-8 text-center hover:shadow-md transition-shadow group"
            >
              <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-poppy-dark-purple transition-colors mb-3">
                Support
              </h3>
              <p className="text-sm text-gray-600">
                Contact us with your questions
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-32">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="font-poppins font-semibold text-gray-900 mb-6">
                Poppy
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Marketing Ads Manager
              </p>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-900 mb-6">
                Product
              </p>
              <ul className="space-y-4 text-sm text-gray-600">
                <li>
                  <Link href="/auth/signin" className="hover:text-poppy-dark-purple transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-900 mb-6">
                Legal
              </p>
              <ul className="space-y-4 text-sm text-gray-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-poppy-dark-purple transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-poppy-dark-purple transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/data-deletion" className="hover:text-poppy-dark-purple transition-colors">
                    Data Deletion
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-900 mb-6">
                Support
              </p>
              <ul className="space-y-4 text-sm text-gray-600">
                <li>
                  <a
                    href="mailto:support@poppymarketingandconsulting.com"
                    className="hover:text-poppy-dark-purple transition-colors"
                  >
                    support@poppymarketingandconsulting.com
                  </a>
                </li>
                <li>
                  <Link href="/support" className="hover:text-poppy-dark-purple transition-colors">
                    Contact Form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-12 mt-12 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Poppy Marketing & Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
