import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const authenticated = isAdmin(request);

    return NextResponse.json(
      {
        authenticated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin session check error:", error);

    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 500 }
    );
  }
}