import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { getPublicActivityBySlug, listPublicActivities } from "@/lib/gallery.functions";
import { ERA_LABEL, formatActivityDate, gradeLabel } from "@/lib/gallery-types";
import { Lightbox } from "@/components/Lightbox";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicNav } from "@/components/PublicNav";
import { Reveal } from "@/components/Reveal";

const activitiesQueryOptions = queryOptions({
  queryKey: ["public-activities"],
  queryFn: () => listPublicActivities(),
});

const activityQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public-activity", slug],
    queryFn: () => getPublicActivityBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/kegiatan/$slug")({
  loader: async ({ context, params }) => {
    const activity = await context.queryClient.ensureQueryData(
      activityQueryOptions(params.slug),
    );
    if (!activity) throw notFound();
    await context.queryClient.ensureQueryData(activitiesQueryOptions);
    return { activity };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Kegiatan Tidak Ditemukan — Ganespic XXV" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { activity } = loaderData;
    const description = activity.description.slice(0, 155);
    return {
      meta: [
        { title: `${activity.title} — Ganespic XXV` },
        { name: "description", content: description },
        { property: "og:title", content: `${activity.title} — Ganespic XXV` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ActivityNotFound,
  errorComponent: ActivityError,
  component: ActivityDetailPage,
});

function ActivityNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNav />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">404</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground">Arsip Tidak Ditemukan</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Kegiatan yang kamu cari mungkin telah dipindahkan atau tautannya keliru.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

function ActivityError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNav />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-foreground">Halaman Gagal Dimuat</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Terjadi kendala saat mengambil arsip. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  );
}

function ActivityDetailPage() {
  const { slug } = Route.useParams();
  const { data: activity } = useSuspenseQuery(activityQueryOptions(slug));
  const { data: all } = useSuspenseQuery(activitiesQueryOptions);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!activity) return null;

  // Sort all activities by era and grade_level (MTs: 7-9, MA: 10-12)
  const sortedActivities = [...all].sort((a, b) => {
    // First sort by era (mts before ma)
    if (a.era !== b.era) {
      return a.era === 'mts' ? -1 : 1;
    }
    // Then sort by grade_level within the same era
    return a.grade_level - b.grade_level;
  });

  const cover = activity.cover_image_url ?? activity.photos[0]?.image_url ?? null;
  const currentIndex = sortedActivities.findIndex((a) => a.slug === activity.slug);
  const prev = currentIndex > 0 ? sortedActivities[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < sortedActivities.length - 1 ? sortedActivities[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <article className="mx-auto max-w-5xl px-6 pb-24 pt-14">
        <Reveal>
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Semua Kegiatan
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {ERA_LABEL[activity.era]}
            </span>
            <span className="rounded-full border border-border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {gradeLabel(activity)}
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
            {activity.title}
          </h1>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {activity.activity_date ? formatActivityDate(activity.activity_date) : "Tanggal menyusul"}
            {activity.photos.length > 0 ? ` · ${activity.photos.length} Foto` : ""}
          </p>
        </Reveal>

        {cover && (
          <Reveal delay={120}>
            <button
              onClick={() => setLightboxIndex(0)}
              className="group relative mt-10 block w-full overflow-hidden rounded-2xl shadow-elegant"
              aria-label="Perbesar foto sampul"
            >
              <img
                src={cover}
                alt={activity.title}
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </button>
          </Reveal>
        )}

        <Reveal delay={180}>
          <p className="mt-12 max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground/85 md:text-lg">
            {activity.description}
          </p>
        </Reveal>

        {activity.photos.length > 0 && (
          <Reveal delay={220}>
            <div className="mt-16">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <h2 className="font-serif text-2xl text-foreground md:text-3xl">Galeri Foto</h2>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Klik untuk memperbesar
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {activity.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(i)}
                    className={`group relative overflow-hidden rounded-xl shadow-elegant ${
                      i === 0 && activity.photos.length > 2
                        ? "col-span-2 row-span-2"
                        : ""
                    }`}
                    aria-label={photo.caption || `Foto ${i + 1}`}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || activity.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {photo.caption && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent px-4 pb-3 pt-10 text-left text-xs text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {photo.caption}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <nav className="mt-20 grid gap-4 border-t border-border pt-10 md:grid-cols-2">
          {prev ? (
            <Link
              to="/kegiatan/$slug"
              params={{ slug: prev.slug }}
              className="group rounded-2xl border border-border p-6 transition-colors hover:border-accent-strong"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                ← Sebelumnya
              </p>
              <p className="mt-2 font-serif text-xl text-foreground group-hover:text-accent-strong">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              to="/kegiatan/$slug"
              params={{ slug: next.slug }}
              className="group rounded-2xl border border-border p-6 text-right transition-colors hover:border-accent-strong"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Berikutnya →
              </p>
              <p className="mt-2 font-serif text-xl text-foreground group-hover:text-accent-strong">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      </article>

      <PublicFooter />

      {lightboxIndex !== null && (
        <Lightbox
          photos={activity.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}