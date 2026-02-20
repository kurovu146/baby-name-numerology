"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" hoặc ""
  onChange: (value: string) => void;
  yearRange?: { min: number; max: number };
  className?: string;
}

function getDaysInMonth(month: number, year: number): number {
  if (!month) return 31;
  if (!year) return new Date(2024, month, 0).getDate();
  return new Date(year, month, 0).getDate();
}

const MONTH_LABELS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// ---- Combobox field: input gõ số + dropdown chọn ----
interface ComboFieldProps {
  value: number; // 0 = chưa chọn
  placeholder: string;
  options: { value: number; label: string }[];
  onSelect: (v: number) => void;
  min: number;
  max: number;
  flex: string;
  inputWidth?: string; // width hint cho input
}

function ComboField({ value, placeholder, options, onSelect, min, max, flex }: ComboFieldProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ? String(value) : "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync text khi value thay đổi từ bên ngoài
  useEffect(() => {
    setText(value ? String(value) : "");
  }, [value]);

  // Click outside → đóng dropdown
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const commitValue = useCallback((raw: string) => {
    const n = parseInt(raw);
    if (!isNaN(n) && n >= min && n <= max) {
      onSelect(n);
    } else if (raw === "") {
      onSelect(0);
    }
    // Invalid → revert display
    setText(value ? String(value) : "");
  }, [min, max, onSelect, value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setText(raw);
    // Auto-commit khi đủ chữ số (2 cho ngày/tháng, 4 cho năm)
    const digitCount = max >= 1000 ? 4 : 2;
    if (raw.length >= digitCount) {
      const n = parseInt(raw);
      if (n >= min && n <= max) {
        onSelect(n);
        setOpen(false);
        inputRef.current?.blur();
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      commitValue(text);
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setText(value ? String(value) : "");
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleFocus() {
    inputRef.current?.select();
    setOpen(true);
  }

  function handleBlur() {
    // Delay nhẹ để click dropdown option kịp fire
    setTimeout(() => {
      if (wrapRef.current?.contains(document.activeElement)) return;
      commitValue(text);
      setOpen(false);
    }, 150);
  }

  function handleOptionClick(v: number) {
    onSelect(v);
    setOpen(false);
  }

  const isEmpty = !value;

  return (
    <div ref={wrapRef} className={`date-combo ${flex}`}>
      <div className="date-combo-input-wrap">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`date-combo-input${isEmpty ? " placeholder" : ""}`}
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          className="date-combo-chevron"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent input blur
            setOpen((o) => !o);
          }}
          aria-label="Mở danh sách"
        >
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M1 1l4 4 4-4" stroke="#af3689" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {open && (
        <ul className="date-combo-dropdown">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`date-combo-option${opt.value === value ? " selected" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleOptionClick(opt.value);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Main DatePicker ----
export default function DatePicker({ value, onChange, yearRange, className }: DatePickerProps) {
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

  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const monthOptions = MONTH_LABELS.map((l, i) => ({ value: i + 1, label: l }));
  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({ value: minYear + i, label: String(minYear + i) }));

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
      <ComboField
        value={day}
        placeholder="Ngày"
        options={dayOptions}
        onSelect={(v) => handleChange(v, month, year)}
        min={1}
        max={daysInMonth}
        flex="flex-[0.8]"
      />
      <ComboField
        value={month}
        placeholder="Tháng"
        options={monthOptions}
        onSelect={(v) => handleChange(day, v, year)}
        min={1}
        max={12}
        flex="flex-[1.3]"
      />
      <ComboField
        value={year}
        placeholder="Năm"
        options={yearOptions}
        onSelect={(v) => handleChange(day, month, v)}
        min={minYear}
        max={maxYear}
        flex="flex-[1.1]"
      />
    </div>
  );
}
