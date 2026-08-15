import { Link } from "@tanstack/react-router";

import type { ActivityWithPhotos } from "@/lib/gallery-types";
import { formatActivityDate, gradeLabel } from "@/lib/gallery-types";

interface ActivityCardProps {
  activity: ActivityWithPhotos;
  variant: "wide" | "tall" | "banner";
}

const VARIANT_CLASSES: Record<ActivityCardProps["variant"], string> = {
  wide: "md:col-span-8 aspect-[3/2]",
  tall: "md:col-span-4 aspect-[3/4] md:aspect-auto",
  banner: "md:col-span-12 aspect-[16/9]",
};

export function ActivityCard({ activity, variant }: ActivityCardProps) {
  const cover = activity.cover_image_url ?? activity.photos[0]?.image_url ?? null;
  const excerpt = activity.description.split("\n")[0] ?? "";

  return (
    <Link
      to="/kegiatan/$slug"
      params={{ slug: activity.slug }}
      className={`group relative block overflow-hidden rounded-2xl shadow-elegant transition-shadow duration-500 hover:shadow-lift ${VARIANT_CLASSES[variant]}`}
    >
      {cover ? (
        <img
          src={cover}
          alt={activity.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
          {gradeLabel(activity)}
          {activity.activity_date ? ` · ${formatActivityDate(activity.activity_date)}` : ""}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-primary-foreground md:text-3xl">
          {activity.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
          {excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/0 transition-colors duration-300 group-hover:text-accent">
          <span className="text-primary-foreground/90 group-hover:text-accent">Buka Arsip →</span>
        </span>
      </div>
    </Link>
  );
}
