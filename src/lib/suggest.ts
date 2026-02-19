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
  middleName?: string;
  limit?: number;
}

export function suggestNames(options: SuggestOptions): NameSuggestion[] {
  const { lastName, birthDate, gender, middleName, limit = 20 } = options;
  const lifePath = calcLifePath(birthDate);

  // Filter tên theo giới tính
  const names = VIETNAMESE_NAMES.filter(
    (n) => gender === "all" || n.gender === gender || n.gender === "unisex"
  );

  // Filter tên đệm theo giới tính
  const middles = middleName
    ? [{ name: middleName, gender: "unisex" as const }]
    : MIDDLE_NAMES.filter(
        (m) => gender === "all" || m.gender === gender || m.gender === "unisex"
      );

  const suggestions: NameSuggestion[] = [];

  for (const mid of middles) {
    for (const first of names) {
      const fullName = `${lastName} ${mid.name} ${first.name}`;
      const analysis = analyzeFullName(fullName, birthDate);

      suggestions.push({
        firstName: first.name,
        middleName: mid.name,
        fullName,
        meaning: first.meaning,
        analysis,
      });
    }
  }

  // Sort theo compatibility score (cao → thấp), rồi theo expression match
  suggestions.sort((a, b) => {
    // Primary: compatibility score
    const scoreDiff = b.analysis.compatibility.score - a.analysis.compatibility.score;
    if (scoreDiff !== 0) return scoreDiff;

    // Secondary: expression number gần life path hơn (cùng nhóm)
    return 0;
  });

  return suggestions.slice(0, limit);
}
