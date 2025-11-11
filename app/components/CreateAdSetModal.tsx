"use client";

import { useState, useEffect } from "react";
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
  const [optimizationGoal, setOptimizationGoal] = useState("REACH");
  const [billingEvent, setBillingEvent] = useState("IMPRESSIONS");
  const [bidAmount, setBidAmount] = useState("0.05");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBudgetWarning] = useState(true);

  // Targeting options
  const [countries, setCountries] = useState(["US"]);
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65");
  const [expandTargeting, setExpandTargeting] = useState(false);

  // Debug: Log the IDs
  useEffect(() => {
    console.log("🔍 CreateAdSetModal received:", {
      adAccountId,
      campaignId,
    });
  }, [adAccountId, campaignId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Ad set name is required");
      if (!bidAmount || parseFloat(bidAmount) <= 0) {
        throw new Error("Bid amount must be greater than 0");
      }

      // Convert bid amount to integers (Meta API requires cents as integers, not floats)
      const bidAmountCents = Math.round(parseFloat(bidAmount) * 100);

      const response = await fetch(`/api/adsets?adAccountId=${adAccountId}&campaignId=${campaignId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          // NOTE: Do NOT include daily_budget here!
          // Meta v24 uses either campaign-level OR ad set-level budgets, not both
          // Since this campaign has a budget, ad sets must not have their own budget
          status: "PAUSED",
          optimization_goal: optimizationGoal,
          billing_event: billingEvent,
          bid_amount: bidAmountCents, // Convert dollars to cents as integer
          // Meta v24 requires targeting with proper structure
          targeting: {
            geo_locations: {
              countries: countries, // User-selected countries
            },
            age_min: parseInt(ageMin),
            age_max: parseInt(ageMax),
          },
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create ad set";
        try {
          const errorData = await response.json();
          console.error("Ad set creation error response:", errorData);

          // Extract detailed error information
          if (errorData.details) {
            errorMessage = `${errorData.error || errorMessage} (Code: ${errorData.code})`;
            console.error("Meta API error details:", errorData.details);
          } else {
            errorMessage = errorData.error || errorData.message || errorMessage;
          }
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
      <div className="modal-content flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6 flex-shrink-0">
          Create Ad Set
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
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

          {showBudgetWarning && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <div className="text-blue-600 text-lg">ℹ️</div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Budget Set at Campaign Level
                  </p>
                  <p className="text-xs text-blue-700">
                    Your campaign has a daily budget. Ad sets inherit this budget automatically. You don't need to set a separate budget for each ad set.
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* Targeting Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setExpandTargeting(!expandTargeting)}
              className="w-full flex items-center justify-between text-left font-medium text-gray-900 hover:bg-gray-100 p-2 rounded transition-colors"
            >
              <span>🎯 Audience Targeting</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${expandTargeting ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {expandTargeting && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Countries
                  </label>
                  <input
                    type="text"
                    value={countries.join(", ")}
                    onChange={(e) => setCountries(e.target.value.split(",").map(c => c.trim().toUpperCase()))}
                    placeholder="e.g., US, CA, MX"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter country codes separated by commas (e.g., US, CA, GB)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Age
                    </label>
                    <select
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                    >
                      {[13, 18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65].map((age) => (
                        <option key={age} value={age}>
                          {age}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Age
                    </label>
                    <select
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                    >
                      {[17, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65, 120].map((age) => (
                        <option key={age} value={age}>
                          {age === 120 ? "65+" : age}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> For interests, behaviors, and detailed demographics, use Meta Ads Manager. This form covers basic location and age targeting.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </form>

        <div className="flex gap-3 pt-4 mt-6 border-t border-gray-200 flex-shrink-0">
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
            onClick={handleSubmit}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ad Set"}
          </button>
        </div>
      </div>
    </div>
  );
}
