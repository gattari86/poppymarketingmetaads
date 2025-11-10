import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCampaigns, createCampaign } from "@/lib/meta-api";
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

  if (!adAccountId) {
    return Response.json(
      { error: "Missing required parameter: adAccountId" },
      { status: 400 }
    );
  }

  try {
    const campaigns = await getCampaigns(adAccountId, session.accessToken);
    return Response.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);

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
      { error: "Failed to fetch campaigns - Unknown error" },
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

  if (!adAccountId) {
    return Response.json(
      { error: "Missing required parameter: adAccountId" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return Response.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    if (!body.objective) {
      return Response.json(
        { error: "Missing required field: objective" },
        { status: 400 }
      );
    }

    const result = await createCampaign(adAccountId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);

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
      { error: "Failed to create campaign - Unknown error" },
      { status: 500 }
    );
  }
}
