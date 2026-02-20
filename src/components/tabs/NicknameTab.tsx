"use client";

import { useState } from "react";
import {
  analyzeNickname as analyzeNicknameFunc,
  getMeaning,
  type NicknameResult,
} from "@/lib/numerology";
import { suggestNicknames, type NicknameSuggestion } from "@/lib/suggest";
import DatePicker from "@/components/shared/DatePicker";

const CATEGORY_LABELS: Record<string, string> = {
  cute: "Dễ thương", animal: "Động vật", fruit: "Trái cây", nature: "Thiên nhiên", english: "Tiếng Anh", other: "Khác",
};

export default function NicknameTab() {
  const [mode, setMode] = useState<"suggest" | "analyze">("suggest");
  const [suggestFullName, setSuggestFullName] = useState("");
  const [suggestBirthDate, setSuggestBirthDate] = useState("");
  const [suggestGender, setSuggestGender] = useState<"male" | "female" | "all">("male");
  const [suggestions, setSuggestions] = useState<NicknameSuggestion[]>([]);
  const [suggestSearched, setSuggestSearched] = useState(false);
  const [nickname, setNickname] = useState("");
  const [analyzeFullNameVal, setAnalyzeFullNameVal] = useState("");
  const [analyzeBirthDate, setAnalyzeBirthDate] = useState("");
  const [result, setResult] = useState<NicknameResult | null>(null);

  function handleSuggest() {
    if (!suggestFullName.trim() || !suggestBirthDate) return;
    const parts = suggestBirthDate.split("-");
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const results = suggestNicknames({ fullName: suggestFullName.trim(), birthDate: formatted, gender: suggestGender, limit: 20 });
    setSuggestions(results);
    setSuggestSearched(true);
  }

  function handleAnalyze() {
    if (!nickname.trim()) return;
    const hasComparison = analyzeFullNameVal.trim() && analyzeBirthDate;
    const parts = analyzeBirthDate ? analyzeBirthDate.split("-") : [];
    const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : "";
    setResult(analyzeNicknameFunc(nickname.trim(), hasComparison ? analyzeFullNameVal.trim() : undefined, hasComparison ? formatted : undefined));
  }

  return (
    <div>
      <div className="flex justify-center gap-2 mb-5 md:mb-6">
        <button onClick={() => setMode("suggest")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${mode === "suggest" ? "bg-[#af3689] text-white shadow-md" : "bg-white/80 text-[#af3689] border border-[#e0d4e8] hover:bg-[#faf5fc]"}`}>
          Gợi ý biệt danh
        </button>
        <button onClick={() => setMode("analyze")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${mode === "analyze" ? "bg-[#af3689] text-white shadow-md" : "bg-white/80 text-[#af3689] border border-[#e0d4e8] hover:bg-[#faf5fc]"}`}>
          Phân tích biệt danh
        </button>
      </div>

      {mode === "suggest" ? (
        <>
          <div className="result-card p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Gợi ý biệt danh hợp mệnh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Nhập tên khai sinh và ngày sinh, hệ thống sẽ gợi ý những biệt danh có năng lượng hài hòa nhất.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Tên khai sinh <span className="text-red-500">*</span></label>
                <input type="text" value={suggestFullName} onChange={(e) => setSuggestFullName(e.target.value)} placeholder="Nguyễn Văn An" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngày sinh <span className="text-red-500">*</span></label>
                <DatePicker value={suggestBirthDate} onChange={setSuggestBirthDate} yearRange={{ min: 1900, max: 2035 }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Giới tính</label>
                <select value={suggestGender} onChange={(e) => setSuggestGender(e.target.value as "male" | "female" | "all")} className="input-field w-full">
                  <option value="all">Tất cả</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
            </div>
            <button onClick={handleSuggest} disabled={!suggestFullName.trim() || !suggestBirthDate} className="btn-primary mt-4 md:mt-5 w-full py-3 md:py-3.5 text-sm uppercase tracking-wider">
              Gợi ý biệt danh
            </button>
          </div>

          {suggestSearched && (
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
                Biệt danh gợi ý
                <span className="text-sm font-normal text-[#999]">({suggestions.length} kết quả)</span>
              </h2>
              <div className="grid gap-3">
                {suggestions.map((s, i) => {
                  const comp = s.analysis.comparison;
                  const score = comp?.harmonyScore ?? 0;
                  const level = comp?.level ?? "neutral";
                  const barColor = level === "excellent" ? "#54a404" : level === "good" ? "#2196f3" : level === "neutral" ? "#da8138" : "#e60909";
                  const levelLabel = level === "excellent" ? "Rất hợp" : level === "good" ? "Hợp" : level === "neutral" ? "Trung bình" : "Thử thách";
                  return (
                    <div key={i} className="result-card p-3 md:p-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <span className="number-badge w-7 h-7 md:w-8 md:h-8 text-xs shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h3 className="font-bold text-[#333] text-sm md:text-base truncate">{s.nickname}</h3>
                            <span className="px-1.5 py-0.5 bg-[#af3689]/10 text-[#af3689] text-[9px] rounded-full shrink-0 whitespace-nowrap">{CATEGORY_LABELS[s.category] || s.category}</span>
                          </div>
                          <p className="text-xs text-[#888] line-clamp-2">{s.meaning}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold" style={{ color: barColor }}>{levelLabel}</span>
                          <div className="compat-bar w-12 md:w-16 mt-1">
                            <div className="compat-bar-fill" style={{ width: `${score}%`, background: barColor }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 md:gap-4 mt-3 pt-3 border-t border-[#f0e8f5]">
                        {[
                          { label: "Thể hiện", value: s.analysis.minorExpression, color: "#af3689" },
                          { label: "Linh hồn", value: s.analysis.minorSoulUrge, color: "#da8138" },
                          { label: "Nhân cách", value: s.analysis.minorPersonality, color: "#2196f3" },
                        ].map((idx) => (
                          <div key={idx.label} className="flex items-center gap-1.5">
                            <span className="number-badge w-6 h-6 text-[10px]" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>{idx.value}</span>
                            <span className="text-[10px] text-[#999]">{idx.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="result-card p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Phân tích biệt danh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Biệt danh ảnh hưởng đến <strong>Minor Expression</strong> (cách thể hiện hàng ngày) và <strong>Minor Soul Urge</strong> (mong muốn tiềm ẩn khi được gọi tên).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Biệt danh <span className="text-red-500">*</span></label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="VD: Bông, Bin, Kuro..." className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Tên khai sinh</label>
                <input type="text" value={analyzeFullNameVal} onChange={(e) => setAnalyzeFullNameVal(e.target.value)} placeholder="Để so sánh (tùy chọn)" className="input-field w-full" />
              </div>
            </div>
            {analyzeFullNameVal.trim() && (
              <div className="mt-3 md:mt-4">
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngày sinh</label>
                <DatePicker value={analyzeBirthDate} onChange={setAnalyzeBirthDate} yearRange={{ min: 1900, max: 2035 }} className="md:max-w-xs" />
              </div>
            )}
            <button onClick={handleAnalyze} disabled={!nickname.trim()} className="btn-primary mt-4 md:mt-5 w-full py-3 md:py-3.5 text-sm uppercase tracking-wider">
              Phân tích biệt danh
            </button>
          </div>

          {result && (
            <div className="result-card p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="number-badge w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl">{result.minorExpression}</span>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#333]">{result.nickname}</h2>
                  <p className="text-xs text-[#999]">{result.normalizedNickname}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-5">
                {[
                  { label: "Minor Expression", sub: "Thể hiện", value: result.minorExpression, color: "#af3689" },
                  { label: "Minor Soul Urge", sub: "Linh hồn", value: result.minorSoulUrge, color: "#da8138" },
                  { label: "Minor Personality", sub: "Nhân cách", value: result.minorPersonality, color: "#2196f3" },
                ].map((idx) => {
                  const meaning = getMeaning(idx.value);
                  return (
                    <div key={idx.label} className="p-2 md:p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                      <p className="text-[10px] text-[#999] uppercase tracking-wider hidden sm:block">{idx.sub}</p>
                      <div className="flex items-center gap-2 sm:gap-1.5">
                        <span className="number-badge w-9 h-9 md:w-10 md:h-10 text-base shrink-0" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>{idx.value}</span>
                        <div className="min-w-0">
                          <p className="text-[10px] text-[#999] sm:hidden">{idx.sub}</p>
                          <p className="text-xs font-semibold text-[#333]">{meaning.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 md:p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white mb-5">
                <h4 className="font-bold text-[#af3689] text-sm mb-1">Minor Expression {result.minorExpression} — {getMeaning(result.minorExpression).name}</h4>
                <p className="text-xs text-[#666] leading-relaxed">
                  Khi được gọi bằng biệt danh &ldquo;{result.nickname}&rdquo;, năng lượng số {result.minorExpression} ảnh hưởng đến cách bé thể hiện hàng ngày: {getMeaning(result.minorExpression).description.toLowerCase()}
                </p>
              </div>

              {result.comparison && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#555] flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    So sánh với tên khai sinh
                  </h4>
                  <div className="p-3 md:p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#555]">Mức hài hòa</span>
                      <span className="text-sm font-bold" style={{
                        color: result.comparison.level === "excellent" ? "#54a404" : result.comparison.level === "good" ? "#2196f3" : result.comparison.level === "neutral" ? "#da8138" : "#e60909"
                      }}>{result.comparison.harmonyScore}%</span>
                    </div>
                    <div className="compat-bar">
                      <div className="compat-bar-fill" style={{
                        width: `${result.comparison.harmonyScore}%`,
                        background: result.comparison.level === "excellent" ? "#54a404" : result.comparison.level === "good" ? "#2196f3" : result.comparison.level === "neutral" ? "#da8138" : "#e60909",
                      }} />
                    </div>
                    <p className="text-xs text-[#777] mt-2 leading-relaxed">{result.comparison.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {[
                      { label: "Expression", match: result.comparison.expressionMatch },
                      { label: "Soul Urge", match: result.comparison.soulUrgeMatch },
                      { label: "Personality", match: result.comparison.personalityMatch },
                    ].map((pair) => (
                      <div key={pair.label} className={`p-2 md:p-3 rounded-lg border text-center ${pair.match ? "border-[#54a404]/30 bg-[#54a404]/5" : "border-[#e8dff0] bg-white"}`}>
                        <p className="text-[9px] md:text-[10px] text-[#999] uppercase tracking-wider mb-1">{pair.label}</p>
                        <span className={`text-xs md:text-sm font-bold ${pair.match ? "text-[#54a404]" : "text-[#da8138]"}`}>{pair.match ? "Cùng nhóm" : "Khác nhóm"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.letterBreakdown.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    Chi tiết quy đổi
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
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
