"use client";

import type { ParentInfo } from "@/constants/ui";
import DatePicker from "./DatePicker";

export default function ParentInputFields({
  info,
  onChange,
}: {
  info: ParentInfo;
  onChange: (info: ParentInfo) => void;
}) {
  return (
    <div className="mt-4 p-3 md:p-4 border border-[#e0c5eb] rounded-lg bg-[#faf5fc] space-y-3">
      <p className="text-xs font-semibold text-[#af3689]">Thông tin bố/mẹ</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#555] mb-1">Họ và tên Bố</label>
          <input
            type="text"
            value={info.dadName}
            onChange={(e) => onChange({ ...info, dadName: e.target.value })}
            placeholder="Nguyễn Văn Hùng"
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#555] mb-1">Ngày sinh Bố</label>
          <DatePicker value={info.dadBirth} onChange={(v) => onChange({ ...info, dadBirth: v })} yearRange={{ min: 1950, max: 2010 }} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#555] mb-1">Họ và tên Mẹ</label>
          <input
            type="text"
            value={info.momName}
            onChange={(e) => onChange({ ...info, momName: e.target.value })}
            placeholder="Trần Thị Mai"
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#555] mb-1">Ngày sinh Mẹ</label>
          <DatePicker value={info.momBirth} onChange={(v) => onChange({ ...info, momBirth: v })} yearRange={{ min: 1950, max: 2010 }} />
        </div>
      </div>
    </div>
  );
}
