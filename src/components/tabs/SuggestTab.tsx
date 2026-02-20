"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  calcLifePath,
  calcCanChi,
  getMeaning,
  NGU_HANH_INFO,
  type NguHanh,
} from "@/lib/numerology";
import { suggestNames, type NameSuggestion } from "@/lib/suggest";
import { LAST_NAMES, VIETNAMESE_NAMES, MIDDLE_NAMES } from "@/lib/names";
import type { ParentInfo } from "@/constants/ui";
import DatePicker from "@/components/shared/DatePicker";
import ParentInputFields from "@/components/shared/ParentInputFields";
import SuggestionCard from "@/components/shared/SuggestionCard";
import CompareModal from "@/components/shared/CompareModal";

export default function SuggestTab() {
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

  // Parent compatibility state
  const [withParents, setWithParents] = useState(false);
  const [parentInfo, setParentInfo] = useState<ParentInfo>({ dadName: "", dadBirth: "", momName: "", momBirth: "" });

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
      parentInfo: withParents ? {
        dadName: parentInfo.dadName.trim() || undefined,
        dadBirth: parentInfo.dadBirth || undefined,
        momName: parentInfo.momName.trim() || undefined,
        momBirth: parentInfo.momBirth || undefined,
      } : undefined,
    });
    setResults(suggestions);
    setSearched(true);
    setCompareList([]);
    setShowCompare(false);
  }

  // Filtered & sorted results
  const displayResults = useMemo(() => {
    let filtered = results.filter((s) => {
      const score = s.blendedScore?.finalScore ?? s.analysis.compatibility.score;
      return score >= minScore;
    });
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
      default: sorted.sort((a, b) => {
        const scoreA = a.blendedScore?.finalScore ?? a.analysis.compatibility.score;
        const scoreB = b.blendedScore?.finalScore ?? b.analysis.compatibility.score;
        return scoreB - scoreA;
      });
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
      <div className="result-card p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Nhập thông tin
        </h2>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
              {LAST_NAMES.map((n) => (<option key={n} value={n} />))}
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
            <p className="text-[10px] text-[#aaa] mt-1">Cho tên 4 từ (tùy chọn)</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">
              Ngày sinh dự kiến <span className="text-red-500">*</span>
            </label>
            <DatePicker value={birthDate} onChange={setBirthDate} yearRange={{ min: 2020, max: 2035 }} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Giới tính</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female" | "all")} className="input-field w-full">
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        {/* Row 3: Tên kiêng */}
        <div className="mt-3 md:mt-4">
          <label className="block text-sm font-semibold text-[#555] mb-1.5">Tên kiêng (gia phả)</label>
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
              placeholder="Gõ tên để tìm, VD: Hùng, Lan..."
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
          <p className="text-[10px] text-[#aaa] mt-1">Gõ tên cần tránh, chọn từ gợi ý hoặc nhấn Enter</p>
        </div>

        {/* Checkbox: Hợp mệnh với bố/mẹ */}
        <div className="mt-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withParents}
              onChange={(e) => setWithParents(e.target.checked)}
              className="w-4 h-4 accent-[#af3689] cursor-pointer"
            />
            <span className="text-sm font-semibold text-[#555]">Tính hợp mệnh với bố/mẹ</span>
          </label>
          {withParents && <ParentInputFields info={parentInfo} onChange={setParentInfo} />}
        </div>

        {/* Life Path + Can Chi preview — luôn hiển thị để tránh layout jump */}
        <div className="mt-4 p-3 md:p-4 bg-gradient-to-r from-[#f3e7f9] to-[#fce4f0] rounded-lg border border-[#e0c5eb] min-h-[60px]">
          {lifePath > 0 ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="number-badge w-11 h-11 md:w-12 md:h-12 text-lg md:text-xl shrink-0">{lifePath}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#af3689]">Số Đường Đời (Life Path)</p>
                <p className="text-xs text-[#555]">{getMeaning(lifePath).name} — {getMeaning(lifePath).keywords.join(", ")}</p>
              </div>
              {canChi && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-[#e0c5eb]">
                  <span className="text-lg">{NGU_HANH_INFO[canChi.nguHanh].emoji}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: NGU_HANH_INFO[canChi.nguHanh].color }}>
                      {canChi.can} {canChi.chi}
                    </p>
                    <p className="text-[10px] text-[#888]">Mệnh {canChi.nguHanh} — {canChi.amDuong}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#bbb] italic">Nhập ngày sinh để xem Số Đường Đời và Mệnh</p>
          )}
        </div>

        <button onClick={handleSearch} disabled={!lastName.trim() || !birthDate} className="btn-primary mt-4 md:mt-5 w-full py-3 md:py-3.5 text-sm uppercase tracking-wider">
          Tìm tên hợp mệnh
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {/* Filter & Sort bar */}
          <div className="result-card p-3 md:p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555] whitespace-nowrap w-24 sm:w-auto">Điểm tối thiểu:</label>
                <select value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="input-field text-xs py-1 px-2 flex-1">
                  <option value={0}>Tất cả</option>
                  <option value={45}>&ge; 45</option>
                  <option value={65}>&ge; 65</option>
                  <option value={82}>&ge; 82</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555] whitespace-nowrap w-24 sm:w-auto">Sắp xếp:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "score" | "name" | "expression")} className="input-field text-xs py-1 px-2 flex-1">
                  <option value="score">Điểm cao nhất</option>
                  <option value="name">A-Z</option>
                  <option value="expression">Số Sứ mệnh</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#555] whitespace-nowrap w-24 sm:w-auto">Ngũ hành:</label>
                <select value={filterHanh} onChange={(e) => setFilterHanh(e.target.value as NguHanh | "all")} className="input-field text-xs py-1 px-2 flex-1">
                  <option value="all">Tất cả</option>
                  <option value="Kim">Kim</option>
                  <option value="Mộc">Mộc</option>
                  <option value="Thủy">Thủy</option>
                  <option value="Hỏa">Hỏa</option>
                  <option value="Thổ">Thổ</option>
                </select>
              </div>
              {compareList.length >= 2 && (
                <button onClick={() => setShowCompare(true)} className="sm:col-span-3 md:col-auto md:ml-auto px-3 py-2 bg-[#af3689] text-white text-xs font-bold rounded-lg hover:bg-[#8a2b6d] transition-colors w-full sm:w-auto">
                  So sánh ({compareList.length})
                </button>
              )}
            </div>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#da8138] rounded-full"></span>
            Gợi ý tên
            <span className="text-sm font-normal text-[#999]">({displayResults.length} kết quả)</span>
          </h2>

          {displayResults.length === 0 ? (
            <p className="text-[#999]">Không tìm thấy kết quả. Hãy thử thay đổi tiêu chí.</p>
          ) : (
            <div className="grid gap-3">
              {displayResults.map((s, i) => (
                <SuggestionCard
                  key={`${s.fullName}-${i}`}
                  suggestion={s}
                  rank={i + 1}
                  isComparing={compareList.some((c) => c.fullName === s.fullName)}
                  onToggleCompare={() => toggleCompare(s)}
                  parentInfo={withParents ? parentInfo : null}
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
