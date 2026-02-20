import { analyzeFullName } from "./analyze";
import { getPairScore, isSameHarmonyGroup, getCompatibilityLevel } from "./compatibility";
import type { NumerologyResult, ParentCompatibilityResult } from "./types";

const PARENT_PAIRS = [
  { label: "Sứ mệnh con ↔ Đường đời bố/mẹ", babyKey: "expression",  parentKey: "lifePath",    weight: 0.35 },
  { label: "Đường đời con ↔ Sứ mệnh bố/mẹ", babyKey: "lifePath",    parentKey: "expression",  weight: 0.25 },
  { label: "Linh hồn con ↔ Linh hồn bố/mẹ", babyKey: "soulUrge",    parentKey: "soulUrge",    weight: 0.20 },
  { label: "Nhân cách con ↔ Nhân cách bố/mẹ",babyKey: "personality", parentKey: "personality", weight: 0.20 },
] as const;

const DESCRIPTIONS: Record<string, string> = {
  excellent:   "Mối liên kết rất sâu sắc! Các chỉ số cốt lõi hài hòa cao, tạo nền tảng thấu hiểu và đồng hành lâu dài.",
  good:        "Tương hợp tốt. Đa số các chỉ số cân bằng, cuộc sống gia đình hài hòa và dễ giao tiếp.",
  neutral:     "Ở mức trung bình — một số chỉ số đồng điệu, một số cần thêm sự thấu hiểu và kiên nhẫn từ cả hai phía.",
  challenging: "Có sự khác biệt về năng lượng. Đây là cơ hội để cả hai học hỏi và bổ trợ lẫn nhau, cùng trưởng thành.",
};

function calcFromResults(
  baby: NumerologyResult,
  parent: NumerologyResult,
  parentName: string,
  parentBirthDate: string,
): ParentCompatibilityResult {
  let weightedScore = 0;
  const breakdown = PARENT_PAIRS.map(({ label, babyKey, parentKey, weight }) => {
    const a = baby[babyKey] as number;
    const b = parent[parentKey] as number;
    const pairScore = getPairScore(a, b);
    weightedScore += pairScore * weight;
    return { label, babyValue: a, parentValue: b, pairScore, weight };
  });

  // Bonus: Expression con và bố/mẹ cùng harmony group
  if (isSameHarmonyGroup(baby.expression, parent.expression)) {
    weightedScore += 2;
  }

  const score = Math.min(100, Math.round(weightedScore));
  const level = getCompatibilityLevel(score);

  return {
    parentName,
    parentBirthDate,
    score,
    level,
    description: DESCRIPTIONS[level],
    breakdown,
  };
}

/** Tính tương hợp con-bố/mẹ, tự phân tích parent từ tên + ngày sinh */
export function calcParentChildCompatibility(
  baby: NumerologyResult,
  parentName: string,
  parentBirthDate: string // DD/MM/YYYY
): ParentCompatibilityResult {
  const parent = analyzeFullName(parentName, parentBirthDate);
  return calcFromResults(baby, parent, parentName, parentBirthDate);
}

/** Tính tương hợp con-bố/mẹ, dùng parent NumerologyResult đã tính sẵn (tối ưu cho batch) */
export function calcParentCompatFromResults(
  baby: NumerologyResult,
  parent: NumerologyResult,
  parentName: string,
  parentBirthDate: string,
): ParentCompatibilityResult {
  return calcFromResults(baby, parent, parentName, parentBirthDate);
}
