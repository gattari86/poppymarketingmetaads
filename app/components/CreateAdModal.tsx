"use client";

import { useState, useEffect } from "react";
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

  // New Ad Copy fields (for display in ad)
  const [primaryText, setPrimaryText] = useState("");
  const [description, setDescription] = useState("");
  const [displayLink, setDisplayLink] = useState("");

  // Tracking fields
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [trackingPixel, setTrackingPixel] = useState("");

  // Local pageId state - can override if prop is empty
  const [localPageId, setLocalPageId] = useState(pageId || "");

  // Update localPageId when the prop changes (e.g., when switching accounts)
  useEffect(() => {
    if (pageId) {
      setLocalPageId(pageId);
      console.log("🔄 Updated localPageId to:", pageId);
    }
  }, [pageId, adAccountId]);

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
        if (!displayLink.trim()) throw new Error("Display Link is required");
        if (!primaryText.trim()) throw new Error("Primary Text is required");
        if (!description.trim()) throw new Error("Description is required");

        // Create creative first
        const formData = new FormData();
        formData.append("image", image);
        formData.append("adAccountId", String(adAccountId));
        formData.append("pageId", String(localPageId || pageId));
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

      // Now create the ad with the creative ID and all new fields
      const adRequestBody: Record<string, any> = {
        name: adName.trim(),
        adset_id: adSetId,
        status: "PAUSED",
        creative: {
          creative_id: finalCreativeId,
        },
        // Add optional destination fields if provided
        ...(displayLink && { display_link: displayLink.trim() }),
        // Add optional ad copy fields if provided
        ...(primaryText && { primary_text: primaryText.trim() }),
        ...(description && { adset_description: description.trim() }),
        // Add tracking if enabled
        ...(trackingEnabled && trackingPixel && {
          conversion_spec: [{
            conversion_pixel_id: trackingPixel.trim(),
          }]
        }),
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
      <div
        className="modal-content flex flex-col max-h-[90vh] w-full md:max-w-2xl mx-auto rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Enhanced Visual Hierarchy */}
        <div className="flex-shrink-0 bg-gradient-to-r from-poppy-light-purple/8 via-poppy-light-purple/4 to-transparent px-6 md:px-10 py-7 md:py-9 border-b border-poppy-light-purple/20">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-900 mb-3">
                Create Ad
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-sm">
                {mode === "create"
                  ? "Upload your image and enter ad details"
                  : "Reference an existing creative from Meta"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 p-2 rounded-lg"
              aria-label="Close modal"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0 overflow-y-auto flex-1 flex flex-col">
          {/* Mode Selector - Improved Visual Design */}
          <div className="flex-shrink-0 px-6 md:px-10 py-6 md:py-7 border-b border-gray-100 space-y-4">
            <p className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider letter-spacing">
              How would you like to create this ad?
            </p>
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <button
                type="button"
                onClick={() => setMode("create")}
                className={`py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                  mode === "create"
                    ? "bg-poppy-dark-purple text-white shadow-lg shadow-poppy-dark-purple/30"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-poppy-dark-purple/30"
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New
              </button>
              <button
                type="button"
                onClick={() => setMode("existing")}
                className={`py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                  mode === "existing"
                    ? "bg-poppy-dark-purple text-white shadow-lg shadow-poppy-dark-purple/30"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-poppy-dark-purple/30"
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                Use Existing
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-7 md:py-8 space-y-7 md:space-y-9">
            {/* Ad Name Field - Always Visible */}
            <div className="space-y-2.5">
              <label className="block text-sm md:text-base font-semibold text-gray-900">
                Ad Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={adName}
                onChange={(e) => setAdName(e.target.value)}
                placeholder="e.g., Summer Sale - Version A"
                className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
              />
              <p className="text-xs md:text-sm text-gray-500">
                Internal reference only (not shown to users)
              </p>
            </div>

            {/* Facebook Page ID - Always Visible if creating */}
            {mode === "create" && (
              <div className="space-y-2.5">
                <label className="block text-sm md:text-base font-semibold text-gray-900">
                  Facebook Page ID <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={localPageId}
                  onChange={(e) => setLocalPageId(e.target.value)}
                  placeholder="e.g., 123456789012345"
                  className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                />
                <p className="text-xs md:text-sm text-gray-500">
                  Your Facebook Page ID (auto-detected or set manually)
                </p>
              </div>
            )}

            {/* CREATE NEW CREATIVE MODE */}
            {mode === "create" && (
              <>
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-6 space-y-2.5">
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl md:text-3xl flex-shrink-0 mt-0">✨</span>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-green-900">
                        Create Creative Right Here
                      </p>
                      <p className="text-xs md:text-sm text-green-800 mt-1.5 leading-relaxed">
                        Upload your image and enter ad copy. We'll create the creative in Meta and set up your ad.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Image <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div
                    className="border-3 border-dashed border-gray-300 rounded-xl p-8 md:p-10 text-center cursor-pointer hover:border-poppy-dark-purple hover:bg-poppy-light-purple/5 transition-all duration-200"
                    onClick={() => document.getElementById("imageInput")?.click()}
                  >
                    {image ? (
                      <div className="space-y-2.5">
                        <svg className="w-10 h-10 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm md:text-base">{image.name}</p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          <p className="text-gray-700 font-semibold text-sm md:text-base">Click to upload or drag and drop</p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1.5">PNG, JPG, GIF (Max 30MB)</p>
                        </div>
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

                {/* Creative Name */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Creative Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={creativeName}
                    onChange={(e) => setCreativeName(e.target.value)}
                    placeholder="e.g., Summer Sale Hero Image"
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                  />
                </div>

                {/* Ad Copy / Message */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Ad Message <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Shop our summer collection and save 20%!"
                    rows={4}
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    The main copy that appears in your ad
                  </p>
                </div>

                {/* Headline */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Headline <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g., Summer Sale - 20% Off"
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                  />
                </div>

                {/* Section Divider - DESTINATION SECTION */}
                <div className="pt-2 pb-4 border-t border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Destination</h3>
                  <p className="text-xs md:text-sm text-gray-600">Where users are sent when they click</p>
                </div>

                {/* URL and Display Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8">
                  <div className="space-y-2.5">
                    <label className="block text-sm md:text-base font-semibold text-gray-900">
                      Landing Page URL <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                    />
                    <p className="text-xs md:text-sm text-gray-500">
                      The actual URL users are sent to
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-sm md:text-base font-semibold text-gray-900">
                      Display Link <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={displayLink}
                      onChange={(e) => setDisplayLink(e.target.value)}
                      placeholder="yoursite.com"
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                    />
                    <p className="text-xs md:text-sm text-gray-500">
                      URL shown to users (can differ from actual landing page)
                    </p>
                  </div>
                </div>

                {/* Section Divider - AD COPY SECTION */}
                <div className="pt-4 pb-4 border-t border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Ad Copy</h3>
                  <p className="text-xs md:text-sm text-gray-600">Text that appears in your ad placements</p>
                </div>

                {/* Primary Text */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Primary Text <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="Additional promotional text for your ad"
                    rows={3}
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    Text that appears above the image in the ad
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Description <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional description text below the image"
                    rows={2}
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    Appears below the image in some placements
                  </p>
                </div>

                {/* Call-to-Action */}
                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Call-to-Action Button
                  </label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all bg-white cursor-pointer"
                  >
                    <option value="LEARN_MORE">Learn More</option>
                    <option value="SHOP_NOW">Shop Now</option>
                    <option value="GET_OFFER">Get Offer</option>
                    <option value="CONTACT_US">Contact Us</option>
                    <option value="SIGN_UP">Sign Up</option>
                    <option value="DOWNLOAD">Download</option>
                    <option value="BOOK_NOW">Book Now</option>
                    <option value="SUBSCRIBE">Subscribe</option>
                    <option value="APPLY_NOW">Apply Now</option>
                  </select>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    Action button that appears in your ad
                  </p>
                </div>

                {/* Section Divider - TRACKING SECTION */}
                <div className="pt-4 pb-4 border-t border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Tracking</h3>
                  <p className="text-xs md:text-sm text-gray-600">Measure ad performance and conversions</p>
                </div>

                {/* Tracking Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex-1">
                      <label className="block text-sm md:text-base font-semibold text-gray-900">
                        Enable Conversion Tracking
                      </label>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Track conversions using pixels and events
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trackingEnabled}
                      onChange={(e) => setTrackingEnabled(e.target.checked)}
                      className="w-5 h-5 ml-4 cursor-pointer"
                    />
                  </div>

                  {/* Tracking Pixel Selection - Only show if tracking enabled */}
                  {trackingEnabled && (
                    <div className="space-y-2.5 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <label className="block text-sm md:text-base font-semibold text-gray-900">
                        Conversion Tracking Pixel <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={trackingPixel}
                        onChange={(e) => setTrackingPixel(e.target.value)}
                        placeholder="e.g., 123456789012345"
                        className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all bg-white"
                      />
                      <p className="text-xs md:text-sm text-gray-600 mt-2">
                        Meta pixel ID to track conversions from this ad
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* USE EXISTING CREATIVE MODE */}
            {mode === "existing" && (
              <>
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 md:p-6 space-y-2.5">
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl md:text-3xl flex-shrink-0 mt-0">🔗</span>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-blue-900">
                        Use Existing Creative
                      </p>
                      <p className="text-xs md:text-sm text-blue-800 mt-1.5 leading-relaxed">
                        Reference a creative you've already created in Meta Ads Manager or with Poppy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-sm md:text-base font-semibold text-gray-900">
                    Creative ID <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={creativeId}
                    onChange={(e) => setCreativeId(e.target.value)}
                    placeholder="e.g., 123456789012345"
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-poppy-dark-purple focus:border-transparent transition-all"
                  />
                  <p className="text-xs md:text-sm text-gray-500">
                    The ID returned when you created a creative via Poppy or the Meta API
                  </p>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 md:p-6">
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl md:text-3xl flex-shrink-0 mt-0">⚠️</span>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-red-900">Error</p>
                    <p className="text-xs md:text-sm text-red-800 mt-1.5 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Action Buttons */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 px-6 md:px-10 py-5 md:py-6 gap-4 flex">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !adName || (mode === "create" && (!image || !creativeName || !message || !link || !displayLink || !primaryText || !description)) || (mode === "existing" && !creativeId)}
              onClick={handleSubmit}
              className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold bg-poppy-dark-purple text-white rounded-lg hover:bg-poppy-dark-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Ad
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
