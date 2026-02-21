import type { Metadata } from "next";
import Link from "next/link";
import { AdSense } from "@/components/adsense";

export const metadata: Metadata = {
  title: "Giới Thiệu | Thần Số Học Đặt Tên",
  description: "Giới thiệu về website Thần Số Học Đặt Tên — công cụ gợi ý tên cho bé dựa trên Pythagorean Numerology và Ngũ Hành.",
};

export default function AboutPage() {
  return (
    <>
      <AdSense />
      <header className="hero-gradient text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">
            Giới Thiệu
          </h1>
          <p className="text-white/70 text-sm mt-2">thansohoc.name.vn</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-sm md:prose-base max-w-none text-[#333] space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#af3689]">Về chúng tôi</h2>
            <p>
              <strong>Thần Số Học Đặt Tên</strong> là công cụ miễn phí giúp các bậc cha mẹ tìm kiếm
              tên đẹp, ý nghĩa và hợp mệnh cho bé yêu. Chúng tôi kết hợp phương pháp{" "}
              <strong>Pythagorean Numerology</strong> (thần số học phương Tây) với{" "}
              <strong>Ngũ Hành</strong> (Kim, Mộc, Thủy, Hỏa, Thổ) để đưa ra gợi ý tối ưu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">Tính năng chính</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Gợi ý tên thông minh</strong> — Tìm tên hợp mệnh dựa trên ngày sinh,
                giới tính, họ và tên đệm. Hỗ trợ lọc theo ngũ hành, điểm số.
              </li>
              <li>
                <strong>Phân tích tên chi tiết</strong> — Chấm điểm tên theo 5 chỉ số thần số học
                (Life Path, Expression, Soul Urge, Personality, Balance) kèm phân tích ngũ hành.
              </li>
              <li>
                <strong>Tương thích bố mẹ</strong> — Đánh giá mức độ hài hòa giữa tên bé với
                tên bố mẹ.
              </li>
              <li>
                <strong>So sánh tên</strong> — Đặt nhiều tên cạnh nhau để dễ dàng so sánh và lựa chọn.
              </li>
              <li>
                <strong>Biệt danh dễ thương</strong> — Gợi ý biệt danh theo nhiều chủ đề: dễ thương,
                động vật, trái cây, thiên nhiên, quốc tế.
              </li>
              <li>
                <strong>Tên kiêng gia phả</strong> — Loại bỏ tên trùng với người thân trong gia đình.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">Phương pháp tính</h2>
            <p>
              Chúng tôi sử dụng bảng chuyển đổi <strong>Pythagorean</strong> để quy đổi chữ cái
              tiếng Việt (bao gồm dấu) thành các con số từ 1-9. Từ đó tính toán các chỉ số
              numerology và đối chiếu với ngũ hành của năm sinh theo lịch Can Chi.
            </p>
            <p>
              Kết quả chỉ mang tính tham khảo. Việc đặt tên cho bé nên kết hợp nhiều yếu tố:
              ý nghĩa, phong thủy, văn hóa gia đình và sở thích cá nhân.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">Cam kết</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hoàn toàn miễn phí, không cần đăng ký</li>
              <li>Mọi tính toán thực hiện trên trình duyệt — không lưu thông tin cá nhân</li>
              <li>Không spam, không quảng cáo quá mức</li>
              <li>Liên tục cập nhật và cải thiện thuật toán</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#af3689]">Liên hệ</h2>
            <p>
              Email: <strong>contact@thansohoc.name.vn</strong>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center space-x-4">
          <Link href="/" className="text-sm text-[#af3689] hover:underline">
            ← Về trang chủ
          </Link>
          <Link href="/dat-ten" className="text-sm text-[#af3689] hover:underline">
            Đặt tên ngay →
          </Link>
        </div>
      </main>
    </>
  );
}
