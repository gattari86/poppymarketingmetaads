"use client";

import { useState } from "react";
import type { Ad } from "@/lib/types";
import { Warning } from "@phosphor-icons/react";

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
  const [useExistingCreative, setUseExistingCreative] = useState(true);
  const [creativeId, setCreativeId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Ad name is required");

      if (useExistingCreative) {
        if (!creativeId.trim()) throw new Error("Please enter a creative ID");
      } else {
        if (!title.trim()) throw new Error("Ad title is required");
        if (!body.trim()) throw new Error("Ad body text is required");
      }

      const requestBody: Record<string, unknown> = {
        name: name.trim(),
        adset_id: adSetId,
        status: "PAUSED", // Meta v24 requires status to be set
      };

      if (useExistingCreative) {
        // Use existing creative - only pass creative_id
        requestBody.creative = {
          creative_id: creativeId.trim(),
        };
      } else {
        // For new creative, pass as separate object
        // Note: Creating inline creatives requires the ads API to handle it properly
        requestBody.creative = {
          title: title.trim(),
          body: body.trim(),
        };
        if (imageUrl.trim()) {
          (requestBody.creative as Record<string, unknown>).image_url = imageUrl.trim();
        }
      }

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
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6">
          Create Ad
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale - Version A"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Creatives must be created in Meta Ads Manager first. Enter the creative ID from your ad account.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useExistingCreative}
                onChange={() => setUseExistingCreative(true)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Use Existing Creative (Recommended)
              </span>
            </label>

            {useExistingCreative && (
              <div className="ml-6 space-y-2">
                <input
                  type="text"
                  value={creativeId}
                  onChange={(e) => setCreativeId(e.target.value)}
                  placeholder="Enter creative ID (e.g., 123456789)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
                <p className="text-xs text-gray-500">
                  Find creative IDs in Meta Ads Manager under Assets → Creatives
                </p>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="radio"
                checked={!useExistingCreative}
                onChange={() => setUseExistingCreative(false)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Create New Creative (Alternative)
              </span>
            </label>

            {!useExistingCreative && (
              <div className="space-y-3 ml-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800 mb-3 flex items-start gap-2">
                  <Warning size={16} weight="fill" className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>This requires additional setup:</strong> After filling in details below, creatives will need to be uploaded to Meta Ads Manager separately before ads can use them.</span>
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ad headline"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Text
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Ad description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
