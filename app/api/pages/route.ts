import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import type { ExtendedSession } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - no access token" },
        { status: 401 }
      );
    }

    console.log("📄 Fetching Facebook Pages for authenticated user");
    console.log("📄 Access token available:", !!session.accessToken);

    // Fetch user's owned pages from Meta API
    // Using /me/accounts endpoint which returns all pages owned by the user
    // This endpoint returns Facebook pages, Instagram business accounts, etc.
    const response = await axios.get(
      `https://graph.facebook.com/v24.0/me/accounts`,
      {
        params: {
          fields: "id,name,category,picture,access_token",
          access_token: session.accessToken,
        },
      }
    );

    console.log("📄 Meta API response:", response.status, response.data);

    const pages = response.data.data || [];
    console.log(`✅ Found ${pages.length} Facebook Pages`);

    if (pages.length === 0) {
      console.warn("⚠️ No Facebook Pages found for this account");
      return NextResponse.json({
        pages: [],
        message: "No Facebook Pages found. Please create a Facebook Page first.",
      });
    }

    // Return pages with id and name
    const formattedPages = pages.map((page: any) => ({
      id: page.id,
      name: page.name,
      category: page.category,
      picture: page.picture?.data?.url,
    }));

    console.log("📄 Returning pages:", formattedPages);

    return NextResponse.json({
      pages: formattedPages,
      success: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error fetching pages:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to fetch Facebook Pages",
        details: errorMessage,
        pages: [],
      },
      { status: 400 }
    );
  }
}
