"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import type { Campaign } from "@/lib/types";
import CreateCampaignModal from "@/app/components/CreateCampaignModal";
import CampaignAdSets from "@/app/components/CampaignAdSets";

export const dynamic = "force-dynamic";

function CampaignsContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || localStorage.getItem("selectedAdAccountId");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "ACTIVE" | "PAUSED">("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!accountId) return;
      try {
        const response = await fetch(
          `/api/campaigns?adAccountId=${accountId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCampaigns(data || []);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
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

  // Filter campaigns based on status
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (statusFilter === "all") return true;
    return campaign.status === statusFilter;
  });

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
        >
          + New Campaign
        </button>
      </div>

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
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-poppy-light-purple/10 border border-poppy-light-purple/30 rounded-xl p-8 text-center">
          <h3 className="text-lg font-poppins font-semibold text-gray-800 mb-2">
            No Campaigns Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first campaign to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                No {statusFilter !== "all" ? statusFilter.toLowerCase() : ""} campaigns found.
              </p>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
            <div key={campaign.id}>
              <button
                onClick={() =>
                  setSelectedCampaign(
                    selectedCampaign?.id === campaign.id ? null : campaign
                  )
                }
                className="w-full card text-left hover:shadow-soft transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-2">
                      {campaign.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">Status</span>
                        <p className="font-semibold text-gray-800 capitalize">
                          {campaign.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Objective</span>
                        <p className="font-semibold text-gray-800 capitalize">
                          {campaign.objective}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created</span>
                        <p className="font-semibold text-gray-800">
                          {new Date(campaign.created_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl ml-4">
                    {selectedCampaign?.id === campaign.id ? "▼" : "▶"}
                  </div>
                </div>
              </button>

              {/* Ad Sets */}
              {selectedCampaign?.id === campaign.id && (
                <CampaignAdSets
                  adAccountId={accountId || ""}
                  campaign={campaign}
                  onCampaignUpdate={(updatedCampaign) => {
                    // Update campaigns list with updated status
                    setCampaigns(campaigns.map(c =>
                      c.id === updatedCampaign.id ? updatedCampaign : c
                    ));
                    // Update selected campaign too
                    setSelectedCampaign(updatedCampaign);
                  }}
                />
              )}
            </div>
            ))
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
