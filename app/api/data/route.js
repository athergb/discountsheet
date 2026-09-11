import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const filePath = process.env.GITHUB_DATA_FILE;

    if (!owner || !repo || !filePath) {
      return NextResponse.json(
        { error: "GitHub configuration is missing" },
        { status: 500 }
      );
    }

    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `GitHub returned status ${response.status}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API /data error:", error);

    return NextResponse.json(
      {
        error: "Failed to load airline data",
      },
      { status: 500 }
    );
  }
}