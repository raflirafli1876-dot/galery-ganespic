import { useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Cloud, ImagePlus, PenLine, Plus, type LucideIcon } from "lucide-react";

import { listPublicActivities } from "@/lib/gallery.functions";
import type { ActivityWithPhotos } from "@/lib/gallery-types";
import { supabase } from "@/integrations/supabase/client";
import { ActivityCard } from "@/components/ActivityCard";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicNav } from "@/components/PublicNav";
import { Reveal } from "@/components/Reveal";
import logoUrl from "@/assets/Logo_xxvganespic.png";

const activitiesQueryOptions = queryOptions({
  queryKey: ["public-activities"],
  queryFn: () => listPublicActivities(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(activitiesQueryOptions),
  head: () => ({
    meta: [
      { title: "Ganespic XXV — Arsip Kenangan Angkatan 25" },
      {
        name: "description",
        content:
          "Galeri kenangan Angkatan XXV Ganespic: perjalanan enam tahun dari kelas 7 MTs hingga kelas 12 MA dalam foto dan cerita.",
      },
      { property: "og:title", content: "Ganespic XXV — Arsip Kenangan Angkatan 25" },
      {
        property: "og:description",
        content:
          "Perjalanan enam tahun dari kelas 7 MTs hingga kelas 12 MA dalam foto dan cerita.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function useSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    const checkAuth = async () => {
      const localSession = typeof window !== "undefined" ? sessionStorage.getItem("ganespic_admin_session") : null;
      if (localSession) {
        setIsLoggedIn(true);
        return;
      }
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      const localSession = typeof window !== "undefined" ? sessionStorage.getItem("ganespic_admin_session") : null;
      setIsLoggedIn(!!localSession || !!next);
    });
    return () => subscription.unsubscribe();
  }, []);
  return isLoggedIn;
}

const PORTAL_TILES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Plus,
    title: "Tambah Kegiatan",
    description: "Abadikan momen baru ke dalam arsip angkatan.",
  },
  {
    icon: PenLine,
    title: "Edit Deskripsi",
    description: "Perbarui cerita di balik setiap kegiatan.",
  },
  {
    icon: Cloud,
    title: "Tautkan Foto Cloud",
    description: "Tempel tautan Google Drive, Dropbox, atau CDN.",
  },
  {
    icon: ImagePlus,
    title: "Unggah Foto",
    description: "Kirim berkas foto langsung ke galeri kegiatan.",
  },
];

function EraSection({
  index,
  era,
  title,
  period,
  activities,
}: {
  index: string;
  era: string;
  title: string;
  period: string;
  activities: ActivityWithPhotos[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="flex flex-col gap-3 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-strong">
              Bagian {index} · {era}
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{period}</p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
        {activities.map((activity, i) => (
          <Reveal key={activity.id} delay={i * 120} className={
            i % 3 === 0 ? "md:col-span-8" : i % 3 === 1 ? "md:col-span-4" : "md:col-span-12"
          }>
            <ActivityCard
              activity={activity}
              variant={i % 3 === 0 ? "wide" : i % 3 === 1 ? "tall" : "banner"}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const { data: activities } = useSuspenseQuery(activitiesQueryOptions);
  const isLoggedIn = useSession();
  const navigate = useNavigate();

  const mts = activities
    .filter((a) => a.era === "mts")
    .sort((a, b) => a.grade_level - b.grade_level);
  const ma = activities
    .filter((a) => a.era === "ma")
    .sort((a, b) => a.grade_level - b.grade_level);

  const portalTarget = () => {
    if (isLoggedIn) navigate({ to: "/admin" });
    else navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pt-28">
        <Reveal>
          <img
            src={logoUrl}
            alt="Logo Angkatan XXV Ganespic"
            className="mx-auto mb-8 h-28 w-28 rounded-full object-contain shadow-elegant md:h-32 md:w-32"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">
            Angkatan 25 · MTs & MA
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Enam Tahun, <span className="italic text-accent-strong">Satu Kisah</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Dari langkah pertama di bangku kelas 7 MTs hingga hari kelulusan di
            kelas 12 MA — setiap kegiatan, setiap foto, dan setiap cerita
            tersimpan rapi dalam arsip kenangan Ganespic XXV.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="hidden h-px w-10 bg-accent-strong/40 sm:block" />
            <p className="font-serif text-xl italic text-accent-strong md:text-2xl">
              “Melangkah ke Depan, Menuju Kemenangan”
            </p>
            <span className="hidden h-px w-10 bg-accent-strong/40 sm:block" />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#mts"
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Jelajahi Arsip
            </a>
            <a
              href="#portal"
              className="rounded-full border border-primary/25 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-secondary"
            >
              Portal Admin
            </a>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 divide-x divide-border border-y border-border py-8">
            {[
              ["06", "Tahun Perjalanan"],
              [String(activities.length).padStart(2, "0"), "Kegiatan"],
              [
                String(activities.reduce((sum, a) => sum + a.photos.length, 0)).padStart(2, "0"),
                "Foto Kenangan",
              ],
            ].map(([value, label]) => (
              <div key={label} className="px-4">
                <p className="font-serif text-4xl text-foreground md:text-5xl">{value}</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Era MTs */}
      <div id="mts" className="scroll-mt-24">
        <EraSection
          index="01"
          era="Era MTs"
          title="Madrasah Tsanawiyah"
          period="Kelas 7–9 · 2023–2026"
          activities={mts}
        />
      </div>

      {/* Divider */}
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-6">
          <div className="h-16 w-px bg-gradient-to-b from-transparent via-accent-strong to-transparent" />
          <p className="py-4 font-serif text-xl italic text-muted-foreground">
            Transisi menuju kedewasaan
          </p>
          <div className="h-16 w-px bg-gradient-to-b from-transparent via-accent-strong to-transparent" />
        </div>
      </Reveal>

      {/* Era MA */}
      <div id="ma" className="scroll-mt-24">
        <EraSection
          index="02"
          era="Era MA"
          title="Madrasah Aliyah"
          period="Kelas 10–12 · 2026–2029"
          activities={ma}
        />
      </div>

      {/* Portal Admin */}
      <section id="portal" className="scroll-mt-24 bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Khusus Admin
              </p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                Dashboard Kurator
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70 md:text-base">
                Area khusus admin Ganespic XXV untuk menjaga arsip tetap hidup:
                menambah kegiatan, memperbarui cerita, serta mengelola foto dari
                unggahan langsung maupun tautan cloud.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PORTAL_TILES.map((tile, i) => (
              <Reveal key={tile.title} delay={i * 100}>
                <button
                  onClick={portalTarget}
                  className="group flex h-full w-full flex-col rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 text-left transition-colors hover:border-accent hover:bg-primary-foreground/10"
                >
                  <tile.icon className="h-7 w-7 text-accent" />
                  <h3 className="mt-5 font-serif text-xl text-primary-foreground">
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/65">
                    {tile.description}
                  </p>
                  <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/50 transition-colors group-hover:text-accent">
                    Masuk →
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
