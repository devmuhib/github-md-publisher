import { type NextRequest, NextResponse } from "next/server";

import { createMarkdownFile, generateSlug } from "@/lib/markdown";
import { createMultipleFiles, getGitHubConfig } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const { drafts } = await request.json();

    if (!Array.isArray(drafts) || drafts.length === 0) {
      return NextResponse.json(
        { error: "No drafts provided" },
        { status: 400 }
      );
    }

    // config from env
    const config = getGitHubConfig();

    // Convert drafts to markdown files
    const files = drafts.map((draft) => {
      const slug = generateSlug(draft.title);
      const content = createMarkdownFile(draft.title, draft.body);
      return {
        path: `content/${slug}.md`,
        content,
      };
    });

    // Publish all files in a single commit
    const message = `Publish ${files.length} post${
      files.length > 1 ? "s" : ""
    }: ${drafts.map((d) => d.title).join(", ")}`;

    await createMultipleFiles(config, files, message);

    return NextResponse.json({
      success: true,
      message: `Successfully published ${files.length} post${
        files.length > 1 ? "s" : ""
      }`,
      files: files.map((f) => f.path),
    });
  } catch (error) {
    console.error("GitHub publish error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to publish drafts",
      },
      { status: 500 }
    );
  }
}
