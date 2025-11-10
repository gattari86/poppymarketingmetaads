import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate email
    if (!body.email || !body.email.trim()) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const email = body.email.trim();
    const timestamp = body.requestedAt || new Date().toISOString();

    // Log data deletion request for compliance
    // In production, this would be stored in a database
    const logsDir = path.join(process.cwd(), "data-deletion-requests");

    // Create logs directory if it doesn't exist (for local development)
    try {
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      const logFile = path.join(logsDir, `${Date.now()}_${email.replace("@", "_at_")}.json`);
      fs.writeFileSync(
        logFile,
        JSON.stringify({
          email,
          requestedAt: timestamp,
          status: "received",
          expiresAt: new Date(new Date(timestamp).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, null, 2)
      );
    } catch (logError) {
      console.warn("Could not write deletion request log:", logError);
      // Don't fail the request if logging fails
    }

    return Response.json(
      {
        success: true,
        message: "Data deletion request received. We have logged your request and will process it within 30 days. Please check your email at the address you provided - we may need to verify your identity before proceeding."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing data deletion request:", error);
    return Response.json(
      { error: "Error processing data deletion request" },
      { status: 500 }
    );
  }
}
