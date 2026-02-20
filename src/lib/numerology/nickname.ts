import { normalizeVietnamese, classifyLetters } from "./core";
import { calcExpression, calcSoulUrge, calcPersonality } from "./indices";
import { getPairScore, isSameHarmonyGroup, getCompatibilityLevel } from "./compatibility";
import { analyzeFullName } from "./analyze";
import type { NicknameResult } from "./types";

export function analyzeNickname(
  nickname: string,
  fullName?: string,
  birthDate?: string,
): NicknameResult {
  const normalized = normalizeVietnamese(nickname);
  const letters = classifyLetters(normalized);

  const minorExpression = calcExpression(normalized);
  const minorSoulUrge = calcSoulUrge(normalized);
  const minorPersonality = calcPersonality(normalized);

  const result: NicknameResult = {
    nickname,
    normalizedNickname: normalized,
    minorExpression,
    minorSoulUrge,
    minorPersonality,
    letterBreakdown: letters,
  };

  // So sánh với tên khai sinh nếu có
  if (fullName && birthDate) {
    const fullAnalysis = analyzeFullName(fullName, birthDate);

    const expressionMatch = isSameHarmonyGroup(minorExpression, fullAnalysis.expression);
    const soulUrgeMatch = isSameHarmonyGroup(minorSoulUrge, fullAnalysis.soulUrge);
    const personalityMatch = isSameHarmonyGroup(minorPersonality, fullAnalysis.personality);

    // Tính harmony score: 3 cặp so sánh với trọng số
    const pairScores = [
      { score: getPairScore(minorExpression, fullAnalysis.expression), weight: 0.40 },
      { score: getPairScore(minorSoulUrge, fullAnalysis.soulUrge), weight: 0.35 },
      { score: getPairScore(minorPersonality, fullAnalysis.personality), weight: 0.25 },
    ];
    let harmonyScore = Math.round(
      pairScores.reduce((sum, p) => sum + p.score * p.weight, 0)
    );

    // Bonus nếu tất cả 3 cặp cùng nhóm
    if (expressionMatch && soulUrgeMatch && personalityMatch) {
      harmonyScore = Math.min(100, harmonyScore + 5);
    }

    const level = getCompatibilityLevel(harmonyScore);

    const descriptions: Record<string, string> = {
      excellent: "Biệt danh rất hài hòa với tên khai sinh! Năng lượng hàng ngày bổ trợ tuyệt vời cho bản chất bên trong.",
      good: "Biệt danh hợp với tên khai sinh. Năng lượng tương đồng, hỗ trợ tốt cho sự phát triển.",
      neutral: "Biệt danh ở mức trung bình so với tên khai sinh. Không xung đột nhưng chưa thật sự nổi bật.",
      challenging: "Biệt danh có năng lượng khác biệt so với tên khai sinh. Có thể tạo sự mâu thuẫn nhẹ trong tính cách thể hiện.",
    };

    result.comparison = {
      fullName,
      expressionMatch,
      soulUrgeMatch,
      personalityMatch,
      harmonyScore,
      level,
      description: descriptions[level] || descriptions.neutral,
    };
  }

  return result;
}
