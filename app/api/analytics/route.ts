import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCampaignInsights, getAccountInsights, getAdSetInsights, getAdInsights } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const adAccountId = url.searchParams.get("adAccountId");
  const dateStart = url.searchParams.get("dateStart");
  const dateEnd = url.searchParams.get("dateEnd");
  const scope = url.searchParams.get("scope") || "account"; // "account", "campaign", "adset", or "ad"
  const campaignId = url.searchParams.get("campaignId");
  const adsetId = url.searchParams.get("adsetId");

  if (!adAccountId) {
    return Response.json(
      { error: "Missing required parameter: adAccountId" },
      { status: 400 }
    );
  }

  try {
    let analyticsData;

    if (scope === "adset") {
      // Fetch ad set-level insights
      if (!campaignId) {
        return Response.json(
          { error: "Missing required parameter for adset scope: campaignId" },
          { status: 400 }
        );
      }
      analyticsData = await getAdSetInsights(
        campaignId,
        session.accessToken,
        dateStart,
        dateEnd
      );
    } else if (scope === "ad") {
      // Fetch ad-level insights
      if (!adsetId) {
        return Response.json(
          { error: "Missing required parameter for ad scope: adsetId" },
          { status: 400 }
        );
      }
      analyticsData = await getAdInsights(
        adsetId,
        session.accessToken,
        dateStart,
        dateEnd
      );
    } else if (scope === "campaign") {
      // Fetch campaign-level insights
      analyticsData = await getCampaignInsights(
        adAccountId,
        session.accessToken,
        dateStart,
        dateEnd
      );
    } else {
      // Fetch account-level insights (default)
      analyticsData = await getAccountInsights(
        adAccountId,
        session.accessToken,
        dateStart,
        dateEnd
      );
    }

    return Response.json({
      success: true,
      scope,
      data: analyticsData,
      dateRange: {
        start: dateStart || "Last 30 days",
        end: dateEnd || "Today",
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);

    // Extract detailed error message from axios error
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Check if it's an axios error with response data
      if ("response" in error && typeof error.response === "object" && error.response !== null) {
        const axiosError = error as any;
        const metaErrorData = axiosError.response?.data;
        if (metaErrorData?.error) {
          return Response.json(
            {
              error: metaErrorData.error.message || metaErrorData.error.type || "Meta API Error",
              code: metaErrorData.error.code,
              details: metaErrorData.error,
            },
            { status: axiosError.response?.status || 500 }
          );
        }
      }

      return Response.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Failed to fetch analytics - Unknown error" },
      { status: 500 }
    );
  }
}
