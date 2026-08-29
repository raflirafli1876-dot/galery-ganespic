export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  era: "mts" | "ma";
  grade_level: number;
  activity_date: string | null; // Format: YYYY-MM-DD (YYYY-MM-01 if only month-year selected)
  cover_image_url: string | null;
  sort_order: number;
}

export interface ActivityPhoto {
  id: string;
  activity_id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface ActivityWithPhotos extends Activity {
  photos: ActivityPhoto[];
}

export const ERA_LABEL: Record<"mts" | "ma", string> = {
  mts: "Era MTs",
  ma: "Era MA",
};

export const GRADE_OPTIONS: { grade: number; era: "mts" | "ma"; label: string }[] = [
  { grade: 7, era: "mts", label: "Kelas 7 MTs" },
  { grade: 8, era: "mts", label: "Kelas 8 MTs" },
  { grade: 9, era: "mts", label: "Kelas 9 MTs" },
  { grade: 10, era: "ma", label: "Kelas 10 MA" },
  { grade: 11, era: "ma", label: "Kelas 11 MA" },
  { grade: 12, era: "ma", label: "Kelas 12 MA" },
];

export function gradeLabel(activity: { grade_level: number; era: string }): string {
  return `Kelas ${activity.grade_level} ${activity.era.toUpperCase()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatActivityDate(isoDate: string | null): string {
  if (!isoDate) return "";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const parts = isoDate.split("-").map(Number);
  const [year, month, day] = parts;
  if (!year || !month) return isoDate;
  // If day is 01, assume user only wanted month-year format
  if (day && day !== 1) {
    return `${day} ${months[month - 1]} ${year}`;
  }
  return `${months[month - 1]} ${year}`;
}