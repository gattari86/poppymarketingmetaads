import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAutomatedRule, getAutomatedRules, deleteAutomatedRule } from "@/lib/meta-api";
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
    const rules = await getAutomatedRules(adAccountId, session.accessToken);
    return Response.json(rules);
  } catch (error) {
    console.error("Error fetching automated rules:", error);

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
      { error: "Failed to fetch automated rules - Unknown error" },
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

    if (!body.name) {
      return Response.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const result = await createAutomatedRule(adAccountId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating automated rule:", error);

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
      { error: "Failed to create automated rule - Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const adAccountId = url.searchParams.get("adAccountId");
  const ruleId = url.searchParams.get("ruleId");

  if (!adAccountId || !ruleId) {
    return Response.json(
      { error: "Missing required parameters: adAccountId and ruleId" },
      { status: 400 }
    );
  }

  try {
    const result = await deleteAutomatedRule(ruleId, session.accessToken);
    return Response.json(result);
  } catch (error) {
    console.error("Error deleting automated rule:", error);

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
      { error: "Failed to delete automated rule - Unknown error" },
      { status: 500 }
    );
  }
}
