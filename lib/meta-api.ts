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
  campaignId: string,
  data: {
    name: string;
    status: string;
    daily_budget?: number;
    targeting?: Record<string, unknown>;
  },
  accessToken: string
) {
  try {
    const response = await metaApi.post(`/${campaignId}/adsets`, data, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ad set:", error);
    throw error;
  }
}

export async function createAd(
  adSetId: string,
  data: {
    name: string;
    adset_id: string;
    creative: {
      creative_id?: string;
      title?: string;
      body?: string;
      image_url?: string;
    };
  },
  accessToken: string
) {
  try {
    const response = await metaApi.post(`/${adSetId}/ads`, data, {
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
