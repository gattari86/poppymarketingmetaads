"use client";

import { useState } from "react";
import type { Campaign } from "@/lib/types";

interface CreateCampaignModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
}

// Meta ODAX (Outcome-Driven Ad Experiences) objectives - 2025
// These are the only valid campaign objectives for creating new campaigns
const OBJECTIVES = [
  "OUTCOME_SALES",
  "OUTCOME_LEADS",
  "OUTCOME_TRAFFIC",
  "OUTCOME_AWARENESS",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_APP_PROMOTION",
];

export default function CreateCampaignModal({
  accountId,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [dailyBudget, setDailyBudget] = useState("5"); // Default $5/day
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [specialAdCategories, setSpecialAdCategories] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Campaign name is required");
      if (!objective.trim()) throw new Error("Campaign objective is required");
      if (!dailyBudget || parseFloat(dailyBudget) <= 0) {
        throw new Error("Daily budget must be greater than 0");
      }

      const campaignData: any = {
        name: name.trim(),
        objective,
        status: "PAUSED",
        // Daily budget in dollars (will be converted to cents by API)
        daily_budget: parseFloat(dailyBudget),
        // Always include special_ad_categories - Meta requires it
        // If empty array, it means "none of the special categories apply"
        special_ad_categories: specialAdCategories.length > 0 ? specialAdCategories : [],
      };

      const response = await fetch(`/api/campaigns?adAccountId=${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create campaign";
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Budget (USD)
            </label>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">$</span>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="5.00"
                min="0.01"
                step="0.01"
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
              <span className="text-gray-500 text-sm ml-2">/day</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Minimum daily budget recommended: $1.00
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Special Ad Categories (Optional)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialAdCategories.includes("HOUSING")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSpecialAdCategories([...specialAdCategories, "HOUSING"]);
                    } else {
                      setSpecialAdCategories(
                        specialAdCategories.filter((c) => c !== "HOUSING")
                      );
                    }
                  }}
                  className="w-4 h-4 text-poppy-dark-purple rounded"
                />
                <span className="text-sm text-gray-700">Housing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialAdCategories.includes("EMPLOYMENT")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSpecialAdCategories([...specialAdCategories, "EMPLOYMENT"]);
                    } else {
                      setSpecialAdCategories(
                        specialAdCategories.filter((c) => c !== "EMPLOYMENT")
                      );
                    }
                  }}
                  className="w-4 h-4 text-poppy-dark-purple rounded"
                />
                <span className="text-sm text-gray-700">Employment</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialAdCategories.includes("CREDIT")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSpecialAdCategories([...specialAdCategories, "CREDIT"]);
                    } else {
                      setSpecialAdCategories(
                        specialAdCategories.filter((c) => c !== "CREDIT")
                      );
                    }
                  }}
                  className="w-4 h-4 text-poppy-dark-purple rounded"
                />
                <span className="text-sm text-gray-700">Credit</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select if your campaign falls under regulated categories (Housing, Employment, Credit)
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
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
