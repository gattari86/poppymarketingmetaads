"use client";

import { useEffect, useState } from "react";
import type { AdSet, Ad } from "@/lib/types";
import CreateAdModal from "./CreateAdModal";

interface AdSetAdsProps {
  adSet: AdSet;
}

export default function AdSetAds({ adSet }: AdSetAdsProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="bg-white rounded-lg p-4 mt-3 space-y-4 border-l-4 border-poppy-light-purple">
      <div className="flex justify-between items-center">
        <h5 className="font-poppins font-semibold text-gray-900">
          Ads ({ads.length})
        </h5>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-xs btn-secondary px-3 py-1"
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
              className="bg-gray-50 rounded p-3 border border-gray-100"
            >
              <p className="text-sm font-semibold text-gray-800">{ad.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                Status: {ad.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
