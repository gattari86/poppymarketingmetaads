"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/app/components/SkeletonLoaders";

interface AnalyticsMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
  actions: number;
  action_value: number;
}

interface CampaignAnalytics extends AnalyticsMetrics {
  campaign_id: string;
  campaign_name: string;
  campaign_status: string;
  campaign_objective: string;
}

export default function AnalyticsDashboard() {
  const [adAccountId, setAdAccountId] = useState("");
  const [scope, setScope] = useState<"account" | "campaign">("account");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignAnalytics[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  // Load saved ad account on mount
  useEffect(() => {
    const savedAdAccountId = localStorage.getItem("selectedAdAccountId");
    if (savedAdAccountId) {
      setAdAccountId(savedAdAccountId);
    }
  }, []);

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const defaultEnd = today.toISOString().split("T")[0];
    const defaultStart = thirtyDaysAgo.toISOString().split("T")[0];

    setDateEnd(defaultEnd);
    setDateStart(defaultStart);
  }, []);

  const handleFetchAnalytics = async () => {
    if (!adAccountId || !dateStart || !dateEnd) {
      setError("Please select an ad account and date range");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        adAccountId,
        dateStart,
        dateEnd,
        scope,
      });

      console.log("📊 Fetching analytics with params:", {
        adAccountId,
        dateStart,
        dateEnd,
        scope,
      });

      const response = await fetch(`/api/analytics?${params}`);

      console.log("📊 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Analytics API error:", errorData);
        throw new Error(
          errorData.error || `Failed to fetch analytics (${response.status})`
        );
      }

      const data = await response.json();
      console.log("📊 Analytics data received:", data);

      if (scope === "account") {
        console.log("📊 Account metrics:", data.data.summary);
        setMetrics(data.data.summary);
        setCampaigns([]);
      } else {
        console.log("📊 Campaign data:", data.data.campaigns);
        setMetrics(null);
        setCampaigns(data.data.campaigns || []);
      }

      setDateRange(data.data.dateRange);
      toast.success("Analytics loaded successfully");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      console.error("❌ Analytics fetch error:", errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + "%";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-poppy-light-purple/8 via-poppy-light-purple/4 to-transparent px-6 md:px-8 py-6 md:py-8 rounded-2xl border border-poppy-light-purple/20">
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-2">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl">
          View detailed performance metrics for your ad campaigns and account
          performance.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
        {/* Scope Toggle */}
        <div>
          <label className="block text-sm md:text-base font-semibold text-gray-900 mb-3">
            View Type
          </label>
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md">
            <button
              onClick={() => {
                setScope("account");
                setMetrics(null);
                setCampaigns([]);
              }}
              className={`py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                scope === "account"
                  ? "bg-poppy-dark-purple text-white shadow-lg shadow-poppy-dark-purple/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Account Overview
            </button>
            <button
              onClick={() => {
                setScope("campaign");
                setMetrics(null);
                setCampaigns([]);
              }}
              className={`py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                scope === "campaign"
                  ? "bg-poppy-dark-purple text-white shadow-lg shadow-poppy-dark-purple/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Campaign Performance
            </button>
          </div>
        </div>

        {/* Date Range Picker */}
        <div>
          <label className="block text-sm md:text-base font-semibold text-gray-900 mb-3">
            Date Range
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Load Button */}
        <div>
          <button
            onClick={handleFetchAnalytics}
            disabled={loading || !adAccountId || !dateStart || !dateEnd}
            className="bg-poppy-dark-purple hover:bg-poppy-dark-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Loading Analytics...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Load Analytics
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 md:p-6">
          <div className="flex items-start gap-3.5">
            <span className="text-2xl md:text-3xl flex-shrink-0 mt-0">⚠️</span>
            <div>
              <p className="font-semibold text-sm md:text-base text-red-900">
                Error Loading Analytics
              </p>
              <p className="text-xs md:text-sm text-red-800 mt-1.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Overview */}
      {scope === "account" && metrics && !loading && (
        <div className="space-y-6">
          {/* Date Range Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 md:p-6">
            <p className="text-sm md:text-base text-blue-900">
              📅 Showing data from{" "}
              <span className="font-semibold">{dateRange.start}</span> to{" "}
              <span className="font-semibold">{dateRange.end}</span>
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Spend */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-green-700 uppercase tracking-wider">
                    Total Spend
                  </p>
                </div>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-900">
                {formatCurrency(metrics.spend)}
              </p>
              <p className="text-xs md:text-sm text-green-700 mt-2">
                All campaigns combined
              </p>
            </div>

            {/* Impressions */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-blue-700 uppercase tracking-wider">
                    Impressions
                  </p>
                </div>
                <span className="text-2xl">👁️</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">
                {formatNumber(metrics.impressions)}
              </p>
              <p className="text-xs md:text-sm text-blue-700 mt-2">
                Times your ads were shown
              </p>
            </div>

            {/* Clicks */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-purple-700 uppercase tracking-wider">
                    Clicks
                  </p>
                </div>
                <span className="text-2xl">🖱️</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">
                {formatNumber(metrics.clicks)}
              </p>
              <p className="text-xs md:text-sm text-purple-700 mt-2">
                People clicked your ads
              </p>
            </div>

            {/* Reach */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-orange-700 uppercase tracking-wider">
                    Reach
                  </p>
                </div>
                <span className="text-2xl">📢</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-orange-900">
                {formatNumber(metrics.reach)}
              </p>
              <p className="text-xs md:text-sm text-orange-700 mt-2">
                Unique people who saw your ads
              </p>
            </div>

            {/* CTR */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                    Click-Through Rate
                  </p>
                </div>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-indigo-900">
                {formatPercent(metrics.ctr)}
              </p>
              <p className="text-xs md:text-sm text-indigo-700 mt-2">
                % of impressions that were clicked
              </p>
            </div>

            {/* CPC */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                    Cost Per Click
                  </p>
                </div>
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-emerald-900">
                {formatCurrency(metrics.cpc)}
              </p>
              <p className="text-xs md:text-sm text-emerald-700 mt-2">
                Average cost of each click
              </p>
            </div>

            {/* CPM */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-rose-700 uppercase tracking-wider">
                    Cost Per 1000 Impressions
                  </p>
                </div>
                <span className="text-2xl">💳</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-rose-900">
                {formatCurrency(metrics.cpm)}
              </p>
              <p className="text-xs md:text-sm text-rose-700 mt-2">
                Cost per thousand impressions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Performance Table */}
      {scope === "campaign" && campaigns.length > 0 && !loading && (
        <div className="space-y-6">
          {/* Date Range Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 md:p-6">
            <p className="text-sm md:text-base text-blue-900">
              📅 Showing data from{" "}
              <span className="font-semibold">{dateRange.start}</span> to{" "}
              <span className="font-semibold">{dateRange.end}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-poppy-light-purple/10 to-poppy-light-purple/5 border-b-2 border-gray-200">
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                      Campaign
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      Spend
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      Impressions
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      Clicks
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      CTR
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      CPC
                    </th>
                    <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                      CPM
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, idx) => (
                    <tr
                      key={campaign.campaign_id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div>
                          <p className="font-semibold text-xs md:text-sm text-gray-900">
                            {campaign.campaign_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {campaign.campaign_objective}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-gray-900">
                        {formatCurrency(campaign.spend)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm text-gray-700">
                        {formatNumber(campaign.impressions)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm text-gray-700">
                        {formatNumber(campaign.clicks)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm text-gray-700">
                        {formatPercent(campaign.ctr)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm text-gray-700">
                        {formatCurrency(campaign.cpc)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right text-xs md:text-sm text-gray-700">
                        {formatCurrency(campaign.cpm)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-left">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.campaign_status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {campaign.campaign_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!metrics && campaigns.length === 0 && !loading && !error && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            No Analytics Loaded
          </p>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Select your ad account, choose a date range, and click "Load
            Analytics" to view your campaign performance.
          </p>
        </div>
      )}
    </div>
  );
}
