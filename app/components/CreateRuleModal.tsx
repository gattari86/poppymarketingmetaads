"use client";

import { useState } from "react";

interface CreateRuleModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type RuleType = "spend" | "roas";

export default function CreateRuleModal({
  accountId,
  onClose,
  onSuccess,
}: CreateRuleModalProps) {
  const [ruleType, setRuleType] = useState<RuleType>("spend");
  const [ruleName, setRuleName] = useState("");
  const [adSetId, setAdSetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Spend Rule Fields
  const [spendThreshold, setSpendThreshold] = useState("500");

  // ROAS Rule Fields
  const [roasPauseThreshold, setRoasPauseThreshold] = useState("1.50");
  const [roasUnpauseThreshold, setRoasUnpauseThreshold] = useState("2.00");
  const [roasTimeWindow, setRoasTimeWindow] = useState("7"); // days
  const [enableAutoUnpause, setEnableAutoUnpause] = useState(true);

  const buildEvaluationSpec = () => {
    if (ruleType === "spend") {
      return {
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
    }

    if (ruleType === "roas") {
      return {
        evaluations: [
          {
            metric: "website_purchase_roas",
            comparison: "LESS_THAN",
            value: parseFloat(roasPauseThreshold),
          },
        ],
        time_window: parseInt(roasTimeWindow),
        trigger: "ALL",
      };
    }

    throw new Error("Invalid rule type");
  };

  const buildExecutionSpec = (isPauseRule: boolean) => {
    return {
      actions: [
        {
          action_type: isPauseRule ? "PAUSE" : "UNPAUSE",
          action_params: {
            ad_set_ids: [adSetId],
          },
        },
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!adSetId) {
        throw new Error("Please enter an ad set ID");
      }

      if (!ruleName) {
        throw new Error("Please enter a rule name");
      }

      // Validate metric-specific fields
      if (ruleType === "spend" && !spendThreshold) {
        throw new Error("Please enter a spend threshold");
      }

      if (ruleType === "roas") {
        if (!roasPauseThreshold) {
          throw new Error("Please enter a ROAS pause threshold");
        }
        if (enableAutoUnpause && !roasUnpauseThreshold) {
          throw new Error("Please enter a ROAS unpause threshold");
        }
        const pauseVal = parseFloat(roasPauseThreshold);
        const unpauseVal = parseFloat(roasUnpauseThreshold);
        if (pauseVal <= 0) {
          throw new Error("ROAS pause threshold must be greater than 0");
        }
        if (enableAutoUnpause && unpauseVal <= pauseVal) {
          throw new Error("Unpause threshold must be greater than pause threshold");
        }
      }

      // Create pause rule
      const evaluation_spec = buildEvaluationSpec();
      const execution_spec = buildExecutionSpec(true);

      const pauseRuleResponse = await fetch(
        `/api/rules?adAccountId=${accountId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ruleName,
            evaluation_spec,
            execution_spec,
            status: "ACTIVE",
          }),
        }
      );

      if (!pauseRuleResponse.ok) {
        const errorData = await pauseRuleResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create rule");
      }

      // If ROAS rule with auto-unpause, create companion unpause rule
      if (ruleType === "roas" && enableAutoUnpause) {
        const unpauseEvaluationSpec = {
          evaluations: [
            {
              metric: "website_purchase_roas",
              comparison: "GREATER_THAN",
              value: parseFloat(roasUnpauseThreshold),
            },
          ],
          time_window: parseInt(roasTimeWindow),
          trigger: "ALL",
        };

        const unpauseExecutionSpec = buildExecutionSpec(false);

        const unpauseRuleResponse = await fetch(
          `/api/rules?adAccountId=${accountId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${ruleName} (Auto-Unpause)`,
              evaluation_spec: unpauseEvaluationSpec,
              execution_spec: unpauseExecutionSpec,
              status: "ACTIVE",
            }),
          }
        );

        if (!unpauseRuleResponse.ok) {
          console.warn("Unpause rule creation failed, but pause rule succeeded");
        }
      }

      setSuccess(true);
      setRuleName("");
      setSpendThreshold("500");
      setRoasPauseThreshold("1.50");
      setRoasUnpauseThreshold("2.00");
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
            {/* Rule Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rule Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRuleType("spend")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    ruleType === "spend"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💰 Spend-Based
                </button>
                <button
                  type="button"
                  onClick={() => setRuleType("roas")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    ruleType === "roas"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📈 ROAS-Based
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder={
                  ruleType === "spend"
                    ? "e.g., Pause when spend hits $500"
                    : "e.g., Pause when ROAS drops below 1.5x"
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
              />
            </div>

            {/* Spend Rule Fields */}
            {ruleType === "spend" && (
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ad set will pause when daily spend exceeds this amount
                </p>
              </div>
            )}

            {/* ROAS Rule Fields */}
            {ruleType === "roas" && (
              <>
                <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-900 mb-2">
                    📊 ROAS Automation Settings
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pause when ROAS drops below
                    </label>
                    <input
                      type="number"
                      value={roasPauseThreshold}
                      onChange={(e) => setRoasPauseThreshold(e.target.value)}
                      min="0.1"
                      max="99.9"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      e.g., 1.50 means pause if ROAS &lt; $1.50
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Auto-unpause when ROAS recovers?
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableAutoUnpause}
                        onChange={(e) => setEnableAutoUnpause(e.target.checked)}
                        className="w-4 h-4 text-poppy-dark-purple rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Yes, create auto-unpause rule
                      </span>
                    </label>
                  </div>

                  {enableAutoUnpause && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unpause when ROAS exceeds
                      </label>
                      <input
                        type="number"
                        value={roasUnpauseThreshold}
                        onChange={(e) => setRoasUnpauseThreshold(e.target.value)}
                        min="0.1"
                        max="99.9"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be higher than pause threshold
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Time Window
                    </label>
                    <select
                      value={roasTimeWindow}
                      onChange={(e) => setRoasTimeWindow(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                    >
                      <option value="1">Daily</option>
                      <option value="7">7 Days (Weekly)</option>
                      <option value="14">14 Days (Bi-weekly)</option>
                      <option value="30">30 Days (Monthly)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      ROAS will be measured over this period
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Ad Set ID - Common */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Set ID
              </label>
              <input
                type="text"
                value={adSetId}
                onChange={(e) => setAdSetId(e.target.value)}
                placeholder="Enter the ad set ID to apply this rule to"
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
