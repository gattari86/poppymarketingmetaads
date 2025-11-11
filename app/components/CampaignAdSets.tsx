"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Campaign, AdSet } from "@/lib/types";
import CreateAdSetModal from "./CreateAdSetModal";
import AdSetAds from "./AdSetAds";
import { Spinner } from "./SkeletonLoaders";

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
  const [togglingAdSetId, setTogglingAdSetId] = useState<string | null>(null);
  const [pageId, setPageId] = useState("");

  // Fetch user's Facebook Pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        console.log("📄 Fetching Facebook Pages...");
        const response = await fetch("/api/pages");

        console.log("📄 Pages endpoint response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📄 Pages data received:", data);

          // Auto-select first page if available
          if (data.pages && data.pages.length > 0) {
            const firstPageId = data.pages[0].id;
            setPageId(firstPageId);
            // Store pageId scoped to this ad account
            const accountKey = `pageId_${adAccountId}`;
            localStorage.setItem(accountKey, firstPageId);
            console.log("✅ Auto-selected first page:", firstPageId, "for account:", adAccountId);
          } else {
            console.warn("⚠️ No pages returned from API");
            // Fallback: check localStorage for this specific account
            const accountKey = `pageId_${adAccountId}`;
            const storedPageId = localStorage.getItem(accountKey);
            if (storedPageId) {
              setPageId(storedPageId);
              console.log("✅ Using stored pageId from localStorage:", storedPageId);
            }
          }
        } else {
          console.error("❌ Pages endpoint failed with status:", response.status);
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Error response:", errorData);

          // Fallback: check localStorage for this specific account
          const accountKey = `pageId_${adAccountId}`;
          const storedPageId = localStorage.getItem(accountKey);
          if (storedPageId) {
            setPageId(storedPageId);
            console.log("✅ Using stored pageId from localStorage:", storedPageId);
            toast.info("Using saved Facebook Page ID from previous session");
          } else {
            toast.error("Please set your Facebook Page ID in the create ad dialog");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching pages:", error);

        // Fallback: check localStorage for this specific account
        const accountKey = `pageId_${adAccountId}`;
        const storedPageId = localStorage.getItem(accountKey);
        if (storedPageId) {
          setPageId(storedPageId);
          console.log("✅ Using stored pageId from localStorage:", storedPageId);
        } else {
          console.warn("⚠️ No pageId available - user will need to set it");
        }
      }
    };

    fetchPages();
  }, [adAccountId]);

  // Debug: Log the account ID
  useEffect(() => {
    console.log("🔍 CampaignAdSets received adAccountId:", {
      value: adAccountId,
      type: typeof adAccountId,
      length: adAccountId?.length,
    });
  }, [adAccountId]);

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

  const handleToggleAdSetStatus = async (adSet: AdSet) => {
    const newStatus = adSet.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setTogglingAdSetId(adSet.id);

    try {
      const response = await fetch(
        `/api/adsets?adSetId=${adSet.id}&status=${newStatus}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        let errorMessage = `Failed to ${newStatus === "ACTIVE" ? "activate" : "pause"} ad set`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Update ad set status locally
      setAdSets(adSets.map(as =>
        as.id === adSet.id ? { ...as, status: newStatus as typeof newStatus } : as
      ));

      toast.success(
        newStatus === "ACTIVE"
          ? `Ad set "${adSet.name}" activated successfully`
          : `Ad set "${adSet.name}" paused successfully`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to ${newStatus === "ACTIVE" ? "activate" : "pause"} ad set`, {
        description: errorMsg,
      });
    } finally {
      setTogglingAdSetId(null);
    }
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
          disabled={campaign.status !== "ACTIVE"}
          className="text-sm btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add ad set"
          title={campaign.status !== "ACTIVE" ? "Campaign must be ACTIVE to add ad sets" : ""}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Ad Set
          </span>
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
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Status toggle button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAdSetStatus(adSet);
                      }}
                      disabled={togglingAdSetId === adSet.id}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors disabled:opacity-50 ${
                        adSet.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      }`}
                      title={adSet.status === "ACTIVE" ? "Click to pause" : "Click to activate"}
                      aria-label={`Toggle ad set status: currently ${adSet.status}`}
                    >
                      {togglingAdSetId === adSet.id ? "Updating..." : (adSet.status === "ACTIVE" ? "Pause" : "Activate")}
                    </button>
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {isExpanded && (
                    <div className="mt-3">
                      <AdSetAds adSet={adSet} adAccountId={adAccountId} pageId={pageId} />
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
