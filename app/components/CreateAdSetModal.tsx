"use client";

import { useState } from "react";
import type { AdSet } from "@/lib/types";

interface CreateAdSetModalProps {
  campaignId: string;
  onClose: () => void;
  onSuccess: (adSet: AdSet) => void;
}

export default function CreateAdSetModal({
  campaignId,
  onClose,
  onSuccess,
}: CreateAdSetModalProps) {
  const [name, setName] = useState("");
  const [dailyBudget, setDailyBudget] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/adsets?campaignId=${campaignId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          campaign_id: campaignId,
          daily_budget: parseInt(dailyBudget) * 100, // Meta API expects cents
          status: "PAUSED",
          targeting: {
            geo_locations: [{ country: "US" }],
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ad set");
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
          Create Ad Set
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Set Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale - United States"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Budget (USD)
            </label>
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              min="1"
              step="0.01"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum daily budget is usually $1
            </p>
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
              {loading ? "Creating..." : "Create Ad Set"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
