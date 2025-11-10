"use client";

import { useEffect, useState } from "react";
import type { Campaign, AdSet } from "@/lib/types";
import CreateAdSetModal from "./CreateAdSetModal";
import AdSetAds from "./AdSetAds";

interface CampaignAdSetsProps {
  campaign: Campaign;
}

export default function CampaignAdSets({ campaign }: CampaignAdSetsProps) {
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdSet, setSelectedAdSet] = useState<AdSet | null>(null);

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

  return (
    <div className="bg-poppy-light-purple/5 border-l-4 border-poppy-dark-purple rounded-lg p-6 mt-3 ml-0 md:ml-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-poppins font-semibold text-gray-900">
          Ad Sets ({adSets.length})
        </h4>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-sm btn-secondary px-4 py-2"
        >
          + Add Ad Set
        </button>
      </div>

      {showCreateModal && (
        <CreateAdSetModal
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
