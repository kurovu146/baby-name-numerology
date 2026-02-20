"use client";

import { useMemo } from "react";
import { analyzeFullName } from "@/lib/numerology";
import AnalysisDetail from "./AnalysisDetail";

export default function FavoriteDetail({ fullName, birthDate }: { fullName: string; birthDate: string }) {
  const result = useMemo(() => {
    // birthDate is DD/MM/YYYY format
    return analyzeFullName(fullName, birthDate);
  }, [fullName, birthDate]);

  return <AnalysisDetail result={result} showLetterBreakdown showNguHanh />;
}
