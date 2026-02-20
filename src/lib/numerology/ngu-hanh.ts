import { MASTER_NUMBERS, reduceToSingleDigit } from "./core";
import type { NguHanh, CanChi, NguHanhRelation } from "./types";

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

const CAN_NGU_HANH: Record<string, NguHanh> = {
  "Giáp": "Mộc", "Ất": "Mộc",
  "Bính": "Hỏa", "Đinh": "Hỏa",
  "Mậu": "Thổ", "Kỷ": "Thổ",
  "Canh": "Kim", "Tân": "Kim",
  "Nhâm": "Thủy", "Quý": "Thủy",
};

const CHI_NGU_HANH: Record<string, NguHanh> = {
  "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc",
  "Thìn": "Thổ", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Mùi": "Thổ",
  "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy",
};

const CAN_AM_DUONG: Record<string, "Âm" | "Dương"> = {
  "Giáp": "Dương", "Ất": "Âm",
  "Bính": "Dương", "Đinh": "Âm",
  "Mậu": "Dương", "Kỷ": "Âm",
  "Canh": "Dương", "Tân": "Âm",
  "Nhâm": "Dương", "Quý": "Âm",
};

// Tương sinh: Kim → Thủy → Mộc → Hỏa → Thổ → Kim
const TUONG_SINH: Record<NguHanh, NguHanh> = {
  "Kim": "Thủy", "Thủy": "Mộc", "Mộc": "Hỏa", "Hỏa": "Thổ", "Thổ": "Kim",
};

// Tương khắc: Kim → Mộc → Thổ → Thủy → Hỏa → Kim
const TUONG_KHAC: Record<NguHanh, NguHanh> = {
  "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy", "Thủy": "Hỏa", "Hỏa": "Kim",
};

/** Tính Can Chi từ năm dương lịch */
export function calcCanChi(year: number): CanChi {
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  const can = THIEN_CAN[canIndex >= 0 ? canIndex : canIndex + 10];
  const chi = DIA_CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12];
  return {
    can,
    chi,
    nguHanh: CAN_NGU_HANH[can],
    nguHanhChi: CHI_NGU_HANH[chi],
    amDuong: CAN_AM_DUONG[can],
  };
}

/** Ngũ hành của tên dựa trên Expression Number */
export function numberToNguHanh(n: number): NguHanh {
  const base = MASTER_NUMBERS.has(n) ? reduceToSingleDigit(n) : n;
  switch (base) {
    case 1: case 2: return "Mộc";
    case 3: case 4: return "Hỏa";
    case 5: case 6: return "Thổ";
    case 7: case 8: return "Kim";
    case 9: return "Thủy";
    default: return "Thổ";
  }
}

/** Đánh giá quan hệ ngũ hành giữa tên và năm sinh */
export function calcNguHanhRelation(nameHanh: NguHanh, yearHanh: NguHanh): NguHanhRelation {
  if (nameHanh === yearHanh) {
    return { relation: "bình_hòa", description: `${nameHanh} — ${yearHanh}: Bình hòa, đồng hành`, score: 5 };
  }
  if (TUONG_SINH[yearHanh] === nameHanh) {
    return { relation: "được_sinh", description: `${yearHanh} sinh ${nameHanh}: Được sinh, thuận lợi phát triển`, score: 10 };
  }
  if (TUONG_SINH[nameHanh] === yearHanh) {
    return { relation: "tương_sinh", description: `${nameHanh} sinh ${yearHanh}: Tương sinh, hao tổn nhẹ nhưng tốt lành`, score: 3 };
  }
  if (TUONG_KHAC[yearHanh] === nameHanh) {
    return { relation: "bị_khắc", description: `${yearHanh} khắc ${nameHanh}: Bị khắc, gặp trở ngại`, score: -8 };
  }
  if (TUONG_KHAC[nameHanh] === yearHanh) {
    return { relation: "tương_khắc", description: `${nameHanh} khắc ${yearHanh}: Tương khắc nhẹ, cần cân bằng`, score: -3 };
  }
  return { relation: "bình_hòa", description: `${nameHanh} — ${yearHanh}: Bình hòa`, score: 0 };
}

export const NGU_HANH_INFO: Record<NguHanh, { emoji: string; color: string; description: string }> = {
  "Kim": { emoji: "🪙", color: "#C0A33E", description: "Kim loại, sắc bén, quyết đoán" },
  "Mộc": { emoji: "🌿", color: "#4CAF50", description: "Cây cối, sinh trưởng, nhân từ" },
  "Thủy": { emoji: "💧", color: "#2196F3", description: "Nước, linh hoạt, trí tuệ" },
  "Hỏa": { emoji: "🔥", color: "#FF5722", description: "Lửa, nhiệt huyết, lễ nghĩa" },
  "Thổ": { emoji: "🏔️", color: "#795548", description: "Đất, ổn định, trung tín" },
};
