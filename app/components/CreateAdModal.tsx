"use client";

import { useState } from "react";
import type { Ad } from "@/lib/types";

interface CreateAdModalProps {
  adSetId: string;
  onClose: () => void;
  onSuccess: (ad: Ad) => void;
}

export default function CreateAdModal({
  adSetId,
  onClose,
  onSuccess,
}: CreateAdModalProps) {
  const [name, setName] = useState("");
  const [creativeId, setCreativeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Ad name is required");
      if (!creativeId.trim()) throw new Error("Creative ID is required");

      // Per Meta API v24: creative object only accepts creative_id
      // Creatives must be created in Meta Ads Manager first
      const requestBody = {
        name: name.trim(),
        adset_id: adSetId,
        status: "PAUSED", // Meta v24 requires status to be set
        creative: {
          creative_id: creativeId.trim(),
        },
      };

      const response = await fetch(`/api/ads?adSetId=${adSetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create ad";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6">
            Create Ad
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-2">
              <strong>How it works:</strong> Creatives must be created in Meta Ads Manager first (image, headline, text, CTA, landing page).
            </p>
            <p className="text-sm text-blue-800">
              Then paste the Creative ID here to attach it to this ad.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale - Version A"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
            <p className="text-xs text-gray-500 mt-1">
              Internal name for your reference (not shown to users)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creative ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={creativeId}
              onChange={(e) => setCreativeId(e.target.value)}
              placeholder="e.g., 123456789012345"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
            <p className="text-xs text-gray-500 mt-2">
              <strong>How to find it:</strong> Go to Meta Ads Manager → Assets → Creatives → Click a creative → Copy the ID from the URL bar or creative details
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </form>

        <div className="flex gap-3 pt-6 mt-6 px-0 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !name || !creativeId}
            onClick={handleSubmit}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ad"}
          </button>
        </div>
      </div>
    </div>
  );
}
