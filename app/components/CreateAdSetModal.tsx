"use client";

import { useState } from "react";
import type { AdSet } from "@/lib/types";

interface CreateAdSetModalProps {
  adAccountId: string;
  campaignId: string;
  onClose: () => void;
  onSuccess: (adSet: AdSet) => void;
}

export default function CreateAdSetModal({
  adAccountId,
  campaignId,
  onClose,
  onSuccess,
}: CreateAdSetModalProps) {
  const [name, setName] = useState("");
  const [dailyBudget, setDailyBudget] = useState("10");
  const [optimizationGoal, setOptimizationGoal] = useState("REACH");
  const [billingEvent, setBillingEvent] = useState("IMPRESSIONS");
  const [bidAmount, setBidAmount] = useState("0.05");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Ad set name is required");
      if (!dailyBudget || parseFloat(dailyBudget) <= 0) {
        throw new Error("Daily budget must be greater than 0");
      }
      if (!bidAmount || parseFloat(bidAmount) <= 0) {
        throw new Error("Bid amount must be greater than 0");
      }

      const response = await fetch(`/api/adsets?adAccountId=${adAccountId}&campaignId=${campaignId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          daily_budget: parseFloat(dailyBudget) * 100, // Meta API expects cents
          status: "PAUSED",
          optimization_goal: optimizationGoal,
          billing_event: billingEvent,
          bid_amount: parseFloat(bidAmount) * 100, // Convert dollars to cents
          targeting: {
            geo_locations: [{ country: "US" }],
          },
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create ad set";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
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
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">$</span>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="10.00"
                min="0.01"
                step="0.01"
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
              <span className="text-gray-500 text-sm ml-2">/day</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum daily budget is usually $1.00
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimization Goal
            </label>
            <select
              value={optimizationGoal}
              onChange={(e) => setOptimizationGoal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            >
              <option value="REACH">Reach (Maximize impressions)</option>
              <option value="IMPRESSIONS">Impressions (Pay per impression)</option>
              <option value="LINK_CLICKS">Link Clicks (Pay per click)</option>
              <option value="VIDEO_VIEWS">Video Views (Pay per view)</option>
              <option value="LANDING_PAGE_VIEWS">Landing Page Views</option>
              <option value="POST_ENGAGEMENT">Post Engagement</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              What to optimize the ad set for
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Event
            </label>
            <select
              value={billingEvent}
              onChange={(e) => setBillingEvent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            >
              <option value="IMPRESSIONS">Impressions (CPM)</option>
              <option value="LINK_CLICKS">Link Clicks (CPC)</option>
              <option value="VIDEO_VIEWS">Video Views</option>
              <option value="VIDEO_10_SEC_VIEWS">10-Second Video Views</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              When Meta charges you
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount (USD)
            </label>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="0.05"
                min="0.01"
                step="0.01"
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum bid per event (e.g., per impression or click)
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
