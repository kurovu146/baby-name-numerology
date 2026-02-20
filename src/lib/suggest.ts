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
  calcParentCompatFromResults,
  type NumerologyResult,
  type NicknameResult,
  type BlendedScore,
} from "./numerology";
import { SUGGEST_NAMES, MIDDLE_NAMES, NICKNAMES, type VietnameseName } from "./names";

export interface NameSuggestion {
  firstName: string;
  middleName: string;
  fullName: string;
  meaning: string;
  analysis: NumerologyResult;
  blendedScore?: BlendedScore;
}

interface ParentInput {
  dadName?: string;
  dadBirth?: string; // YYYY-MM-DD
  momName?: string;
  momBirth?: string; // YYYY-MM-DD
}

interface SuggestOptions {
  lastName: string;
  birthDate: string;
  gender: "male" | "female" | "all";
  middleName?: string;      // Tên đệm 1 (VD: Thị, Văn)
  middleName2?: string;     // Tên đệm 2 (VD: Ngọc, Minh) — cho tên 4 từ
  excludeNames?: string[];  // Tên kiêng (gia phả) — loại tên chứa từ trùng
  limit?: number;
  parentInfo?: ParentInput;
}

/** Convert YYYY-MM-DD → DD/MM/YYYY */
function toNumerologyDate(yyyymmdd: string): string {
  const [y, m, d] = yyyymmdd.split("-");
  return `${d}/${m}/${y}`;
}

// Blend ratio: 70% name harmony + 30% parent harmony
const NAME_WEIGHT = 0.70;
const PARENT_WEIGHT = 0.30;

export function suggestNames(options: SuggestOptions): NameSuggestion[] {
  const { lastName, birthDate, gender, middleName, middleName2, excludeNames, limit = 30, parentInfo } = options;

  // Normalize danh sách tên kiêng để so sánh
  const excluded = (excludeNames ?? [])
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n.length > 0);

  // Filter tên theo giới tính
  const names = SUGGEST_NAMES.filter(
    (n) => gender === "all" || n.gender === gender || n.gender === "unisex"
  );

  // Filter tên đệm theo giới tính
  const middles = middleName
    ? [{ name: middleName, gender: "male" as const }]
    : MIDDLE_NAMES.filter(
        (m) => gender === "all" || m.gender === gender
      );

  // Pre-compute parent analysis (chỉ tính 1 lần, tái sử dụng cho mọi tên)
  const dadAnalysis = (parentInfo?.dadName && parentInfo.dadBirth)
    ? analyzeFullName(parentInfo.dadName.trim(), toNumerologyDate(parentInfo.dadBirth))
    : null;
  const momAnalysis = (parentInfo?.momName && parentInfo.momBirth)
    ? analyzeFullName(parentInfo.momName.trim(), toNumerologyDate(parentInfo.momBirth))
    : null;

  const suggestions: NameSuggestion[] = [];

  for (const mid of middles) {
    for (const first of names) {
      // Ghép tên: lastName + middleName + [middleName2] + firstName
      const middlePart = middleName2
        ? `${mid.name} ${middleName2}`
        : mid.name;
      const fullName = `${lastName} ${middlePart} ${first.name}`;

      // Kiêng tên gia phả: bỏ qua nếu bất kỳ phần nào của tên trùng
      if (excluded.length > 0) {
        const parts = [mid.name, middleName2, first.name]
          .filter(Boolean)
          .flatMap((p) => p!.split(/\s+/))
          .map((p) => p.toLowerCase());
        if (parts.some((p) => excluded.includes(p))) continue;
      }

      const analysis = analyzeFullName(fullName, birthDate);

      // Tính blended score khi có parent info
      let blendedScore: BlendedScore | undefined;
      if (dadAnalysis || momAnalysis) {
        const dadScore = dadAnalysis
          ? calcParentCompatFromResults(analysis, dadAnalysis, parentInfo!.dadName!, toNumerologyDate(parentInfo!.dadBirth!)).score
          : null;
        const momScore = momAnalysis
          ? calcParentCompatFromResults(analysis, momAnalysis, parentInfo!.momName!, toNumerologyDate(parentInfo!.momBirth!)).score
          : null;

        const parentScores = [dadScore, momScore].filter((s): s is number => s !== null);
        const avgParentScore = parentScores.reduce((a, b) => a + b, 0) / parentScores.length;
        const finalScore = Math.round(
          analysis.compatibility.score * NAME_WEIGHT + avgParentScore * PARENT_WEIGHT
        );

        blendedScore = {
          finalScore,
          nameScore: analysis.compatibility.score,
          parentScore: Math.round(avgParentScore),
          parentBreakdown: {
            ...(dadScore !== null && { dadScore }),
            ...(momScore !== null && { momScore }),
          },
        };
      }

      suggestions.push({
        firstName: first.name,
        middleName: middlePart,
        fullName,
        meaning: first.meaning,
        analysis,
        blendedScore,
      });
    }
  }

  // Sort theo blended score (nếu có) hoặc compatibility score
  suggestions.sort((a, b) => {
    const scoreA = a.blendedScore?.finalScore ?? a.analysis.compatibility.score;
    const scoreB = b.blendedScore?.finalScore ?? b.analysis.compatibility.score;
    return scoreB - scoreA;
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
