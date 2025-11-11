"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-poppy-light-purple/5 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-2">
          An unexpected error occurred. Our team has been notified.
        </p>
        <p className="text-sm text-gray-500 mb-6 break-words">
          {error.message || "Unknown error"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 btn-primary"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="flex-1 btn-outline"
          >
            Go to Dashboard
          </button>
        </div>

        {process.env.NODE_ENV === "development" && error.digest && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-mono break-all">
              Error ID: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
