import { reduceNumber, reduceToSingleDigit, classifyLetters } from "./core";

/** Tính Life Path Number từ ngày sinh (DD/MM/YYYY) */
export function calcLifePath(birthDate: string): number {
  const parts = birthDate.split("/");
  if (parts.length !== 3) return 0;

  const day = reduceNumber(parseInt(parts[0]) || 0);
  const month = reduceNumber(parseInt(parts[1]) || 0);
  const year = reduceNumber(
    (parts[2] || "0")
      .split("")
      .reduce((sum, d) => sum + (parseInt(d) || 0), 0)
  );

  return reduceNumber(day + month + year);
}

/** Tính Birthday Number */
export function calcBirthday(birthDate: string): number {
  const day = parseInt(birthDate.split("/")[0]) || 0;
  return reduceNumber(day);
}

/** Tính Expression Number (Số Sứ mệnh) — toàn bộ tên */
export function calcExpression(normalizedName: string): number {
  const letters = classifyLetters(normalizedName);
  const sum = letters.reduce((acc, l) => acc + l.value, 0);
  return reduceNumber(sum);
}

/** Tính Soul Urge Number (Số Linh hồn) — chỉ nguyên âm */
export function calcSoulUrge(normalizedName: string): number {
  const letters = classifyLetters(normalizedName);
  const sum = letters
    .filter((l) => l.type === "vowel")
    .reduce((acc, l) => acc + l.value, 0);
  return reduceNumber(sum);
}

/** Tính Personality Number (Số Nhân cách) — chỉ phụ âm */
export function calcPersonality(normalizedName: string): number {
  const letters = classifyLetters(normalizedName);
  const sum = letters
    .filter((l) => l.type === "consonant")
    .reduce((acc, l) => acc + l.value, 0);
  return reduceNumber(sum);
}

/** Tính Maturity Number = Life Path + Expression */
export function calcMaturity(lifePath: number, expression: number): number {
  return reduceNumber(
    reduceToSingleDigit(lifePath) + reduceToSingleDigit(expression)
  );
}
