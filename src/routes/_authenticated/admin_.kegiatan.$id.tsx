import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Link2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { MonthYearPicker } from "@/components/MonthYearPicker";
import { useAdmin } from "@/hooks/use-admin";
import {
  GRADE_OPTIONS,
  formatActivityDate,
  type Activity,
  type ActivityPhoto,
} from "@/lib/gallery-types";

export const Route = createFileRoute("/_authenticated/admin_/kegiatan/$id")({
  head: () => ({
    meta: [
      { title: "Kelola Kegiatan — Ganespic XXV" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ManageActivityPage,
});

function ManageActivityPage() {
  const { id } = Route.useParams();
  const { user, isAdmin, isLoading: adminLoading } = useAdmin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [gradeKey, setGradeKey] = useState("7-mts");
  const [month, setMonth] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");
  const [linkCaption, setLinkCaption] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [confirmDeleteActivity, setConfirmDeleteActivity] = useState(false);

  const activityQuery = useQuery({
    queryKey: ["admin-activity", id],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Activity | null;
    },
  });

  const photosQuery = useQuery({
    queryKey: ["admin-activity-photos", id],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_photos")
        .select("*")
        .eq("activity_id", id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ActivityPhoto[];
    },
  });

  const activity = activityQuery.data ?? null;
  const photos = photosQuery.data ?? [];

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setGradeKey(`${activity.grade_level}-${activity.era}`);
      // Convert YYYY-MM-01 back to YYYY-MM for the picker
      if (activity.activity_date) {
        const parts = activity.activity_date.split('-');
        if (parts.length === 3 && parts[2] === '01') {
          setMonth(`${parts[0]}-${parts[1]}`);
        } else {
          setMonth(activity.activity_date);
        }
      } else {
        setMonth("");
      }
      setDescription(activity.description);
    }
  }, [activity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ["admin-activity", id] });
    await queryClient.invalidateQueries({ queryKey: ["admin-activity-photos", id] });
    await queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const grade = GRADE_OPTIONS.find((g) => `${g.grade}-${g.era}` === gradeKey);
    if (!title.trim() || !grade) {
      toast.error("Judul dan jenjang wajib diisi.");
      return;
    }
    setSaving(true);
    // Handle date: if month is YYYY-MM, convert to YYYY-MM-01 for database
    let activityDate = null;
    if (month) {
      if (month.includes('-') && month.split('-').length === 2) {
        activityDate = `${month}-01`;
      } else {
        activityDate = month;
      }
    }
    
    const { error } = await supabase
      .from("activities")
      .update({
        title: title.trim(),
        era: grade.era,
        grade_level: grade.grade,
        activity_date: activityDate,
        description: description.trim(),
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(`Gagal menyimpan: ${error.message}`);
      return;
    }
    toast.success("Perubahan disimpan.");
    await invalidate();
  }

  function nextSortOrder(): number {
    return photos.reduce((max, p) => Math.max(max, p.sort_order), 0) + 1;
  }

  async function handleAddLink(event: FormEvent) {
    event.preventDefault();
    setLinkError(null);
    const url = linkUrl.trim();
    if (!/^https?:\/\/.+\..+/.test(url)) {
      setLinkError("Tautan foto tidak valid. Gunakan URL lengkap diawali https://");
      return;
    }
    setAddingLink(true);
    const { error } = await supabase.from("activity_photos").insert({
      activity_id: id,
      image_url: url,
      caption: linkCaption.trim(),
      sort_order: nextSortOrder(),
    });
    setAddingLink(false);
    if (error) {
      setLinkError(`Gagal menambah foto: ${error.message}`);
      return;
    }
    toast.success("Foto dari tautan ditambahkan.");
    setLinkUrl("");
    setLinkCaption("");
    await invalidate();
  }

  async function handleSetCover(photo: ActivityPhoto) {
    const { error } = await supabase
      .from("activities")
      .update({ cover_image_url: photo.image_url })
      .eq("id", id);
    if (error) {
      toast.error(`Gagal mengatur sampul: ${error.message}`);
      return;
    }
    toast.success("Foto sampul diperbarui.");
    await invalidate();
  }

  async function handleCaptionBlur(photo: ActivityPhoto, value: string) {
    const caption = value.trim();
    if (caption === photo.caption) return;
    const { error } = await supabase
      .from("activity_photos")
      .update({ caption })
      .eq("id", photo.id);
    if (error) {
      toast.error(`Gagal menyimpan keterangan: ${error.message}`);
      return;
    }
    toast.success("Keterangan foto disimpan.");
    await invalidate();
  }

  async function handleDeletePhoto(photo: ActivityPhoto) {
    const { error } = await supabase.from("activity_photos").delete().eq("id", photo.id);
    if (error) {
      toast.error(`Gagal menghapus foto: ${error.message}`);
      return;
    }
    toast.success("Foto dihapus.");
    setDeletingPhotoId(null);
    await invalidate();
  }

  async function handleDeleteActivity() {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) {
      toast.error(`Gagal menghapus kegiatan: ${error.message}`);
      return;
    }
    toast.success("Kegiatan dihapus.");
    await queryClient.invalidateQueries({ queryKey: ["admin-activities"] });
    navigate({ to: "/admin" });
  }

  if (adminLoading || (isAdmin && activityQuery.isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Memuat kegiatan…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
          <h1 className="font-serif text-3xl text-foreground">Akses Dibatasi</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Akun {user?.email} tidak memiliki hak admin untuk mengelola arsip.
          </p>
          <Link
            to="/admin"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground">Kegiatan tidak ditemukan</h1>
          <Link
            to="/admin"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Kelola: <span className="italic text-accent-strong">{activity.title}</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {activity.activity_date ? formatActivityDate(activity.activity_date) : "Tanpa tanggal"}
              {" · "}
              {photos.length} foto
            </p>
          </div>
          <a
            href={`/kegiatan/${activity.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-primary/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-secondary"
          >
            Lihat Halaman Publik
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Edit details */}
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-8 shadow-elegant"
        >
          <h2 className="font-serif text-2xl text-foreground">Detail Kegiatan</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Judul
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong"
              />
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
                Tanggal Kegiatan (Opsional)
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
                rows={5}
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-accent-strong"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
        </form>

        {/* Add photos */}
        <div className="mt-10">
          <form
            onSubmit={handleAddLink}
            className="rounded-2xl border border-border bg-card p-6 shadow-elegant"
          >
            <h3 className="inline-flex items-center gap-2 font-serif text-xl text-foreground">
              <Link2 className="h-5 w-5 text-accent-strong" />
              Tambah dari Tautan Cloud
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Google Drive, Dropbox, CDN, atau URL gambar langsung.
            </p>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://…"
              className="mt-4 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong"
            />
            <input
              value={linkCaption}
              onChange={(e) => setLinkCaption(e.target.value)}
              placeholder="Keterangan foto (opsional)"
              className="mt-3 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-accent-strong"
            />
            <button
              type="submit"
              disabled={addingLink}
              className="mt-4 w-full rounded-full bg-accent py-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {addingLink ? "Menambahkan…" : "Tambah Foto"}
            </button>
          </form>

          {linkError && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {linkError}
            </p>
          )}
        </div>

        {/* Photo manager */}
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-foreground">Foto Kegiatan</h2>
          {photos.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Belum ada foto. Tambahkan lewat tautan cloud di atas.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => {
                const isCover = activity.cover_image_url === photo.image_url;
                return (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant"
                  >
                    <div className="relative">
                      <img
                        src={photo.image_url}
                        alt={photo.caption || "Foto kegiatan"}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {isCover && (
                        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                          Sampul
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <input
                        key={`${photo.id}-${photo.caption}`}
                        defaultValue={photo.caption}
                        onBlur={(e) => handleCaptionBlur(photo, e.target.value)}
                        placeholder="Keterangan foto…"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-accent-strong"
                      />
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleSetCover(photo)}
                          disabled={isCover}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-secondary disabled:opacity-40"
                        >
                          <Star className="h-3 w-3" />
                          Sampul
                        </button>
                        {deletingPhotoId === photo.id ? (
                          <>
                            <button
                              onClick={() => handleDeletePhoto(photo)}
                              className="rounded-full bg-destructive px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive-foreground"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setDeletingPhotoId(null)}
                              className="rounded-full border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeletingPhotoId(photo.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-serif text-xl text-destructive">Zona Berbahaya</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Menghapus kegiatan juga menghapus seluruh foto di dalamnya secara permanen.
          </p>
          {confirmDeleteActivity ? (
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleDeleteActivity}
                className="rounded-full bg-destructive px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-destructive-foreground"
              >
                Ya, Hapus Permanen
              </button>
              <button
                onClick={() => setConfirmDeleteActivity(false)}
                className="rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDeleteActivity(true)}
              className="mt-4 rounded-full border border-destructive/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-destructive transition-colors hover:bg-destructive/10"
            >
              Hapus Kegiatan Ini
            </button>
          )}
        </div>
      </main>
    </div>
  );
}