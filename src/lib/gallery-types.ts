export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  era: "mts" | "ma";
  grade_level: number;
  activity_date: string | null;
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
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const [year, month] = isoDate.split("-").map(Number);
  if (!year || !month) return isoDate;
  return `${months[month - 1]} ${year}`;
}
