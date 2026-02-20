import { normalizeVietnamese, classifyLetters } from "./core";
import { calcLifePath, calcBirthday, calcExpression, calcSoulUrge, calcPersonality, calcMaturity } from "./indices";
import { calcFullCompatibility, getCompatibilityLevel, getCompatibilityDescription } from "./compatibility";
import { calcCanChi, numberToNguHanh, calcNguHanhRelation } from "./ngu-hanh";
import type { NumerologyResult } from "./types";

export function analyzeFullName(
  fullName: string,
  birthDate: string
): NumerologyResult {
  const normalized = normalizeVietnamese(fullName);
  const letterBreakdown = classifyLetters(normalized);

  const lifePath = calcLifePath(birthDate);
  const expression = calcExpression(normalized);
  const soulUrge = calcSoulUrge(normalized);
  const personality = calcPersonality(normalized);
  const birthday = calcBirthday(birthDate);
  const maturity = calcMaturity(lifePath, expression);

  // Ngũ Hành calculation
  const yearStr = birthDate.split("/")[2];
  const year = parseInt(yearStr) || 0;
  const canChi = year > 0 ? calcCanChi(year) : null;
  const nameHanh = numberToNguHanh(expression);
  const yearHanh = canChi?.nguHanh || "Thổ";
  const nguHanhRelation = calcNguHanhRelation(nameHanh, yearHanh);

  const baseScore = calcFullCompatibility({
    lifePath, expression, soulUrge, personality, birthday, maturity,
  });
  // Apply ngũ hành bonus/penalty
  const score = Math.max(0, Math.min(100, baseScore + nguHanhRelation.score));
  const level = getCompatibilityLevel(score);

  return {
    originalName: fullName,
    normalizedName: normalized,
    birthDate,
    lifePath,
    expression,
    soulUrge,
    personality,
    maturity,
    birthday,
    letterBreakdown,
    compatibility: {
      score,
      level,
      description: getCompatibilityDescription(level),
    },
    nguHanh: canChi ? {
      canChi,
      nameHanh,
      yearHanh,
      relation: nguHanhRelation,
    } : undefined,
  };
}
