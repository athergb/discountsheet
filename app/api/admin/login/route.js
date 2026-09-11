import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSessionToken() {
  const payload = JSON.stringify({
    authenticated: true,
    createdAt: Date.now(),
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");

  const signature = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
      console.error("Admin authentication environment variables are missing.");

      return NextResponse.json(
        { success: false, error: "Server authentication is not configured." },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Incorrect password." },
        { status: 401 }
      );
    }

    const sessionToken = createSessionToken();

    const response = NextResponse.json(
      {
        success: true,
        message: "Manager login successful.",
      },
      { status: 200 }
    );

    response.cookies.set("qfc_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process login.",
      },
      { status: 500 }
    );
  }
}