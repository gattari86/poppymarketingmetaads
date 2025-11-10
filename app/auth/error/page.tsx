"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gradient-to-br from-poppy-white via-poppy-white to-poppy-light-purple flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-6v-2m0-4v-2"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-poppins font-semibold text-gray-800 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-6">
              {error === "OAuthAccountNotLinked"
                ? "This account is already connected to another provider."
                : "Something went wrong during sign in. Please try again."}
            </p>
          </div>

          <Link href="/auth/signin" className="block w-full btn-primary text-center">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
