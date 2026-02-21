import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#af3689] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#af3689] text-white rounded-lg hover:bg-[#8f2d70] transition-colors font-medium"
          >
            Về trang chủ
          </Link>
          <Link
            href="/dat-ten"
            className="px-6 py-3 border-2 border-[#af3689] text-[#af3689] rounded-lg hover:bg-[#af3689]/10 transition-colors font-medium"
          >
            Phân tích tên bé
          </Link>
        </div>
      </div>
    </main>
  );
}
