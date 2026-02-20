import { analyzeFullName } from "./analyze";
import { getPairScore, isSameHarmonyGroup, getCompatibilityLevel } from "./compatibility";
import type { NumerologyResult, ParentCompatibilityResult } from "./types";

export function calcParentChildCompatibility(
  baby: NumerologyResult,
  parentName: string,
  parentBirthDate: string // DD/MM/YYYY
): ParentCompatibilityResult {
  const parent = analyzeFullName(parentName, parentBirthDate);

  const pairs: { label: string; a: number; b: number; weight: number }[] = [
    { label: "Sứ mệnh con ↔ Đường đời bố/mẹ", a: baby.expression,  b: parent.lifePath,    weight: 0.35 },
    { label: "Đường đời con ↔ Sứ mệnh bố/mẹ", a: baby.lifePath,    b: parent.expression,  weight: 0.25 },
    { label: "Linh hồn con ↔ Linh hồn bố/mẹ", a: baby.soulUrge,    b: parent.soulUrge,    weight: 0.20 },
    { label: "Nhân cách con ↔ Nhân cách bố/mẹ",a: baby.personality, b: parent.personality, weight: 0.20 },
  ];

  let weightedScore = 0;
  const breakdown = pairs.map(({ label, a, b, weight }) => {
    const pairScore = getPairScore(a, b);
    weightedScore += pairScore * weight;
    return { label, babyValue: a, parentValue: b, pairScore, weight };
  });

  // Bonus: Expression con và bố/mẹ cùng harmony group
  if (isSameHarmonyGroup(baby.expression, parent.expression)) {
    weightedScore += 3;
  }

  const score = Math.min(100, Math.round(weightedScore));
  const level = getCompatibilityLevel(score);

  const descriptions: Record<string, string> = {
    excellent:   "Mối liên kết rất sâu sắc! Các chỉ số cốt lõi hài hòa cao, tạo nền tảng thấu hiểu và đồng hành lâu dài.",
    good:        "Tương hợp tốt. Đa số các chỉ số cân bằng, cuộc sống gia đình hài hòa và dễ giao tiếp.",
    neutral:     "Ở mức trung bình — một số chỉ số đồng điệu, một số cần thêm sự thấu hiểu và kiên nhẫn từ cả hai phía.",
    challenging: "Có sự khác biệt về năng lượng. Đây là cơ hội để cả hai học hỏi và bổ trợ lẫn nhau, cùng trưởng thành.",
  };

  return {
    parentName,
    parentBirthDate,
    score,
    level,
    description: descriptions[level],
    breakdown,
  };
}
