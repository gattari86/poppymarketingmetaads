import axios from "axios";

const API_VERSION = process.env.META_GRAPH_VERSION || "v24.0";
const GRAPH_API_URL = "https://graph.facebook.com";

export const metaApi = axios.create({
  baseURL: `${GRAPH_API_URL}/${API_VERSION}`,
});

// Utility function to format ad account ID with 'act_' prefix if needed
export function formatAdAccountId(accountId: string): string {
  if (!accountId) return accountId;
  // If it already has the act_ prefix, return as is
  if (accountId.startsWith("act_")) return accountId;
  // Otherwise, add the prefix
  return `act_${accountId}`;
}

export async function getAdAccounts(accessToken: string) {
  try {
    const response = await metaApi.get("/me/adaccounts", {
      params: {
        access_token: accessToken,
        fields: "id,name,currency,account_id,account_status",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching ad accounts:", error);
    throw error;
  }
}

export async function getCampaigns(adAccountId: string, accessToken: string) {
  try {
    const formattedId = formatAdAccountId(adAccountId);
    const response = await metaApi.get(`/${formattedId}/campaigns`, {
      params: {
        access_token: accessToken,
        fields: "id,name,status,objective,created_time,updated_time,daily_budget,lifetime_budget",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}

export async function getAdSets(campaignId: string, accessToken: string) {
  try {
    const response = await metaApi.get(`/${campaignId}/adsets`, {
      params: {
        access_token: accessToken,
        fields: "id,name,campaign_id,status,targeting,daily_budget,lifetime_budget,created_time,updated_time",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching ad sets:", error);
    throw error;
  }
}

export async function getAds(adSetId: string, accessToken: string) {
  try {
    const response = await metaApi.get(`/${adSetId}/ads`, {
      params: {
        access_token: accessToken,
        fields: "id,name,adset_id,campaign_id,status,creative,created_time,updated_time",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
}

export async function createCampaign(
  adAccountId: string,
  data: {
    name: string;
    objective: string;
    status: string;
    special_ad_categories?: string[];
    daily_budget?: number;
  },
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);

    // Meta API v24 requires specific parameters for campaign creation
    // Reference: https://developers.facebook.com/docs/marketing-api/reference/ad-campaign
    const campaignData: Record<string, any> = {
      name: data.name,
      objective: data.objective,
      status: data.status,
      // REQUIRED: buying_type - specifies how to buy inventory (AUCTION is standard)
      buying_type: "AUCTION",
      // REQUIRED: Must specify at least one budget. Using daily_budget with default of $5/day
      daily_budget: (data.daily_budget || 500) * 100, // Convert to cents (Meta API expects cents)
      // Meta requires special_ad_categories - send as JSON string or empty array
      // Empty array means "no special categories apply to this campaign"
      special_ad_categories: data.special_ad_categories && data.special_ad_categories.length > 0
        ? data.special_ad_categories
        : [],
    };

    console.log("Creating campaign with v24 parameters:", {
      adAccountId: formattedId,
      name: campaignData.name,
      objective: campaignData.objective,
      buying_type: campaignData.buying_type,
      daily_budget: campaignData.daily_budget,
      status: campaignData.status,
    });

    const response = await metaApi.post(`/${formattedId}/campaigns`, campaignData, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

export async function createAdSet(
  adAccountId: string,
  campaignId: string,
  data: {
    name: string;
    status: string;
    daily_budget?: number;
    targeting?: Record<string, unknown>;
    bid_amount?: number;
    optimization_goal?: string;
    billing_event?: string;
  },
  accessToken: string
) {
  // Meta API v24 CORRECT endpoint: POST /act_{ad_account_id}/adsets
  // NOT /{campaignId}/adsets - that doesn't exist!
  // campaign_id is sent in the request body, not in URL
  const formattedAccountId = formatAdAccountId(adAccountId);

  // Meta v24 targeting spec requires specific structure
  // geo_locations needs "regions" or "cities" or just "countries" array (not wrapped in object)
  const defaultTargeting = {
    geo_locations: {
      countries: ["US"], // Use "countries" key with array, not "country" in object
    },
    // Add other required targeting fields for v24
    age_min: 18,
    age_max: 65,
  };

  const adSetData: Record<string, any> = {
    name: data.name,
    campaign_id: campaignId, // REQUIRED: send campaign_id in body
    status: data.status,
    // NOTE: Do NOT include daily_budget here!
    // Meta v24 uses either campaign-level OR ad set-level budgets, not both
    // If campaign has a budget, ad sets inherit it and cannot have their own
    targeting: data.targeting || defaultTargeting,
    // REQUIRED: optimization_goal - what to optimize for
    optimization_goal: data.optimization_goal || "REACH",
    // REQUIRED: billing_event - when to charge (IMPRESSIONS, LINK_CLICKS, etc)
    billing_event: data.billing_event || "IMPRESSIONS",
    // RECOMMENDED: bid_amount - how much to bid per event (must be integer cents)
    bid_amount: Math.round(data.bid_amount || 500), // Ensure integer cents
  };

  console.log("Creating ad set with v24 parameters:", {
    accountId: formattedAccountId,
    campaignId,
    name: adSetData.name,
    daily_budget: adSetData.daily_budget,
    optimization_goal: adSetData.optimization_goal,
    billing_event: adSetData.billing_event,
    status: adSetData.status,
    targeting: adSetData.targeting,
    bid_amount: adSetData.bid_amount,
  });

  try {
    // Correct endpoint: POST /act_{ad_account_id}/adsets with campaign_id in body
    const endpoint = `/${formattedAccountId}/adsets`;
    console.log("📡 Making POST request to Meta API:", {
      endpoint,
      baseURL: `${GRAPH_API_URL}/${API_VERSION}`,
      fullURL: `${GRAPH_API_URL}/${API_VERSION}${endpoint}`,
      data: adSetData,
    });

    const response = await metaApi.post(endpoint, adSetData, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    // Enhanced error logging to capture Meta API error details
    if (error instanceof Error) {
      console.error("Error creating ad set:", {
        message: error.message,
        name: error.name,
      });

      // Check if it's an axios error with response data
      if ("response" in error && typeof error.response === "object" && error.response !== null) {
        const axiosError = error as any;
        const metaErrorData = axiosError.response?.data;
        console.error("Meta API Error Details:", {
          status: axiosError.response?.status,
          errorCode: metaErrorData?.error?.code,
          errorType: metaErrorData?.error?.type,
          errorMessage: metaErrorData?.error?.message,
          errorSubcode: metaErrorData?.error?.error_subcode,
          fullError: metaErrorData?.error,
          requestData: adSetData,
        });
      }
    }
    throw error;
  }
}

export async function createAd(
  adSetId: string,
  data: {
    name: string;
    adset_id?: string;
    creative: {
      creative_id?: string;
      title?: string;
      body?: string;
      image_url?: string;
    };
    status?: string;
    // Optional destination fields
    display_link?: string;
    // Optional ad copy fields
    primary_text?: string;
    adset_description?: string;
    // Optional tracking fields
    conversion_spec?: Array<{
      conversion_pixel_id?: string;
      conversion_event_id?: string;
    }>;
    // Allow any other Meta API v24 ad fields
    [key: string]: any;
  },
  accessToken: string
) {
  try {
    // Meta API v24 requires specific parameters for ad creation
    // Build ad data, copying all provided fields to allow flexibility
    const adData: Record<string, any> = {
      name: data.name,
      adset_id: adSetId,
      creative: data.creative,
      // REQUIRED in v24: status - should be PAUSED for new ads
      status: data.status || "PAUSED",
    };

    // Add optional destination fields
    if (data.display_link) {
      adData.display_link = data.display_link;
    }

    // Add optional ad copy fields
    if (data.primary_text) {
      adData.primary_text = data.primary_text;
    }
    if (data.adset_description) {
      adData.adset_description = data.adset_description;
    }

    // Add optional tracking/conversion spec
    if (data.conversion_spec) {
      adData.conversion_spec = data.conversion_spec;
    }

    // Pass through any other fields that were provided
    for (const [key, value] of Object.entries(data)) {
      if (!adData.hasOwnProperty(key) && value !== undefined) {
        adData[key] = value;
      }
    }

    console.log("Creating ad with v24 parameters:", {
      adSetId,
      name: adData.name,
      status: adData.status,
      hasCreative: !!adData.creative,
      creativeType: adData.creative.creative_id ? "existing" : "new",
      hasDisplayLink: !!adData.display_link,
      hasPrimaryText: !!adData.primary_text,
      hasTracking: !!adData.conversion_spec,
    });

    const response = await metaApi.post(`/${adSetId}/ads`, adData, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ad:", error);
    throw error;
  }
}

export async function updateCampaignStatus(
  campaignId: string,
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED",
  accessToken: string
) {
  try {
    const response = await metaApi.post(
      `/${campaignId}`,
      { status },
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating campaign status:", error);
    throw error;
  }
}

export async function deleteCampaign(
  campaignId: string,
  accessToken: string
) {
  try {
    console.log("🗑️ Deleting campaign:", campaignId);
    const response = await metaApi.post(
      `/${campaignId}`,
      { status: "DELETED" },
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    console.log("✅ Campaign deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
}

export async function updateAdSetStatus(
  adSetId: string,
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED",
  accessToken: string
) {
  try {
    const response = await metaApi.post(
      `/${adSetId}`,
      { status },
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ad set status:", error);
    throw error;
  }
}

export async function updateAdStatus(
  adId: string,
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED",
  accessToken: string
) {
  try {
    const response = await metaApi.post(
      `/${adId}`,
      { status },
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ad status:", error);
    throw error;
  }
}

export async function getAutomatedRules(
  adAccountId: string,
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);
    const response = await metaApi.get(
      `/${formattedId}/adrules_library`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,status,evaluation_spec,execution_spec,created_time,updated_time",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching automated rules:", error);
    throw error;
  }
}

export async function createAutomatedRule(
  adAccountId: string,
  data: {
    name: string;
    evaluation_spec: Record<string, unknown>;
    execution_spec: Record<string, unknown>;
    status?: string;
  },
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);
    const response = await metaApi.post(
      `/${formattedId}/adrules_library`,
      data,
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating automated rule:", error);
    throw error;
  }
}

export async function deleteAutomatedRule(
  ruleId: string,
  accessToken: string
) {
  try {
    const response = await metaApi.delete(
      `/${ruleId}`,
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting automated rule:", error);
    throw error;
  }
}

export async function updateRuleStatus(
  ruleId: string,
  status: "ENABLED" | "DISABLED",
  accessToken: string
) {
  try {
    const response = await metaApi.post(
      `/${ruleId}`,
      {
        status,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating rule status:", error);
    throw error;
  }
}

// Creative creation functions for programmatic ad creation
export async function uploadAdImage(
  adAccountId: string,
  imageBuffer: Buffer,
  filename: string,
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);

    console.log("📤 Uploading image with filename:", filename, "Size:", imageBuffer.length, "bytes");

    // Create FormData for multipart upload
    const FormData = require("form-data");
    const form = new FormData();
    form.append("filename", imageBuffer, filename);
    form.append("access_token", accessToken);

    console.log("📤 Sending multipart request to Meta API...");

    const response = await metaApi.post(
      `/${formattedId}/adimages`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    console.log("📤 Meta API upload response status:", response.status);
    console.log("📤 Meta API upload response data:", JSON.stringify(response.data, null, 2));

    // Check if response has images
    if (!response.data || !response.data.images) {
      console.error("❌ Invalid upload response - no images field:", response.data);
      throw new Error("Meta API did not return images field in response");
    }

    // Response format: { images: { [filename]: { hash: "..." } } }
    // Meta may return images with different filenames, so check all returned images
    let imageData = response.data.images[filename];

    if (!imageData && Object.keys(response.data.images).length > 0) {
      // If exact filename not found, try to get the first/only image
      const imageKeys = Object.keys(response.data.images);
      console.log("⚠️ Exact filename not found. Available images:", imageKeys);
      if (imageKeys.length > 0) {
        imageData = response.data.images[imageKeys[0]];
        console.log("✅ Using first available image:", imageKeys[0]);
      }
    }

    if (!imageData) {
      console.error("❌ No image data found in response. Images object:", response.data.images);
      throw new Error("No image data returned from Meta API");
    }

    if (!imageData.hash) {
      console.error("❌ Image data missing hash. Data:", imageData);
      throw new Error("Image uploaded but no hash returned");
    }

    console.log("✅ Image uploaded successfully:", {
      originalFilename: filename,
      returnedKey: Object.keys(response.data.images)[0],
      hash: imageData.hash,
    });

    return imageData.hash;
  } catch (error) {
    console.error("❌ Error uploading ad image:", error);

    // Log detailed error if it's an axios error
    const axiosError = error as any;
    if (axiosError?.response?.data) {
      console.error("❌ Meta API error response:", axiosError.response.data);
      console.error("❌ HTTP Status:", axiosError.response.status);
    }
    if (axiosError?.message) {
      console.error("❌ Error message:", axiosError.message);
    }

    throw error;
  }
}

export async function createAdCreative(
  adAccountId: string,
  data: {
    name: string;
    page_id: string;
    image_hash: string;
    link: string;
    message: string;
    headline?: string;
    call_to_action_type?: string;
  },
  accessToken: string
) {
  let creativeData: Record<string, any> = {};

  try {
    const formattedId = formatAdAccountId(adAccountId);

    // Normalize URL: ensure it has a protocol
    const normalizeUrl = (url: string): string => {
      const trimmed = url.trim();
      // Check if URL already has a protocol
      if (/^https?:\/\//.test(trimmed)) {
        return trimmed;
      }
      // Add https:// if no protocol found
      return `https://${trimmed}`;
    };

    const normalizedLink = normalizeUrl(data.link);

    // Meta API v24 creative creation using object_story_spec
    creativeData = {
      name: data.name,
      object_story_spec: {
        page_id: data.page_id,
        link_data: {
          image_hash: data.image_hash,
          link: normalizedLink,
          message: data.message,
          ...(data.headline && { name: data.headline }),
          ...(data.call_to_action_type && {
            call_to_action: {
              type: data.call_to_action_type,
              value: {
                link: normalizedLink,
              },
            },
          }),
        },
      },
    };

    console.log("Creating ad creative with v24 parameters:", {
      name: creativeData.name,
      pageId: data.page_id,
      imageHash: data.image_hash,
      link: normalizedLink,
      linkOriginal: data.link,
      hasCallToAction: !!data.call_to_action_type,
      callToActionType: data.call_to_action_type,
    });

    const response = await metaApi.post(
      `/${formattedId}/adcreatives`,
      creativeData,
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    const creativeId = response.data.id;
    if (!creativeId) {
      throw new Error("Failed to get creative ID from response");
    }

    console.log("Ad creative created successfully:", {
      creativeId,
    });

    return {
      id: creativeId,
      ...response.data,
    };
  } catch (error) {
    console.error("Error creating ad creative:", error);

    // Log detailed error info for debugging
    const axiosError = error as any;
    if (axiosError?.response?.data) {
      console.error("❌ Meta API error response data:", axiosError.response.data);
      console.error("❌ Meta API error object:", JSON.stringify(axiosError.response.data.error || axiosError.response.data, null, 2));
      console.error("❌ HTTP Status:", axiosError.response.status);
    }
    if (axiosError?.response?.statusText) {
      console.error("❌ Status text:", axiosError.response.statusText);
    }

    console.error("❌ Request payload that failed:", JSON.stringify(creativeData, null, 2));

    throw error;
  }
}

// Analytics/Insights functions
export async function getAccountInsights(
  adAccountId: string,
  accessToken: string,
  dateStart?: string | null,
  dateEnd?: string | null
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);

    // Default to last 30 days if no dates provided
    let startDate = dateStart;
    let endDate = dateEnd;

    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      endDate = endDate || today.toISOString().split("T")[0];
      startDate = startDate || thirtyDaysAgo.toISOString().split("T")[0];
    }

    console.log("📊 Fetching account insights for date range:", { startDate, endDate });

    const response = await metaApi.get(`/${formattedId}/insights`, {
      params: {
        access_token: accessToken,
        fields:
          "campaign_id,spend,impressions,clicks,reach,frequency,ctr,cpc,cpp,cpm,actions,action_values,date_start,date_stop",
        date_preset: "last_30d", // Fallback if dates not provided
        time_range: JSON.stringify({
          since: startDate,
          until: endDate,
        }),
        level: "account",
      },
    });

    console.log("📊 Account insights response:", response.data.data?.length, "records");

    // Aggregate data
    const aggregated = aggregateInsightsData(response.data.data || []);

    return {
      summary: aggregated,
      detailed: response.data.data || [],
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Error fetching account insights:", error);
    throw error;
  }
}

export async function getCampaignInsights(
  adAccountId: string,
  accessToken: string,
  dateStart?: string | null,
  dateEnd?: string | null
) {
  try {
    // Default to last 30 days if no dates provided
    let startDate = dateStart;
    let endDate = dateEnd;

    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      endDate = endDate || today.toISOString().split("T")[0];
      startDate = startDate || thirtyDaysAgo.toISOString().split("T")[0];
    }

    console.log("📊 Fetching campaign insights for date range:", { startDate, endDate });

    // Get campaigns first
    const campaigns = await getCampaigns(adAccountId, accessToken);

    // Fetch insights for each campaign
    const campaignInsights = await Promise.all(
      campaigns.map(async (campaign: any) => {
        try {
          const response = await metaApi.get(`/${campaign.id}/insights`, {
            params: {
              access_token: accessToken,
              fields:
                "campaign_id,campaign_name,spend,impressions,clicks,reach,frequency,ctr,cpc,cpp,cpm,actions,action_values,date_start,date_stop",
              time_range: JSON.stringify({
                since: startDate,
                until: endDate,
              }),
              level: "campaign",
            },
          });

          // Sum up metrics across date range for this campaign
          const campaignData = response.data.data || [];
          const summed = sumInsightsMetrics(campaignData);

          return {
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            campaign_status: campaign.status,
            campaign_objective: campaign.objective,
            ...summed,
          };
        } catch (err) {
          console.error(`Error fetching insights for campaign ${campaign.id}:`, err);
          return {
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            campaign_status: campaign.status,
            error: "Failed to fetch insights",
          };
        }
      })
    );

    return {
      campaigns: campaignInsights,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    throw error;
  }
}

export async function getAdSetInsights(
  campaignId: string,
  accessToken: string,
  dateStart?: string | null,
  dateEnd?: string | null
) {
  try {
    // Default to last 30 days if no dates provided
    let startDate = dateStart;
    let endDate = dateEnd;

    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      endDate = endDate || today.toISOString().split("T")[0];
      startDate = startDate || thirtyDaysAgo.toISOString().split("T")[0];
    }

    console.log("📊 Fetching ad set insights for date range:", { startDate, endDate });

    const response = await metaApi.get(`/${campaignId}/insights`, {
      params: {
        access_token: accessToken,
        fields:
          "adset_id,adset_name,spend,impressions,clicks,reach,frequency,ctr,cpc,cpp,cpm,actions,action_values,date_start,date_stop",
        time_range: JSON.stringify({
          since: startDate,
          until: endDate,
        }),
        level: "adset",
      },
    });

    console.log("📊 Ad set insights response:", response.data.data?.length, "records");

    return {
      adsets: response.data.data || [],
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Error fetching ad set insights:", error);
    throw error;
  }
}

// Helper function to aggregate insights data
function aggregateInsightsData(data: any[]) {
  const aggregated = {
    spend: 0,
    impressions: 0,
    clicks: 0,
    reach: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0,
    actions: 0,
    action_value: 0,
    records: data.length,
  };

  if (data.length === 0) return aggregated;

  // Sum metrics
  data.forEach((record) => {
    aggregated.spend += parseFloat(record.spend || 0);
    aggregated.impressions += parseInt(record.impressions || 0);
    aggregated.clicks += parseInt(record.clicks || 0);
    aggregated.reach += parseInt(record.reach || 0);
    if (record.actions) {
      const actions = Array.isArray(record.actions) ? record.actions : [record.actions];
      aggregated.actions += actions.reduce((sum: number, a: any) => sum + (a.value || 0), 0);
    }
    if (record.action_values) {
      const values = Array.isArray(record.action_values) ? record.action_values : [record.action_values];
      aggregated.action_value += values.reduce((sum: number, v: any) => sum + (v.value || 0), 0);
    }
  });

  // Calculate averages for rates
  if (aggregated.impressions > 0) {
    aggregated.ctr = (aggregated.clicks / aggregated.impressions) * 100;
  }
  if (aggregated.clicks > 0) {
    aggregated.cpc = aggregated.spend / aggregated.clicks;
  }
  if (aggregated.impressions > 0) {
    aggregated.cpm = (aggregated.spend / aggregated.impressions) * 1000;
  }

  return aggregated;
}

// Helper function to sum insights metrics for a single campaign
function sumInsightsMetrics(data: any[]) {
  const summed = {
    spend: 0,
    impressions: 0,
    clicks: 0,
    reach: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0,
    actions: 0,
    action_value: 0,
  };

  if (data.length === 0) return summed;

  data.forEach((record) => {
    summed.spend += parseFloat(record.spend || 0);
    summed.impressions += parseInt(record.impressions || 0);
    summed.clicks += parseInt(record.clicks || 0);
    summed.reach += parseInt(record.reach || 0);
    if (record.actions) {
      const actions = Array.isArray(record.actions) ? record.actions : [record.actions];
      summed.actions += actions.reduce((sum: number, a: any) => sum + (a.value || 0), 0);
    }
    if (record.action_values) {
      const values = Array.isArray(record.action_values) ? record.action_values : [record.action_values];
      summed.action_value += values.reduce((sum: number, v: any) => sum + (v.value || 0), 0);
    }
  });

  // Calculate rates
  if (summed.impressions > 0) {
    summed.ctr = (summed.clicks / summed.impressions) * 100;
  }
  if (summed.clicks > 0) {
    summed.cpc = summed.spend / summed.clicks;
  }
  if (summed.impressions > 0) {
    summed.cpm = (summed.spend / summed.impressions) * 1000;
  }

  return summed;
}
