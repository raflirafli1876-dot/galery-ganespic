import { useState, useEffect } from "react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const YEARS = Array.from({ length: 9 }, (_, i) => 2022 + i);

const selectClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong";

type Props = {
  /** Value in "YYYY-MM" or "YYYY-MM-DD" format, or "" when unset. 
   * UI displays YYYY-MM if day is not selected, but database stores as YYYY-MM-01 */
  value: string;
  onChange: (value: string) => void;
};

export function MonthYearPicker({ value, onChange }: Props) {
  // Handle both YYYY-MM and YYYY-MM-DD formats
  // If YYYY-MM-01, treat as YYYY-MM (user only selected month-year)
  const parts = value && value.includes('-') ? value.split("-") : [];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = (parts[2] && parts[2] !== '01') ? parts[2] : ""; // Don't show day if it's 01
  
  // Maintain local state to prevent sync issues
  const [localYear, setLocalYear] = useState(year);
  const [localMonth, setLocalMonth] = useState(month);
  const [localDay, setLocalDay] = useState(day);
  
  // Sync local state when prop value changes
  useEffect(() => {
    const newParts = value && value.includes('-') ? value.split("-") : [];
    const newYear = newParts[0] || "";
    const newMonth = newParts[1] || "";
    const newDay = (newParts[2] && newParts[2] !== '01') ? newParts[2] : "";
    setLocalYear(newYear);
    setLocalMonth(newMonth);
    setLocalDay(newDay);
  }, [value]);

  const update = (nextYear: string, nextMonth: string, nextDay: string) => {
    // Only update if year and month are set, day is optional
    if (nextYear && nextMonth) {
      if (nextDay) {
        onChange(`${nextYear}-${nextMonth}-${nextDay}`);
      } else {
        // Store as YYYY-MM for UI, will be converted to YYYY-MM-01 for database
        onChange(`${nextYear}-${nextMonth}`);
      }
    } else {
      onChange("");
    }
  };

  const daysInMonth = localMonth && localYear && !isNaN(parseInt(localMonth)) && !isNaN(parseInt(localYear)) 
    ? new Date(parseInt(localYear), parseInt(localMonth), 0).getDate() 
    : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <select
          aria-label="Bulan kegiatan"
          value={localMonth}
          onChange={(e) => {
            const newMonth = e.target.value;
            setLocalMonth(newMonth);
            // Reset day if it's invalid for the new month
            if (localDay && localYear && parseInt(localDay) > new Date(parseInt(localYear), parseInt(newMonth), 0).getDate()) {
              setLocalDay("");
              update(localYear, newMonth, "");
            } else {
              update(localYear, newMonth, localDay);
            }
          }}
          className={selectClass}
        >
          <option value="">Bulan</option>
          {MONTHS.map((label, i) => (
            <option key={label} value={String(i + 1).padStart(2, "0")}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label="Tahun kegiatan"
          value={localYear}
          onChange={(e) => {
            const newYear = e.target.value;
            setLocalYear(newYear);
            update(newYear, localMonth, localDay);
          }}
          className={selectClass}
        >
          <option value="">Tahun</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <select
        aria-label="Tanggal kegiatan (opsional)"
        value={localDay}
        onChange={(e) => {
          const newDay = e.target.value;
          setLocalDay(newDay);
          update(localYear, localMonth, newDay);
        }}
        className={selectClass}
      >
        <option value="">Tanggal (opsional)</option>
        {days.map((d) => (
          <option key={d} value={String(d).padStart(2, "0")}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}