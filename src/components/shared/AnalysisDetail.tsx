"use client";

import { getMeaning, NGU_HANH_INFO, type NumerologyResult } from "@/lib/numerology";

export default function AnalysisDetail({
  result,
  showLetterBreakdown = false,
  showNguHanh = false,
}: {
  result: NumerologyResult;
  showLetterBreakdown?: boolean;
  showNguHanh?: boolean;
}) {
  const indices = [
    { label: "Đường Đời", value: result.lifePath, sub: "Life Path", color: "#af3689" },
    { label: "Sứ Mệnh", value: result.expression, sub: "Expression", color: "#8a2b6d" },
    { label: "Linh Hồn", value: result.soulUrge, sub: "Soul Urge", color: "#da8138" },
    { label: "Nhân Cách", value: result.personality, sub: "Personality", color: "#2196f3" },
    { label: "Trưởng Thành", value: result.maturity, sub: "Maturity", color: "#54a404" },
    { label: "Ngày Sinh", value: result.birthday, sub: "Birthday", color: "#9c27b0" },
  ];

  const compatColor = result.compatibility.level === "excellent" ? "#54a404" : result.compatibility.level === "good" ? "#2196f3" : result.compatibility.level === "neutral" ? "#da8138" : "#e60909";

  return (
    <div className="space-y-4 md:space-y-5 pt-3">
      {/* Compatibility */}
      <div className="p-3 md:p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[#555]">Mức tương hợp</span>
          <span className="text-sm font-bold" style={{ color: compatColor }}>{result.compatibility.score}%</span>
        </div>
        <div className="compat-bar">
          <div className="compat-bar-fill" style={{ width: `${result.compatibility.score}%`, background: `linear-gradient(90deg, ${compatColor}, ${compatColor}cc)` }} />
        </div>
        <p className="text-xs text-[#777] mt-2 leading-relaxed">{result.compatibility.description}</p>
      </div>

      {/* Ngũ Hành */}
      {showNguHanh && result.nguHanh && (
        <div className="p-3 md:p-4 rounded-lg border border-[#e8dff0] bg-white">
          <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
            Ngũ Hành
          </h4>
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
            <div className="p-2 md:p-3 rounded-lg border border-[#e8dff0] text-center">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">Mệnh năm sinh</p>
              <span className="text-2xl">{NGU_HANH_INFO[result.nguHanh.yearHanh].emoji}</span>
              <p className="text-sm font-bold mt-1" style={{ color: NGU_HANH_INFO[result.nguHanh.yearHanh].color }}>
                {result.nguHanh.canChi.can} {result.nguHanh.canChi.chi}
              </p>
              <p className="text-[10px] text-[#888]">{result.nguHanh.yearHanh} — {result.nguHanh.canChi.amDuong}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg border border-[#e8dff0] text-center">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">Mệnh tên</p>
              <span className="text-2xl">{NGU_HANH_INFO[result.nguHanh.nameHanh].emoji}</span>
              <p className="text-sm font-bold mt-1" style={{ color: NGU_HANH_INFO[result.nguHanh.nameHanh].color }}>
                {result.nguHanh.nameHanh}
              </p>
              <p className="text-[10px] text-[#888]">{NGU_HANH_INFO[result.nguHanh.nameHanh].description}</p>
            </div>
          </div>
          <div className={`p-3 rounded-lg text-center text-sm font-bold ${
            result.nguHanh.relation.score > 0 ? "bg-[#54a404]/10 text-[#54a404] border border-[#54a404]/20" :
            result.nguHanh.relation.score < 0 ? "bg-[#e60909]/10 text-[#e60909] border border-[#e60909]/20" :
            "bg-[#da8138]/10 text-[#da8138] border border-[#da8138]/20"
          }`}>
            {result.nguHanh.relation.description}
          </div>
        </div>
      )}

      {/* Chỉ số grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {indices.map((idx) => {
          const meaning = getMeaning(idx.value);
          return (
            <div key={idx.label} className="p-2 md:p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow">
              <p className="text-[9px] md:text-[10px] text-[#999] uppercase tracking-wider mb-1">{idx.label}</p>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="number-badge w-8 h-8 md:w-10 md:h-10 text-sm md:text-base shrink-0" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>{idx.value}</span>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs font-semibold text-[#333] truncate">{meaning.name}</p>
                  <p className="text-[9px] md:text-[10px] text-[#aaa]">{idx.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ý nghĩa số sứ mệnh */}
      <div className="p-3 md:p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white">
        <h4 className="font-bold text-[#af3689] text-sm mb-1">Số Sứ Mệnh {result.expression} — {getMeaning(result.expression).name}</h4>
        <p className="text-xs text-[#666] leading-relaxed mb-3">{getMeaning(result.expression).description}</p>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-[#54a404] font-semibold mb-1">Điểm mạnh</p>
            <div className="flex flex-wrap gap-1">
              {getMeaning(result.expression).strengths.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[#54a404]/10 text-[#54a404] text-[10px] rounded-full border border-[#54a404]/20">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#e60909] font-semibold mb-1">Thử thách</p>
            <div className="flex flex-wrap gap-1">
              {getMeaning(result.expression).challenges.map((c) => (
                <span key={c} className="px-2 py-0.5 bg-[#e60909]/10 text-[#e60909] text-[10px] rounded-full border border-[#e60909]/20">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Letter Breakdown */}
      {showLetterBreakdown && result.letterBreakdown.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
            Chi tiết quy đổi chữ cái
          </h4>
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {result.letterBreakdown.map((l, i) => (
              <div key={i} className={`w-9 h-14 md:w-11 md:h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${l.type === "vowel" ? "bg-[#af3689]/5 border-[#af3689]/30 text-[#af3689]" : "bg-[#2196f3]/5 border-[#2196f3]/30 text-[#2196f3]"}`}>
                <span className="font-bold text-sm md:text-base">{l.letter}</span>
                <span className="text-xs opacity-70">{l.value}</span>
                <span className="text-[7px] md:text-[8px] opacity-50 uppercase">{l.type === "vowel" ? "nguyên" : "phụ"}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-[#999]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-[#af3689]/30 bg-[#af3689]/5"></span>
              Nguyên âm &rarr; Linh Hồn
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-[#2196f3]/30 bg-[#2196f3]/5"></span>
              Phụ âm &rarr; Nhân Cách
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
