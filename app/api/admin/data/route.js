import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_API_BASE =
  "https://api.github.com";

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const filePath = process.env.GITHUB_DATA_FILE;

  if (!token || !owner || !repo || !filePath) {
    throw new Error(
      "GitHub configuration is missing."
    );
  }

  return {
    token,
    owner,
    repo,
    filePath,
  };
}

function getGitHubFileUrl({
  owner,
  repo,
  filePath,
}) {
  return `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;
}


/*
  GET
  Returns the current data.json from GitHub.

  Only authenticated managers can use this route.
*/
export async function GET(request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const config = getGitHubConfig();

    const response = await fetch(
      getGitHubFileUrl(config),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "GitHub GET data error:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to retrieve airline data from GitHub.",
        },
        { status: 500 }
      );
    }

    const githubFile = await response.json();

    if (!githubFile.content) {
      throw new Error(
        "GitHub file content was not returned."
      );
    }

    const decodedContent = Buffer.from(
      githubFile.content.replace(/\n/g, ""),
      "base64"
    ).toString("utf8");

    const data = JSON.parse(decodedContent);

    if (!Array.isArray(data)) {
      throw new Error(
        "GitHub data.json does not contain an array."
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        sha: githubFile.sha,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Admin GET data error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to retrieve manager airline data.",
      },
      { status: 500 }
    );
  }
}


/*
  PUT
  Saves the complete airline data array to GitHub.

  Only authenticated managers can use this route.
*/
export async function PUT(request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const config = getGitHubConfig();

    const body = await request.json();

    const data = body?.data;

    if (!Array.isArray(data)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid airline data.",
        },
        { status: 400 }
      );
    }

    /*
      First retrieve the current GitHub file.
      We need its SHA before updating it.
    */
    const currentFileResponse = await fetch(
      getGitHubFileUrl(config),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!currentFileResponse.ok) {
      const errorText =
        await currentFileResponse.text();

      console.error(
        "GitHub current file error:",
        currentFileResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to retrieve current GitHub data.",
        },
        { status: 500 }
      );
    }

    const currentFile =
      await currentFileResponse.json();

    if (!currentFile.sha) {
      throw new Error(
        "GitHub file SHA was not returned."
      );
    }

    /*
      Convert the new JSON into a formatted string.
    */
    const jsonContent = JSON.stringify(
      data,
      null,
      2
    );

    /*
      GitHub Contents API requires Base64 content.
    */
    const encodedContent =
      Buffer.from(jsonContent, "utf8").toString(
        "base64"
      );

    /*
      Update data.json on GitHub.
    */
    const updateResponse = await fetch(
      getGitHubFileUrl(config),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            "Update airline discount data from QFC Manager",
          content: encodedContent,
          sha: currentFile.sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorText =
        await updateResponse.text();

      console.error(
        "GitHub update error:",
        updateResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to save airline data to GitHub.",
        },
        { status: 500 }
      );
    }

    const updatedFile =
      await updateResponse.json();

    return NextResponse.json(
      {
        success: true,
        message:
          "Airline discount data saved successfully.",
        sha: updatedFile.content?.sha || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Admin PUT data error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to save manager airline data.",
      },
      { status: 500 }
    );
  }
}