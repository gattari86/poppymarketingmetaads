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
  const campaignId = url.searchParams.get("campaignId");

  if (!campaignId) {
    return Response.json(
      { error: "Missing required parameter: campaignId" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (!body.name) {
      return Response.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const result = await createAdSet(campaignId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating ad set:", error);

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
      { error: "Failed to create ad set - Unknown error" },
      { status: 500 }
    );
  }
}
