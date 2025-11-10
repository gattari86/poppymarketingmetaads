"use client";

import { useState } from "react";

interface CreateRuleModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRuleModal({
  accountId,
  onClose,
  onSuccess,
}: CreateRuleModalProps) {
  const [ruleName, setRuleName] = useState("");
  const [spendThreshold, setSpendThreshold] = useState("500");
  const [adSetId, setAdSetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!adSetId) {
        throw new Error("Please enter an ad set ID");
      }

      // Meta's automated rules use a specific format for pausing based on spend
      const evaluation_spec = {
        evaluations: [
          {
            metric: "spend",
            comparison: "GREATER_THAN",
            value: parseInt(spendThreshold),
          },
        ],
        time_window: 1, // 1 day
        trigger: "ALL",
      };

      const execution_spec = {
        actions: [
          {
            action_type: "PAUSE",
            action_params: {
              ad_set_ids: [adSetId],
            },
          },
        ],
      };

      const response = await fetch(`/api/rules?adAccountId=${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ruleName,
          evaluation_spec,
          execution_spec,
          status: "ACTIVE",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create rule"
        );
      }

      setSuccess(true);
      setRuleName("");
      setSpendThreshold("500");
      setAdSetId("");

      setTimeout(() => {
        onSuccess();
      }, 1500);
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
          Create Automated Rule
        </h2>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-lg font-poppins font-semibold text-green-600 mb-2">
              Rule Created Successfully
            </p>
            <p className="text-gray-600">
              Your automated rule is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g., Pause when spend hits $500"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Spend Threshold (USD)
              </label>
              <input
                type="number"
                value={spendThreshold}
                onChange={(e) => setSpendThreshold(e.target.value)}
                min="1"
                step="50"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ad set will pause when daily spend exceeds this amount
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Set ID
              </label>
              <input
                type="text"
                value={adSetId}
                onChange={(e) => setAdSetId(e.target.value)}
                placeholder="Enter the ad set ID to apply this rule to"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this in your campaign's ad set details
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
                disabled={loading || !ruleName || !adSetId}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Rule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
