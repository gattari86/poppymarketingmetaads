"use client";

import { useEffect, useState } from "react";
import type { Campaign, AdSet } from "@/lib/types";
import CreateAdSetModal from "./CreateAdSetModal";
import AdSetAds from "./AdSetAds";

interface CampaignAdSetsProps {
  adAccountId: string;
  campaign: Campaign;
  onCampaignUpdate?: (updatedCampaign: Campaign) => void;
}

export default function CampaignAdSets({ adAccountId, campaign, onCampaignUpdate }: CampaignAdSetsProps) {
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdSet, setSelectedAdSet] = useState<AdSet | null>(null);
  const [activatingCampaign, setActivatingCampaign] = useState(false);
  const [activationError, setActivationError] = useState("");

  useEffect(() => {
    const fetchAdSets = async () => {
      try {
        const response = await fetch(
          `/api/adsets?campaignId=${campaign.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setAdSets(data || []);
        }
      } catch (error) {
        console.error("Error fetching ad sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdSets();
  }, [campaign.id]);

  const handleAdSetCreated = (newAdSet: AdSet) => {
    setAdSets([newAdSet, ...adSets]);
    setShowCreateModal(false);
  };

  const handleActivateCampaign = async () => {
    setActivatingCampaign(true);
    setActivationError("");

    try {
      console.log("Activating campaign:", campaign.id);

      const url = `/api/campaigns?campaignId=${campaign.id}&status=ACTIVE`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: "PATCH",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Failed to activate campaign";
        try {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Activation successful:", responseData);

      // Update campaign status locally
      const updatedCampaign = { ...campaign, status: "ACTIVE" as const };
      if (onCampaignUpdate) {
        console.log("Calling onCampaignUpdate with:", updatedCampaign);
        onCampaignUpdate(updatedCampaign);
      } else {
        console.warn("onCampaignUpdate callback not provided");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      console.error("Activation error:", errorMsg);
      setActivationError(errorMsg);
    } finally {
      setActivatingCampaign(false);
    }
  };

  return (
    <div className="bg-poppy-light-purple/5 border-l-4 border-poppy-dark-purple rounded-lg p-6 mt-3 ml-0 md:ml-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-poppins font-semibold text-gray-900">
          Ad Sets ({adSets.length})
        </h4>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={campaign.status !== "ACTIVE"}
          className="text-sm btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={campaign.status !== "ACTIVE" ? "Campaign must be ACTIVE to add ad sets" : ""}
        >
          + Add Ad Set
        </button>
      </div>

      {/* Warning: Campaign must be ACTIVE */}
      {campaign.status !== "ACTIVE" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div className="flex-1">
              <h5 className="font-semibold text-yellow-800 mb-2">Campaign Must Be Active</h5>
              <p className="text-sm text-yellow-700 mb-3">
                To create ad sets, this campaign must be in ACTIVE status. Currently it's {campaign.status}.
              </p>
              <button
                onClick={handleActivateCampaign}
                disabled={activatingCampaign}
                className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
              >
                {activatingCampaign ? "Activating..." : "Activate Campaign"}
              </button>
            </div>
          </div>
          {activationError && (
            <p className="text-sm text-red-700 mt-3 bg-red-50 p-2 rounded">
              Error: {activationError}
            </p>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateAdSetModal
          adAccountId={adAccountId}
          campaignId={campaign.id}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleAdSetCreated}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-poppy-dark-purple"></div>
        </div>
      ) : adSets.length === 0 ? (
        <p className="text-gray-600 text-sm py-4">
          No ad sets yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {adSets.map((adSet) => (
            <div key={adSet.id}>
              <button
                onClick={() =>
                  setSelectedAdSet(
                    selectedAdSet?.id === adSet.id ? null : adSet
                  )
                }
                className="w-full bg-white rounded-lg p-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {adSet.name}
                  </h5>
                  <p className="text-xs text-gray-500 capitalize">
                    Status: {adSet.status}
                  </p>
                </div>
                <div className="text-lg">
                  {selectedAdSet?.id === adSet.id ? "▼" : "▶"}
                </div>
              </button>

              {selectedAdSet?.id === adSet.id && (
                <AdSetAds adSet={adSet} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
