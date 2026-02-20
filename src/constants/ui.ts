export type Tab = "name" | "nickname" | "favorites";

export const LEVEL_COLORS: Record<string, string> = {
  excellent: "#54a404",
  good: "#2196f3",
  neutral: "#da8138",
  challenging: "#e60909",
};

export const LEVEL_LABELS: Record<string, string> = {
  excellent: "Xuất sắc",
  good: "Tốt",
  neutral: "Trung bình",
  challenging: "Thử thách",
};

// Thông tin bố/mẹ dùng chung
export interface ParentInfo {
  dadName: string;
  dadBirth: string; // YYYY-MM-DD
  momName: string;
  momBirth: string; // YYYY-MM-DD
}
