// ============================================================================
// Name Suggestion Engine — Gợi ý tên dựa trên thần số học
// ============================================================================

import {
  normalizeVietnamese,
  calcLifePath,
  calcExpression,
  calcSoulUrge,
  calcPersonality,
  analyzeFullName,
  type NumerologyResult,
} from "./numerology";
import { VIETNAMESE_NAMES, MIDDLE_NAMES, type VietnameseName } from "./names";

export interface NameSuggestion {
  firstName: string;
  middleName: string;
  fullName: string;
  meaning: string;
  analysis: NumerologyResult;
}

interface SuggestOptions {
  lastName: string;
  birthDate: string;
  gender: "male" | "female" | "all";
  middleName?: string;      // Tên đệm 1 (VD: Thị, Văn)
  middleName2?: string;     // Tên đệm 2 (VD: Ngọc, Minh) — cho tên 4 từ
  limit?: number;
}

export function suggestNames(options: SuggestOptions): NameSuggestion[] {
  const { lastName, birthDate, gender, middleName, middleName2, limit = 30 } = options;

  // Filter tên theo giới tính
  const names = VIETNAMESE_NAMES.filter(
    (n) => gender === "all" || n.gender === gender || n.gender === "unisex"
  );

  // Filter tên đệm theo giới tính
  const middles = middleName
    ? [{ name: middleName, gender: "male" as const }]
    : MIDDLE_NAMES.filter(
        (m) => gender === "all" || m.gender === gender
      );

  const suggestions: NameSuggestion[] = [];

  for (const mid of middles) {
    for (const first of names) {
      // Ghép tên: lastName + middleName + [middleName2] + firstName
      const middlePart = middleName2
        ? `${mid.name} ${middleName2}`
        : mid.name;
      const fullName = `${lastName} ${middlePart} ${first.name}`;
      const analysis = analyzeFullName(fullName, birthDate);

      suggestions.push({
        firstName: first.name,
        middleName: middlePart,
        fullName,
        meaning: first.meaning,
        analysis,
      });
    }
  }

  // Sort theo compatibility score (cao → thấp)
  suggestions.sort((a, b) => {
    return b.analysis.compatibility.score - a.analysis.compatibility.score;
  });

  return suggestions.slice(0, limit);
}
