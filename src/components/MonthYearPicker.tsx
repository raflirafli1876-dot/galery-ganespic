const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const YEARS = Array.from({ length: 9 }, (_, i) => 2022 + i);

const selectClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong";

type Props = {
  /** Value in "YYYY-MM" format, or "" when unset. */
  value: string;
  onChange: (value: string) => void;
};

export function MonthYearPicker({ value, onChange }: Props) {
  const [year = "", month = ""] = value ? value.split("-") : [];

  const update = (nextYear: string, nextMonth: string) => {
    if (!nextYear || !nextMonth) {
      onChange("");
      return;
    }
    onChange(`${nextYear}-${nextMonth}`);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <select
        aria-label="Bulan kegiatan"
        value={month}
        onChange={(e) => update(year, e.target.value)}
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
        value={year}
        onChange={(e) => update(e.target.value, month)}
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
  );
}