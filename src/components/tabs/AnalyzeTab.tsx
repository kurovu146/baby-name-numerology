"use client";

import { useState, useEffect } from "react";
import { analyzeFullName, type NumerologyResult } from "@/lib/numerology";
import { getQueryParams, setQueryParams } from "@/lib/url-params";
import type { ParentInfo } from "@/constants/ui";
import DatePicker from "@/components/shared/DatePicker";
import ParentInputFields from "@/components/shared/ParentInputFields";
import ParentCompatCards from "@/components/shared/ParentCompatCards";
import AnalysisDetail from "@/components/shared/AnalysisDetail";
import ShareButton from "@/components/shared/ShareButton";

export default function AnalyzeTab() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [withParents, setWithParents] = useState(false);
  const [parentInfo, setParentInfo] = useState<ParentInfo>({ dadName: "", dadBirth: "", momName: "", momBirth: "" });

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
    setQueryParams({ tab: "name", mode: "analyze", name: fullName.trim(), birthDate });
  }

  return (
    <div>
      <div className="result-card p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-bold text-[#af3689] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
          Phân tích tên đầy đủ
        </h2>
        <p className="text-xs text-[#888] mb-4">Nhập tên và ngày sinh để xem đầy đủ 6 chỉ số thần số học + ngũ hành.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn An" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#555] mb-1.5">Ngày sinh <span className="text-red-500">*</span></label>
            <DatePicker value={birthDate} onChange={setBirthDate} yearRange={{ min: 1900, max: 2035 }} />
          </div>
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

        <button onClick={handleAnalyze} disabled={!fullName.trim() || !birthDate} className="btn-primary mt-4 md:mt-5 w-full py-3 md:py-3.5 text-sm uppercase tracking-wider">
          Phân tích
        </button>
      </div>

      {result && (
        <div className="result-card p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="number-badge w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl">{result.expression}</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#333]">{result.originalName}</h2>
              <p className="text-xs text-[#999]">{result.normalizedName} — {result.birthDate}</p>
            </div>
          </div>
          <AnalysisDetail result={result} showLetterBreakdown showNguHanh />
          {withParents && <ParentCompatCards babyResult={result} parentInfo={parentInfo} />}
          <ShareButton name={result.originalName} birthDate={birthDate} />
        </div>
      )}
    </div>
  );
}
