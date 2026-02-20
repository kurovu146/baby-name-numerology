"use client";

import { useState } from "react";

export default function ShareButton({ name, birthDate }: { name: string; birthDate: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = new URL(window.location.origin);
    url.searchParams.set("tab", "name");
    url.searchParams.set("mode", "analyze");
    url.searchParams.set("name", name);
    url.searchParams.set("birthDate", birthDate);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button onClick={handleCopy} className="w-full mt-4 py-2.5 px-4 rounded-lg border border-[#e8dff0] bg-white hover:bg-[#faf5fc] transition-colors text-sm text-[#af3689] font-medium flex items-center justify-center gap-2">
      {copied ? "Đã copy link!" : "Chia sẻ kết quả"}
    </button>
  );
}
