"use client";

import { useState, useEffect } from "react";
import { getFavorites, removeFavorite, type Favorite } from "@/lib/favorites";
import FavoriteDetail from "@/components/shared/FavoriteDetail";

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemove(fullName: string, birthDate: string) {
    removeFavorite(fullName, birthDate);
    setFavorites(getFavorites());
  }

  if (favorites.length === 0) {
    return (
      <div className="result-card p-8 text-center">
        <p className="text-[#999] text-lg mb-2">Chưa có tên yêu thích nào</p>
        <p className="text-xs text-[#bbb]">Nhấn nút ♡ trên kết quả gợi ý để lưu tên yêu thích tại đây.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-[#555] mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#af3689] rounded-full"></span>
        Tên yêu thích
        <span className="text-sm font-normal text-[#999]">({favorites.length})</span>
      </h2>

      <div className="grid gap-3">
        {favorites.map((fav, i) => {
          const levelConfig: Record<string, { text: string; label: string }> = {
            excellent: { text: "text-[#54a404]", label: "Rất hợp" },
            good: { text: "text-[#2196f3]", label: "Hợp" },
            neutral: { text: "text-[#da8138]", label: "Trung bình" },
            challenging: { text: "text-[#e60909]", label: "Thử thách" },
          };
          const cfg = levelConfig[fav.level] || levelConfig.neutral;
          const barColor = fav.level === "excellent" ? "#54a404" : fav.level === "good" ? "#2196f3" : fav.level === "neutral" ? "#da8138" : "#e60909";
          const isExpanded = expandedIdx === i;

          return (
            <div key={`${fav.fullName}-${fav.birthDate}`} className="result-card overflow-hidden">
              <div className="p-3 md:p-4 cursor-pointer hover:bg-[#faf5fc] transition-colors" onClick={() => setExpandedIdx(isExpanded ? null : i)}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#333] text-sm md:text-base truncate">{fav.fullName}</h3>
                    <p className="text-xs text-[#888]">{fav.birthDate}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                      <div className="compat-bar w-14 md:w-16 mt-1">
                        <div className="compat-bar-fill" style={{ width: `${fav.score}%`, background: barColor }} />
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleRemove(fav.fullName, fav.birthDate); }} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-400 hover:text-red-500" title="Xóa">
                      &times;
                    </button>
                    <span className="text-[#bbb] text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="animate-expand px-3 md:px-4 pb-4 border-t border-[#f0e8f5]">
                  <FavoriteDetail fullName={fav.fullName} birthDate={fav.birthDate} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
