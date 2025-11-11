"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Campaign, AdSet } from "@/lib/types";
import CreateAdSetModal from "./CreateAdSetModal";
import AdSetAds from "./AdSetAds";
import { Spinner } from "./SkeletonLoaders";

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
        } else {
          throw new Error("Failed to fetch ad sets");
        }
      } catch (error) {
        console.error("Error fetching ad sets:", error);
        toast.error("Failed to load ad sets");
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
    <div className="bg-gradient-to-br from-poppy-light-purple/5 to-poppy-light-purple/10 border-l-4 border-poppy-dark-purple rounded-lg p-6 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-poppins font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📁</span>
          Ad Sets
          <span className="text-sm font-normal text-gray-500">({adSets.length})</span>
        </h4>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-sm btn-secondary px-4 py-2"
          aria-label="Add ad set"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Ad Set
          </span>
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
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : adSets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600 text-sm mb-4">
            No ad sets yet. Create one to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sm btn-primary px-4 py-2"
          >
            Create First Ad Set
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {adSets.map((adSet) => {
            const isExpanded = selectedAdSet?.id === adSet.id;
            return (
              <div key={adSet.id}>
                <button
                  onClick={() =>
                    setSelectedAdSet(isExpanded ? null : adSet)
                  }
                  className="w-full bg-white rounded-lg p-4 text-left hover:shadow-md transition-all duration-200 flex justify-between items-center group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-gray-900">
                        {adSet.name}
                      </h5>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          adSet.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {adSet.status}
                      </span>
                    </div>
                    {adSet.daily_budget && (
                      <p className="text-xs text-gray-500">
                        Budget: ${(parseFloat(adSet.daily_budget) / 100).toFixed(2)}/day
                      </p>
                    )}
                  </div>
                  <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {isExpanded && (
                    <div className="mt-3">
                      <AdSetAds adSet={adSet} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
