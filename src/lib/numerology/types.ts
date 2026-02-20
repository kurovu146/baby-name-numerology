export type NguHanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

export interface CanChi {
  can: string;
  chi: string;
  nguHanh: NguHanh;
  nguHanhChi: NguHanh;
  amDuong: "Âm" | "Dương";
}

export interface NguHanhRelation {
  relation: "tương_sinh" | "được_sinh" | "tương_khắc" | "bị_khắc" | "bình_hòa";
  description: string;
  score: number; // bonus/penalty cho compatibility
}

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

  // Ngũ Hành
  nguHanh?: {
    canChi: CanChi;
    nameHanh: NguHanh;
    yearHanh: NguHanh;
    relation: NguHanhRelation;
  };
}

export interface ParentCompatibilityResult {
  parentName: string;
  parentBirthDate: string;
  score: number; // 0-100
  level: "excellent" | "good" | "neutral" | "challenging";
  description: string;
  breakdown: {
    label: string;
    babyValue: number;
    parentValue: number;
    pairScore: number;
    weight: number;
  }[];
}

export interface NumberMeaning {
  number: number;
  name: string;
  keywords: string[];
  description: string;
  strengths: string[];
  challenges: string[];
}

export interface NicknameResult {
  nickname: string;
  normalizedNickname: string;
  minorExpression: number;
  minorSoulUrge: number;
  minorPersonality: number;
  letterBreakdown: {
    letter: string;
    value: number;
    type: "vowel" | "consonant";
  }[];
  comparison?: {
    fullName: string;
    expressionMatch: boolean;
    soulUrgeMatch: boolean;
    personalityMatch: boolean;
    harmonyScore: number;
    level: "excellent" | "good" | "neutral" | "challenging";
    description: string;
  };
}
