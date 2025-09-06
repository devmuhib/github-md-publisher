import { getFile, getGitHubConfig } from "@/lib/github";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 }
      );
    }

    // config from env
    const config = getGitHubConfig();

    // get a file
    const file = await getFile(config, path);

    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch file",
      },
      { status: 500 }
    );
  }
}
