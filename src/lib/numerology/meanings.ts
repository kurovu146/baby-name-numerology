import { reduceToSingleDigit } from "./core";
import type { NumberMeaning } from "./types";

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
