"use client";

import { useState } from "react";

interface ShareButtonProps {
  name: string;
  birthDate: string;
  title?: string;
  text?: string;
  mode?: "analyze" | "nickname";
  nickname?: string;
}

export default function ShareButton({
  name,
  birthDate,
  title,
  text,
  mode = "analyze",
  nickname,
}: ShareButtonProps) {
  const [feedback, setFeedback] = useState<"copied" | "shared" | null>(null);

  function buildUrl(): string {
    const url = new URL(window.location.origin);
    if (mode === "nickname" && nickname) {
      url.searchParams.set("tab", "nickname");
      url.searchParams.set("mode", "analyze");
      url.searchParams.set("nickname", nickname);
      if (name) url.searchParams.set("name", name);
      if (birthDate) url.searchParams.set("birthDate", birthDate);
    } else {
      url.searchParams.set("tab", "name");
      url.searchParams.set("mode", "analyze");
      url.searchParams.set("name", name);
      url.searchParams.set("birthDate", birthDate);
    }
    return url.toString();
  }

  async function handleShare() {
    const shareUrl = buildUrl();
    const shareTitle = title ?? `Kết quả thần số học: ${name}`;
    const shareText =
      text ?? `Xem phân tích tên "${name}" theo thần số học Pythagorean & Ngũ Hành`;

    // Web Share API — primary on mobile
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setFeedback("shared");
        setTimeout(() => setFeedback(null), 2000);
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedback("copied");
      setTimeout(() => setFeedback(null), 2000);
    } catch {
      window.prompt("Sao chép link:", shareUrl);
    }
  }

  const label =
    feedback === "shared"
      ? "Đã chia sẻ!"
      : feedback === "copied"
        ? "Đã copy link!"
        : "Chia sẻ kết quả";

  return (
    <button
      onClick={handleShare}
      className="w-full mt-4 py-2.5 px-4 rounded-lg border border-[#e8dff0] bg-white hover:bg-[#faf5fc] transition-colors text-sm text-[#af3689] font-medium flex items-center justify-center gap-2"
    >
      <span>{feedback ? "✓" : "↗"}</span>
      {label}
    </button>
  );
}
