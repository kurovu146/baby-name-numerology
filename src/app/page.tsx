"use client";

import { useState, useMemo } from "react";
import {
  analyzeFullName,
  calcLifePath,
  getMeaning,
  type NumerologyResult,
} from "@/lib/numerology";
import { suggestNames, type NameSuggestion } from "@/lib/suggest";
import { LAST_NAMES } from "@/lib/names";

type Tab = "suggest" | "analyze";

export default function Home() {
  const [tab, setTab] = useState<Tab>("suggest");

  return (
    <>
      {/* Hero Header */}
      <header className="hero-gradient text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">
            Đặt Tên Bé Theo Thần Số Học
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Tìm tên hay, hợp mệnh cho bé yêu dựa trên phương pháp Pythagorean
            Numerology
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setTab("suggest")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wide ${
                tab === "suggest"
                  ? "bg-white text-[#af3689] shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              Gợi ý tên
            </button>
            <button
              onClick={() => setTab("analyze")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wide ${
                tab === "analyze"
                  ? "bg-white text-[#af3689] shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              Phân tích tên
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        {tab === "suggest" ? <SuggestTab /> : <AnalyzeTab />}
      </main>

      {/* Footer — luôn ở bottom nhờ flex-1 trên main */}
      <footer className="bg-[#15143e] text-white/60 py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs leading-relaxed">
            Kết quả chỉ mang tính tham khảo dựa trên thần số học Pythagorean.
            <br />
            Việc đặt tên cho bé nên kết hợp nhiều yếu tố: ý nghĩa, phong thủy,
            văn hóa gia đình.
          </p>
          <p className="text-[10px] text-white/30 mt-4">
            &copy; 2026 Baby Name Numerology
          </p>
        </div>
      </footer>
    </>
  );
}

// ============================================================================
// Tab: Gợi ý tên
// ============================================================================

function SuggestTab() {
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [middleName2, setMiddleName2] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "all">("male");
  const [results, setResults] = useState<NameSuggestion[]>([]);
  const [searched, setSearched] = useState(false);

  const lifePath = useMemo(() => {
    if (!birthDate) return 0;
    const parts = birthDate.split("-");
    if (parts.length !== 3) return 0;
    return calcLifePath(`${parts[2]}/${parts[1]}/${parts[0]}`);
  }, [birthDate]);

  function handleSearch() {
    if (!lastName.trim() || !birthDate) return;
    const parts = birthDate.split("-");
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const suggestions = suggestNames({
      lastName: lastName.trim(),
      birthDate: formatted,
      gender,
      middleName: middleName.trim() || undefined,
      middleName2: middleName2.trim() || undefined,
      limit: 30,
    });
    setResults(suggestions);
    setSearched(true);
  }

  return (
    <div>
      {/* Form */}
      <div className="result-card p-6 mb-8">
        <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Nhập thông tin
        </h2>
        {/* Row 1: Họ + Đệm 1 + Đệm 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="lastnames"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nguyễn"
              className="input-field w-full"
            />
            <datalist id="lastnames">
              {LAST_NAMES.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Tên đệm 1
            </label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Thị, Văn..."
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Tên đệm 2
            </label>
            <input
              type="text"
              value={middleName2}
              onChange={(e) => setMiddleName2(e.target.value)}
              placeholder="Ngọc, Minh..."
              className="input-field w-full"
            />
            <p className="text-[10px] text-[#aaa] mt-1">Cho tên 4 từ (tuỳ chọn)</p>
          </div>
        </div>

        {/* Row 2: Ngày sinh + Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ngày sinh dự kiến <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Giới tính
            </label>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as "male" | "female" | "all")
              }
              className="input-field w-full"
            >
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        {lifePath > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[#f3e7f9] to-[#fce4f0] rounded-lg border border-[#e0c5eb]">
            <div className="flex items-center gap-3">
              <span className="number-badge w-12 h-12 text-xl">
                {lifePath}
              </span>
              <div>
                <p className="text-sm font-bold text-[#af3689]">
                  Số Đường Đời (Life Path)
                </p>
                <p className="text-xs text-[#555]">
                  {getMeaning(lifePath).name} —{" "}
                  {getMeaning(lifePath).keywords.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={!lastName.trim() || !birthDate}
          className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider"
        >
          Tìm tên hợp mệnh
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <h2 className="text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
            Gợi ý tên
            <span className="text-sm font-normal text-[#999]">
              ({results.length} kết quả)
            </span>
          </h2>
          {results.length === 0 ? (
            <p className="text-[#999]">
              Không tìm thấy kết quả. Hãy thử thay đổi tiêu chí.
            </p>
          ) : (
            <div className="grid gap-3">
              {results.map((s, i) => (
                <SuggestionCard key={i} suggestion={s} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SuggestionCard({
  suggestion,
  rank,
}: {
  suggestion: NameSuggestion;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { analysis } = suggestion;
  const compat = analysis.compatibility;

  const levelConfig = {
    excellent: { text: "text-[#54a404]", label: "Rất hợp" },
    good: { text: "text-[#2196f3]", label: "Hợp" },
    neutral: { text: "text-[#da8138]", label: "Trung bình" },
    challenging: { text: "text-[#e60909]", label: "Thử thách" },
  };

  const cfg = levelConfig[compat.level];
  const barColor =
    compat.level === "excellent" ? "#54a404"
    : compat.level === "good" ? "#2196f3"
    : compat.level === "neutral" ? "#da8138"
    : "#e60909";

  return (
    <div className="result-card overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-[#faf5fc] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="number-badge w-8 h-8 text-xs shrink-0">
            {rank}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#333] text-base truncate">
              {suggestion.fullName}
            </h3>
            <p className="text-xs text-[#888] truncate">{suggestion.meaning}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className={`text-xs font-bold ${cfg.text}`}>
                {cfg.label}
              </span>
              <div className="compat-bar w-16 mt-1">
                <div
                  className="compat-bar-fill"
                  style={{ width: `${compat.score}%`, background: barColor }}
                />
              </div>
            </div>
            <span className="text-[#bbb] text-xs">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#f0e8f5]">
          <AnalysisDetail result={analysis} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Tab: Phân tích tên
// ============================================================================

function AnalyzeTab() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);

  function handleAnalyze() {
    if (!fullName.trim() || !birthDate) return;
    const parts = birthDate.split("-");
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    setResult(analyzeFullName(fullName.trim(), formatted));
  }

  return (
    <div>
      <div className="result-card p-6 mb-8">
        <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Phân tích họ tên
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Họ tên đầy đủ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="VD: Nguyễn Thị Ngọc Mai"
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!fullName.trim() || !birthDate}
          className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider"
        >
          Phân tích ngay
        </button>
      </div>

      {result && (
        <div className="result-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="number-badge w-14 h-14 text-2xl">
              {result.expression}
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#333]">
                {result.originalName}
              </h2>
              <p className="text-xs text-[#999]">
                {result.normalizedName} &bull; {result.birthDate}
              </p>
            </div>
          </div>
          <AnalysisDetail result={result} showLetterBreakdown />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Component: Chi tiết phân tích
// ============================================================================

function AnalysisDetail({
  result,
  showLetterBreakdown = false,
}: {
  result: NumerologyResult;
  showLetterBreakdown?: boolean;
}) {
  const indices = [
    { label: "Đường Đời", value: result.lifePath, sub: "Life Path", color: "#af3689" },
    { label: "Sứ Mệnh", value: result.expression, sub: "Expression", color: "#8a2b6d" },
    { label: "Linh Hồn", value: result.soulUrge, sub: "Soul Urge", color: "#da8138" },
    { label: "Nhân Cách", value: result.personality, sub: "Personality", color: "#2196f3" },
    { label: "Trưởng Thành", value: result.maturity, sub: "Maturity", color: "#54a404" },
    { label: "Ngày Sinh", value: result.birthday, sub: "Birthday", color: "#9c27b0" },
  ];

  const compatColor =
    result.compatibility.level === "excellent" ? "#54a404"
    : result.compatibility.level === "good" ? "#2196f3"
    : result.compatibility.level === "neutral" ? "#da8138"
    : "#e60909";

  return (
    <div className="space-y-5 pt-3">
      {/* Compatibility */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[#555]">Mức tương hợp</span>
          <span className="text-sm font-bold" style={{ color: compatColor }}>
            {result.compatibility.score}%
          </span>
        </div>
        <div className="compat-bar">
          <div
            className="compat-bar-fill"
            style={{
              width: `${result.compatibility.score}%`,
              background: `linear-gradient(90deg, ${compatColor}, ${compatColor}cc)`,
            }}
          />
        </div>
        <p className="text-xs text-[#777] mt-2 leading-relaxed">
          {result.compatibility.description}
        </p>
      </div>

      {/* Chỉ số grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {indices.map((idx) => {
          const meaning = getMeaning(idx.value);
          return (
            <div
              key={idx.label}
              className="p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow"
            >
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">
                {idx.label}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="number-badge w-10 h-10 text-base"
                  style={{
                    background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)`,
                  }}
                >
                  {idx.value}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#333] truncate">
                    {meaning.name}
                  </p>
                  <p className="text-[10px] text-[#aaa]">{idx.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ý nghĩa số sứ mệnh */}
      <div className="p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white">
        <h4 className="font-bold text-[#af3689] text-sm mb-1">
          Số Sứ Mệnh {result.expression} — {getMeaning(result.expression).name}
        </h4>
        <p className="text-xs text-[#666] leading-relaxed mb-3">
          {getMeaning(result.expression).description}
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-[#54a404] font-semibold mb-1">
              Điểm mạnh
            </p>
            <div className="flex flex-wrap gap-1">
              {getMeaning(result.expression).strengths.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 bg-[#54a404]/10 text-[#54a404] text-[10px] rounded-full border border-[#54a404]/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#e60909] font-semibold mb-1">
              Thử thách
            </p>
            <div className="flex flex-wrap gap-1">
              {getMeaning(result.expression).challenges.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 bg-[#e60909]/10 text-[#e60909] text-[10px] rounded-full border border-[#e60909]/20"
                >
                  {c}
                </span>
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
          <div className="flex flex-wrap gap-1.5">
            {result.letterBreakdown.map((l, i) => (
              <div
                key={i}
                className={`w-11 h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${
                  l.type === "vowel"
                    ? "bg-[#af3689]/5 border-[#af3689]/30 text-[#af3689]"
                    : "bg-[#2196f3]/5 border-[#2196f3]/30 text-[#2196f3]"
                }`}
              >
                <span className="font-bold text-base">{l.letter}</span>
                <span className="text-xs opacity-70">{l.value}</span>
                <span className="text-[8px] opacity-50 uppercase">
                  {l.type === "vowel" ? "ngâm" : "phụ"}
                </span>
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
