import { NextResponse } from "next/server";

const REPO = "kurovu146/baby-name-numerology";
const FILE_PATH = "public/data/custom-names.json";
const BRANCH = "main";

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

// GET: fetch custom names from GitHub raw
export async function GET() {
  try {
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${FILE_PATH}`;
    const res = await fetch(url, {
      next: { revalidate: 60 }, // cache 60s
    });

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const names: string[] = await res.json();
    return NextResponse.json(names);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST: add a name via GitHub Contents API
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const trimmed = name.trim();
    const headers = getGitHubHeaders();

    // 1. Get current file content + SHA
    const fileUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const fileRes = await fetch(fileUrl, { headers });

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
      return NextResponse.json(
        { error: "Failed to save" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, name: trimmed });
  } catch (err) {
    console.error("POST /api/names error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
