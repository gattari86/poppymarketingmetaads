"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppHeader from "@/app/components/AppHeader";
import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
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
    <div className="min-h-screen bg-poppy-white flex flex-col">
      {/* Header */}
      <AppHeader />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 md:py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
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
