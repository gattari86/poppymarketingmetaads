"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gradient-to-br from-poppy-white via-poppy-white to-poppy-light-purple flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold text-poppy-dark-purple mb-2">
            Poppy
          </h1>
          <p className="text-gray-600">Marketing Ads Manager</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
          <h2 className="text-2xl font-poppins font-semibold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Connect your Meta Business account to manage your ads.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                {error === "OAuthAccountNotLinked"
                  ? "This account is already connected."
                  : "An error occurred during sign in."}
              </p>
            </div>
          )}

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full btn-primary mb-4 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>

          {/* Dev bypass for testing */}
          {process.env.NEXT_PUBLIC_DEV_MODE && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-4 text-center">
                Development Mode
              </p>
              <button
                onClick={() => signIn("credentials", { callbackUrl: "/dashboard" })}
                className="w-full btn-outline text-sm"
              >
                Dev Login
              </button>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            <Link href="/privacy-policy" className="text-poppy-dark-purple hover:underline">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="text-poppy-dark-purple hover:underline">
              Terms of Service
            </Link>
          </p>
          <p>
            Questions?{" "}
            <Link href="/support" className="text-poppy-dark-purple hover:underline font-semibold">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
