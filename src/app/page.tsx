"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  analyzeNickname as analyzeNicknameFunc,
  calcLifePath,
  getMeaning,
  type NumerologyResult,
  type NicknameResult,
} from "@/lib/numerology";
import { suggestNames, suggestNicknames, type NameSuggestion, type NicknameSuggestion } from "@/lib/suggest";
import { LAST_NAMES, VIETNAMESE_NAMES, MIDDLE_NAMES } from "@/lib/names";

type Tab = "suggest" | "nickname";

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
              onClick={() => setTab("nickname")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-wide ${
                tab === "nickname"
                  ? "bg-white text-[#af3689] shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              Biệt danh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        {tab === "suggest" && <SuggestTab />}
        {tab === "nickname" && <NicknameTab />}
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
  const [excludeList, setExcludeList] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState("");
  const [excludeOpen, setExcludeOpen] = useState(false);
  const excludeRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<NameSuggestion[]>([]);
  const [searched, setSearched] = useState(false);

  // Danh sách tên unique để suggest (gộp tên chính + tên đệm)
  const allNames = useMemo(() => {
    const set = new Set<string>();
    VIETNAMESE_NAMES.forEach((n) => set.add(n.name));
    MIDDLE_NAMES.forEach((n) => set.add(n.name));
    return [...set].sort((a, b) => a.localeCompare(b, "vi"));
  }, []);

  const filteredExclude = useMemo(() => {
    if (!excludeInput.trim()) return [];
    const q = excludeInput.trim().toLowerCase();
    return allNames
      .filter((n) => n.toLowerCase().startsWith(q) && !excludeList.includes(n))
      .slice(0, 8);
  }, [excludeInput, excludeList, allNames]);

  // Click outside để đóng dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (excludeRef.current && !excludeRef.current.contains(e.target as Node)) {
        setExcludeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
      excludeNames: excludeList.length > 0 ? excludeList : undefined,
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

        {/* Row 3: Tên kiêng */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-[#555] mb-1.5">
            Tên kiêng (gia phả)
          </label>

          {/* Tag chips */}
          {excludeList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {excludeList.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#af3689]/10 text-[#af3689] text-xs font-medium rounded-full border border-[#af3689]/20"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => setExcludeList((prev) => prev.filter((n) => n !== name))}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#af3689]/20 text-[#af3689] text-xs leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Autocomplete input */}
          <div className="relative" ref={excludeRef}>
            <input
              type="text"
              value={excludeInput}
              onChange={(e) => {
                setExcludeInput(e.target.value);
                setExcludeOpen(true);
              }}
              onFocus={() => excludeInput.trim() && setExcludeOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && excludeInput.trim()) {
                  e.preventDefault();
                  const pick = filteredExclude.length > 0 ? filteredExclude[0] : excludeInput.trim();
                  if (!excludeList.includes(pick)) {
                    setExcludeList((prev) => [...prev, pick]);
                  }
                  setExcludeInput("");
                  setExcludeOpen(false);
                }
              }}
              placeholder="Gõ tên để tìm, VD: Hùng, Lan..."
              className="input-field w-full"
            />

            {/* Dropdown */}
            {excludeOpen && filteredExclude.length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#e8dff0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredExclude.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-[#faf5fc] transition-colors"
                    onClick={() => {
                      setExcludeList((prev) => [...prev, name]);
                      setExcludeInput("");
                      setExcludeOpen(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] text-[#aaa] mt-1">
            Gõ tên cần tránh, chọn từ gợi ý hoặc nhấn Enter
          </p>
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
// Tab: Biệt danh
// ============================================================================

function NicknameTab() {
  const [mode, setMode] = useState<"suggest" | "analyze">("suggest");
  // Suggest mode
  const [suggestFullName, setSuggestFullName] = useState("");
  const [suggestBirthDate, setSuggestBirthDate] = useState("");
  const [suggestGender, setSuggestGender] = useState<"male" | "female" | "all">("male");
  const [suggestions, setSuggestions] = useState<NicknameSuggestion[]>([]);
  const [suggestSearched, setSuggestSearched] = useState(false);
  // Analyze mode
  const [nickname, setNickname] = useState("");
  const [analyzeFullName, setAnalyzeFullName] = useState("");
  const [analyzeBirthDate, setAnalyzeBirthDate] = useState("");
  const [result, setResult] = useState<NicknameResult | null>(null);

  function handleSuggest() {
    if (!suggestFullName.trim() || !suggestBirthDate) return;
    const parts = suggestBirthDate.split("-");
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const results = suggestNicknames({
      fullName: suggestFullName.trim(),
      birthDate: formatted,
      gender: suggestGender,
      limit: 20,
    });
    setSuggestions(results);
    setSuggestSearched(true);
  }

  function handleAnalyze() {
    if (!nickname.trim()) return;
    const hasComparison = analyzeFullName.trim() && analyzeBirthDate;
    const parts = analyzeBirthDate ? analyzeBirthDate.split("-") : [];
    const formatted = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : "";
    setResult(
      analyzeNicknameFunc(
        nickname.trim(),
        hasComparison ? analyzeFullName.trim() : undefined,
        hasComparison ? formatted : undefined,
      )
    );
  }

  const CATEGORY_LABELS: Record<string, string> = {
    cute: "Dễ thương",
    animal: "Động vật",
    fruit: "Trái cây",
    nature: "Thiên nhiên",
    english: "Tiếng Anh",
    other: "Khác",
  };

  return (
    <div>
      {/* Mode switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("suggest")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === "suggest"
              ? "bg-[#af3689] text-white shadow"
              : "bg-white text-[#af3689] border border-[#e8dff0] hover:bg-[#faf5fc]"
          }`}
        >
          Gợi ý biệt danh
        </button>
        <button
          onClick={() => setMode("analyze")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === "analyze"
              ? "bg-[#af3689] text-white shadow"
              : "bg-white text-[#af3689] border border-[#e8dff0] hover:bg-[#faf5fc]"
          }`}
        >
          Phân tích biệt danh
        </button>
      </div>

      {mode === "suggest" ? (
        <>
          {/* Suggest Form */}
          <div className="result-card p-6 mb-8">
            <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Gợi ý biệt danh hợp mệnh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Nhập tên khai sinh và ngày sinh, hệ thống sẽ gợi ý những biệt danh có năng lượng hài hòa nhất.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Tên khai sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={suggestFullName}
                  onChange={(e) => setSuggestFullName(e.target.value)}
                  placeholder="Nguyễn Văn An"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={suggestBirthDate}
                  onChange={(e) => setSuggestBirthDate(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Giới tính
                </label>
                <select
                  value={suggestGender}
                  onChange={(e) => setSuggestGender(e.target.value as "male" | "female" | "all")}
                  className="input-field w-full"
                >
                  <option value="all">Tất cả</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSuggest}
              disabled={!suggestFullName.trim() || !suggestBirthDate}
              className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider"
            >
              Gợi ý biệt danh
            </button>
          </div>

          {/* Suggest Results */}
          {suggestSearched && (
            <div>
              <h2 className="text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
                Biệt danh gợi ý
                <span className="text-sm font-normal text-[#999]">
                  ({suggestions.length} kết quả)
                </span>
              </h2>
              <div className="grid gap-3">
                {suggestions.map((s, i) => {
                  const comp = s.analysis.comparison;
                  const score = comp?.harmonyScore ?? 0;
                  const level = comp?.level ?? "neutral";
                  const barColor =
                    level === "excellent" ? "#54a404"
                    : level === "good" ? "#2196f3"
                    : level === "neutral" ? "#da8138"
                    : "#e60909";
                  const levelLabel =
                    level === "excellent" ? "Rất hợp"
                    : level === "good" ? "Hợp"
                    : level === "neutral" ? "Trung bình"
                    : "Thử thách";

                  return (
                    <div key={i} className="result-card p-4">
                      <div className="flex items-center gap-3">
                        <span className="number-badge w-8 h-8 text-xs shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#333] text-base">
                              {s.nickname}
                            </h3>
                            <span className="px-2 py-0.5 bg-[#af3689]/10 text-[#af3689] text-[10px] rounded-full">
                              {CATEGORY_LABELS[s.category] || s.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#888]">{s.meaning}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold" style={{ color: barColor }}>
                            {levelLabel}
                          </span>
                          <div className="compat-bar w-16 mt-1">
                            <div
                              className="compat-bar-fill"
                              style={{ width: `${score}%`, background: barColor }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Minor indices */}
                      <div className="flex gap-4 mt-3 pt-3 border-t border-[#f0e8f5]">
                        {[
                          { label: "Thể hiện", value: s.analysis.minorExpression, color: "#af3689" },
                          { label: "Linh hồn", value: s.analysis.minorSoulUrge, color: "#da8138" },
                          { label: "Nhân cách", value: s.analysis.minorPersonality, color: "#2196f3" },
                        ].map((idx) => (
                          <div key={idx.label} className="flex items-center gap-1.5">
                            <span
                              className="number-badge w-6 h-6 text-[10px]"
                              style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}
                            >
                              {idx.value}
                            </span>
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
          {/* Analyze Form */}
          <div className="result-card p-6 mb-8">
            <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Phân tích biệt danh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Biệt danh ảnh hưởng đến <strong>Minor Expression</strong> (cách thể hiện hàng ngày) và <strong>Minor Soul Urge</strong> (mong muốn tiềm ẩn khi được gọi tên).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Biệt danh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="VD: Bông, Bin, Kuro..."
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Tên khai sinh
                </label>
                <input
                  type="text"
                  value={analyzeFullName}
                  onChange={(e) => setAnalyzeFullName(e.target.value)}
                  placeholder="Để so sánh (tuỳ chọn)"
                  className="input-field w-full"
                />
              </div>
            </div>

            {analyzeFullName.trim() && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#555] mb-1.5">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={analyzeBirthDate}
                  onChange={(e) => setAnalyzeBirthDate(e.target.value)}
                  className="input-field w-full md:w-1/2"
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!nickname.trim()}
              className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider"
            >
              Phân tích biệt danh
            </button>
          </div>

          {/* Analyze Result */}
          {result && (
            <div className="result-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="number-badge w-14 h-14 text-2xl">
                  {result.minorExpression}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-[#333]">{result.nickname}</h2>
                  <p className="text-xs text-[#999]">{result.normalizedNickname}</p>
                </div>
              </div>

              {/* 3 chỉ số minor */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Minor Expression", sub: "Thể hiện", value: result.minorExpression, color: "#af3689" },
                  { label: "Minor Soul Urge", sub: "Linh hồn", value: result.minorSoulUrge, color: "#da8138" },
                  { label: "Minor Personality", sub: "Nhân cách", value: result.minorPersonality, color: "#2196f3" },
                ].map((idx) => {
                  const meaning = getMeaning(idx.value);
                  return (
                    <div key={idx.label} className="p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow">
                      <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">{idx.sub}</p>
                      <div className="flex items-center gap-2">
                        <span className="number-badge w-10 h-10 text-base" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>
                          {idx.value}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#333] truncate">{meaning.name}</p>
                          <p className="text-[10px] text-[#aaa]">{idx.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ý nghĩa */}
              <div className="p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white mb-5">
                <h4 className="font-bold text-[#af3689] text-sm mb-1">
                  Minor Expression {result.minorExpression} — {getMeaning(result.minorExpression).name}
                </h4>
                <p className="text-xs text-[#666] leading-relaxed">
                  Khi được gọi bằng biệt danh &ldquo;{result.nickname}&rdquo;, năng lượng số {result.minorExpression} ảnh hưởng đến cách bé thể hiện hàng ngày: {getMeaning(result.minorExpression).description.toLowerCase()}
                </p>
              </div>

              {/* So sánh */}
              {result.comparison && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#555] flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    So sánh với tên khai sinh
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#555]">Mức hài hòa</span>
                      <span className="text-sm font-bold" style={{
                        color: result.comparison.level === "excellent" ? "#54a404"
                          : result.comparison.level === "good" ? "#2196f3"
                          : result.comparison.level === "neutral" ? "#da8138" : "#e60909"
                      }}>
                        {result.comparison.harmonyScore}%
                      </span>
                    </div>
                    <div className="compat-bar">
                      <div className="compat-bar-fill" style={{
                        width: `${result.comparison.harmonyScore}%`,
                        background: result.comparison.level === "excellent" ? "#54a404"
                          : result.comparison.level === "good" ? "#2196f3"
                          : result.comparison.level === "neutral" ? "#da8138" : "#e60909",
                      }} />
                    </div>
                    <p className="text-xs text-[#777] mt-2 leading-relaxed">
                      {result.comparison.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: "Expression", match: result.comparison.expressionMatch },
                      { label: "Soul Urge", match: result.comparison.soulUrgeMatch },
                      { label: "Personality", match: result.comparison.personalityMatch },
                    ].map((pair) => (
                      <div key={pair.label} className={`p-3 rounded-lg border text-center ${pair.match ? "border-[#54a404]/30 bg-[#54a404]/5" : "border-[#e8dff0] bg-white"}`}>
                        <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">{pair.label}</p>
                        <span className={`text-sm font-bold ${pair.match ? "text-[#54a404]" : "text-[#da8138]"}`}>
                          {pair.match ? "Cùng nhóm" : "Khác nhóm"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Letter Breakdown */}
              {result.letterBreakdown.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    Chi tiết quy đổi
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.letterBreakdown.map((l, i) => (
                      <div key={i} className={`w-11 h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${l.type === "vowel" ? "bg-[#af3689]/5 border-[#af3689]/30 text-[#af3689]" : "bg-[#2196f3]/5 border-[#2196f3]/30 text-[#2196f3]"}`}>
                        <span className="font-bold text-base">{l.letter}</span>
                        <span className="text-xs opacity-70">{l.value}</span>
                        <span className="text-[8px] opacity-50 uppercase">{l.type === "vowel" ? "ngâm" : "phụ"}</span>
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

      {/* Xem chi tiết trên tracuuthansohoc.com */}
      <a
        href="https://tracuuthansohoc.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-2 py-2.5 px-4 rounded-lg border border-[#e8dff0] bg-white hover:bg-[#faf5fc] transition-colors text-sm text-[#af3689] font-medium flex items-center justify-center gap-2"
      >
        Xem phân tích chi tiết trên tracuuthansohoc.com &rarr;
      </a>
    </div>
  );
}
