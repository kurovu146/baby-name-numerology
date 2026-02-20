"use client";

import { useMemo } from "react";
import { calcParentChildCompatibility, type NumerologyResult, type ParentCompatibilityResult } from "@/lib/numerology";
import { LEVEL_COLORS, LEVEL_LABELS, type ParentInfo } from "@/constants/ui";

export default function ParentCompatCards({
  babyResult,
  parentInfo,
}: {
  babyResult: NumerologyResult;
  parentInfo: ParentInfo;
}) {
  const entries = useMemo(() => {
    const results: { role: string; res: ParentCompatibilityResult }[] = [];
    if (parentInfo.dadName.trim() && parentInfo.dadBirth) {
      const [y, m, d] = parentInfo.dadBirth.split("-");
      results.push({ role: "Bố", res: calcParentChildCompatibility(babyResult, parentInfo.dadName.trim(), `${d}/${m}/${y}`) });
    }
    if (parentInfo.momName.trim() && parentInfo.momBirth) {
      const [y, m, d] = parentInfo.momBirth.split("-");
      results.push({ role: "Mẹ", res: calcParentChildCompatibility(babyResult, parentInfo.momName.trim(), `${d}/${m}/${y}`) });
    }
    return results;
  }, [babyResult, parentInfo]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-bold text-[#555] flex items-center gap-2">
        <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
        Hợp mệnh với bố/mẹ
      </h3>
      {entries.map(({ role, res }) => (
        <div key={role} className="border border-[#e8dff0] rounded-xl p-3 md:p-4 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#af3689] text-white text-[10px] flex items-center justify-center font-bold shrink-0">{role[0]}</span>
            <span className="text-sm font-bold text-[#333]">{role} — {res.parentName}</span>
          </div>
          {/* Score bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#777]">Tương hợp con — {role}</span>
              <span className="text-xs font-bold" style={{ color: LEVEL_COLORS[res.level] }}>
                {res.score}% — {LEVEL_LABELS[res.level]}
              </span>
            </div>
            <div className="compat-bar">
              <div className="compat-bar-fill" style={{ width: `${res.score}%`, background: `linear-gradient(90deg, ${LEVEL_COLORS[res.level]}, ${LEVEL_COLORS[res.level]}cc)` }} />
            </div>
            <p className="text-xs text-[#777] mt-2 leading-relaxed">{res.description}</p>
          </div>
          {/* Breakdown */}
          <div className="space-y-1">
            {res.breakdown.map((b) => {
              const c = b.pairScore >= 85 ? "#54a404" : b.pairScore >= 70 ? "#2196f3" : b.pairScore >= 55 ? "#da8138" : "#e60909";
              return (
                <div key={b.label} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#faf5fc] border border-[#f0e8f5]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#888] truncate">{b.label}</p>
                    <p className="text-[10px] text-[#bbb]">Con: {b.babyValue} — {role}: {b.parentValue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold" style={{ color: c }}>{b.pairScore}</span>
                    <p className="text-[9px] text-[#ccc]">{Math.round(b.weight * 100)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
