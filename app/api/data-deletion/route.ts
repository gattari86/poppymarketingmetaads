export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production, you would log this for compliance and follow up with the user
    console.log("Data deletion request received:", body);

    return Response.json(
      {
        success: true,
        message: "Data deletion request received. We will process this within 30 days and contact you via email."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing data deletion request:", error);
    return new Response("Error processing data deletion request", { status: 500 });
  }
}
