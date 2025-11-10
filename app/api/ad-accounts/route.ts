import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdAccounts } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function GET() {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const accounts = await getAdAccounts(session.accessToken);
    return Response.json(accounts);
  } catch (error) {
    console.error("Error fetching ad accounts:", error);
    return new Response("Error fetching ad accounts", { status: 500 });
  }
}
