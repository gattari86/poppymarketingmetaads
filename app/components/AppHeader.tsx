"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AppHeader() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!session) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-softer sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-2xl font-poppins font-bold text-poppy-dark-purple hover:text-poppy-purple transition-colors"
        >
          <img src="/logo.png" alt="Poppy Logo" className="w-8 h-8" />
          <span>Poppy</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-poppy-dark-purple font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/campaigns"
            className="text-gray-700 hover:text-poppy-dark-purple font-medium transition-colors"
          >
            Campaigns
          </Link>
          <Link
            href="/dashboard/rules"
            className="text-gray-700 hover:text-poppy-dark-purple font-medium transition-colors"
          >
            Rules
          </Link>
        </nav>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-4">
          {/* Quick Links */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="mailto:support@poppymarketingandconsulting.com"
              className="text-gray-600 hover:text-poppy-dark-purple transition-colors text-sm"
              title="Contact Support"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={session.user?.email || "User"}
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user?.email?.split("@")[0]}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  showUserMenu ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  Dashboard
                </Link>

                <a
                  href="mailto:support@poppymarketingandconsulting.com"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  Contact Support
                </a>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut({ redirect: true, callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
