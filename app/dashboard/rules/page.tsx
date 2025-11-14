"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import CreateRuleModal from "@/app/components/CreateRuleModal";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

interface Rule {
  id: string;
  name: string;
  status: string;
  evaluation_spec: {
    evaluation_type: string;
    filters: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  execution_spec: {
    execution_type: string;
  };
  schedule_spec?: {
    schedule_type: string;
  };
  created_time: string;
  updated_time: string;
}

function RulesContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || localStorage.getItem("selectedAdAccountId");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Fetch rules on mount
  useEffect(() => {
    const fetchRules = async () => {
      if (!accountId) return;

      try {
        const response = await fetch(`/api/rules?adAccountId=${accountId}`);
        if (response.ok) {
          const data = await response.json();
          setRules(data || []);
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
        toast.error("Failed to load rules");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [accountId]);

  const getRuleTypeIcon = (rule: Rule) => {
    // Get the metric field from filters array
    const metricFilter = rule.evaluation_spec.filters?.find(f =>
      ["website_purchase_roas", "cost_per_purchase", "spend", "ctr"].includes(f.field)
    );
    const field = metricFilter?.field || "unknown";

    if (field === "spend") return "💰";
    if (field === "website_purchase_roas") return "📈";
    if (field === "cost_per_purchase") return "💵";
    if (field === "ctr") return "📊";
    return "⚙️";
  };

  const getRuleTypeLabel = (rule: Rule) => {
    // Get the metric field from filters array
    const metricFilter = rule.evaluation_spec.filters?.find(f =>
      ["website_purchase_roas", "cost_per_purchase", "spend", "ctr"].includes(f.field)
    );
    const field = metricFilter?.field || "unknown";

    if (field === "spend") return "Spend-Based";
    if (field === "website_purchase_roas") return "ROAS-Based";
    if (field === "cost_per_purchase") return "CPA-Based";
    if (field === "ctr") return "CTR-Based";
    return "Time-Based";
  };

  const getMetricDisplay = (rule: Rule) => {
    // Get the metric field from filters array
    const metricFilter = rule.evaluation_spec.filters?.find(f =>
      ["website_purchase_roas", "cost_per_purchase", "spend", "ctr"].includes(f.field)
    );

    if (!metricFilter) {
      return "Time-based scheduling";
    }

    const field = metricFilter.field;
    const operator = metricFilter.operator;
    const value = metricFilter.value;

    // Safely convert value to number
    const numValue = typeof value === "number" ? value : parseFloat(String(value));

    if (field === "spend") {
      return `Pause when spend > $${numValue}`;
    }
    if (field === "website_purchase_roas") {
      const comp = operator === "LESS_THAN" ? "<" : ">";
      return `Pause when ROAS ${comp} ${numValue.toFixed(2)}x`;
    }
    if (field === "cost_per_purchase") {
      const comp = operator === "GREATER_THAN" ? ">" : "<";
      return `Pause when CPA ${comp} $${numValue}`;
    }
    return `${field} ${operator} ${numValue}`;
  };


  const getActionLabel = (rule: Rule) => {
    // Get execution type and ad set from filters
    const executionType = rule.execution_spec.execution_type || "PAUSE";
    const adSetFilter = rule.evaluation_spec.filters?.find(f => f.field === "adset.id");
    const adSetIds = adSetFilter?.value as string[] || [];
    const isPause = executionType === "PAUSE";

    return `${isPause ? "Pause" : "Unpause"} ${adSetIds.length} ad set${adSetIds.length !== 1 ? "s" : ""}`;
  };

  const handleDeleteRule = async (ruleId: string, ruleName: string) => {
    if (!confirm(`Are you sure you want to delete the rule "${ruleName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(ruleId);
    try {
      const response = await fetch(`/api/rules?adAccountId=${accountId}&ruleId=${ruleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Rule was deleted AND verified as removed from Meta API
        setRules(rules.filter(r => r.id !== ruleId));
        toast.success(`✅ Rule "${ruleName}" deleted and verified removed from Meta API`);
      } else if (response.ok && !data.verified) {
        // Delete succeeded but verification failed
        toast.error(`⚠️ Rule deletion may have failed - rule still exists in Meta API`);
      } else {
        // Delete request failed
        toast.error(`❌ Failed to delete rule: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast.error("Failed to delete rule - network error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleRuleStatus = async (ruleId: string, currentStatus: string, ruleName: string) => {
    const newStatus = (currentStatus === "ENABLED" || currentStatus === "ACTIVE") ? "DISABLED" : "ENABLED";
    const action = newStatus === "ENABLED" ? "resume" : "pause";

    setUpdating(ruleId);
    try {
      const response = await fetch(`/api/rules?ruleId=${ruleId}&status=${newStatus}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the rule in local state
        setRules(
          rules.map(r =>
            r.id === ruleId ? { ...r, status: newStatus } : r
          )
        );
        toast.success(`✅ Rule "${ruleName}" ${action}d successfully`);
      } else {
        toast.error(`❌ Failed to ${action} rule: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating rule status:", error);
      toast.error(`Failed to ${action} rule - network error`);
    } finally {
      setUpdating(null);
    }
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setShowCreateModal(true);
  };

  const handleEditComplete = async (oldRuleId: string) => {
    // Delete the old rule and refresh the list
    setRules(rules.filter(r => r.id !== oldRuleId));
    setEditingRule(null);

    // Refresh the rules list to show the new rule
    try {
      const response = await fetch(`/api/rules?adAccountId=${accountId}`);
      if (response.ok) {
        const data = await response.json();
        setRules(data || []);
        toast.success("✅ Rule updated successfully!");
      }
    } catch (error) {
      console.error("Error refreshing rules:", error);
    }
  };

  if (!accountId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Please select an ad account first.</p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6 flex-col md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-3">
            Automated Rules
          </h1>
          <p className="text-lg text-gray-600">
            Create rules to automatically manage your ad spend and performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary whitespace-nowrap"
        >
          + New Rule
        </button>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <CreateRuleModal
          accountId={accountId}
          editingRule={editingRule}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRule(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            if (editingRule) {
              handleEditComplete(editingRule.id);
            }
          }}
        />
      )}

      {/* Rules List or Empty State */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div>
        </div>
      ) : rules.length === 0 ? (
        <>
          {/* Info Card */}
          <div className="card bg-poppy-light-purple/10 border-l-4 border-poppy-dark-purple">
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-3">
              How It Works
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-3">
                <span className="text-poppy-dark-purple font-bold">1.</span>
                <span>Choose a rule type: Spend-Based or ROAS-Based</span>
              </li>
              <li className="flex gap-3">
                <span className="text-poppy-dark-purple font-bold">2.</span>
                <span>Set your thresholds (e.g., pause if ROAS drops below 1.5x)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-poppy-dark-purple font-bold">3.</span>
                <span>Meta will automatically execute actions when conditions are met</span>
              </li>
            </ul>
          </div>

          {/* Empty State */}
          <div className="bg-gradient-to-br from-poppy-light-purple/10 to-poppy-light-purple/5 border-2 border-dashed border-poppy-light-purple/40 rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-2">
                No Rules Created Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Automate your campaign management with smart rules. Set spend limits, pause underperforming ads, and more!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Rule
                </span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Rules List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-poppins font-semibold text-gray-900">
              Active Rules ({rules.length})
            </h2>
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="card border-l-4 border-poppy-dark-purple hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getRuleTypeIcon(rule)}</span>
                      <div>
                        <h3 className="font-poppins font-semibold text-gray-900">
                          {rule.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {getRuleTypeLabel(rule)} • Trigger-Based
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Condition:</span> {getMetricDisplay(rule)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Action:</span> {getActionLabel(rule)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        rule.status === "ACTIVE" || rule.status === "ENABLED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rule.status === "ACTIVE" || rule.status === "ENABLED" ? "🟢 Active" : "⏸️ Paused"}
                    </span>
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      title="Edit this rule"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleToggleRuleStatus(rule.id, rule.status, rule.name)}
                      disabled={updating === rule.id}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        rule.status === "ACTIVE" || rule.status === "ENABLED"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      title={rule.status === "ACTIVE" || rule.status === "ENABLED" ? "Pause this rule" : "Resume this rule"}
                    >
                      {updating === rule.id ? "Updating..." : (rule.status === "ACTIVE" || rule.status === "ENABLED" ? "⏸️ Pause" : "▶️ Resume")}
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id, rule.name)}
                      disabled={deleting === rule.id}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Delete this rule"
                    >
                      {deleting === rule.id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RulesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div></div>}>
      <RulesContent />
    </Suspense>
  );
}
