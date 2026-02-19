"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  analyzeNickname as analyzeNicknameFunc,
  analyzeFullName,
  calcLifePath,
  calcCanChi,
  numberToNguHanh,
  getMeaning,
  NGU_HANH_INFO,
  type NumerologyResult,
  type NicknameResult,
  type NguHanh,
} from "@/lib/numerology";
import { suggestNames, suggestNicknames, type NameSuggestion, type NicknameSuggestion } from "@/lib/suggest";
import { LAST_NAMES, VIETNAMESE_NAMES, MIDDLE_NAMES } from "@/lib/names";

// ============================================================================
// LocalStorage helpers
// ============================================================================

interface Favorite {
  fullName: string;
  birthDate: string;
  score: number;
  level: string;
  savedAt: number;
}

function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("baby-name-favorites") || "[]");
  } catch { return []; }
}

function saveFavorite(fav: Favorite): void {
  const list = getFavorites();
  if (list.some((f) => f.fullName === fav.fullName && f.birthDate === fav.birthDate)) return;
  list.push(fav);
  localStorage.setItem("baby-name-favorites", JSON.stringify(list));
}

function removeFavorite(fullName: string, birthDate: string): void {
  const list = getFavorites().filter((f) => !(f.fullName === fullName && f.birthDate === birthDate));
  localStorage.setItem("baby-name-favorites", JSON.stringify(list));
}

function isFavorited(fullName: string, birthDate: string): boolean {
  return getFavorites().some((f) => f.fullName === fullName && f.birthDate === birthDate);
}

// ============================================================================
// URL Query Params helpers
// ============================================================================

function getQueryParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((v, k) => { result[k] = v; });
  return result;
}

function setQueryParams(params: Record<string, string>): void {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  });
  window.history.replaceState({}, "", url.toString());
}

// ============================================================================
// Types
// ============================================================================

type Tab = "suggest" | "nickname" | "analyze" | "favorites";

// ============================================================================
// Main Page
// ============================================================================

export default function Home() {
  const [tab, setTab] = useState<Tab>("suggest");

  // Read initial tab from URL
  useEffect(() => {
    const params = getQueryParams();
    if (params.tab && ["suggest", "nickname", "analyze", "favorites"].includes(params.tab)) {
      setTab(params.tab as Tab);
    }
    // Auto-switch to analyze tab if name param is present
    if (params.name) {
      setTab("analyze");
    }
  }, []);

  return (
    <>
      {/* Hero Header */}
      <header className="hero-gradient text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">
            Dat Ten Be Theo Than So Hoc
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Tim ten hay, hop menh cho be yeu dua tren phuong phap Pythagorean
            Numerology ket hop Ngu Hanh
          </p>

          {/* Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { key: "suggest" as Tab, label: "Goi y ten" },
              { key: "analyze" as Tab, label: "Phan tich" },
              { key: "nickname" as Tab, label: "Biet danh" },
              { key: "favorites" as Tab, label: "Da luu" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setQueryParams({ tab: t.key }); }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all uppercase tracking-wide ${
                  tab === t.key
                    ? "bg-white text-[#af3689] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        {tab === "suggest" && <SuggestTab />}
        {tab === "analyze" && <AnalyzeTab />}
        {tab === "nickname" && <NicknameTab />}
        {tab === "favorites" && <FavoritesTab />}
      </main>

      <footer className="bg-[#15143e] text-white/60 py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs leading-relaxed">
            Ket qua chi mang tinh tham khao dua tren than so hoc Pythagorean va Ngu Hanh.
            <br />
            Viec dat ten cho be nen ket hop nhieu yeu to: y nghia, phong thuy,
            van hoa gia dinh.
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
// Tab: Goi y ten
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

  // Filter & Sort state
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<"score" | "name" | "expression">("score");
  const [filterHanh, setFilterHanh] = useState<NguHanh | "all">("all");

  // Compare state
  const [compareList, setCompareList] = useState<NameSuggestion[]>([]);
  const [showCompare, setShowCompare] = useState(false);

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

  const canChi = useMemo(() => {
    if (!birthDate) return null;
    const year = parseInt(birthDate.split("-")[0]);
    return year > 0 ? calcCanChi(year) : null;
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
      limit: 50,
    });
    setResults(suggestions);
    setSearched(true);
    setCompareList([]);
    setShowCompare(false);
  }

  // Filtered & sorted results
  const displayResults = useMemo(() => {
    let filtered = results.filter((s) => s.analysis.compatibility.score >= minScore);
    if (filterHanh !== "all") {
      filtered = filtered.filter((s) => {
        const nh = s.analysis.nguHanh;
        return nh && nh.nameHanh === filterHanh;
      });
    }
    const sorted = [...filtered];
    switch (sortBy) {
      case "name": sorted.sort((a, b) => a.fullName.localeCompare(b.fullName, "vi")); break;
      case "expression": sorted.sort((a, b) => a.analysis.expression - b.analysis.expression); break;
      default: sorted.sort((a, b) => b.analysis.compatibility.score - a.analysis.compatibility.score);
    }
    return sorted;
  }, [results, minScore, sortBy, filterHanh]);

  function toggleCompare(s: NameSuggestion) {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.fullName === s.fullName);
      if (exists) return prev.filter((c) => c.fullName !== s.fullName);
      if (prev.length >= 5) return prev;
      return [...prev, s];
    });
  }

  return (
    <div>
      {/* Form */}
      <div className="result-card p-6 mb-8">
        <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Nhap thong tin
        </h2>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ho <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="lastnames"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nguyen"
              className="input-field w-full"
            />
            <datalist id="lastnames">
              {LAST_NAMES.map((n) => (<option key={n} value={n} />))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ten dem 1
            </label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Thi, Van..."
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ten dem 2
            </label>
            <input
              type="text"
              value={middleName2}
              onChange={(e) => setMiddleName2(e.target.value)}
              placeholder="Ngoc, Minh..."
              className="input-field w-full"
            />
            <p className="text-[10px] text-[#aaa] mt-1">Cho ten 4 tu (tuy chon)</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ngay sinh du kien <span className="text-red-500">*</span>
            </label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Gioi tinh</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "all")} className="input-field w-full">
              <option value="all">Tat ca</option>
              <option value="male">Nam</option>
              <option value="female">Nu</option>
            </select>
          </div>
        </div>

        {/* Row 3: Ten kieng */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-[#555] mb-1.5">Ten kieng (gia pha)</label>
          {excludeList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {excludeList.map((name) => (
                <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#af3689]/10 text-[#af3689] text-xs font-medium rounded-full border border-[#af3689]/20">
                  {name}
                  <button type="button" onClick={() => setExcludeList((prev) => prev.filter((n) => n !== name))} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#af3689]/20 text-[#af3689] text-xs leading-none">&times;</button>
                </span>
              ))}
            </div>
          )}
          <div className="relative" ref={excludeRef}>
            <input
              type="text" value={excludeInput}
              onChange={(e) => { setExcludeInput(e.target.value); setExcludeOpen(true); }}
              onFocus={() => excludeInput.trim() && setExcludeOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && excludeInput.trim()) {
                  e.preventDefault();
                  const pick = filteredExclude.length > 0 ? filteredExclude[0] : excludeInput.trim();
                  if (!excludeList.includes(pick)) setExcludeList((prev) => [...prev, pick]);
                  setExcludeInput(""); setExcludeOpen(false);
                }
              }}
              placeholder="Go ten de tim, VD: Hung, Lan..."
              className="input-field w-full"
            />
            {excludeOpen && filteredExclude.length > 0 && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#e8dff0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredExclude.map((name) => (
                  <button key={name} type="button" className="w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-[#faf5fc] transition-colors"
                    onClick={() => { setExcludeList((prev) => [...prev, name]); setExcludeInput(""); setExcludeOpen(false); }}>
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-[#aaa] mt-1">Go ten can tranh, chon tu goi y hoac nhan Enter</p>
        </div>

        {/* Life Path + Can Chi preview */}
        {lifePath > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-[#f3e7f9] to-[#fce4f0] rounded-lg border border-[#e0c5eb]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="number-badge w-12 h-12 text-xl">{lifePath}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#af3689]">So Duong Doi (Life Path)</p>
                <p className="text-xs text-[#555]">{getMeaning(lifePath).name} — {getMeaning(lifePath).keywords.join(", ")}</p>
              </div>
              {canChi && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-[#e0c5eb]">
                  <span className="text-lg">{NGU_HANH_INFO[canChi.nguHanh].emoji}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: NGU_HANH_INFO[canChi.nguHanh].color }}>
                      {canChi.can} {canChi.chi}
                    </p>
                    <p className="text-[10px] text-[#888]">Menh {canChi.nguHanh} — {canChi.amDuong}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button onClick={handleSearch} disabled={!lastName.trim() || !birthDate} className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider">
          Tim ten hop menh
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {/* Filter & Sort bar */}
          <div className="result-card p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555]">Diem toi thieu:</label>
                <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="input-field text-xs py-1 px-2">
                  <option value={0}>Tat ca</option>
                  <option value={55}>&ge; 55</option>
                  <option value={70}>&ge; 70</option>
                  <option value={85}>&ge; 85</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555]">Sap xep:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "score" | "name" | "expression")} className="input-field text-xs py-1 px-2">
                  <option value="score">Diem cao nhat</option>
                  <option value="name">A-Z</option>
                  <option value="expression">So Su menh</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555]">Ngu hanh:</label>
                <select value={filterHanh} onChange={(e) => setFilterHanh(e.target.value as NguHanh | "all")} className="input-field text-xs py-1 px-2">
                  <option value="all">Tat ca</option>
                  <option value="Kim">Kim</option>
                  <option value="Mộc">Moc</option>
                  <option value="Thủy">Thuy</option>
                  <option value="Hỏa">Hoa</option>
                  <option value="Thổ">Tho</option>
                </select>
              </div>
              {compareList.length >= 2 && (
                <button onClick={() => setShowCompare(true)} className="ml-auto px-3 py-1.5 bg-[#af3689] text-white text-xs font-bold rounded-lg hover:bg-[#8a2b6d] transition-colors">
                  So sanh ({compareList.length})
                </button>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
            Goi y ten
            <span className="text-sm font-normal text-[#999]">({displayResults.length} ket qua)</span>
          </h2>

          {displayResults.length === 0 ? (
            <p className="text-[#999]">Khong tim thay ket qua. Hay thu thay doi tieu chi.</p>
          ) : (
            <div className="grid gap-3">
              {displayResults.map((s, i) => (
                <SuggestionCard
                  key={`${s.fullName}-${i}`}
                  suggestion={s}
                  rank={i + 1}
                  isComparing={compareList.some((c) => c.fullName === s.fullName)}
                  onToggleCompare={() => toggleCompare(s)}
                />
              ))}
            </div>
          )}

          {/* Compare Modal */}
          {showCompare && compareList.length >= 2 && (
            <CompareModal names={compareList} onClose={() => setShowCompare(false)} />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Suggestion Card (with favorite & compare)
// ============================================================================

function SuggestionCard({
  suggestion,
  rank,
  isComparing,
  onToggleCompare,
}: {
  suggestion: NameSuggestion;
  rank: number;
  isComparing: boolean;
  onToggleCompare: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [fav, setFav] = useState(false);
  const { analysis } = suggestion;
  const compat = analysis.compatibility;

  useEffect(() => {
    setFav(isFavorited(suggestion.fullName, analysis.birthDate));
  }, [suggestion.fullName, analysis.birthDate]);

  const levelConfig = {
    excellent: { text: "text-[#54a404]", label: "Rat hop" },
    good: { text: "text-[#2196f3]", label: "Hop" },
    neutral: { text: "text-[#da8138]", label: "Trung binh" },
    challenging: { text: "text-[#e60909]", label: "Thu thach" },
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
      <div className="p-4 cursor-pointer hover:bg-[#faf5fc] transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <span className="number-badge w-8 h-8 text-xs shrink-0">{rank}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#333] text-base truncate">{suggestion.fullName}</h3>
              {analysis.nguHanh && (
                <span className="text-sm" title={`Menh ten: ${analysis.nguHanh.nameHanh}`}>
                  {NGU_HANH_INFO[analysis.nguHanh.nameHanh].emoji}
                </span>
              )}
            </div>
            <p className="text-xs text-[#888] truncate">{suggestion.meaning}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={toggleFav} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#fce4f0] transition-colors" title={fav ? "Bo yeu thich" : "Luu yeu thich"}>
              <span className={`text-lg ${fav ? "text-red-500" : "text-[#ccc]"}`}>{fav ? "♥" : "♡"}</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold border transition-colors ${isComparing ? "bg-[#af3689] text-white border-[#af3689]" : "text-[#af3689] border-[#e8dff0] hover:bg-[#faf5fc]"}`}
              title="Them vao so sanh">
              {isComparing ? "✓" : "VS"}
            </button>
            <div className="text-right ml-1">
              <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
              <div className="compat-bar w-16 mt-1">
                <div className="compat-bar-fill" style={{ width: `${compat.score}%`, background: barColor }} />
              </div>
            </div>
            <span className="text-[#bbb] text-xs">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#f0e8f5]">
          <AnalysisDetail result={analysis} showNguHanh />
          <ShareButton name={suggestion.fullName} birthDate={analysis.birthDate} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compare Modal
// ============================================================================

function CompareModal({ names, onClose }: { names: NameSuggestion[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#af3689]">So sanh ten</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0e8f5] text-[#999] text-xl">&times;</button>
        </div>

        {/* Header row */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8dff0]">
                <th className="text-left py-2 px-3 text-[#999] font-semibold">Chi so</th>
                {names.map((n) => (
                  <th key={n.fullName} className="text-center py-2 px-3 font-bold text-[#333]">{n.fullName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Tuong hop", key: "score" },
                { label: "Duong Doi", key: "lifePath" },
                { label: "Su Menh", key: "expression" },
                { label: "Linh Hon", key: "soulUrge" },
                { label: "Nhan Cach", key: "personality" },
                { label: "Truong Thanh", key: "maturity" },
                { label: "Ngay Sinh", key: "birthday" },
                { label: "Ngu Hanh", key: "nguHanh" },
              ].map((row) => (
                <tr key={row.key} className="border-b border-[#f0e8f5]">
                  <td className="py-2 px-3 text-[#888] font-semibold">{row.label}</td>
                  {names.map((n) => {
                    const a = n.analysis;
                    let value: string | number = "";
                    if (row.key === "score") value = `${a.compatibility.score}%`;
                    else if (row.key === "nguHanh") value = a.nguHanh ? `${NGU_HANH_INFO[a.nguHanh.nameHanh].emoji} ${a.nguHanh.nameHanh}` : "—";
                    else value = (a as unknown as Record<string, number>)[row.key] ?? "—";
                    return <td key={n.fullName} className="text-center py-2 px-3 font-bold text-[#333]">{value}</td>;
                  })}
                </tr>
              ))}
              <tr>
                <td className="py-2 px-3 text-[#888] font-semibold">Y nghia</td>
                {names.map((n) => (
                  <td key={n.fullName} className="text-center py-2 px-3 text-xs text-[#666]">{n.meaning}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tab: Phan tich ten co san
// ============================================================================

function AnalyzeTab() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);

  // Load from URL params
  useEffect(() => {
    const params = getQueryParams();
    if (params.name) setFullName(decodeURIComponent(params.name));
    if (params.birthDate) setBirthDate(params.birthDate);
    // Auto-analyze if both params present
    if (params.name && params.birthDate) {
      const parts = params.birthDate.split("-");
      if (parts.length === 3) {
        const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        setResult(analyzeFullName(decodeURIComponent(params.name), formatted));
      }
    }
  }, []);

  function handleAnalyze() {
    if (!fullName.trim() || !birthDate) return;
    const parts = birthDate.split("-");
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const res = analyzeFullName(fullName.trim(), formatted);
    setResult(res);
    setQueryParams({ tab: "analyze", name: fullName.trim(), birthDate });
  }

  return (
    <div>
      <div className="result-card p-6 mb-8">
        <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Phan tich ten day du
        </h2>
        <p className="text-xs text-[#888] mb-4">Nhap ten va ngay sinh de xem day du 6 chi so than so hoc + ngu hanh.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Ho va ten <span className="text-red-500">*</span></label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyen Van An" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngay sinh <span className="text-red-500">*</span></label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-field w-full" />
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={!fullName.trim() || !birthDate} className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider">
          Phan tich
        </button>
      </div>

      {result && (
        <div className="result-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="number-badge w-14 h-14 text-2xl">{result.expression}</span>
            <div>
              <h2 className="text-xl font-bold text-[#333]">{result.originalName}</h2>
              <p className="text-xs text-[#999]">{result.normalizedName} — {result.birthDate}</p>
            </div>
          </div>
          <AnalysisDetail result={result} showLetterBreakdown showNguHanh />
          <ShareButton name={result.originalName} birthDate={birthDate} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Tab: Biet danh
// ============================================================================

function NicknameTab() {
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

  const CATEGORY_LABELS: Record<string, string> = {
    cute: "De thuong", animal: "Dong vat", fruit: "Trai cay", nature: "Thien nhien", english: "Tieng Anh", other: "Khac",
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode("suggest")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "suggest" ? "bg-[#af3689] text-white shadow" : "bg-white text-[#af3689] border border-[#e8dff0] hover:bg-[#faf5fc]"}`}>
          Goi y biet danh
        </button>
        <button onClick={() => setMode("analyze")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "analyze" ? "bg-[#af3689] text-white shadow" : "bg-white text-[#af3689] border border-[#e8dff0] hover:bg-[#faf5fc]"}`}>
          Phan tich biet danh
        </button>
      </div>

      {mode === "suggest" ? (
        <>
          <div className="result-card p-6 mb-8">
            <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Goi y biet danh hop menh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Nhap ten khai sinh va ngay sinh, he thong se goi y nhung biet danh co nang luong hai hoa nhat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ten khai sinh <span className="text-red-500">*</span></label>
                <input type="text" value={suggestFullName} onChange={(e) => setSuggestFullName(e.target.value)} placeholder="Nguyen Van An" className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngay sinh <span className="text-red-500">*</span></label>
                <input type="date" value={suggestBirthDate} onChange={(e) => setSuggestBirthDate(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Gioi tinh</label>
                <select value={suggestGender} onChange={(e) => setSuggestGender(e.target.value as "male" | "female" | "all")} className="input-field w-full">
                  <option value="all">Tat ca</option>
                  <option value="male">Nam</option>
                  <option value="female">Nu</option>
                </select>
              </div>
            </div>
            <button onClick={handleSuggest} disabled={!suggestFullName.trim() || !suggestBirthDate} className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider">
              Goi y biet danh
            </button>
          </div>

          {suggestSearched && (
            <div>
              <h2 className="text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
                Biet danh goi y
                <span className="text-sm font-normal text-[#999]">({suggestions.length} ket qua)</span>
              </h2>
              <div className="grid gap-3">
                {suggestions.map((s, i) => {
                  const comp = s.analysis.comparison;
                  const score = comp?.harmonyScore ?? 0;
                  const level = comp?.level ?? "neutral";
                  const barColor = level === "excellent" ? "#54a404" : level === "good" ? "#2196f3" : level === "neutral" ? "#da8138" : "#e60909";
                  const levelLabel = level === "excellent" ? "Rat hop" : level === "good" ? "Hop" : level === "neutral" ? "Trung binh" : "Thu thach";
                  return (
                    <div key={i} className="result-card p-4">
                      <div className="flex items-center gap-3">
                        <span className="number-badge w-8 h-8 text-xs shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#333] text-base">{s.nickname}</h3>
                            <span className="px-2 py-0.5 bg-[#af3689]/10 text-[#af3689] text-[10px] rounded-full">{CATEGORY_LABELS[s.category] || s.category}</span>
                          </div>
                          <p className="text-xs text-[#888]">{s.meaning}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold" style={{ color: barColor }}>{levelLabel}</span>
                          <div className="compat-bar w-16 mt-1">
                            <div className="compat-bar-fill" style={{ width: `${score}%`, background: barColor }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-[#f0e8f5]">
                        {[
                          { label: "The hien", value: s.analysis.minorExpression, color: "#af3689" },
                          { label: "Linh hon", value: s.analysis.minorSoulUrge, color: "#da8138" },
                          { label: "Nhan cach", value: s.analysis.minorPersonality, color: "#2196f3" },
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
          <div className="result-card p-6 mb-8">
            <h2 className="text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
              Phan tich biet danh
            </h2>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Biet danh anh huong den <strong>Minor Expression</strong> (cach the hien hang ngay) va <strong>Minor Soul Urge</strong> (mong muon tiem an khi duoc goi ten).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Biet danh <span className="text-red-500">*</span></label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="VD: Bong, Bin, Kuro..." className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ten khai sinh</label>
                <input type="text" value={analyzeFullNameVal} onChange={(e) => setAnalyzeFullNameVal(e.target.value)} placeholder="De so sanh (tuy chon)" className="input-field w-full" />
              </div>
            </div>
            {analyzeFullNameVal.trim() && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngay sinh</label>
                <input type="date" value={analyzeBirthDate} onChange={(e) => setAnalyzeBirthDate(e.target.value)} className="input-field w-full md:w-1/2" />
              </div>
            )}
            <button onClick={handleAnalyze} disabled={!nickname.trim()} className="btn-primary mt-5 w-full py-3.5 text-sm uppercase tracking-wider">
              Phan tich biet danh
            </button>
          </div>

          {result && (
            <div className="result-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="number-badge w-14 h-14 text-2xl">{result.minorExpression}</span>
                <div>
                  <h2 className="text-xl font-bold text-[#333]">{result.nickname}</h2>
                  <p className="text-xs text-[#999]">{result.normalizedNickname}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Minor Expression", sub: "The hien", value: result.minorExpression, color: "#af3689" },
                  { label: "Minor Soul Urge", sub: "Linh hon", value: result.minorSoulUrge, color: "#da8138" },
                  { label: "Minor Personality", sub: "Nhan cach", value: result.minorPersonality, color: "#2196f3" },
                ].map((idx) => {
                  const meaning = getMeaning(idx.value);
                  return (
                    <div key={idx.label} className="p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow">
                      <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">{idx.sub}</p>
                      <div className="flex items-center gap-2">
                        <span className="number-badge w-10 h-10 text-base" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>{idx.value}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#333] truncate">{meaning.name}</p>
                          <p className="text-[10px] text-[#aaa]">{idx.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white mb-5">
                <h4 className="font-bold text-[#af3689] text-sm mb-1">Minor Expression {result.minorExpression} — {getMeaning(result.minorExpression).name}</h4>
                <p className="text-xs text-[#666] leading-relaxed">
                  Khi duoc goi bang biet danh &ldquo;{result.nickname}&rdquo;, nang luong so {result.minorExpression} anh huong den cach be the hien hang ngay: {getMeaning(result.minorExpression).description.toLowerCase()}
                </p>
              </div>

              {result.comparison && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#555] flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    So sanh voi ten khai sinh
                  </h4>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#555]">Muc hai hoa</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: "Expression", match: result.comparison.expressionMatch },
                      { label: "Soul Urge", match: result.comparison.soulUrgeMatch },
                      { label: "Personality", match: result.comparison.personalityMatch },
                    ].map((pair) => (
                      <div key={pair.label} className={`p-3 rounded-lg border text-center ${pair.match ? "border-[#54a404]/30 bg-[#54a404]/5" : "border-[#e8dff0] bg-white"}`}>
                        <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">{pair.label}</p>
                        <span className={`text-sm font-bold ${pair.match ? "text-[#54a404]" : "text-[#da8138]"}`}>{pair.match ? "Cung nhom" : "Khac nhom"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.letterBreakdown.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
                    Chi tiet quy doi
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.letterBreakdown.map((l, i) => (
                      <div key={i} className={`w-11 h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${l.type === "vowel" ? "bg-[#af3689]/5 border-[#af3689]/30 text-[#af3689]" : "bg-[#2196f3]/5 border-[#2196f3]/30 text-[#2196f3]"}`}>
                        <span className="font-bold text-base">{l.letter}</span>
                        <span className="text-xs opacity-70">{l.value}</span>
                        <span className="text-[8px] opacity-50 uppercase">{l.type === "vowel" ? "ngam" : "phu"}</span>
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
// Tab: Da luu (Favorites)
// ============================================================================

function FavoritesTab() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemove(fullName: string, birthDate: string) {
    removeFavorite(fullName, birthDate);
    setFavorites(getFavorites());
  }

  if (favorites.length === 0) {
    return (
      <div className="result-card p-8 text-center">
        <p className="text-[#999] text-lg mb-2">Chua co ten yeu thich nao</p>
        <p className="text-xs text-[#bbb]">Nhan nut ♡ tren ket qua goi y de luu ten yeu thich tai day.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
        Ten yeu thich
        <span className="text-sm font-normal text-[#999]">({favorites.length})</span>
      </h2>

      <div className="grid gap-3">
        {favorites.map((fav, i) => {
          const levelConfig: Record<string, { text: string; label: string }> = {
            excellent: { text: "text-[#54a404]", label: "Rat hop" },
            good: { text: "text-[#2196f3]", label: "Hop" },
            neutral: { text: "text-[#da8138]", label: "Trung binh" },
            challenging: { text: "text-[#e60909]", label: "Thu thach" },
          };
          const cfg = levelConfig[fav.level] || levelConfig.neutral;
          const barColor = fav.level === "excellent" ? "#54a404" : fav.level === "good" ? "#2196f3" : fav.level === "neutral" ? "#da8138" : "#e60909";
          const isExpanded = expandedIdx === i;

          return (
            <div key={`${fav.fullName}-${fav.birthDate}`} className="result-card overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-[#faf5fc] transition-colors" onClick={() => setExpandedIdx(isExpanded ? null : i)}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#333] text-base truncate">{fav.fullName}</h3>
                    <p className="text-xs text-[#888]">{fav.birthDate}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                      <div className="compat-bar w-16 mt-1">
                        <div className="compat-bar-fill" style={{ width: `${fav.score}%`, background: barColor }} />
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleRemove(fav.fullName, fav.birthDate); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-400 hover:text-red-500" title="Xoa">
                      &times;
                    </button>
                    <span className="text-[#bbb] text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-[#f0e8f5]">
                  <FavoriteDetail fullName={fav.fullName} birthDate={fav.birthDate} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FavoriteDetail({ fullName, birthDate }: { fullName: string; birthDate: string }) {
  const result = useMemo(() => {
    // birthDate is DD/MM/YYYY format
    return analyzeFullName(fullName, birthDate);
  }, [fullName, birthDate]);

  return <AnalysisDetail result={result} showLetterBreakdown showNguHanh />;
}

// ============================================================================
// Share Button
// ============================================================================

function ShareButton({ name, birthDate }: { name: string; birthDate: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = new URL(window.location.origin);
    url.searchParams.set("tab", "analyze");
    url.searchParams.set("name", name);
    url.searchParams.set("birthDate", birthDate);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button onClick={handleCopy} className="w-full mt-4 py-2.5 px-4 rounded-lg border border-[#e8dff0] bg-white hover:bg-[#faf5fc] transition-colors text-sm text-[#af3689] font-medium flex items-center justify-center gap-2">
      {copied ? "Da copy link!" : "Chia se ket qua"}
    </button>
  );
}

// ============================================================================
// Component: Chi tiet phan tich
// ============================================================================

function AnalysisDetail({
  result,
  showLetterBreakdown = false,
  showNguHanh = false,
}: {
  result: NumerologyResult;
  showLetterBreakdown?: boolean;
  showNguHanh?: boolean;
}) {
  const indices = [
    { label: "Duong Doi", value: result.lifePath, sub: "Life Path", color: "#af3689" },
    { label: "Su Menh", value: result.expression, sub: "Expression", color: "#8a2b6d" },
    { label: "Linh Hon", value: result.soulUrge, sub: "Soul Urge", color: "#da8138" },
    { label: "Nhan Cach", value: result.personality, sub: "Personality", color: "#2196f3" },
    { label: "Truong Thanh", value: result.maturity, sub: "Maturity", color: "#54a404" },
    { label: "Ngay Sinh", value: result.birthday, sub: "Birthday", color: "#9c27b0" },
  ];

  const compatColor = result.compatibility.level === "excellent" ? "#54a404" : result.compatibility.level === "good" ? "#2196f3" : result.compatibility.level === "neutral" ? "#da8138" : "#e60909";

  return (
    <div className="space-y-5 pt-3">
      {/* Compatibility */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#faf5fc] to-[#f5f0fa] border border-[#e8dff0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-[#555]">Muc tuong hop</span>
          <span className="text-sm font-bold" style={{ color: compatColor }}>{result.compatibility.score}%</span>
        </div>
        <div className="compat-bar">
          <div className="compat-bar-fill" style={{ width: `${result.compatibility.score}%`, background: `linear-gradient(90deg, ${compatColor}, ${compatColor}cc)` }} />
        </div>
        <p className="text-xs text-[#777] mt-2 leading-relaxed">{result.compatibility.description}</p>
      </div>

      {/* Ngu Hanh */}
      {showNguHanh && result.nguHanh && (
        <div className="p-4 rounded-lg border border-[#e8dff0] bg-white">
          <h4 className="text-sm font-bold text-[#555] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#da8138] rounded-full"></span>
            Ngu Hanh
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-lg border border-[#e8dff0] text-center">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">Menh nam sinh</p>
              <span className="text-2xl">{NGU_HANH_INFO[result.nguHanh.yearHanh].emoji}</span>
              <p className="text-sm font-bold mt-1" style={{ color: NGU_HANH_INFO[result.nguHanh.yearHanh].color }}>
                {result.nguHanh.canChi.can} {result.nguHanh.canChi.chi}
              </p>
              <p className="text-[10px] text-[#888]">{result.nguHanh.yearHanh} — {result.nguHanh.canChi.amDuong}</p>
            </div>
            <div className="p-3 rounded-lg border border-[#e8dff0] text-center">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">Menh ten</p>
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

      {/* Chi so grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {indices.map((idx) => {
          const meaning = getMeaning(idx.value);
          return (
            <div key={idx.label} className="p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-md transition-shadow">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-1">{idx.label}</p>
              <div className="flex items-center gap-2">
                <span className="number-badge w-10 h-10 text-base" style={{ background: `linear-gradient(135deg, ${idx.color}, ${idx.color}cc)` }}>{idx.value}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#333] truncate">{meaning.name}</p>
                  <p className="text-[10px] text-[#aaa]">{idx.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Y nghia so su menh */}
      <div className="p-4 rounded-lg border-l-4 border-[#af3689] bg-gradient-to-r from-[#faf5fc] to-white">
        <h4 className="font-bold text-[#af3689] text-sm mb-1">So Su Menh {result.expression} — {getMeaning(result.expression).name}</h4>
        <p className="text-xs text-[#666] leading-relaxed mb-3">{getMeaning(result.expression).description}</p>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] text-[#54a404] font-semibold mb-1">Diem manh</p>
            <div className="flex flex-wrap gap-1">
              {getMeaning(result.expression).strengths.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-[#54a404]/10 text-[#54a404] text-[10px] rounded-full border border-[#54a404]/20">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#e60909] font-semibold mb-1">Thu thach</p>
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
            Chi tiet quy doi chu cai
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.letterBreakdown.map((l, i) => (
              <div key={i} className={`w-11 h-16 rounded-lg flex flex-col items-center justify-center border-2 transition-transform hover:scale-110 ${l.type === "vowel" ? "bg-[#af3689]/5 border-[#af3689]/30 text-[#af3689]" : "bg-[#2196f3]/5 border-[#2196f3]/30 text-[#2196f3]"}`}>
                <span className="font-bold text-base">{l.letter}</span>
                <span className="text-xs opacity-70">{l.value}</span>
                <span className="text-[8px] opacity-50 uppercase">{l.type === "vowel" ? "ngam" : "phu"}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-[#999]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-[#af3689]/30 bg-[#af3689]/5"></span>
              Nguyen am &rarr; Linh Hon
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-[#2196f3]/30 bg-[#2196f3]/5"></span>
              Phu am &rarr; Nhan Cach
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
