import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAds, createAd } from "@/lib/meta-api";
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
  const adSetId = url.searchParams.get("adSetId");

  if (!adSetId) {
    return Response.json(
      { error: "Missing required parameter: adSetId" },
      { status: 400 }
    );
  }

  try {
    const ads = await getAds(adSetId, session.accessToken);
    return Response.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);

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
      { error: "Failed to fetch ads - Unknown error" },
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
  const adSetId = url.searchParams.get("adSetId");

  if (!adSetId) {
    return Response.json(
      { error: "Missing required parameter: adSetId" },
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

    if (!body.creative) {
      return Response.json(
        { error: "Missing required field: creative" },
        { status: 400 }
      );
    }

    const result = await createAd(adSetId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);

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
      { error: "Failed to create ad - Unknown error" },
      { status: 500 }
    );
  }
}
