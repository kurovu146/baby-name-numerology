// ============================================================================
// Pythagorean Numerology Engine
// ============================================================================

// Bảng quy đổi Pythagorean: A=1, B=2, ... I=9, J=1, ...
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const MASTER_NUMBERS = new Set([11, 22, 33]);

// Bảng chuyển đổi ký tự tiếng Việt → Latin
const VIETNAMESE_MAP: Record<string, string> = {
  "Ă": "A", "Â": "A", "À": "A", "Á": "A", "Ả": "A", "Ã": "A", "Ạ": "A",
  "Ằ": "A", "Ắ": "A", "Ẳ": "A", "Ẵ": "A", "Ặ": "A",
  "Ầ": "A", "Ấ": "A", "Ẩ": "A", "Ẫ": "A", "Ậ": "A",
  "Đ": "D",
  "È": "E", "É": "E", "Ẻ": "E", "Ẽ": "E", "Ẹ": "E",
  "Ê": "E", "Ề": "E", "Ế": "E", "Ể": "E", "Ễ": "E", "Ệ": "E",
  "Ì": "I", "Í": "I", "Ỉ": "I", "Ĩ": "I", "Ị": "I",
  "Ò": "O", "Ó": "O", "Ỏ": "O", "Õ": "O", "Ọ": "O",
  "Ô": "O", "Ồ": "O", "Ố": "O", "Ổ": "O", "Ỗ": "O", "Ộ": "O",
  "Ơ": "O", "Ờ": "O", "Ớ": "O", "Ở": "O", "Ỡ": "O", "Ợ": "O",
  "Ù": "U", "Ú": "U", "Ủ": "U", "Ũ": "U", "Ụ": "U",
  "Ư": "U", "Ừ": "U", "Ứ": "U", "Ử": "U", "Ữ": "U", "Ự": "U",
  "Ỳ": "Y", "Ý": "Y", "Ỷ": "Y", "Ỹ": "Y", "Ỵ": "Y",
};

// ============================================================================
// Normalize & Convert
// ============================================================================

/** Chuyển tên tiếng Việt có dấu → không dấu (uppercase) */
export function normalizeVietnamese(name: string): string {
  return name
    .toUpperCase()
    .split("")
    .map((ch) => VIETNAMESE_MAP[ch] || ch)
    .join("")
    .replace(/[^A-Z\s]/g, ""); // chỉ giữ A-Z và space
}

/** Chuyển chữ cái → số theo Pythagorean */
function letterToNumber(ch: string): number {
  return PYTHAGOREAN_MAP[ch] || 0;
}

// ============================================================================
// Rút gọn số
// ============================================================================

/** Rút gọn về 1 chữ số, giữ nguyên Master Numbers (11, 22, 33) */
export function reduceNumber(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

/** Rút gọn nhưng KHÔNG giữ Master Numbers */
function reduceToSingleDigit(n: number): number {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

// ============================================================================
// Xử lý chữ Y — vowel hay consonant
// ============================================================================

/**
 * Phân loại Y theo context:
 * - Y là nguyên âm nếu: nó là vowel duy nhất trong từ (Mary, Amy, Vy)
 *   hoặc nằm giữa 2 phụ âm (Kyle, Tyson)
 * - Y là phụ âm nếu: đứng đầu từ trước nguyên âm (Yasmine, Yến)
 *   hoặc đứng sau nguyên âm (Mickey, May)
 */
function classifyY(word: string, index: number): "vowel" | "consonant" {
  const letters = word.split("").filter((ch) => /[A-Z]/.test(ch));
  const pos = letters.indexOf("Y", 0);
  if (pos === -1) return "consonant";

  // Nếu Y là ký tự vowel duy nhất trong từ → vowel
  const otherVowels = letters.filter((ch, i) => i !== pos && VOWELS.has(ch));
  if (otherVowels.length === 0) return "vowel";

  // Y đứng đầu từ → consonant
  if (pos === 0) return "consonant";

  // Y đứng sau nguyên âm → consonant
  if (pos > 0 && VOWELS.has(letters[pos - 1])) return "consonant";

  // Y nằm giữa 2 phụ âm → vowel
  if (
    pos > 0 &&
    pos < letters.length - 1 &&
    !VOWELS.has(letters[pos - 1]) &&
    !VOWELS.has(letters[pos + 1])
  ) {
    return "vowel";
  }

  return "consonant";
}

/** Phân loại mỗi chữ cái trong tên thành vowel / consonant */
function classifyLetters(
  normalizedName: string
): { letter: string; value: number; type: "vowel" | "consonant" }[] {
  const words = normalizedName.split(/\s+/);
  const result: { letter: string; value: number; type: "vowel" | "consonant" }[] = [];

  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!/[A-Z]/.test(ch)) continue;

      const value = letterToNumber(ch);
      let type: "vowel" | "consonant";

      if (ch === "Y") {
        type = classifyY(word, i);
      } else {
        type = VOWELS.has(ch) ? "vowel" : "consonant";
      }

      result.push({ letter: ch, value, type });
    }
  }

  return result;
}

// ============================================================================
// Tính các chỉ số chính
// ============================================================================

export interface NumerologyResult {
  // Input
  originalName: string;
  normalizedName: string;
  birthDate: string; // DD/MM/YYYY

  // Các chỉ số
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  maturity: number;
  birthday: number;

  // Chi tiết tính toán
  letterBreakdown: {
    letter: string;
    value: number;
    type: "vowel" | "consonant";
  }[];

  // Tương hợp
  compatibility: {
    score: number; // 0-100
    level: "excellent" | "good" | "neutral" | "challenging";
    description: string;
  };
}

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

// ============================================================================
// Tương hợp giữa các số
// ============================================================================

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
function getPairScore(a: number, b: number): number {
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
function isSameHarmonyGroup(a: number, b: number): boolean {
  const baseA = MASTER_NUMBERS.has(a) ? reduceToSingleDigit(a) : a;
  const baseB = MASTER_NUMBERS.has(b) ? reduceToSingleDigit(b) : b;
  return HARMONY_GROUPS.some(
    (g) => g.includes(baseA) && g.includes(baseB)
  );
}

/**
 * Tính điểm tương hợp tổng hợp từ 6 chỉ số.
 *
 * Weighted scoring — 5 cặp chỉ số với trọng số khác nhau:
 *   1. Life Path ↔ Expression  (30%) — cốt lõi: sứ mệnh có hợp đường đời?
 *   2. Life Path ↔ Soul Urge   (25%) — nội tâm có đồng điệu với đường đời?
 *   3. Expression ↔ Personality (20%) — cách thể hiện bên ngoài có hỗ trợ sứ mệnh?
 *   4. Life Path ↔ Birthday     (15%) — tài năng bẩm sinh có bổ trợ?
 *   5. Life Path ↔ Maturity     (10%) — sự trưởng thành hướng về đâu?
 *
 * Bonus: +3 nếu Expression & Soul Urge cùng nhóm hài hoà (nội ngoại thống nhất)
 */
interface FullCompatibilityInput {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
}

function calcFullCompatibility(input: FullCompatibilityInput): number {
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

function getCompatibilityLevel(
  score: number
): "excellent" | "good" | "neutral" | "challenging" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "neutral";
  return "challenging";
}

function getCompatibilityDescription(level: string): string {
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

// ============================================================================
// Tính toán tổng hợp
// ============================================================================

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

  const score = calcFullCompatibility({
    lifePath, expression, soulUrge, personality, birthday, maturity,
  });
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
  };
}

// ============================================================================
// Ý nghĩa các số
// ============================================================================

export interface NumberMeaning {
  number: number;
  name: string;
  keywords: string[];
  description: string;
  strengths: string[];
  challenges: string[];
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1,
    name: "Người Tiên Phong",
    keywords: ["Lãnh đạo", "Độc lập", "Sáng tạo"],
    description:
      "Số 1 đại diện cho sự khởi đầu, lãnh đạo và quyết đoán. Người mang số 1 có tính cách độc lập, tự tin và luôn muốn đi đầu.",
    strengths: ["Quyết đoán", "Sáng tạo", "Tự tin", "Tiên phong"],
    challenges: ["Cố chấp", "Ích kỷ", "Nóng nảy"],
  },
  2: {
    number: 2,
    name: "Người Hòa Giải",
    keywords: ["Hợp tác", "Nhạy cảm", "Ngoại giao"],
    description:
      "Số 2 tượng trưng cho sự hợp tác, kiên nhẫn và nhạy cảm. Người mang số 2 giỏi lắng nghe, thấu hiểu và kết nối mọi người.",
    strengths: ["Kiên nhẫn", "Thấu hiểu", "Ngoại giao", "Hợp tác"],
    challenges: ["Thiếu quyết đoán", "Quá nhạy cảm", "Phụ thuộc"],
  },
  3: {
    number: 3,
    name: "Người Sáng Tạo",
    keywords: ["Sáng tạo", "Lạc quan", "Biểu đạt"],
    description:
      "Số 3 thể hiện sự sáng tạo, lạc quan và khả năng biểu đạt. Người mang số 3 có tài nghệ thuật, giao tiếp tốt và lan tỏa niềm vui.",
    strengths: ["Sáng tạo", "Vui vẻ", "Giao tiếp tốt", "Nghệ thuật"],
    challenges: ["Thiếu tập trung", "Phung phí", "Nông cạn"],
  },
  4: {
    number: 4,
    name: "Người Xây Dựng",
    keywords: ["Ổn định", "Kỷ luật", "Chăm chỉ"],
    description:
      "Số 4 đại diện cho sự ổn định, thực tế và kỷ luật. Người mang số 4 chăm chỉ, đáng tin cậy và xây dựng nền tảng vững chắc.",
    strengths: ["Kỷ luật", "Đáng tin cậy", "Thực tế", "Chăm chỉ"],
    challenges: ["Cứng nhắc", "Bảo thủ", "Hay lo lắng"],
  },
  5: {
    number: 5,
    name: "Người Tự Do",
    keywords: ["Tự do", "Phiêu lưu", "Linh hoạt"],
    description:
      "Số 5 tượng trưng cho tự do, phiêu lưu và sự thay đổi. Người mang số 5 năng động, tò mò và thích khám phá điều mới.",
    strengths: ["Linh hoạt", "Năng động", "Tò mò", "Thích nghi"],
    challenges: ["Bồn chồn", "Thiếu kiên nhẫn", "Thiếu cam kết"],
  },
  6: {
    number: 6,
    name: "Người Yêu Thương",
    keywords: ["Yêu thương", "Trách nhiệm", "Gia đình"],
    description:
      "Số 6 thể hiện tình yêu thương, trách nhiệm và sự chăm sóc. Người mang số 6 hướng về gia đình, giàu lòng nhân ái.",
    strengths: ["Yêu thương", "Trách nhiệm", "Chăm sóc", "Hài hòa"],
    challenges: ["Hy sinh quá mức", "Kiểm soát", "Lo lắng"],
  },
  7: {
    number: 7,
    name: "Người Trí Tuệ",
    keywords: ["Trí tuệ", "Phân tích", "Tâm linh"],
    description:
      "Số 7 đại diện cho trí tuệ, phân tích và chiều sâu tâm linh. Người mang số 7 thích tìm hiểu, suy ngẫm và khám phá chân lý.",
    strengths: ["Thông minh", "Phân tích", "Trực giác", "Sâu sắc"],
    challenges: ["Cô đơn", "Hoài nghi", "Khó gần"],
  },
  8: {
    number: 8,
    name: "Người Quyền Lực",
    keywords: ["Quyền lực", "Tham vọng", "Thành công"],
    description:
      "Số 8 tượng trưng cho quyền lực, tham vọng và thành công vật chất. Người mang số 8 có năng lực tổ chức và quản lý xuất sắc.",
    strengths: ["Tham vọng", "Tổ chức", "Thực tế", "Kiên định"],
    challenges: ["Tham lam", "Độc đoán", "Quá vật chất"],
  },
  9: {
    number: 9,
    name: "Người Nhân Đạo",
    keywords: ["Nhân đạo", "Từ bi", "Lý tưởng"],
    description:
      "Số 9 thể hiện lòng nhân đạo, sự từ bi và lý tưởng cao đẹp. Người mang số 9 có tầm nhìn rộng, vị tha và muốn cống hiến cho cộng đồng.",
    strengths: ["Vị tha", "Lý tưởng", "Sáng tạo", "Truyền cảm hứng"],
    challenges: ["Mơ mộng", "Xa rời thực tế", "Dễ thất vọng"],
  },
  11: {
    number: 11,
    name: "Bậc Thầy Trực Giác",
    keywords: ["Trực giác", "Tâm linh", "Truyền cảm hứng"],
    description:
      "Số 11 là Master Number, đại diện cho trực giác mạnh mẽ và tầm nhìn tâm linh. Người mang số 11 có khả năng truyền cảm hứng và dẫn dắt người khác.",
    strengths: ["Trực giác mạnh", "Truyền cảm hứng", "Nhạy bén", "Lý tưởng"],
    challenges: ["Căng thẳng", "Quá nhạy cảm", "Áp lực lớn"],
  },
  22: {
    number: 22,
    name: "Bậc Thầy Kiến Tạo",
    keywords: ["Kiến tạo", "Tầm nhìn", "Thực hiện"],
    description:
      "Số 22 là Master Number mạnh nhất, kết hợp tầm nhìn của 11 với khả năng thực hiện của 4. Người mang số 22 có thể biến ước mơ lớn thành hiện thực.",
    strengths: ["Tầm nhìn lớn", "Thực hiện", "Kiến tạo", "Kỷ luật"],
    challenges: ["Áp lực cực lớn", "Hoàn hảo chủ nghĩa", "Kiệt sức"],
  },
  33: {
    number: 33,
    name: "Bậc Thầy Yêu Thương",
    keywords: ["Yêu thương vô điều kiện", "Hướng dẫn", "Chữa lành"],
    description:
      "Số 33 là Master Number hiếm gặp, đại diện cho tình yêu thương vô điều kiện và sự hướng dẫn tâm linh cao nhất.",
    strengths: [
      "Yêu thương vô điều kiện",
      "Chữa lành",
      "Hướng dẫn",
      "Hy sinh",
    ],
    challenges: ["Hy sinh quá mức", "Gánh nặng trách nhiệm", "Mất cân bằng"],
  },
};

// ============================================================================
// Phân tích biệt danh (Nickname)
// ============================================================================

export interface NicknameResult {
  nickname: string;
  normalizedNickname: string;
  minorExpression: number;    // Tổng tất cả chữ cái biệt danh
  minorSoulUrge: number;      // Chỉ nguyên âm trong biệt danh
  minorPersonality: number;   // Chỉ phụ âm trong biệt danh
  letterBreakdown: {
    letter: string;
    value: number;
    type: "vowel" | "consonant";
  }[];
  // So sánh với tên khai sinh
  comparison?: {
    fullName: string;
    expressionMatch: boolean;     // Minor Expression cùng nhóm với Expression?
    soulUrgeMatch: boolean;       // Minor Soul Urge cùng nhóm với Soul Urge?
    personalityMatch: boolean;    // Minor Personality cùng nhóm với Personality?
    harmonyScore: number;         // 0-100
    level: "excellent" | "good" | "neutral" | "challenging";
    description: string;
  };
}

/**
 * Phân tích biệt danh.
 * Nếu truyền fullName + birthDate sẽ so sánh với tên khai sinh.
 */
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

export function getMeaning(n: number): NumberMeaning {
  return (
    NUMBER_MEANINGS[n] ||
    NUMBER_MEANINGS[reduceToSingleDigit(n)] || {
      number: n,
      name: "Không xác định",
      keywords: [],
      description: "",
      strengths: [],
      challenges: [],
    }
  );
}
