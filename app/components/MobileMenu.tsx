"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="font-poppins font-bold text-lg text-poppy-dark-purple">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-poppy-dark-purple text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/campaigns"
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive("/dashboard/campaigns")
                      ? "bg-poppy-dark-purple text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🚀 Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive("/dashboard/analytics")
                      ? "bg-poppy-dark-purple text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/rules"
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive("/dashboard/rules")
                      ? "bg-poppy-dark-purple text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ⚙️ Rules
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <a
              href="mailto:support@poppymarketingandconsulting.com"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
