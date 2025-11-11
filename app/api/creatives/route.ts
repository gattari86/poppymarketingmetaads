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

    // Debug logging
    console.log("📝 Creative creation request received:", {
      imagePresent: !!image,
      imageName: image?.name,
      imageSize: image?.size,
      adAccountId: `${adAccountId} (type: ${typeof adAccountId})`,
      pageId: `${pageId} (type: ${typeof pageId})`,
      creativeName,
      message: message?.substring(0, 50),
      link,
      headline,
      ctaType,
    });

    // Validation
    if (!image) {
      console.error("❌ Image file is required");
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedPageId = pageId?.trim() || "";
    const trimmedCreativeName = creativeName?.trim() || "";
    const trimmedMessage = message?.trim() || "";
    const trimmedLink = link?.trim() || "";

    if (!adAccountId || !trimmedPageId || !trimmedCreativeName || !trimmedMessage || !trimmedLink) {
      const missing = [];
      if (!adAccountId) missing.push("adAccountId");
      if (!trimmedPageId) missing.push("pageId");
      if (!trimmedCreativeName) missing.push("creativeName");
      if (!trimmedMessage) missing.push("message");
      if (!trimmedLink) missing.push("link");

      console.error("❌ Missing required fields:", missing);
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
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
    console.log("📤 Step 1: Uploading image:", image.name);
    let imageHash: string;
    try {
      imageHash = await uploadAdImage(
        adAccountId,
        imageBuffer,
        image.name,
        session.accessToken
      );
      console.log("✅ Image uploaded successfully. Hash:", imageHash);
    } catch (uploadError) {
      console.error("❌ Image upload failed:", uploadError);
      throw new Error(
        `Image upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`
      );
    }

    // Step 2: Create ad creative using the image hash
    console.log("🎨 Step 2: Creating ad creative with image hash:", imageHash);
    let creative;
    try {
      creative = await createAdCreative(
        adAccountId,
        {
          name: trimmedCreativeName,
          page_id: trimmedPageId,
          image_hash: imageHash,
          link: trimmedLink,
          message: trimmedMessage,
          headline: headline?.trim() || undefined,
          call_to_action_type: ctaType || undefined,
        },
        session.accessToken
      );
      console.log("✅ Creative created successfully. ID:", creative.id);
    } catch (creativeError) {
      console.error("❌ Creative creation failed:", creativeError);
      throw new Error(
        `Creative creation failed: ${creativeError instanceof Error ? creativeError.message : "Unknown error"}`
      );
    }

    return NextResponse.json({
      success: true,
      creative: {
        id: creative.id,
        name: creative.name,
        imageHash,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Fatal error in creatives route:", errorMessage);

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
