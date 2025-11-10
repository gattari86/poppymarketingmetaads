"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Campaign } from "@/lib/types";
import CreateCampaignModal from "@/app/components/CreateCampaignModal";
import CampaignAdSets from "@/app/components/CampaignAdSets";

export default function CampaignsPage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || localStorage.getItem("selectedAdAccountId");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Campaigns
          </h1>
          <p className="text-gray-600">
            Create and manage your ad campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + Create Campaign
        </button>
      </div>

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
          {campaigns.map((campaign) => (
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
                <CampaignAdSets campaign={campaign} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
