import { useState } from "react";
import {
  Users,
  GraduationCap,
  Trophy,
  HeartHandshake,
  Music,
  MapPin,
  PartyPopper,
  Camera,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ActivityWithItems, GalleryItem } from "@/lib/supabase";

const ICONS: Record<string, LucideIcon> = {
  Users,
  GraduationCap,
  Trophy,
  HeartHandshake,
  Music,
  MapPin,
  PartyPopper,
  Camera,
};

type GalleryProps = {
  activities: ActivityWithItems[];
  loading: boolean;
};

export default function Gallery({ activities, loading }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered =
    activeFilter === "all" ? activities : activities.filter((a) => a.id === activeFilter);

  return (
    <section id="galeri" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-sage-800 dark:bg-sage-900/50 dark:text-sage-300">
            Galeri Kegiatan
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-sage-950 sm:text-5xl dark:text-sage-100">
            Setiap Kegiatan, Sebuah Cerita
          </h2>
          <p className="mt-4 text-lg text-sage-950/70 dark:text-sage-200/70">
            Pilih kategori kegiatan untuk melihat momen-momen berharga angkatan kita.
          </p>
        </div>

        {/* Filter pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-sage-950 text-sage-100 shadow-md shadow-sage-950/25 dark:bg-sage-400 dark:text-sage-950 dark:shadow-sage-400/30"
                : "border border-white/50 bg-white/60 text-sage-800 hover:bg-white/80 dark:border-sage-800 dark:bg-sage-950/50 dark:text-sage-300 dark:hover:bg-sage-900/60"
            }`}
          >
            Semua
          </button>
          {activities.map((a) => {
            const Icon = ICONS[a.icon] ?? Camera;
            const active = activeFilter === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setActiveFilter(a.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-sage-950 text-sage-100 shadow-md shadow-sage-950/25 dark:bg-sage-400 dark:text-sage-950 dark:shadow-sage-400/30"
                    : "border border-white/50 bg-white/60 text-sage-800 hover:bg-white/80 dark:border-sage-800 dark:bg-sage-950/50 dark:text-sage-300 dark:hover:bg-sage-900/60"
                }`}
              >
                <Icon size={15} />
                {a.name}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-3xl bg-white/40 dark:bg-sage-900/40"
              />
            ))}
          </div>
        )}

        {/* Activity sections */}
        {!loading && (
          <div id="kegiatan" className="mt-16 space-y-20 scroll-mt-24">
            {filtered.map((activity, idx) => {
              const Icon = ICONS[activity.icon] ?? Camera;
              return (
                <div key={activity.id} className="scroll-mt-24">
                  {/* Activity header */}
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/70 text-sage-700 dark:bg-sage-900/50 dark:text-sage-400">
                      <Icon size={26} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-bold text-sage-700 dark:text-sage-400">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-sage-950 sm:text-3xl dark:text-sage-100">
                          {activity.name}
                        </h3>
                      </div>
                      {activity.description && (
                        <p className="mt-1.5 max-w-2xl text-sage-950/70 dark:text-sage-200/70">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Photo grid */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activity.items.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => setLightbox(item)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage-200 dark:bg-sage-900/40"
                        style={{
                          animation: "var(--animate-fade-up)",
                          animationDelay: `${i * 0.08}s`,
                        }}
                      >
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-sage-950/80 via-sage-950/10 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                          <h4 className="font-display text-lg font-bold text-white">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="mt-1 text-sm text-white/80 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sage-300 opacity-0 transition-opacity group-hover:opacity-100">
                            Lihat detail
                            <ChevronRight size={14} />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-sage-950/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          style={{ animation: "var(--animate-fade-in)" }}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "var(--animate-scale-in)" }}
          >
            <img
              src={lightbox.image_url}
              alt={lightbox.title}
              className="max-h-[80vh] w-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sage-950 to-transparent p-6">
              <h4 className="font-display text-2xl font-bold text-white">{lightbox.title}</h4>
              {lightbox.description && <p className="mt-2 text-white/80">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
