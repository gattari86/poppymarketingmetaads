import axios from "axios";

const API_VERSION = process.env.META_GRAPH_VERSION || "v20.0";
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
  },
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);
    const response = await metaApi.post(`/${formattedId}/campaigns`, data, {
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
