"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Campaign } from "@/lib/types";
import CreateCampaignModal from "@/app/components/CreateCampaignModal";
import CampaignAdSets from "@/app/components/CampaignAdSets";
import { CampaignsListSkeleton } from "@/app/components/SkeletonLoaders";
import { formatObjective, formatRelativeTime, formatDateWithRelative, debounce } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

function CampaignsContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || localStorage.getItem("selectedAdAccountId");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "ACTIVE" | "PAUSED">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!accountId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `/api/campaigns?adAccountId=${accountId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data || []);
        } else {
          throw new Error("Failed to fetch campaigns");
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns", {
          description: "Please try refreshing the page",
          action: {
            label: "Retry",
            onClick: () => window.location.reload(),
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [accountId]);

  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns]);
    setShowCreateModal(false);
  };

  // Filter, search, and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let result = campaigns;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((campaign) => campaign.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((campaign) =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.objective.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
        case "oldest":
          return new Date(a.created_time).getTime() - new Date(b.created_time).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [campaigns, statusFilter, searchQuery, sortBy]);

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const pausedCampaigns = campaigns.filter((c) => c.status === "PAUSED").length;

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
            Campaigns
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your ad campaigns efficiently
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary whitespace-nowrap"
          aria-label="Create new campaign"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Campaign
          </span>
        </button>
      </div>

      {/* Search and Sort */}
      {campaigns.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search campaigns by name or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple transition-shadow"
              aria-label="Search campaigns"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple bg-white cursor-pointer"
              aria-label="Sort campaigns"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Stats and Filters */}
      {campaigns.length > 0 && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
              <p className="text-3xl font-poppins font-bold text-poppy-dark-purple">
                {campaigns.length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Active</p>
              <p className="text-3xl font-poppins font-bold text-green-600">
                {activeCampaigns}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500 mb-1">Paused</p>
              <p className="text-3xl font-poppins font-bold text-orange-600">
                {pausedCampaigns}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-poppy-dark-purple text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({campaigns.length})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "ACTIVE"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active ({activeCampaigns})
            </button>
            <button
              onClick={() => setStatusFilter("PAUSED")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "PAUSED"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paused ({pausedCampaigns})
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          accountId={accountId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCampaignCreated}
        />
      )}

      {/* Campaigns List */}
      {loading ? (
        <CampaignsListSkeleton />
      ) : campaigns.length === 0 ? (
        <div className="bg-gradient-to-br from-poppy-light-purple/10 to-poppy-light-purple/5 border-2 border-dashed border-poppy-light-purple/40 rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-2">
              No Campaigns Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first campaign. It only takes a minute!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Campaign
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedCampaigns.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-600 mb-2">
                No campaigns found matching your filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-poppy-dark-purple hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredAndSortedCampaigns.map((campaign) => {
              const isExpanded = selectedCampaign?.id === campaign.id;
              return (
                <div
                  key={campaign.id}
                  className="transition-all duration-200"
                >
                  <button
                    onClick={() =>
                      setSelectedCampaign(isExpanded ? null : campaign)
                    }
                    className="w-full card text-left hover:shadow-soft transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-poppins font-semibold text-gray-900">
                            {campaign.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              campaign.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "PAUSED"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs block mb-1">Objective</span>
                            <p className="font-semibold text-gray-800">
                              {formatObjective(campaign.objective)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs block mb-1">Created</span>
                            <p className="font-semibold text-gray-800" title={new Date(campaign.created_time).toLocaleString()}>
                              {formatRelativeTime(campaign.created_time)}
                            </p>
                          </div>
                          {campaign.daily_budget && (
                            <div>
                              <span className="text-gray-500 text-xs block mb-1">Daily Budget</span>
                              <p className="font-semibold text-gray-800">
                                ${(parseFloat(campaign.daily_budget) / 100).toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Ad Sets - with smooth animation */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {isExpanded && (
                      <div className="mt-3">
                        <CampaignAdSets campaign={campaign} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div></div>}>
      <CampaignsContent />
    </Suspense>
  );
}
