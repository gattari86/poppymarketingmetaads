import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdSets, createAdSet } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const campaignId = url.searchParams.get("campaignId");

  if (!campaignId) {
    return new Response("Missing campaignId", { status: 400 });
  }

  try {
    const adSets = await getAdSets(campaignId, session.accessToken);
    return Response.json(adSets);
  } catch (error) {
    console.error("Error fetching ad sets:", error);
    return new Response("Error fetching ad sets", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const campaignId = url.searchParams.get("campaignId");

  if (!campaignId) {
    return new Response("Missing campaignId", { status: 400 });
  }

  try {
    const body = await request.json();
    const result = await createAdSet(campaignId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating ad set:", error);
    return new Response("Error creating ad set", { status: 500 });
  }
}
