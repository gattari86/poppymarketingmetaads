"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AdSet, Ad } from "@/lib/types";
import CreateAdModal from "./CreateAdModal";

interface AdSetAdsProps {
  adSet: AdSet;
}

export default function AdSetAds({ adSet }: AdSetAdsProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [togglingAdId, setTogglingAdId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          `/api/ads?adSetId=${adSet.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setAds(data || []);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [adSet.id]);

  const handleAdCreated = (newAd: Ad) => {
    setAds([newAd, ...ads]);
    setShowCreateModal(false);
  };

  const handleToggleAdStatus = async (ad: Ad) => {
    const newStatus = ad.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setTogglingAdId(ad.id);

    try {
      const response = await fetch(
        `/api/ads?adId=${ad.id}&status=${newStatus}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        let errorMessage = `Failed to ${newStatus === "ACTIVE" ? "activate" : "pause"} ad`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Update ad status locally
      setAds(ads.map(a =>
        a.id === ad.id ? { ...a, status: newStatus as typeof newStatus } : a
      ));

      toast.success(
        newStatus === "ACTIVE"
          ? `Ad "${ad.name}" activated successfully`
          : `Ad "${ad.name}" paused successfully`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to ${newStatus === "ACTIVE" ? "activate" : "pause"} ad`, {
        description: errorMsg,
      });
    } finally {
      setTogglingAdId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-3 space-y-4 border-l-4 border-poppy-light-purple">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h5 className="font-poppins font-semibold text-gray-900 mb-1">
            Ads ({ads.length})
          </h5>
          <p className="text-xs text-gray-500">
            Ads inherit budget from their Ad Set. Budgets are managed at the Campaign & Ad Set level.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-xs btn-secondary px-3 py-1 whitespace-nowrap ml-4"
        >
          + Add Ad
        </button>
      </div>

      {showCreateModal && (
        <CreateAdModal
          adSetId={adSet.id}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleAdCreated}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-poppy-dark-purple"></div>
        </div>
      ) : ads.length === 0 ? (
        <p className="text-gray-600 text-sm py-4">
          No ads yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-gray-50 rounded p-3 border border-gray-100 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{ad.name}</p>
                <p className="text-xs text-gray-500 capitalize mt-1">
                  Status: {ad.status}
                </p>
              </div>
              <button
                onClick={() => handleToggleAdStatus(ad)}
                disabled={togglingAdId === ad.id}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors disabled:opacity-50 whitespace-nowrap ml-2 ${
                  ad.status === "ACTIVE"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
                title={ad.status === "ACTIVE" ? "Click to pause" : "Click to activate"}
                aria-label={`Toggle ad status: currently ${ad.status}`}
              >
                {togglingAdId === ad.id ? "Updating..." : (ad.status === "ACTIVE" ? "Pause" : "Activate")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
