// app/api/generate-video-token/route.ts

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Your token security key from Bunny.net dashboard (stored server-side)
    const TOKEN_SECURITY_KEY = process.env.BUNNY_SECURITY_KEY;

    // Your Bunny.net library ID
    const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || "759";

    // Set expiration to 2 hours from now (in seconds)
    const expires = Math.floor(Date.now() / 1000) + 7200;

    // Generate the token using the algorithm: SHA256_HEX(token_security_key + video_id + expiration)
    const token = crypto
      .createHash("sha256")
      .update(`${TOKEN_SECURITY_KEY}${videoId}${expires}`)
      .digest("hex");

    // Return the secure URL
    const secureUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}`;

    return NextResponse.json({ url: secureUrl });
  } catch (error) {
    console.error("Error generating secure video URL:", error);
    return NextResponse.json(
      { error: "Failed to generate secure video URL" },
      { status: 500 }
    );
  }
}
