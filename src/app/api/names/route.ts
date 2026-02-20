import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REPO = "kurovu146/baby-name-numerology";
const FILE_PATH = "public/data/custom-names.json";
const BRANCH = "main";

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

// GET: fetch custom names via GitHub API (no cache)
export async function GET() {
  try {
    const token = getGitHubToken();
    if (!token) {
      return NextResponse.json([]);
    }

    const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const res = await fetch(fileUrl, {
      headers: getGitHubHeaders(token),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const names: string[] = JSON.parse(content);
    return NextResponse.json(names);
  } catch {
    return NextResponse.json([]);
  }
}

// POST: add a name via GitHub Contents API
export async function POST(request: Request) {
  try {
    const token = getGitHubToken();
    if (!token) {
      return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 });
    }

    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const trimmed = name.trim();
    const headers = getGitHubHeaders(token);
    const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

    // 1. Get current file content + SHA
    const fileRes = await fetch(fileUrl, { headers, cache: "no-store" });

    let currentNames: string[] = [];
    let sha: string | undefined;

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
      const content = Buffer.from(fileData.content, "base64").toString("utf-8");
      currentNames = JSON.parse(content);
    }

    // 2. Check duplicate
    if (currentNames.includes(trimmed)) {
      return NextResponse.json({ ok: true, message: "Already exists" });
    }

    // 3. Add name and update file
    currentNames.push(trimmed);
    currentNames.sort((a, b) => a.localeCompare(b, "vi"));

    const newContent = Buffer.from(
      JSON.stringify(currentNames, null, 2) + "\n"
    ).toString("base64");

    const updateRes = await fetch(fileUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `chore: add name "${trimmed}"`,
        content: newContent,
        sha,
        branch: BRANCH,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("GitHub API error:", err);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, name: trimmed });
  } catch (err) {
    console.error("POST /api/names error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
