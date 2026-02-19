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

type Tab = "analyze" | "suggest";

export default function Home() {
  const [tab, setTab] = useState<Tab>("suggest");

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
          Đặt Tên Bé Theo Thần Số Học
        </h1>
        <p className="text-amber-700/80 text-sm md:text-base">
          Tìm tên hay, hợp mệnh cho bé yêu dựa trên Pythagorean Numerology
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setTab("suggest")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === "suggest"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
          }`}
        >
          Gợi ý tên
        </button>
        <button
          onClick={() => setTab("analyze")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === "analyze"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
          }`}
        >
          Phân tích tên
        </button>
      </div>

      {tab === "suggest" ? <SuggestTab /> : <AnalyzeTab />}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-amber-200/60 text-center">
        <p className="text-xs text-amber-600/60">
          Kết quả chỉ mang tính tham khảo dựa trên thần số học Pythagorean.
          <br />
          Việc đặt tên cho bé nên kết hợp nhiều yếu tố khác nhau.
        </p>
      </footer>
    </main>
  );
}

// ============================================================================
// Tab: Gợi ý tên
// ============================================================================

function SuggestTab() {
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "all">("all");
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
      limit: 30,
    });
    setResults(suggestions);
    setSearched(true);
  }

  return (
    <div>
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Họ của bé *
            </label>
            <input
              type="text"
              list="lastnames"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="VD: Nguyễn"
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            />
            <datalist id="lastnames">
              {LAST_NAMES.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Tên đệm (tùy chọn)
            </label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="VD: Văn, Thị, Ngọc..."
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Ngày sinh dự kiến *
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Giới tính
            </label>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as "male" | "female" | "all")
              }
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            >
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        {lifePath > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              Số Đường đời (Life Path):{" "}
              <span className="font-bold text-amber-900 text-lg">
                {lifePath}
              </span>{" "}
              — {getMeaning(lifePath).name}
            </p>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={!lastName.trim() || !birthDate}
          className="mt-4 w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Tìm tên hợp mệnh
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <h2 className="text-xl font-bold text-amber-900 mb-4">
            Gợi ý tên ({results.length} kết quả)
          </h2>
          {results.length === 0 ? (
            <p className="text-amber-600">
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

  const levelColors = {
    excellent: "bg-green-100 text-green-800 border-green-200",
    good: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-yellow-100 text-yellow-800 border-yellow-200",
    challenging: "bg-red-100 text-red-800 border-red-200",
  };

  const levelLabels = {
    excellent: "Rất hợp",
    good: "Hợp",
    neutral: "Trung bình",
    challenging: "Thử thách",
  };

  return (
    <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-amber-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400 font-mono w-6">
            #{rank}
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 text-lg">
              {suggestion.fullName}
            </h3>
            <p className="text-sm text-amber-600/70">{suggestion.meaning}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${levelColors[compat.level]}`}
            >
              {levelLabels[compat.level]} ({compat.score}%)
            </span>
            <span className="text-amber-400 text-sm">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-amber-50">
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
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Họ tên đầy đủ *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">
              Ngày sinh *
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-gray-800"
            />
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!fullName.trim() || !birthDate}
          className="mt-4 w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Phân tích
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-1">
            {result.originalName}
          </h2>
          <p className="text-sm text-amber-600 mb-4">
            Normalized: {result.normalizedName} | Ngày sinh:{" "}
            {result.birthDate}
          </p>
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
    { label: "Đường đời", value: result.lifePath, desc: "Từ ngày sinh" },
    { label: "Sứ mệnh", value: result.expression, desc: "Từ họ tên" },
    { label: "Linh hồn", value: result.soulUrge, desc: "Nguyên âm" },
    { label: "Nhân cách", value: result.personality, desc: "Phụ âm" },
    { label: "Trưởng thành", value: result.maturity, desc: "Tổng hợp" },
    { label: "Ngày sinh", value: result.birthday, desc: "Ngày" },
  ];

  return (
    <div className="space-y-4 pt-4">
      {/* Compatibility */}
      <div
        className={`p-3 rounded-lg ${
          result.compatibility.level === "excellent"
            ? "bg-green-50"
            : result.compatibility.level === "good"
              ? "bg-blue-50"
              : result.compatibility.level === "neutral"
                ? "bg-yellow-50"
                : "bg-red-50"
        }`}
      >
        <p className="text-sm font-medium text-gray-800">
          Tương hợp: {result.compatibility.score}%
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {result.compatibility.description}
        </p>
      </div>

      {/* Chỉ số */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {indices.map((idx) => {
          const meaning = getMeaning(idx.value);
          return (
            <div
              key={idx.label}
              className="p-3 bg-amber-50/50 rounded-lg border border-amber-100"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-amber-600 font-medium">
                  {idx.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-900">{idx.value}</p>
              <p className="text-xs text-amber-700/70 mt-0.5">
                {meaning.name}
              </p>
              <p className="text-[10px] text-amber-500 mt-0.5">{idx.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Ý nghĩa số sứ mệnh */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-rose-50 rounded-lg">
        <h4 className="font-medium text-amber-900 text-sm mb-2">
          Số Sứ mệnh {result.expression} — {getMeaning(result.expression).name}
        </h4>
        <p className="text-xs text-amber-700/80 leading-relaxed">
          {getMeaning(result.expression).description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {getMeaning(result.expression).keywords.map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 bg-white/80 rounded text-xs text-amber-700 border border-amber-200/60"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Letter Breakdown */}
      {showLetterBreakdown && result.letterBreakdown.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-amber-800 mb-2">
            Chi tiết quy đổi chữ cái
          </h4>
          <div className="flex flex-wrap gap-1">
            {result.letterBreakdown.map((l, i) => (
              <div
                key={i}
                className={`w-10 h-14 rounded-lg flex flex-col items-center justify-center text-xs border ${
                  l.type === "vowel"
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-sky-50 border-sky-200 text-sky-700"
                }`}
              >
                <span className="font-bold text-sm">{l.letter}</span>
                <span className="text-[10px] opacity-70">{l.value}</span>
                <span className="text-[8px] opacity-50">
                  {l.type === "vowel" ? "V" : "C"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-200"></span>
              Nguyên âm (Soul Urge)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-sky-100 border border-sky-200"></span>
              Phụ âm (Personality)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
