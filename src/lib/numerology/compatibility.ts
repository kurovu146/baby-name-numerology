import { MASTER_NUMBERS, reduceToSingleDigit } from "./core";

// 3 nhóm hài hòa tự nhiên
const HARMONY_GROUPS: number[][] = [
  [1, 5, 7], // Độc lập, tự do, trí tuệ
  [2, 4, 8], // Ổn định, thực tế, tổ chức
  [3, 6, 9], // Sáng tạo, yêu thương, nhân đạo
];

// Ma trận tương hợp chi tiết (1-9 x 1-9)
const COMPATIBILITY_MATRIX: Record<string, number> = {
  "1-1": 70, "1-2": 60, "1-3": 85, "1-4": 55, "1-5": 90, "1-6": 65,
  "1-7": 80, "1-8": 75, "1-9": 80,
  "2-2": 75, "2-3": 70, "2-4": 85, "2-5": 55, "2-6": 90, "2-7": 60,
  "2-8": 80, "2-9": 75,
  "3-3": 70, "3-4": 55, "3-5": 85, "3-6": 90, "3-7": 65, "3-8": 60,
  "3-9": 90,
  "4-4": 70, "4-5": 55, "4-6": 75, "4-7": 65, "4-8": 90, "4-9": 60,
  "5-5": 65, "5-6": 55, "5-7": 85, "5-8": 60, "5-9": 80,
  "6-6": 75, "6-7": 55, "6-8": 70, "6-9": 90,
  "7-7": 65, "7-8": 55, "7-9": 75,
  "8-8": 70, "8-9": 65,
  "9-9": 75,
};

/** Tra điểm tương hợp giữa 2 số từ ma trận */
export function getPairScore(a: number, b: number): number {
  const baseA = MASTER_NUMBERS.has(a) ? reduceToSingleDigit(a) : a;
  const baseB = MASTER_NUMBERS.has(b) ? reduceToSingleDigit(b) : b;
  const key =
    baseA <= baseB ? `${baseA}-${baseB}` : `${baseB}-${baseA}`;
  const score = COMPATIBILITY_MATRIX[key] ?? 65;

  // Master Number bonus
  if (MASTER_NUMBERS.has(a) || MASTER_NUMBERS.has(b)) {
    return Math.min(100, score + 5);
  }
  return score;
}

/** Kiểm tra 2 số có cùng nhóm hài hoà không */
export function isSameHarmonyGroup(a: number, b: number): boolean {
  const baseA = MASTER_NUMBERS.has(a) ? reduceToSingleDigit(a) : a;
  const baseB = MASTER_NUMBERS.has(b) ? reduceToSingleDigit(b) : b;
  return HARMONY_GROUPS.some(
    (g) => g.includes(baseA) && g.includes(baseB)
  );
}

interface FullCompatibilityInput {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
}

export function calcFullCompatibility(input: FullCompatibilityInput): number {
  const { lifePath, expression, soulUrge, personality, birthday, maturity } = input;

  const pairs: { a: number; b: number; weight: number }[] = [
    { a: lifePath, b: expression, weight: 0.30 },
    { a: lifePath, b: soulUrge, weight: 0.25 },
    { a: expression, b: personality, weight: 0.20 },
    { a: lifePath, b: birthday, weight: 0.15 },
    { a: lifePath, b: maturity, weight: 0.10 },
  ];

  let weightedScore = 0;
  for (const { a, b, weight } of pairs) {
    weightedScore += getPairScore(a, b) * weight;
  }

  // Bonus: Expression & Soul Urge cùng nhóm → nội ngoại thống nhất
  if (isSameHarmonyGroup(expression, soulUrge)) {
    weightedScore += 3;
  }

  return Math.min(100, Math.round(weightedScore));
}

export function getCompatibilityLevel(
  score: number
): "excellent" | "good" | "neutral" | "challenging" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "neutral";
  return "challenging";
}

export function getCompatibilityDescription(level: string): string {
  const descriptions: Record<string, string> = {
    excellent:
      "Tên và ngày sinh rất hài hòa! Tất cả 6 chỉ số bổ trợ lẫn nhau, tạo nền tảng vững chắc cho sự phát triển toàn diện.",
    good:
      "Tên và ngày sinh tương hợp tốt. Đa số các chỉ số cân bằng, phù hợp cho sự phát triển.",
    neutral:
      "Tên và ngày sinh ở mức trung bình. Một số chỉ số hài hòa, một số cần bổ trợ thêm từ môi trường và giáo dục.",
    challenging:
      "Tên và ngày sinh có sự khác biệt giữa các chỉ số. Tuy nhiên đây có thể là động lực giúp bé vượt qua thử thách và trưởng thành.",
  };
  return descriptions[level] || descriptions.neutral;
}
