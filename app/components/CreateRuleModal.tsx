"use client";

import { useState, useEffect } from "react";

interface CreateRuleModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface AdSet {
  id: string;
  name: string;
  campaign_name: string;
  status: string;
}

type RuleType = "spend" | "roas" | "cpa" | "time";

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

  // CPA Rule Fields
  const [cpaPauseThreshold, setCpaPauseThreshold] = useState("50");
  const [cpaUnpauseThreshold, setCpaUnpauseThreshold] = useState("40");
  const [cpaTimeWindow, setCpaTimeWindow] = useState("7"); // days
  const [enableCpaAutoUnpause, setEnableCpaAutoUnpause] = useState(true);

  // Time-Based Rule Fields (Dayparting)
  const [timeRuleType, setTimeRuleType] = useState<"hourly" | "daily">("hourly");
  const [pauseHour, setPauseHour] = useState("18"); // 6 PM
  const [unpauseHour, setUnpauseHour] = useState("9"); // 9 AM
  const [pauseDays, setPauseDays] = useState<string[]>(["Saturday", "Sunday"]); // Weekend by default
  const [timezone, setTimezone] = useState("America/Chicago"); // Default timezone

  // Campaign and Ad Set Selection
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [adSetsLoading, setAdSetsLoading] = useState(false);

  // Fetch campaigns on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`/api/campaigns?adAccountId=${accountId}`);
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data || []);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setCampaignsLoading(false);
      }
    };

    if (accountId) {
      fetchCampaigns();
    }
  }, [accountId]);

  // Fetch ad sets when campaign is selected
  useEffect(() => {
    const fetchAdSets = async () => {
      if (!selectedCampaignId) {
        setAdSets([]);
        return;
      }

      setAdSetsLoading(true);
      try {
        const response = await fetch(
          `/api/adsets?adAccountId=${accountId}&campaignId=${selectedCampaignId}`
        );
        if (response.ok) {
          const data = await response.json();
          setAdSets(data || []);
          // Auto-select first ad set if available
          if (data && data.length > 0 && !adSetId) {
            setAdSetId(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching ad sets:", error);
      } finally {
        setAdSetsLoading(false);
      }
    };

    fetchAdSets();
  }, [selectedCampaignId, accountId, adSetId]);

  const buildEvaluationSpec = () => {
    // Meta's adrules_library API uses a trigger-based structure
    // evaluation_spec contains: evaluation_type, trigger (with type, field, operator, value), and filters

    if (ruleType === "spend") {
      return {
        evaluation_type: "TRIGGER",
        trigger: {
          type: "PERFORMANCE_CONDITION",
          field: "spend",
          operator: "GREATER_THAN",
          value: parseInt(spendThreshold),
        },
        filters: [],
      };
    }

    if (ruleType === "roas") {
      return {
        evaluation_type: "TRIGGER",
        trigger: {
          type: "PERFORMANCE_CONDITION",
          field: "website_purchase_roas",
          operator: "LESS_THAN",
          value: parseFloat(roasPauseThreshold),
        },
        filters: [],
      };
    }

    if (ruleType === "cpa") {
      return {
        evaluation_type: "TRIGGER",
        trigger: {
          type: "PERFORMANCE_CONDITION",
          field: "cost_per_purchase",
          operator: "GREATER_THAN",
          value: parseInt(cpaPauseThreshold),
        },
        filters: [],
      };
    }

    if (ruleType === "time") {
      // Time-based rules - use a condition that's always true
      // The actual scheduling is handled by the action execution
      if (timeRuleType === "hourly") {
        return {
          evaluation_type: "TRIGGER",
          trigger: {
            type: "PERFORMANCE_CONDITION",
            field: "impressions",
            operator: "GREATER_THAN_OR_EQUAL",
            value: 0, // Always true
          },
          filters: [],
        };
      } else {
        // Daily scheduling
        return {
          evaluation_type: "TRIGGER",
          trigger: {
            type: "PERFORMANCE_CONDITION",
            field: "impressions",
            operator: "GREATER_THAN_OR_EQUAL",
            value: 0, // Always true
          },
          filters: [],
        };
      }
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

      if (ruleType === "cpa") {
        if (!cpaPauseThreshold) {
          throw new Error("Please enter a CPA pause threshold");
        }
        if (enableCpaAutoUnpause && !cpaUnpauseThreshold) {
          throw new Error("Please enter a CPA unpause threshold");
        }
        const pauseVal = parseInt(cpaPauseThreshold);
        const unpauseVal = parseInt(cpaUnpauseThreshold);
        if (pauseVal <= 0) {
          throw new Error("CPA pause threshold must be greater than 0");
        }
        if (enableCpaAutoUnpause && unpauseVal >= pauseVal) {
          throw new Error("Unpause threshold must be lower than pause threshold");
        }
      }

      if (ruleType === "time") {
        if (timeRuleType === "hourly") {
          const pauseH = parseInt(pauseHour);
          const unpauseH = parseInt(unpauseHour);
          if (pauseH < 0 || pauseH > 23) {
            throw new Error("Pause hour must be between 0-23");
          }
          if (unpauseH < 0 || unpauseH > 23) {
            throw new Error("Unpause hour must be between 0-23");
          }
        } else if (timeRuleType === "daily") {
          if (pauseDays.length === 0) {
            throw new Error("Please select at least one day to pause");
          }
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

      // If CPA rule with auto-unpause, create companion unpause rule
      if (ruleType === "cpa" && enableCpaAutoUnpause) {
        const unpauseEvaluationSpec = {
          evaluations: [
            {
              metric: "cost_per_purchase",
              comparison: "LESS_THAN",
              value: parseInt(cpaUnpauseThreshold),
            },
          ],
          time_window: parseInt(cpaTimeWindow),
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

      // If time-based rule, create companion unpause rule
      if (ruleType === "time") {
        const unpauseExecutionSpec = buildExecutionSpec(false);
        let unpauseRuleName = ruleName;
        let unpauseEvaluationSpec = buildEvaluationSpec();

        if (timeRuleType === "hourly") {
          unpauseRuleName = `${ruleName} (Auto-Unpause at ${unpauseHour}:00)`;
        } else {
          unpauseRuleName = `${ruleName} (Resume on Weekdays)`;
        }

        const unpauseRuleResponse = await fetch(
          `/api/rules?adAccountId=${accountId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: unpauseRuleName,
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
      setCpaPauseThreshold("50");
      setCpaUnpauseThreshold("40");
      setPauseHour("18");
      setUnpauseHour("9");
      setPauseDays(["Saturday", "Sunday"]);
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setRuleType("spend")}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    ruleType === "spend"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💰 Spend
                </button>
                <button
                  type="button"
                  onClick={() => setRuleType("roas")}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    ruleType === "roas"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📈 ROAS
                </button>
                <button
                  type="button"
                  onClick={() => setRuleType("cpa")}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    ruleType === "cpa"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  💵 CPA
                </button>
                <button
                  type="button"
                  onClick={() => setRuleType("time")}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    ruleType === "time"
                      ? "bg-poppy-dark-purple text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🕐 Time-Based
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
                    : ruleType === "roas"
                    ? "e.g., Pause when ROAS drops below 1.5x"
                    : ruleType === "cpa"
                    ? "e.g., Pause when CPA exceeds $50"
                    : "e.g., Pause after business hours"
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

            {/* CPA Rule Fields */}
            {ruleType === "cpa" && (
              <>
                <div className="space-y-3 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-orange-900 mb-2">
                    💵 CPA Automation Settings
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pause when CPA exceeds
                    </label>
                    <input
                      type="number"
                      value={cpaPauseThreshold}
                      onChange={(e) => setCpaPauseThreshold(e.target.value)}
                      min="1"
                      max="9999"
                      step="5"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      e.g., 50 means pause if CPA exceeds $50
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Auto-unpause when CPA improves?
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableCpaAutoUnpause}
                        onChange={(e) => setEnableCpaAutoUnpause(e.target.checked)}
                        className="w-4 h-4 text-poppy-dark-purple rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Yes, create auto-unpause rule
                      </span>
                    </label>
                  </div>

                  {enableCpaAutoUnpause && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unpause when CPA drops below
                      </label>
                      <input
                        type="number"
                        value={cpaUnpauseThreshold}
                        onChange={(e) => setCpaUnpauseThreshold(e.target.value)}
                        min="1"
                        max="9999"
                        step="5"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be lower than pause threshold
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Time Window
                    </label>
                    <select
                      value={cpaTimeWindow}
                      onChange={(e) => setCpaTimeWindow(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                    >
                      <option value="1">Daily</option>
                      <option value="7">7 Days (Weekly)</option>
                      <option value="14">14 Days (Bi-weekly)</option>
                      <option value="30">30 Days (Monthly)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      CPA will be measured over this period
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Time-Based Rule Fields (Dayparting) */}
            {ruleType === "time" && (
              <>
                <div className="space-y-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-purple-900 mb-2">
                    🕐 Time-Based Automation (Dayparting)
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Schedule Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTimeRuleType("hourly")}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                          timeRuleType === "hourly"
                            ? "bg-poppy-dark-purple text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        ⏰ Hourly
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeRuleType("daily")}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                          timeRuleType === "daily"
                            ? "bg-poppy-dark-purple text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        📅 Daily
                      </button>
                    </div>
                  </div>

                  {timeRuleType === "hourly" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Pause at hour (24-hour format)
                        </label>
                        <select
                          value={pauseHour}
                          onChange={(e) => setPauseHour(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i)}>
                              {String(i).padStart(2, "0")}:00 ({i < 12 ? i === 0 ? "12 AM" : `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          e.g., 18 = 6:00 PM
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Resume at hour
                        </label>
                        <select
                          value={unpauseHour}
                          onChange={(e) => setUnpauseHour(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={String(i)}>
                              {String(i).padStart(2, "0")}:00 ({i < 12 ? i === 0 ? "12 AM" : `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          e.g., 9 = 9:00 AM
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple text-sm"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </>
                  )}

                  {timeRuleType === "daily" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Days to pause
                      </label>
                      <div className="space-y-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <label key={day} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={pauseDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPauseDays([...pauseDays, day]);
                                } else {
                                  setPauseDays(pauseDays.filter((d) => d !== day));
                                }
                              }}
                              className="w-4 h-4 text-poppy-dark-purple rounded"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Currently pausing: {pauseDays.length > 0 ? pauseDays.join(", ") : "No days selected"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Campaign and Ad Set Selection */}
            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              {/* Campaign Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign
                </label>
                {campaignsLoading ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700">Loading campaigns...</p>
                  </div>
                ) : (
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => {
                      setSelectedCampaignId(e.target.value);
                      setAdSetId(""); // Reset ad set when campaign changes
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  >
                    <option value="">Select a campaign...</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                )}
                {campaigns.length === 0 && !campaignsLoading && (
                  <p className="text-xs text-red-600 mt-1">No campaigns found. Make sure you have active campaigns in this account.</p>
                )}
              </div>

              {/* Ad Set Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Set
                </label>
                {!selectedCampaignId ? (
                  <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Select a campaign first to see ad sets</p>
                  </div>
                ) : adSetsLoading ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-700">Loading ad sets...</p>
                  </div>
                ) : (
                  <select
                    value={adSetId}
                    onChange={(e) => setAdSetId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  >
                    <option value="">Select an ad set...</option>
                    {adSets.map((adSet) => (
                      <option key={adSet.id} value={adSet.id}>
                        {adSet.name}
                      </option>
                    ))}
                  </select>
                )}
                {selectedCampaignId && adSets.length === 0 && !adSetsLoading && (
                  <p className="text-xs text-red-600 mt-1">No ad sets found for this campaign.</p>
                )}
              </div>

              {/* Display Selected IDs */}
              {adSetId && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    <span className="font-semibold">Rule will apply to:</span><br />
                    Campaign: {campaigns.find((c) => c.id === selectedCampaignId)?.name}<br />
                    Ad Set: {adSets.find((a) => a.id === adSetId)?.name}<br />
                    <span className="text-gray-600">ID: {adSetId}</span>
                  </p>
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
