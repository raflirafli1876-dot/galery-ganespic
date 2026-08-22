import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { MonthYearPicker } from "@/components/MonthYearPicker";
import { useAdmin } from "@/hooks/use-admin";
import { GRADE_OPTIONS, formatActivityDate, gradeLabel, slugify } from "@/lib/gallery-types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Kurator — Ganespic XXV" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

interface AdminActivityRow {
  id: string;
  title: string;
  slug: string;
  era: "mts" | "ma";
  grade_level: number;
  activity_date: string | null;
  description: string;
  cover_image_url: string | null;
  sort_order: number;
  activity_photos: { count: number }[];
}

interface AdminPhotoRow {
  image_url: string;
  sort_order: number;
}

function uniqueSlug(base: string, taken: string[]): string {
  const root = base || "kegiatan";
  let slug = root;
  let i = 2;
  while (taken.includes(slug)) {
    slug = `${root}-${i}`;
    i += 1;
  }
  return slug;
}

function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [gradeKey, setGradeKey] = useState("7-mts");
  const [month, setMonth] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activitiesQuery = useQuery({
    queryKey: ["admin-activities"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*, activity_photos(count), photos:activity_photos(image_url, sort_order)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as (AdminActivityRow & { photos: AdminPhotoRow[] })[];
    },
  });

  const activities = activitiesQuery.data ?? [];
  const totalPhotos = activities.reduce(
    (sum, a) => sum + (a.activity_photos[0]?.count ?? 0),
    0,
  );

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ganespic_admin_session");
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("Judul kegiatan wajib diisi.");
      return;
    }
    const grade = GRADE_OPTIONS.find((g) => `${g.grade}-${g.era}` === gradeKey);
    if (!grade) return;
    setCreating(true);
    const slug = uniqueSlug(
      slugify(title),
      activities.map((a) => a.slug),
    );
    const maxSort = activities.reduce((max, a) => Math.max(max, a.sort_order), 0);
    const { data, error } = await supabase
      .from("activities")
      .insert({
        title: title.trim(),
        slug,
        era: grade.era,
        grade_level: grade.grade,
        activity_date: month ? `${month}-01` : null,
        description: description.trim(),
        sort_order: maxSort + 1,
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error(`Gagal menambah kegiatan: ${error?.message ?? "tidak diketahui"}`);
      return;
    }
    toast.success("Kegiatan baru ditambahkan.");
    await queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
    navigate({ to: "/admin/kegiatan/$id", params: { id: data.id } });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) {
      toast.error(`Gagal menghapus: ${error.message}`);
      return;
    }
    toast.success("Kegiatan dihapus.");
    setConfirmDeleteId(null);
    await queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Memuat dashboard…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
          <h1 className="font-serif text-3xl text-foreground">Akses Dibatasi</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Akun <span className="font-semibold text-foreground">{user?.email}</span> belum
            memiliki hak admin. Hubungi kurator arsip untuk diberikan akses.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/"
              className="rounded-full border border-primary/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-secondary"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Ganespic XXV
            </p>
            <h1 className="mt-2 font-serif text-4xl tracking-tight">Dashboard Kurator</h1>
            <p className="mt-1 text-sm text-primary-foreground/65">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-primary-foreground/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-primary-foreground/10"
            >
              Lihat Galeri
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-primary-foreground/20"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            [activities.length, "Kegiatan"],
            [totalPhotos, "Foto Tersimpan"],
            [activities.filter((a) => a.era === "mts").length, "Era MTs"],
            [activities.filter((a) => a.era === "ma").length, "Era MA"],
          ].map(([value, label]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <p className="font-serif text-4xl text-foreground">{value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Create */}
        <div className="mt-10">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Tutup Formulir" : "Tambah Kegiatan"}
          </button>

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-elegant"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Judul Kegiatan
                  </span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Study Tour ke Yogyakarta"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong"
                  />
                  {title.trim() && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Slug: /kegiatan/{slugify(title) || "…"}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Jenjang
                  </span>
                  <select
                    value={gradeKey}
                    onChange={(e) => setGradeKey(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={`${g.grade}-${g.era}`} value={`${g.grade}-${g.era}`}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Bulan & Tahun Kegiatan
                  </span>
                  <MonthYearPicker value={month} onChange={setMonth} />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Deskripsi
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Ceritakan momen kegiatan ini…"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-accent-strong"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="mt-6 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {creating ? "Menyimpan…" : "Simpan & Kelola Foto"}
              </button>
            </form>
          )}
        </div>

        {/* List */}
        <div className="mt-12">
          <h2 className="font-serif text-3xl text-foreground">Daftar Kegiatan</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            {activitiesQuery.isLoading && (
              <p className="px-6 py-8 text-sm text-muted-foreground">Memuat arsip…</p>
            )}
            {activities.map((activity) => {
              const photoCount = activity.activity_photos[0]?.count ?? 0;
              const thumb =
                activity.cover_image_url ??
                activity.photos
                  ?.slice()
                  .sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url ??
                null;
              return (
                <div
                  key={activity.id}
                  className="flex flex-wrap items-center gap-4 px-6 py-5"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-14 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-lg bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {gradeLabel(activity)}
                      {activity.activity_date
                        ? ` · ${formatActivityDate(activity.activity_date)}`
                        : ""}
                      {` · ${photoCount} foto`}
                    </p>
                  </div>
                  <Link
                    to="/admin/kegiatan/$id"
                    params={{ id: activity.id }}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Kelola
                  </Link>
                  {confirmDeleteId === activity.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="rounded-full bg-destructive px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-destructive-foreground"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        Batal
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(activity.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  )}
                </div>
              );
            })}
            {!activitiesQuery.isLoading && activities.length === 0 && (
              <p className="px-6 py-8 text-sm text-muted-foreground">
                Belum ada kegiatan. Tambahkan yang pertama di atas.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}