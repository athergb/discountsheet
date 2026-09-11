import { NextResponse } from "next/server";
import { getSessionCookieName } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Manager logged out successfully.",
      },
      { status: 200 }
    );

    response.cookies.set(getSessionCookieName(), "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to logout.",
      },
      { status: 500 }
    );
  }
}