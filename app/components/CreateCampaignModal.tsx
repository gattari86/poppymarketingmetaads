"use client";

import { useState } from "react";
import type { Campaign } from "@/lib/types";

interface CreateCampaignModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
}

const OBJECTIVES = [
  "LINK_CLICKS",
  "PAGE_LIKES",
  "POST_ENGAGEMENT",
  "VIDEO_VIEWS",
  "REACH",
  "IMPRESSIONS",
  "LEAD_GENERATION",
  "MESSAGES",
  "CONVERSIONS",
];

export default function CreateCampaignModal({
  accountId,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/campaigns?adAccountId=${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          objective,
          status: "PAUSED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6">
          Create Campaign
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Objective
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            >
              {OBJECTIVES.map((obj) => (
                <option key={obj} value={obj}>
                  {obj.replace(/_/g, " ")}
                </option>
              ))}
            </select>
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
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
