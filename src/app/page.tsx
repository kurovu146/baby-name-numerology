"use client";

import { useState, useEffect } from "react";
import { getQueryParams, setQueryParams } from "@/lib/url-params";
import { type Tab } from "@/constants/ui";
import NameTab from "@/components/tabs/NameTab";
import NicknameTab from "@/components/tabs/NicknameTab";
import FavoritesTab from "@/components/tabs/FavoritesTab";

export default function Home() {
  const [tab, setTab] = useState<Tab>("name");

  // Read initial tab from URL
  useEffect(() => {
    const params = getQueryParams();
    if (params.tab && ["name", "nickname", "favorites"].includes(params.tab)) {
      setTab(params.tab as Tab);
    }
    // Legacy: suggest/analyze → name tab
    if (params.tab === "suggest" || params.tab === "analyze" || params.name) {
      setTab("name");
    }
  }, []);

  return (
    <>
      {/* Hero Header */}
      <header className="hero-gradient text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 drop-shadow-md leading-tight">
            Đặt Tên Bé Theo Thần Số Học
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Tìm tên hay, hợp mệnh cho bé yêu dựa trên phương pháp Pythagorean
            Numerology kết hợp Ngũ Hành
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 max-w-xs mx-auto md:max-w-none md:flex md:flex-wrap md:justify-center md:gap-2">
            {[
              { key: "name" as Tab, label: "Tên" },
              { key: "nickname" as Tab, label: "Biệt danh" },
              { key: "favorites" as Tab, label: "Đã lưu" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setQueryParams({ tab: t.key }); }}
                className={`px-2 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all text-center ${
                  tab === t.key
                    ? "bg-white text-[#af3689] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8 flex-1 w-full">
        {tab === "name" && <NameTab />}
        {tab === "nickname" && <NicknameTab />}
        {tab === "favorites" && <FavoritesTab />}
      </main>

      <footer className="bg-[#15143e] text-white/60 py-6 md:py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs leading-relaxed">
            Kết quả chỉ mang tính tham khảo dựa trên thần số học Pythagorean và Ngũ Hành.
            <br />
            Việc đặt tên cho bé nên kết hợp nhiều yếu tố: ý nghĩa, phong thủy,
            văn hóa gia đình.
          </p>
          <p className="text-[10px] text-white/30 mt-4">
            &copy; 2026 Baby Name Numerology
          </p>
        </div>
      </footer>
    </>
  );
}
