import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadAdImage, createAdCreative } from "@/lib/meta-api";
import type { ExtendedSession } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession;

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - no access token" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const adAccountId = formData.get("adAccountId") as string;
    const pageId = formData.get("pageId") as string;
    const creativeName = formData.get("creativeName") as string;
    const message = formData.get("message") as string;
    const link = formData.get("link") as string;
    const headline = formData.get("headline") as string;
    const ctaType = formData.get("ctaType") as string;

    // Validation
    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!adAccountId || !pageId || !creativeName || !message || !link) {
      return NextResponse.json(
        { error: "Missing required fields: adAccountId, pageId, creativeName, message, link" },
        { status: 400 }
      );
    }

    // Validate image size (Max 30MB for Meta)
    if (image.size > 30 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 30MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Step 1: Upload image and get hash
    console.log("Uploading image:", image.name);
    const imageHash = await uploadAdImage(
      adAccountId,
      imageBuffer,
      image.name,
      session.accessToken
    );

    // Step 2: Create ad creative using the image hash
    console.log("Creating ad creative with image hash:", imageHash);
    const creative = await createAdCreative(
      adAccountId,
      {
        name: creativeName,
        page_id: pageId,
        image_hash: imageHash,
        link,
        message,
        headline: headline || undefined,
        call_to_action_type: ctaType || undefined,
      },
      session.accessToken
    );

    return NextResponse.json({
      success: true,
      creative: {
        id: creative.id,
        name: creative.name,
        imageHash,
      },
    });
  } catch (error) {
    console.error("Error in creatives route:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("401") ? 401 : 400;

    return NextResponse.json(
      {
        error: "Failed to create creative",
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}
