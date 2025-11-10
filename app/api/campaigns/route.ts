import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCampaigns, createCampaign } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const adAccountId = url.searchParams.get("adAccountId");

  if (!adAccountId) {
    return new Response("Missing adAccountId", { status: 400 });
  }

  try {
    const campaigns = await getCampaigns(adAccountId, session.accessToken);
    return Response.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return new Response("Error fetching campaigns", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const adAccountId = url.searchParams.get("adAccountId");

  if (!adAccountId) {
    return new Response("Missing adAccountId", { status: 400 });
  }

  try {
    const body = await request.json();
    const result = await createCampaign(adAccountId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return new Response("Error creating campaign", { status: 500 });
  }
}
