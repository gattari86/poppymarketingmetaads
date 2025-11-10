"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-poppy-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-poppy-dark-purple mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-poppy-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white shadow-softer sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-poppins font-bold text-poppy-dark-purple">
                Poppy
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-8">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-poppy-dark-purple transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/campaigns"
                  className="text-gray-600 hover:text-poppy-dark-purple transition-colors text-sm font-medium"
                >
                  Campaigns
                </Link>
                <Link
                  href="/dashboard/rules"
                  className="text-gray-600 hover:text-poppy-dark-purple transition-colors text-sm font-medium"
                >
                  Rules
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Meta Business</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="px-4 py-2 text-sm text-poppy-dark-purple hover:bg-poppy-light-purple/20 rounded-lg transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  <Link href="/dashboard" className="hover:text-poppy-dark-purple">
                    Dashboard
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
