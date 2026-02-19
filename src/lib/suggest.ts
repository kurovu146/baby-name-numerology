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
  analyzeNickname,
  type NumerologyResult,
  type NicknameResult,
} from "./numerology";
import { VIETNAMESE_NAMES, MIDDLE_NAMES, NICKNAMES, type VietnameseName } from "./names";

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
  excludeNames?: string[];  // Tên kiêng (gia phả) — loại tên chứa từ trùng
  limit?: number;
}

export function suggestNames(options: SuggestOptions): NameSuggestion[] {
  const { lastName, birthDate, gender, middleName, middleName2, excludeNames, limit = 30 } = options;

  // Normalize danh sách tên kiêng để so sánh
  const excluded = (excludeNames ?? [])
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n.length > 0);

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

      // Kiêng tên gia phả: bỏ qua nếu tên chứa từ trùng
      if (excluded.length > 0) {
        const nameLower = first.name.toLowerCase();
        if (excluded.some((ex) => nameLower === ex)) continue;
      }

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

// ============================================================================
// Nickname Suggestion Engine — Gợi ý biệt danh
// ============================================================================

export interface NicknameSuggestion {
  nickname: string;
  meaning: string;
  category: string;
  analysis: NicknameResult;
}

interface SuggestNicknameOptions {
  fullName: string;
  birthDate: string;
  gender: "male" | "female" | "all";
  limit?: number;
}

export function suggestNicknames(options: SuggestNicknameOptions): NicknameSuggestion[] {
  const { fullName, birthDate, gender, limit = 20 } = options;

  // Filter theo giới tính
  const candidates = NICKNAMES.filter(
    (n) => gender === "all" || n.gender === gender || n.gender === "unisex"
  );

  const suggestions: NicknameSuggestion[] = [];

  for (const nick of candidates) {
    const analysis = analyzeNickname(nick.name, fullName, birthDate);

    suggestions.push({
      nickname: nick.name,
      meaning: nick.meaning,
      category: nick.category,
      analysis,
    });
  }

  // Sort theo harmony score (cao → thấp)
  suggestions.sort((a, b) => {
    const scoreA = a.analysis.comparison?.harmonyScore ?? 0;
    const scoreB = b.analysis.comparison?.harmonyScore ?? 0;
    return scoreB - scoreA;
  });

  return suggestions.slice(0, limit);
}
