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
  try {
    // Meta API v24 CORRECT endpoint: POST /act_{ad_account_id}/adsets
    // NOT /{campaignId}/adsets - that doesn't exist!
    // campaign_id is sent in the request body, not in URL
    const formattedAccountId = formatAdAccountId(adAccountId);

    const adSetData: Record<string, any> = {
      name: data.name,
      campaign_id: campaignId, // REQUIRED: send campaign_id in body
      status: data.status,
      daily_budget: data.daily_budget || 1000, // Default $10/day in cents
      targeting: data.targeting || {
        geo_locations: [{ country: "US" }],
      },
      // REQUIRED: optimization_goal - what to optimize for
      optimization_goal: data.optimization_goal || "REACH",
      // REQUIRED: billing_event - when to charge (IMPRESSIONS, LINK_CLICKS, etc)
      billing_event: data.billing_event || "IMPRESSIONS",
      // RECOMMENDED: bid_amount - how much to bid per event
      bid_amount: data.bid_amount || 500, // Default 5 cents
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

    // Correct endpoint: POST /act_{ad_account_id}/adsets with campaign_id in body
    const response = await metaApi.post(`/${formattedAccountId}/adsets`, adSetData, {
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
  },
  accessToken: string
) {
  try {
    // Meta API v24 requires specific parameters for ad creation
    const adData: Record<string, any> = {
      name: data.name,
      adset_id: adSetId,
      creative: data.creative,
      // REQUIRED in v24: status - should be PAUSED for new ads
      status: data.status || "PAUSED",
    };

    console.log("Creating ad with v24 parameters:", {
      adSetId,
      name: adData.name,
      status: adData.status,
      hasCreative: !!adData.creative,
      creativeType: adData.creative.creative_id ? "existing" : "new",
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
