import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đặt Tên Bé Bính Ngọ 2026 — Mệnh Thiên Hà Thủy | Thần Số Học",
  description:
    "Hướng dẫn đặt tên cho bé sinh năm Bính Ngọ 2026 (mệnh Thiên Hà Thủy). Tên hợp mệnh Kim, Thủy giúp bé phát triển thuận lợi. Phân tích ngũ hành, thần số học Pythagorean.",
  keywords: [
    "tên bé Bính Ngọ 2026",
    "mệnh Thiên Hà Thủy",
    "đặt tên con 2026",
    "tên hợp mệnh Thủy",
    "năm Ngọ đặt tên",
    "tên bé trai 2026",
    "tên bé gái 2026",
    "ngũ hành tên bé",
  ],
  openGraph: {
    title: "Đặt Tên Bé Bính Ngọ 2026 — Mệnh Thiên Hà Thủy",
    description:
      "Hướng dẫn đặt tên cho bé sinh năm 2026 hợp mệnh. Phân tích ngũ hành Thiên Hà Thủy & thần số học.",
  },
};

const TEN_NAM_GOI_Y = [
  { name: "Minh Khang", meaning: "Sáng suốt, khỏe mạnh — Expression số 7 (Kim) sinh Thủy" },
  { name: "Bảo Long", meaning: "Rồng quý — Expression số 8 (Kim) sinh mệnh Thủy" },
  { name: "An Phúc", meaning: "Bình an phúc lành — Expression số 9 (Thủy) đồng hành mệnh" },
  { name: "Hải Đăng", meaning: "Ngọn hải đăng — tên mang hành Thủy mạnh mẽ" },
  { name: "Quang Huy", meaning: "Quang minh huy hoàng — Expression số 7 (Kim) hỗ trợ Thủy" },
];

const TEN_NU_GOI_Y = [
  { name: "An Nhiên", meaning: "Bình an tự nhiên — tên nhẹ nhàng hợp mệnh Thủy" },
  { name: "Minh Anh", meaning: "Sáng suốt anh hoa — Expression hành Kim sinh Thủy" },
  { name: "Bảo Ngọc", meaning: "Ngọc quý — hành Kim tương sinh mệnh Thủy" },
  { name: "Khánh Vy", meaning: "Vui mừng quý phái — tên mềm mại hợp nước" },
  { name: "Thanh Trúc", meaning: "Trúc thanh cao — hành Mộc được Thủy nuôi dưỡng" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f3fa]">
      {/* Hero */}
      <header className="hero-gradient text-white text-center py-12 px-4">
        <p className="text-sm uppercase tracking-widest text-white/60 mb-2">Năm Bính Ngọ 2026</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">
          Đặt Tên Bé Mệnh Thiên Hà Thủy
        </h1>
        <p className="text-sm md:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
          Bé sinh năm 2026 thuộc mệnh Thiên Hà Thủy (nước trên trời). Tên hợp mệnh giúp bé phát triển thuận lợi, may mắn cả đời.
        </p>
        <Link
          href="/dat-ten"
          className="btn-primary inline-block mt-5 px-8 py-3 text-sm uppercase tracking-wider"
        >
          Đặt tên cho bé ngay
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Tổng quan Bính Ngọ */}
        <section className="result-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-[#af3689] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#af3689] rounded-full" />
            Bính Ngọ 2026 là gì?
          </h2>
          <div className="space-y-3 text-sm text-[#555] leading-relaxed">
            <p>
              Theo lịch Can Chi, năm 2026 là năm <strong>Bính Ngọ</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Thiên Can</strong>: Bính (丙) — thuộc hành <span className="text-red-500 font-semibold">Hỏa</span>, Dương</li>
              <li><strong>Địa Chi</strong>: Ngọ (午) — con Ngựa, thuộc hành <span className="text-red-500 font-semibold">Hỏa</span></li>
              <li><strong>Nạp Âm</strong>: <span className="text-blue-500 font-semibold">Thiên Hà Thủy</span> — nước trên trời, mưa tuôn từ thiên hà</li>
            </ul>
            <p>
              Dù Can Chi đều thuộc Hỏa, mệnh nạp âm lại là <strong>Thủy</strong>. Đây là loại nước thiên phú — mang năng lượng mềm mại nhưng lan tỏa mạnh, như mưa nuôi dưỡng vạn vật.
            </p>
          </div>
        </section>

        {/* Tính cách bé Bính Ngọ */}
        <section className="result-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-[#af3689] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#da8138] rounded-full" />
            Tính cách bé tuổi Ngọ
          </h2>
          <div className="space-y-3 text-sm text-[#555] leading-relaxed">
            <p>Bé sinh năm Ngọ thường có tính cách:</p>
            <div className="grid grid-cols-2 gap-2">
              {["Năng động, hoạt bát", "Thông minh, nhanh nhẹn", "Độc lập, tự tin", "Nhiệt huyết, lạc quan", "Sáng tạo, phóng khoáng", "Thích tự do, khám phá"].map((trait) => (
                <div key={trait} className="flex items-center gap-2 p-2 rounded-lg bg-[#faf5fc] border border-[#e8dff0]">
                  <span className="text-[#af3689] text-xs">●</span>
                  <span className="text-xs">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nguyên tắc đặt tên */}
        <section className="result-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-[#af3689] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#2196f3] rounded-full" />
            Nguyên tắc đặt tên hợp mệnh Thủy
          </h2>
          <div className="space-y-4 text-sm text-[#555] leading-relaxed">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="font-bold text-green-700 mb-1">Tên NÊN chọn:</p>
              <ul className="list-disc pl-5 space-y-1 text-green-800">
                <li><strong>Hành Kim</strong> (tương sinh → Kim sinh Thủy): Expression số 7, 8</li>
                <li><strong>Hành Thủy</strong> (đồng hành): Expression số 9</li>
                <li>Tên gợi nước, biển, mưa, sông: Hải, Bích, Thanh, Ngọc...</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="font-bold text-orange-700 mb-1">Tên CẨN THẬN:</p>
              <ul className="list-disc pl-5 space-y-1 text-orange-800">
                <li><strong>Hành Thổ</strong> (tương khắc → Thổ khắc Thủy): Expression số 5, 6</li>
                <li>Không có nghĩa là không dùng được — cần kết hợp thêm các chỉ số khác</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gợi ý tên nam */}
        <section className="result-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-[#2196f3] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#2196f3] rounded-full" />
            Gợi ý tên bé trai Bính Ngọ 2026
          </h2>
          <div className="space-y-2">
            {TEN_NAM_GOI_Y.map((t) => (
              <div key={t.name} className="flex items-start gap-3 p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-sm transition-shadow">
                <span className="number-badge w-9 h-9 text-sm shrink-0 mt-0.5">♂</span>
                <div>
                  <p className="font-bold text-[#333] text-sm">{t.name}</p>
                  <p className="text-xs text-[#777]">{t.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gợi ý tên nữ */}
        <section className="result-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-[#af3689] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#af3689] rounded-full" />
            Gợi ý tên bé gái Bính Ngọ 2026
          </h2>
          <div className="space-y-2">
            {TEN_NU_GOI_Y.map((t) => (
              <div key={t.name} className="flex items-start gap-3 p-3 rounded-lg border border-[#e8dff0] bg-white hover:shadow-sm transition-shadow">
                <span className="number-badge w-9 h-9 text-sm shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #af3689, #8a2b6d)" }}>♀</span>
                <div>
                  <p className="font-bold text-[#333] text-sm">{t.name}</p>
                  <p className="text-xs text-[#777]">{t.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-6">
          <h2 className="text-lg font-bold text-[#333] mb-3">Phân tích tên cho bé ngay</h2>
          <p className="text-sm text-[#777] mb-5">
            Dùng công cụ thần số học để tìm tên hợp mệnh nhất cho bé Bính Ngọ 2026
          </p>
          <Link
            href="/dat-ten"
            className="btn-primary inline-block px-8 py-3 text-sm uppercase tracking-wider"
          >
            Gợi ý tên ngay
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#15143e] text-white/50 text-center py-6 px-4">
        <p className="text-xs leading-relaxed max-w-lg mx-auto">
          Thông tin mang tính tham khảo dựa trên thần số học Pythagorean và ngũ hành.
          Việc đặt tên nên kết hợp ý nghĩa, phong tục gia đình và sở thích cá nhân.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/about" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Giới thiệu</Link>
          <Link href="/privacy" className="text-[10px] text-white/40 hover:text-white/70 transition-colors">Chính sách bảo mật</Link>
        </div>
        <p className="text-xs mt-2 text-white/30">© 2026 thansohoc.name.vn</p>
      </footer>
    </div>
  );
}
