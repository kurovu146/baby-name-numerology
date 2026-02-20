import { MASTER_NUMBERS, reduceToSingleDigit } from "./core";

// 3 nhóm hài hòa tự nhiên
const HARMONY_GROUPS: number[][] = [
  [1, 5, 7], // Độc lập, tự do, trí tuệ
  [2, 4, 8], // Ổn định, thực tế, tổ chức
  [3, 6, 9], // Sáng tạo, yêu thương, nhân đạo
];

// Ma trận tương hợp chi tiết (1-9 x 1-9), range 30-90
const COMPATIBILITY_MATRIX: Record<string, number> = {
  "1-1": 55, "1-2": 42, "1-3": 78, "1-4": 35, "1-5": 90, "1-6": 48,
  "1-7": 72, "1-8": 65, "1-9": 70,
  "2-2": 60, "2-3": 55, "2-4": 80, "2-5": 35, "2-6": 88, "2-7": 40,
  "2-8": 72, "2-9": 62,
  "3-3": 55, "3-4": 35, "3-5": 78, "3-6": 88, "3-7": 45, "3-8": 40,
  "3-9": 88,
  "4-4": 55, "4-5": 33, "4-6": 62, "4-7": 48, "4-8": 88, "4-9": 40,
  "5-5": 48, "5-6": 33, "5-7": 80, "5-8": 38, "5-9": 72,
  "6-6": 62, "6-7": 35, "6-8": 55, "6-9": 88,
  "7-7": 48, "7-8": 30, "7-9": 62,
  "8-8": 55, "8-9": 48,
  "9-9": 62,
};

/** Tra điểm tương hợp giữa 2 số từ ma trận */
export function getPairScore(a: number, b: number): number {
  const baseA = MASTER_NUMBERS.has(a) ? reduceToSingleDigit(a) : a;
  const baseB = MASTER_NUMBERS.has(b) ? reduceToSingleDigit(b) : b;
  const key =
    baseA <= baseB ? `${baseA}-${baseB}` : `${baseB}-${baseA}`;
  const score = COMPATIBILITY_MATRIX[key] ?? 50;

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
    weightedScore += 2;
  }

  return Math.min(100, Math.round(weightedScore));
}

export function getCompatibilityLevel(
  score: number
): "excellent" | "good" | "neutral" | "challenging" {
  if (score >= 82) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "neutral";
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
