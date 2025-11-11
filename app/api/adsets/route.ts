import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdSets, createAdSet } from "@/lib/meta-api";
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
  const campaignId = url.searchParams.get("campaignId");

  if (!campaignId) {
    return Response.json(
      { error: "Missing required parameter: campaignId" },
      { status: 400 }
    );
  }

  try {
    const adSets = await getAdSets(campaignId, session.accessToken);
    return Response.json(adSets);
  } catch (error) {
    console.error("Error fetching ad sets:", error);

    if (error instanceof Error) {
      const errorMessage = error.message;

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
      { error: "Failed to fetch ad sets - Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const adAccountId = url.searchParams.get("adAccountId");
  const campaignId = url.searchParams.get("campaignId");

  if (!adAccountId) {
    return Response.json(
      { error: "Missing required parameter: adAccountId" },
      { status: 400 }
    );
  }

  if (!campaignId) {
    return Response.json(
      { error: "Missing required parameter: campaignId" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    console.log("📝 Ad set request body:", JSON.stringify(body, null, 2));
    console.log("📍 Query parameters received:", {
      adAccountId,
      campaignId,
      adAccountIdType: typeof adAccountId,
      adAccountIdLength: adAccountId?.length,
    });

    if (!body.name) {
      return Response.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const result = await createAdSet(adAccountId, campaignId, body, session.accessToken);

    console.log("✅ Ad set creation successful from Meta API:", result);

    // Meta API returns minimal response: { id, ... }
    // Enrich it with required fields so it matches AdSet type
    const enrichedAdSet = {
      id: result.id,
      name: body.name,
      campaign_id: campaignId,
      status: body.status || "PAUSED",
      // Note: daily_budget is NOT set at ad set level when campaign has a budget
      // Ad sets inherit the campaign's budget
      targeting: body.targeting,
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString(),
    };

    console.log("📤 Returning enriched ad set to client:", enrichedAdSet);
    return Response.json(enrichedAdSet, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating ad set:", error);

    if (error instanceof Error) {
      const errorMessage = error.message;

      if ("response" in error && typeof error.response === "object" && error.response !== null) {
        const axiosError = error as any;
        const metaErrorData = axiosError.response?.data;

        console.error("📊 Full Meta API Response:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: metaErrorData,
          config: axiosError.config,
        });

        if (metaErrorData?.error) {
          const fullErrorDetails = {
            error: metaErrorData.error.message || metaErrorData.error.type || "Meta API Error",
            code: metaErrorData.error.code,
            subcode: metaErrorData.error?.error_subcode,
            type: metaErrorData.error?.type,
            details: metaErrorData.error,
            fullResponse: metaErrorData,
          };

          console.error("🔴 Detailed error:", fullErrorDetails);

          return Response.json(fullErrorDetails, { status: axiosError.response?.status || 500 });
        }
      }

      return Response.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Failed to create ad set - Unknown error" },
      { status: 500 }
    );
  }
}
