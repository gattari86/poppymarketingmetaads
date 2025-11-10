import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAutomatedRule } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

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
    const result = await createAutomatedRule(adAccountId, body, session.accessToken);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating automated rule:", error);
    return new Response("Error creating automated rule", { status: 500 });
  }
}
