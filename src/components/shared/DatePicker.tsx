"use client";

import { useState, useEffect } from "react";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" hoặc ""
  onChange: (value: string) => void;
  yearRange?: { min: number; max: number };
  className?: string;
}

function getDaysInMonth(month: number, year: number): number {
  if (!month) return 31;
  if (!year) return new Date(2024, month, 0).getDate(); // 2024 is leap year
  return new Date(year, month, 0).getDate();
}

export default function DatePicker({ value, onChange, yearRange, className }: DatePickerProps) {
  // Internal state để giữ từng phần khi chưa chọn đủ 3
  const parseValue = (v: string) => {
    const parts = v ? v.split("-") : [];
    return { year: parseInt(parts[0]) || 0, month: parseInt(parts[1]) || 0, day: parseInt(parts[2]) || 0 };
  };
  const [internal, setInternal] = useState(() => parseValue(value));

  useEffect(() => { setInternal(parseValue(value)); }, [value]);

  const { day, month, year } = internal;
  const minYear = yearRange?.min ?? 2020;
  const maxYear = yearRange?.max ?? 2030;
  const daysInMonth = getDaysInMonth(month, year);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = [
    { v: 1, l: "Tháng 1" }, { v: 2, l: "Tháng 2" }, { v: 3, l: "Tháng 3" },
    { v: 4, l: "Tháng 4" }, { v: 5, l: "Tháng 5" }, { v: 6, l: "Tháng 6" },
    { v: 7, l: "Tháng 7" }, { v: 8, l: "Tháng 8" }, { v: 9, l: "Tháng 9" },
    { v: 10, l: "Tháng 10" }, { v: 11, l: "Tháng 11" }, { v: 12, l: "Tháng 12" },
  ];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  function handleChange(newDay: number, newMonth: number, newYear: number) {
    const maxD = getDaysInMonth(newMonth, newYear);
    const clampedDay = newDay > maxD ? maxD : newDay;
    const next = { day: clampedDay, month: newMonth, year: newYear };
    setInternal(next);
    if (clampedDay && newMonth && newYear) {
      onChange(`${newYear}-${String(newMonth).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`);
    } else {
      onChange("");
    }
  }

  return (
    <div className={`flex gap-1.5 w-full ${className ?? ""}`}>
      {/* Ngày */}
      <select
        value={day || ""}
        onChange={(e) => handleChange(Number(e.target.value), month, year)}
        className={`date-select flex-[0.8]${!day ? " placeholder" : ""}`}
      >
        <option value="" disabled>Ngày</option>
        {days.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      {/* Tháng */}
      <select
        value={month || ""}
        onChange={(e) => handleChange(day, Number(e.target.value), year)}
        className={`date-select flex-[1.3]${!month ? " placeholder" : ""}`}
      >
        <option value="" disabled>Tháng</option>
        {months.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
      </select>
      {/* Năm */}
      <select
        value={year || ""}
        onChange={(e) => handleChange(day, month, Number(e.target.value))}
        className={`date-select flex-[1.1]${!year ? " placeholder" : ""}`}
      >
        <option value="" disabled>Năm</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}
