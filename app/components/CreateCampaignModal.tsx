"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Campaign } from "@/lib/types";
import { Spinner } from "./SkeletonLoaders";

interface CreateCampaignModalProps {
  accountId: string;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
}

// Meta ODAX (Outcome-Driven Ad Experiences) objectives - 2025
// These are the only valid campaign objectives for creating new campaigns
const OBJECTIVES = [
  { value: "OUTCOME_SALES", label: "💰 Sales", description: "Drive purchases and conversions" },
  { value: "OUTCOME_LEADS", label: "📋 Leads", description: "Collect contact information" },
  { value: "OUTCOME_TRAFFIC", label: "🚀 Traffic", description: "Send people to your website" },
  { value: "OUTCOME_AWARENESS", label: "👁️ Awareness", description: "Reach more people" },
  { value: "OUTCOME_ENGAGEMENT", label: "❤️ Engagement", description: "Get likes, comments, shares" },
  { value: "OUTCOME_APP_PROMOTION", label: "📱 App Promotion", description: "Promote your app" },
];

export default function CreateCampaignModal({
  accountId,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState(OBJECTIVES[0].value);
  const [dailyBudget, setDailyBudget] = useState("5"); // Default $5/day
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [specialAdCategories, setSpecialAdCategories] = useState<string[]>([]);
  const [touched, setTouched] = useState({ name: false, dailyBudget: false });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    // Focus first input on mount
    firstInputRef.current?.focus();

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [loading, onClose]);

  // Validation
  const errors = {
    name: touched.name && !name.trim() ? "Campaign name is required" : "",
    dailyBudget: touched.dailyBudget && (!dailyBudget || parseFloat(dailyBudget) <= 0)
      ? "Daily budget must be greater than $0"
      : touched.dailyBudget && parseFloat(dailyBudget) < 1
      ? "Minimum recommended budget is $1.00"
      : "",
  };

  const isValid = name.trim() && dailyBudget && parseFloat(dailyBudget) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, dailyBudget: true });

    if (!isValid) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    setError("");

    try {
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
      toast.success(`Campaign "${name.trim()}" created successfully!`, {
        description: "Your campaign is now paused and ready to configure",
      });
      onSuccess(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error("Failed to create campaign", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={!loading ? onClose : undefined}>
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-6">
          <h2 id="modal-title" className="text-2xl font-poppins font-semibold text-gray-900">
            Create Campaign
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campaign Name */}
          <div>
            <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="campaign-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched({ ...touched, name: true })}
              placeholder="e.g., Summer Sale 2025"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.name
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-poppy-dark-purple"
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Campaign Objective */}
          <div>
            <label htmlFor="campaign-objective" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Objective <span className="text-red-500">*</span>
            </label>
            <select
              id="campaign-objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              {OBJECTIVES.map((obj) => (
                <option key={obj.value} value={obj.value}>
                  {obj.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {OBJECTIVES.find(o => o.value === objective)?.description}
            </p>
          </div>

          {/* Daily Budget */}
          <div>
            <label htmlFor="daily-budget" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Budget (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">$</span>
              <input
                id="daily-budget"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                onBlur={() => setTouched({ ...touched, dailyBudget: true })}
                placeholder="5.00"
                min="0.01"
                step="0.01"
                disabled={loading}
                className={`w-full pl-10 pr-16 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.dailyBudget
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-poppy-dark-purple"
                }`}
                aria-invalid={!!errors.dailyBudget}
                aria-describedby="budget-help budget-error"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/day</span>
            </div>
            {errors.dailyBudget && (
              <p id="budget-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.dailyBudget}
              </p>
            )}
            <p id="budget-help" className="mt-1 text-xs text-gray-500">
              💡 Minimum recommended: $1.00 per day for better results
            </p>
          </div>

          {/* Special Ad Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Special Ad Categories (Optional)
            </label>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {[
                { value: "HOUSING", label: "Housing" },
                { value: "EMPLOYMENT", label: "Employment" },
                { value: "CREDIT", label: "Credit" },
              ].map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={specialAdCategories.includes(category.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSpecialAdCategories([...specialAdCategories, category.value]);
                      } else {
                        setSpecialAdCategories(
                          specialAdCategories.filter((c) => c !== category.value)
                        );
                      }
                    }}
                    disabled={loading}
                    className="w-4 h-4 text-poppy-dark-purple rounded focus:ring-2 focus:ring-poppy-dark-purple disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-700 font-medium">{category.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ℹ️ Select if your campaign falls under regulated categories
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg" role="alert">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" className="border-white" />
                  Creating...
                </span>
              ) : (
                "Create Campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
