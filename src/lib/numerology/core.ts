// Bảng quy đổi Pythagorean: A=1, B=2, ... I=9, J=1, ...
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);
export const MASTER_NUMBERS = new Set([11, 22, 33]);

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
export function reduceToSingleDigit(n: number): number {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

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
export function classifyLetters(
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
