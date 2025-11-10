import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAds, createAd } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const adSetId = url.searchParams.get("adSetId");

  if (!adSetId) {
    return new Response("Missing adSetId", { status: 400 });
  }

  try {
    const ads = await getAds(adSetId, session.accessToken);
    return Response.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return new Response("Error fetching ads", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const adSetId = url.searchParams.get("adSetId");

  if (!adSetId) {
    return new Response("Missing adSetId", { status: 400 });
  }

  try {
    const body = await request.json();
    const result = await createAd(adSetId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return new Response("Error creating ad", { status: 500 });
  }
}
