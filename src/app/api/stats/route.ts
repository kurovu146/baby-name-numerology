import { NextResponse } from "next/server";

const REPO = "kurovu146/baby-name-numerology";
const FILE_PATH = "public/data/stats.json";
const BRANCH = "main";

interface Stats {
  totalSearches: number;
}

function getGitHubToken(): string | null {
  return process.env.GITHUB_TOKEN || null;
}

function getGitHubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

async function fetchStats(token: string): Promise<{ stats: Stats; sha: string | undefined }> {
  const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const res = await fetch(fileUrl, {
    headers: getGitHubHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    return { stats: { totalSearches: 0 }, sha: undefined };
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { stats: JSON.parse(content), sha: data.sha };
}

// GET: fetch current stats
export async function GET() {
  try {
    const token = getGitHubToken();
    if (!token) {
      return NextResponse.json({ totalSearches: 0 });
    }

    const { stats } = await fetchStats(token);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ totalSearches: 0 });
  }
}

// POST: increment search counter (with retry on SHA conflict)
export async function POST() {
  const token = getGitHubToken();
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN not set", hasToken: false }, { status: 500 });
  }

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { stats, sha } = await fetchStats(token);
      stats.totalSearches += 1;

      const newContent = Buffer.from(
        JSON.stringify(stats, null, 2) + "\n"
      ).toString("base64");

      const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
      const updateRes = await fetch(fileUrl, {
        method: "PUT",
        headers: getGitHubHeaders(token),
        body: JSON.stringify({
          message: `chore: update stats (${stats.totalSearches} searches)`,
          content: newContent,
          sha,
          branch: BRANCH,
        }),
      });

      if (updateRes.ok) {
        return NextResponse.json(stats);
      }

      const errText = await updateRes.text();
      // 409 = SHA conflict, retry
      if (updateRes.status === 409 && attempt < maxRetries - 1) {
        continue;
      }

      return NextResponse.json(
        { error: "GitHub API error", status: updateRes.status, detail: errText },
        { status: 500 }
      );
    } catch (err) {
      if (attempt < maxRetries - 1) continue;
      return NextResponse.json(
        { error: "Internal error", detail: String(err) },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Max retries exceeded" }, { status: 500 });
}
