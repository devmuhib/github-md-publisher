export interface MarkdownPost {
  title: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createMarkdownFile(title: string, body: string): string {
  const frontmatter = `---
${title}
---

`;

  return frontmatter + `\n` + body;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
