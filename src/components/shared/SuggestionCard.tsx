"use client";

import { useState, useEffect } from "react";
import { NGU_HANH_INFO } from "@/lib/numerology";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/favorites";
import type { ParentInfo } from "@/constants/ui";
import type { NameSuggestion } from "@/lib/suggest";
import AnalysisDetail from "./AnalysisDetail";
import ParentCompatCards from "./ParentCompatCards";
import ShareButton from "./ShareButton";

export default function SuggestionCard({
  suggestion,
  rank,
  isComparing,
  onToggleCompare,
  parentInfo,
}: {
  suggestion: NameSuggestion;
  rank: number;
  isComparing: boolean;
  onToggleCompare: () => void;
  parentInfo: ParentInfo | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [fav, setFav] = useState(false);
  const { analysis } = suggestion;
  const compat = analysis.compatibility;

  useEffect(() => {
    setFav(isFavorited(suggestion.fullName, analysis.birthDate));
  }, [suggestion.fullName, analysis.birthDate]);

  const levelConfig = {
    excellent: { text: "text-[#54a404]", label: "Rất hợp" },
    good: { text: "text-[#2196f3]", label: "Hợp" },
    neutral: { text: "text-[#da8138]", label: "Trung bình" },
    challenging: { text: "text-[#e60909]", label: "Thử thách" },
  };

  const cfg = levelConfig[compat.level];
  const barColor = compat.level === "excellent" ? "#54a404" : compat.level === "good" ? "#2196f3" : compat.level === "neutral" ? "#da8138" : "#e60909";

  function toggleFav(e: React.MouseEvent) {
    e.stopPropagation();
    if (fav) {
      removeFavorite(suggestion.fullName, analysis.birthDate);
    } else {
      saveFavorite({
        fullName: suggestion.fullName,
        birthDate: analysis.birthDate,
        score: compat.score,
        level: compat.level,
        savedAt: Date.now(),
      });
    }
    setFav(!fav);
  }

  return (
    <div className={`result-card overflow-hidden ${isComparing ? "ring-2 ring-[#af3689]" : ""}`}>
      <div className="p-3 md:p-4 cursor-pointer hover:bg-[#faf5fc] transition-colors" onClick={() => setExpanded(!expanded)}>
        {/* Dòng 1: rank + tên + emoji */}
        <div className="flex items-center gap-2 mb-2">
          <span className="number-badge w-7 h-7 text-xs shrink-0">{rank}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#333] text-sm truncate">{suggestion.fullName}</h3>
              {analysis.nguHanh && (
                <span className="text-sm shrink-0" title={`Mệnh tên: ${analysis.nguHanh.nameHanh}`}>
                  {NGU_HANH_INFO[analysis.nguHanh.nameHanh].emoji}
                </span>
              )}
            </div>
            <p className="text-xs text-[#888] truncate">{suggestion.meaning}</p>
          </div>
          <span className="text-[#bbb] text-xs shrink-0">{expanded ? "▲" : "▼"}</span>
        </div>
        {/* Dòng 2: actions + compat bar */}
        <div className="flex items-center gap-1.5 pl-9">
          <button onClick={toggleFav} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#fce4f0] transition-colors shrink-0" title={fav ? "Bỏ yêu thích" : "Lưu yêu thích"}>
            <span className={`text-base ${fav ? "text-red-500" : "text-[#ccc]"}`}>{fav ? "♥" : "♡"}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            className={`px-2 py-0.5 flex items-center justify-center rounded text-xs font-bold border transition-colors shrink-0 ${isComparing ? "bg-[#af3689] text-white border-[#af3689]" : "text-[#af3689] border-[#e8dff0] hover:bg-[#faf5fc]"}`}
            title="Thêm vào so sánh">
            {isComparing ? "✓ Đang chọn" : "+ So sánh"}
          </button>
          <div className="flex-1 flex items-center gap-2 justify-end">
            <span className={`text-xs font-bold whitespace-nowrap ${cfg.text}`}>{cfg.label} {compat.score}%</span>
            <div className="compat-bar w-16">
              <div className="compat-bar-fill" style={{ width: `${compat.score}%`, background: barColor }} />
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-3 md:px-4 pb-4 border-t border-[#f0e8f5]">
          <AnalysisDetail result={analysis} showNguHanh />
          {parentInfo && <ParentCompatCards babyResult={analysis} parentInfo={parentInfo} />}
          <ShareButton name={suggestion.fullName} birthDate={analysis.birthDate} />
        </div>
      )}
    </div>
  );
}
