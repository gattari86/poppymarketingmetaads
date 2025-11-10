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
      const creative: Record<string, unknown> = {
        adset_id: adSetId,
      };

      if (useExistingCreative) {
        if (!creativeId) throw new Error("Please enter a creative ID");
        creative.creative_id = creativeId;
      } else {
        creative.title = title;
        creative.body = body;
        if (imageUrl) creative.image_url = imageUrl;
      }

      const response = await fetch(`/api/ads?adSetId=${adSetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          adset_id: adSetId,
          creative,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ad");
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useExistingCreative}
                onChange={() => setUseExistingCreative(true)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Use Existing Creative
              </span>
            </label>

            {useExistingCreative && (
              <input
                type="text"
                value={creativeId}
                onChange={(e) => setCreativeId(e.target.value)}
                placeholder="Enter creative ID"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple ml-6"
              />
            )}

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="radio"
                checked={!useExistingCreative}
                onChange={() => setUseExistingCreative(false)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Create New Creative
              </span>
            </label>

            {!useExistingCreative && (
              <div className="space-y-3 ml-6">
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
