export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  content: string;
  sha?: string;
}

function createRequest(config: GitHubConfig) {
  const baseUrl = "https://api.github.com";

  return async (endpoint: string, options: RequestInit = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  };
}

export async function getFile(
  config: GitHubConfig,
  path: string
): Promise<GitHubFile> {
  const request = createRequest(config);

  try {
    const data = await request(
      `/repos/${config.owner}/${config.repo}/contents/${path}`
    );

    if (Array.isArray(data)) {
      throw new Error(`Path ${path} is a directory, not a file`);
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      name: data.name,
      path: data.path,
      content,
      sha: data.sha,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch file ${path}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createOrUpdateFile(
  config: GitHubConfig,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const request = createRequest(config);

  const body: any = {
    message,
    content: Buffer.from(content).toString("base64"),
  };

  if (sha) {
    body.sha = sha;
  }

  await request(`/repos/${config.owner}/${config.repo}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function createMultipleFiles(
  config: GitHubConfig,
  files: Array<{ path: string; content: string }>,
  message: string
): Promise<void> {
  const request = createRequest(config);

  // Get the latest commit SHA
  const ref = await request(
    `/repos/${config.owner}/${config.repo}/git/ref/heads/main`
  );

  const latestCommitSha = ref.object.sha;

  // Get the tree SHA from the latest commit
  const commitData = await request(
    `/repos/${config.owner}/${config.repo}/git/commits/${latestCommitSha}`
  );
  const baseTree = commitData.tree;

  // Create blobs for each file
  const tree = await Promise.all(
    files.map(async (file) => {
      const blob = await request(
        `/repos/${config.owner}/${config.repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({
            content: Buffer.from(file.content).toString("base64"),
            encoding: "base64",
          }),
        }
      );

      return {
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      };
    })
  );

  // Create a new tree
  const newTree = await request(
    `/repos/${config.owner}/${config.repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTree.sha,
        tree,
      }),
    }
  );

  // Create a new commit
  const newCommit = await request(
    `/repos/${config.owner}/${config.repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
      }),
    }
  );

  // Update the reference
  await request(`/repos/${config.owner}/${config.repo}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({
      sha: newCommit.sha,
    }),
  });
}

export function getGitHubConfig(config?: GitHubConfig): GitHubConfig {
  const owner = config?.owner ?? process.env.GITHUB_OWNER;
  const repo = config?.repo ?? process.env.GITHUB_REPO;
  const token = config?.token ?? process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    const missing = [];
    if (!owner) missing.push("GITHUB_OWNER");
    if (!repo) missing.push("GITHUB_REPO");
    if (!token) missing.push("GITHUB_TOKEN");
    throw new Error(
      `GitHub configuration incomplete. Missing environment variables: ${missing.join(
        ", "
      )}. Please add these in your Vercel project settings.`
    );
  }

  return { owner, repo, token };
}

export function isGitHubConfigured(): boolean {
  return !!(
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_TOKEN
  );
}
