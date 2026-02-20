"use client";

import { useState, useEffect } from "react";
import { NGU_HANH_INFO, getCompatibilityLevel } from "@/lib/numerology";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/favorites";
import { LEVEL_COLORS, LEVEL_LABELS, type ParentInfo } from "@/constants/ui";
import type { NameSuggestion } from "@/lib/suggest";
import AnalysisDetail from "./AnalysisDetail";
import ParentCompatCards from "./ParentCompatCards";
import ShareButton from "./ShareButton";
import { trackEvent } from "@/lib/analytics";

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
  const { analysis, blendedScore } = suggestion;
  const compat = analysis.compatibility;

  // Dùng blended score nếu có, fallback compatibility score
  const displayScore = blendedScore?.finalScore ?? compat.score;
  const displayLevel = blendedScore ? getCompatibilityLevel(displayScore) : compat.level;

  useEffect(() => {
    setFav(isFavorited(suggestion.fullName, analysis.birthDate));
  }, [suggestion.fullName, analysis.birthDate]);

  const levelConfig = {
    excellent: { text: "text-[#54a404]", label: "Rất hợp" },
    good: { text: "text-[#2196f3]", label: "Hợp" },
    neutral: { text: "text-[#da8138]", label: "Trung bình" },
    challenging: { text: "text-[#e60909]", label: "Thử thách" },
  };

  const cfg = levelConfig[displayLevel];
  const barColor = LEVEL_COLORS[displayLevel];

  function toggleFav(e: React.MouseEvent) {
    e.stopPropagation();
    if (fav) {
      removeFavorite(suggestion.fullName, analysis.birthDate);
    } else {
      saveFavorite({
        fullName: suggestion.fullName,
        birthDate: analysis.birthDate,
        score: displayScore,
        level: displayLevel,
        savedAt: Date.now(),
      });
      trackEvent("save_favorite");
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
            <span className={`text-xs font-bold whitespace-nowrap ${cfg.text}`}>{cfg.label} {displayScore}%</span>
            <div className="compat-bar w-16">
              <div className="compat-bar-fill" style={{ width: `${displayScore}%`, background: barColor }} />
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="animate-expand px-3 md:px-4 pb-4 border-t border-[#f0e8f5]">
          <AnalysisDetail result={analysis} showNguHanh />
          {/* Blended score breakdown */}
          {blendedScore && (
            <div className="mt-3 p-3 rounded-lg bg-[#f5f0fa] border border-[#e8dff0]">
              <p className="text-xs font-bold text-[#555] mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#af3689] rounded-full"></span>
                Phân tích tổng hợp
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[#888]">Hài hòa tên:</span>
                  <span className="font-bold">{blendedScore.nameScore}%</span>
                  <span className="text-[10px] text-[#bbb]">(70%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#888]">Hợp bố/mẹ:</span>
                  <span className="font-bold">{blendedScore.parentScore}%</span>
                  <span className="text-[10px] text-[#bbb]">(30%)</span>
                </div>
              </div>
              {blendedScore.parentBreakdown && (
                <div className="flex gap-4 mt-1.5 text-[10px] text-[#aaa]">
                  {blendedScore.parentBreakdown.dadScore != null && <span>Bố: {blendedScore.parentBreakdown.dadScore}%</span>}
                  {blendedScore.parentBreakdown.momScore != null && <span>Mẹ: {blendedScore.parentBreakdown.momScore}%</span>}
                </div>
              )}
            </div>
          )}
          {parentInfo && <ParentCompatCards babyResult={analysis} parentInfo={parentInfo} />}
          <ShareButton name={suggestion.fullName} birthDate={analysis.birthDate} />
        </div>
      )}
    </div>
  );
}
