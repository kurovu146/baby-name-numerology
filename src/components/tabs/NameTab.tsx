"use client";

import { useState, useEffect } from "react";
import { getQueryParams, setQueryParams } from "@/lib/url-params";
import SuggestTab from "./SuggestTab";
import AnalyzeTab from "./AnalyzeTab";

export default function NameTab() {
  const [mode, setMode] = useState<"suggest" | "analyze">("suggest");

  useEffect(() => {
    const params = getQueryParams();
    if (params.mode === "analyze" || params.name) {
      setMode("analyze");
    }
  }, []);

  return (
    <>
      <div className="flex justify-center gap-2 mb-5 md:mb-6">
        <button
          onClick={() => { setMode("suggest"); setQueryParams({ tab: "name", mode: "suggest" }); }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            mode === "suggest"
              ? "bg-[#af3689] text-white shadow-md"
              : "bg-white text-[#af3689] border border-[#e0d4e8] hover:bg-[#faf5fc]"
          }`}
        >
          Gợi ý tên
        </button>
        <button
          onClick={() => { setMode("analyze"); setQueryParams({ tab: "name", mode: "analyze" }); }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            mode === "analyze"
              ? "bg-[#af3689] text-white shadow-md"
              : "bg-white text-[#af3689] border border-[#e0d4e8] hover:bg-[#faf5fc]"
          }`}
        >
          Phân tích
        </button>
      </div>
      <div className="min-h-[60vh]">
        {mode === "suggest" ? <SuggestTab /> : <AnalyzeTab />}
      </div>
    </>
  );
}
