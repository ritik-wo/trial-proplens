import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const speechKey = (process.env.AZURE_SPEECH_KEY || "").trim();
  const speechRegion = (process.env.AZURE_SPEECH_REGION || "").trim();

  if (!speechKey || !speechRegion) {
    return NextResponse.json(
      { error: "Azure Speech credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": speechKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure Speech Token Error:", response.status, errorText);
      return NextResponse.json(
        { error: `Azure Error: ${response.status} ${errorText}` },
        { status: 500 }
      );
    }

    const token = await response.text();
    const jsonResponse = NextResponse.json({ token, region: speechRegion });

    jsonResponse.headers.set("Access-Control-Allow-Origin", "*");
    jsonResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    jsonResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return jsonResponse;
  } catch (error: any) {
    console.error("Speech Token Fetch Error:", error);
    return NextResponse.json(
      { error: `Failed to authorize speech key: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
