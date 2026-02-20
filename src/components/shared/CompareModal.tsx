"use client";

import { NGU_HANH_INFO } from "@/lib/numerology";
import type { NameSuggestion } from "@/lib/suggest";

export default function CompareModal({ names, onClose }: { names: NameSuggestion[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] md:max-h-[85vh] overflow-auto p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-[#af3689]">So sánh tên</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0e8f5] text-[#999] text-xl">&times;</button>
        </div>

        {/* Header row */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8dff0]">
                <th className="text-left py-2 px-2 md:px-3 text-[#999] font-semibold text-xs md:text-sm">Chỉ số</th>
                {names.map((n) => (
                  <th key={n.fullName} className="text-center py-2 px-2 md:px-3 font-bold text-[#333] text-xs md:text-sm">{n.fullName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Tương hợp", key: "score" },
                { label: "Đường Đời", key: "lifePath" },
                { label: "Sứ Mệnh", key: "expression" },
                { label: "Linh Hồn", key: "soulUrge" },
                { label: "Nhân Cách", key: "personality" },
                { label: "Trưởng Thành", key: "maturity" },
                { label: "Ngày Sinh", key: "birthday" },
                { label: "Ngũ Hành", key: "nguHanh" },
              ].map((row) => (
                <tr key={row.key} className="border-b border-[#f0e8f5]">
                  <td className="py-2 px-2 md:px-3 text-[#888] font-semibold text-xs md:text-sm">{row.label}</td>
                  {names.map((n) => {
                    const a = n.analysis;
                    let value: string | number = "";
                    if (row.key === "score") value = `${n.blendedScore?.finalScore ?? a.compatibility.score}%`;
                    else if (row.key === "nguHanh") value = a.nguHanh ? `${NGU_HANH_INFO[a.nguHanh.nameHanh].emoji} ${a.nguHanh.nameHanh}` : "—";
                    else value = (a as unknown as Record<string, number>)[row.key] ?? "—";
                    return <td key={n.fullName} className="text-center py-2 px-2 md:px-3 font-bold text-[#333] text-xs md:text-sm">{value}</td>;
                  })}
                </tr>
              ))}
              <tr>
                <td className="py-2 px-2 md:px-3 text-[#888] font-semibold text-xs md:text-sm">Ý nghĩa</td>
                {names.map((n) => (
                  <td key={n.fullName} className="text-center py-2 px-2 md:px-3 text-xs text-[#666]">{n.meaning}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
