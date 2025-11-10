export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production, you would send this to your email service or database
    // For now, we just log it
    console.log("Support request received:", body);

    return Response.json(
      { success: true, message: "Support request received" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing support request:", error);
    return new Response("Error processing support request", { status: 500 });
  }
}
