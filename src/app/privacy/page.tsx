import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Thần Số Học Đặt Tên",
  description: "Chính sách bảo mật của website Thần Số Học Đặt Tên — thansohoc.name.vn",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="hero-gradient text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">
            Chính Sách Bảo Mật
          </h1>
          <p className="text-white/70 text-sm mt-2">Cập nhật lần cuối: 20/02/2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-sm md:prose-base max-w-none text-[#333] space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#af3689]">1. Thông tin chúng tôi thu thập</h2>
            <p>
              Website <strong>thansohoc.name.vn</strong> cung cấp công cụ gợi ý và phân tích tên cho bé
              theo thần số học. Chúng tôi <strong>không yêu cầu đăng ký tài khoản</strong> và thu thập
              tối thiểu thông tin:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thông tin nhập vào công cụ (họ tên, ngày sinh) — chỉ xử lý trên trình duyệt, <strong>không lưu trên server</strong></li>
              <li>Dữ liệu phân tích ẩn danh (lượt truy cập, lượt sử dụng) qua Plausible Analytics</li>
              <li>Tên yêu thích được lưu trong localStorage trình duyệt của bạn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">2. Cách chúng tôi sử dụng thông tin</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cung cấp kết quả gợi ý và phân tích tên theo yêu cầu</li>
              <li>Cải thiện trải nghiệm người dùng và chất lượng dịch vụ</li>
              <li>Thống kê lượt sử dụng tổng hợp (không liên kết với cá nhân)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">3. Cookies và Analytics</h2>
            <p>
              Chúng tôi sử dụng <strong>Plausible Analytics</strong> — công cụ phân tích thân thiện với
              quyền riêng tư, <strong>không sử dụng cookies</strong>, không theo dõi cá nhân, tuân thủ
              GDPR.
            </p>
            <p>
              Website có thể hiển thị quảng cáo từ Google AdSense. Google có thể sử dụng cookies
              để hiển thị quảng cáo phù hợp. Bạn có thể tắt quảng cáo cá nhân hóa tại{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#af3689] underline">
                Cài đặt quảng cáo Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">4. Bảo mật dữ liệu</h2>
            <p>
              Mọi tính toán thần số học được thực hiện <strong>hoàn toàn trên trình duyệt</strong> (client-side).
              Thông tin họ tên, ngày sinh bạn nhập <strong>không được gửi đến server</strong> hay lưu trữ
              ở bất kỳ đâu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">5. Quyền của bạn</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bạn có thể xóa dữ liệu localStorage bất kỳ lúc nào qua cài đặt trình duyệt</li>
              <li>Bạn có thể chặn cookies qua cài đặt trình duyệt</li>
              <li>Bạn có thể sử dụng website mà không cần cung cấp bất kỳ thông tin cá nhân nào</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">6. Liên hệ</h2>
            <p>
              Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua email:{" "}
              <strong>contact@thansohoc.name.vn</strong>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-[#af3689] hover:underline">
            ← Về trang chủ
          </Link>
        </div>
      </main>
    </>
  );
}
