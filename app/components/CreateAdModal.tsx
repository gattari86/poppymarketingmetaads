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
      // Creatives must be created via API or exist in Meta Ads Manager
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900 mb-2">
              ⚠️ Coming Soon: Image Upload
            </p>
            <p className="text-xs text-amber-800 mb-2">
              We're building a feature to upload images and create creatives directly in Poppy. For now, please use the Creative ID option below.
            </p>
            <p className="text-xs text-amber-700">
              <strong>Temporary Workaround:</strong> You can create a creative in Meta Ads Manager and reference its ID here. A detailed guide is available below.
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
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-3">How to Find Your Creative ID:</p>
            <ol className="text-xs text-blue-800 space-y-2 ml-4 list-decimal">
              <li>Go to <strong>Meta Ads Manager</strong> (ads.facebook.com)</li>
              <li>Click <strong>Assets</strong> in the left sidebar</li>
              <li>Select <strong>Creatives</strong> (under Creative Library)</li>
              <li>Find the creative you want to use</li>
              <li>The <strong>Creative ID is displayed in the creative details</strong> - it looks like a long number (e.g., 120234882987030293)</li>
              <li>Copy and paste it above</li>
            </ol>
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
