import { NextResponse } from "next/server";

const REPO = "kurovu146/baby-name-numerology";
const FILE_PATH = "public/data/stats.json";
const BRANCH = "main";

interface Stats {
  totalSearches: number;
}

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

// GET: fetch current stats
export async function GET() {
  try {
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${FILE_PATH}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json({ totalSearches: 0 });
    }

    const stats: Stats = await res.json();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ totalSearches: 0 });
  }
}

// POST: increment search counter
export async function POST() {
  try {
    const headers = getGitHubHeaders();
    const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

    // Get current file
    const fileRes = await fetch(fileUrl, { headers });
    let stats: Stats = { totalSearches: 0 };
    let sha: string | undefined;

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      stats = JSON.parse(content);
    }

    // Increment
    stats.totalSearches += 1;

    // Update file
    const newContent = Buffer.from(
      JSON.stringify(stats, null, 2) + "\n"
    ).toString("base64");

    const updateRes = await fetch(fileUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `chore: update stats (${stats.totalSearches} searches)`,
        content: newContent,
        sha,
        branch: BRANCH,
      }),
    });

    if (!updateRes.ok) {
      console.error("GitHub API error:", await updateRes.text());
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error("POST /api/stats error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
