"use client";

import { useState } from "react";
import type { Ad } from "@/lib/types";

interface CreateAdModalProps {
  adSetId: string;
  adAccountId: string;
  pageId: string;
  onClose: () => void;
  onSuccess: (ad: Ad) => void;
}

export default function CreateAdModal({
  adSetId,
  adAccountId,
  pageId,
  onClose,
  onSuccess,
}: CreateAdModalProps) {
  const [mode, setMode] = useState<"create" | "existing">("create");
  const [adName, setAdName] = useState("");
  const [creativeId, setCreativeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Creative creation fields
  const [image, setImage] = useState<File | null>(null);
  const [creativeName, setCreativeName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [headline, setHeadline] = useState("");
  const [ctaType, setCtaType] = useState("LEARN_MORE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!adName.trim()) throw new Error("Ad name is required");

      let finalCreativeId = creativeId;

      // If creating new creative, do that first
      if (mode === "create") {
        if (!image) throw new Error("Image is required");
        if (!creativeName.trim()) throw new Error("Creative name is required");
        if (!message.trim()) throw new Error("Ad message/body text is required");
        if (!link.trim()) throw new Error("Landing page URL is required");

        // Create creative first
        const formData = new FormData();
        formData.append("image", image);
        formData.append("adAccountId", adAccountId);
        formData.append("pageId", pageId);
        formData.append("creativeName", creativeName);
        formData.append("message", message);
        formData.append("link", link);
        if (headline) formData.append("headline", headline);
        if (ctaType) formData.append("ctaType", ctaType);

        const creativeResponse = await fetch("/api/creatives", {
          method: "POST",
          body: formData,
        });

        if (!creativeResponse.ok) {
          const creativeError = await creativeResponse.json().catch(() => ({}));
          throw new Error(creativeError.details || "Failed to create creative");
        }

        const creativeData = await creativeResponse.json();
        finalCreativeId = creativeData.creative.id;
      } else {
        if (!creativeId.trim()) throw new Error("Creative ID is required");
      }

      // Now create the ad with the creative ID
      const adRequestBody = {
        name: adName.trim(),
        adset_id: adSetId,
        status: "PAUSED",
        creative: {
          creative_id: finalCreativeId,
        },
      };

      const adResponse = await fetch(`/api/ads?adSetId=${adSetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adRequestBody),
      });

      if (!adResponse.ok) {
        let errorMessage = "Failed to create ad";
        try {
          const errorData = await adResponse.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = adResponse.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const adData = await adResponse.json();
      onSuccess(adData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6">
            Create Ad
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Mode selector */}
          <div className="flex gap-3 bg-gray-50 p-3 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all ${
                mode === "create"
                  ? "bg-poppy-dark-purple text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Create New Creative
            </button>
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all ${
                mode === "existing"
                  ? "bg-poppy-dark-purple text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Use Existing Creative
            </button>
          </div>

          {/* Common ad name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              placeholder="e.g., Summer Sale - Version A"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
            <p className="text-xs text-gray-500 mt-1">
              Internal name for your reference (not shown to users)
            </p>
          </div>

          {/* CREATE NEW CREATIVE MODE */}
          {mode === "create" && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-900">
                  ✨ Create Creative Right Here
                </p>
                <p className="text-xs text-green-800 mt-1">
                  Upload your image and enter ad copy. We'll create the creative in Meta and use it for this ad.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-poppy-dark-purple transition-colors"
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  {image ? (
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{image.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (Max 30MB)</p>
                    </div>
                  )}
                </div>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creative Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={creativeName}
                  onChange={(e) => setCreativeName(e.target.value)}
                  placeholder="e.g., Summer Sale Hero Image"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Copy / Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Shop our summer collection and save 20%!"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Summer Sale - 20% Off"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landing Page URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action Button
                  </label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  >
                    <option value="LEARN_MORE">Learn More</option>
                    <option value="SHOP_NOW">Shop Now</option>
                    <option value="GET_OFFER">Get Offer</option>
                    <option value="CONTACT_US">Contact Us</option>
                    <option value="SIGN_UP">Sign Up</option>
                    <option value="DOWNLOAD">Download</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* USE EXISTING CREATIVE MODE */}
          {mode === "existing" && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Use an Existing Creative
                </p>
                <p className="text-xs text-blue-800">
                  Reference a creative you've already created in Meta Ads Manager or with Poppy.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creative ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={creativeId}
                  onChange={(e) => setCreativeId(e.target.value)}
                  placeholder="e.g., 123456789012345"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The ID returned when you created a creative via Poppy or the Meta API
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </form>

        <div className="flex gap-3 pt-6 mt-6 px-0 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !adName || (mode === "create" && (!image || !creativeName || !message || !link)) || (mode === "existing" && !creativeId)}
            onClick={handleSubmit}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ad"}
          </button>
        </div>
      </div>
    </div>
  );
}
