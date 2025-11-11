"use client";

import { useState } from "react";
import type { Ad } from "@/lib/types";
import { Warning } from "@phosphor-icons/react";

interface CreateAdModalProps {
  adSetId: string;
  onClose: () => void;
  onSuccess: (ad: Ad) => void;
}

export default function CreateAdModal({
  adSetId,
  onClose,
  onSuccess,
}: CreateAdModalProps) {
  const [name, setName] = useState("");
  const [useExistingCreative, setUseExistingCreative] = useState(false);
  const [creativeId, setCreativeId] = useState("");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [description, setDescription] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [ctaType, setCtaType] = useState("LEARN_MORE");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CTA_TYPES = [
    "LEARN_MORE",
    "SHOP_NOW",
    "CONTACT_US",
    "SIGN_UP",
    "SUBSCRIBE",
    "DOWNLOAD",
    "GET_OFFER",
    "BOOK_NOW",
    "GET_QUOTES",
    "ORDER_NOW",
    "INSTALL_APP",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name.trim()) throw new Error("Ad name is required");

      if (useExistingCreative) {
        if (!creativeId.trim()) throw new Error("Please enter a creative ID");
      } else {
        if (!headline.trim()) throw new Error("Headline is required");
        if (!primaryText.trim()) throw new Error("Primary text is required");
        if (!landingPageUrl.trim()) throw new Error("Landing page URL is required");
        if (!imageUrl.trim()) throw new Error("Image URL is required");
      }

      const requestBody: Record<string, unknown> = {
        name: name.trim(),
        adset_id: adSetId,
        status: "PAUSED", // Meta v24 requires status to be set
      };

      if (useExistingCreative) {
        // Use existing creative - only pass creative_id
        requestBody.creative = {
          creative_id: creativeId.trim(),
        };
      } else {
        // Create inline creative with all fields per Meta v24
        requestBody.creative = {
          title: headline.trim(),
          body: primaryText.trim(),
          link_description: description.trim() || undefined,
          image_url: imageUrl.trim(),
          call_to_action_type: ctaType,
          object_url: landingPageUrl.trim(),
        };
      }

      const response = await fetch(`/api/ads?adSetId=${adSetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create ad";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-6 flex-shrink-0">
          Create Ad
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale - Version A"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useExistingCreative}
                onChange={() => setUseExistingCreative(false)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Create Ad Content (Recommended)
              </span>
            </label>

            {!useExistingCreative && (
              <div className="space-y-3 ml-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800 mb-3 flex items-start gap-2">
                  <Warning size={16} weight="fill" className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Fill in your ad details below:</strong> Provide the headline, text, image, landing page, and call-to-action. This creates the complete ad content right here.</span>
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g., Amazing Summer Sale"
                    maxLength={125}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">{headline.length}/125 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="Main ad copy / body text"
                    rows={3}
                    maxLength={300}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">{primaryText.length}/300 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details (appears below primary text)"
                    rows={2}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">{description.length}/300 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Image must be at least 1200x628px for best results
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landing Page URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    placeholder="https://your-website.com/page"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL where users will be directed when they click the ad
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action Button <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                  >
                    {CTA_TYPES.map((cta) => (
                      <option key={cta} value={cta}>
                        {cta.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Button text shown to users (e.g., "Shop Now", "Learn More")
                  </p>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="radio"
                checked={useExistingCreative}
                onChange={() => setUseExistingCreative(true)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Use Existing Creative ID
              </span>
            </label>

            {useExistingCreative && (
              <div className="ml-6 space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700 mb-3">
                  If you've already created creatives in Meta Ads Manager, you can reuse them here.
                </p>
                <input
                  type="text"
                  value={creativeId}
                  onChange={(e) => setCreativeId(e.target.value)}
                  placeholder="Enter creative ID (e.g., 123456789)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Find creative IDs in Meta Ads Manager under Assets → Creatives
                </p>
              </div>
            )}
          </div>

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
            disabled={loading || !name}
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
