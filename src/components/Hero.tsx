import { ArrowDown, Sparkles } from "lucide-react";
import GanespicLogo from "@/components/GanespicLogo";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/25 blur-3xl dark:bg-sage-500/20" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-sage-300/40 blur-3xl dark:bg-sage-600/15" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-white/20 blur-3xl dark:bg-sage-700/10" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8">
        {/* Logo with motto arc */}
        <div
          className="mb-2 flex justify-center text-sage-950 opacity-0 dark:text-sage-100"
          style={{ animation: "var(--animate-scale-in)", animationDelay: "0.05s" }}
        >
          <GanespicLogo size={180} />
        </div>

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-sage-800 opacity-0 backdrop-blur dark:border-sage-800 dark:bg-sage-950/50 dark:text-sage-300"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.2s" }}
        >
          <Sparkles size={15} className="text-sage-600 dark:text-sage-400" />
          Angkatan XXV Ganespic
        </div>

        <h1
          className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-sage-950 text-balance opacity-0 sm:text-6xl lg:text-7xl dark:text-sage-100"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.3s" }}
        >
          Galeri Kenangan
          <br />
          <span className="bg-gradient-to-r from-sage-700 via-sage-800 to-sage-900 bg-clip-text text-transparent dark:from-sage-300 dark:via-sage-400 dark:to-sage-200">
            Angkatan Kita
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-sage-950/75 opacity-0 dark:text-sage-200/70"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.4s" }}
        >
          Setiap momen, setiap kegiatan, setiap cerita — terabadikan dalam satu galeri. Jelajahi
          perjalanan angkatan kita melalui beragam kegiatan yang penuh kebersamaan.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.5s" }}
        >
          <a
            href="#galeri"
            className="group inline-flex items-center gap-2 rounded-xl bg-sage-950 px-7 py-3.5 text-base font-semibold text-sage-100 shadow-lg shadow-sage-950/25 transition-all hover:scale-105 hover:bg-sage-900 dark:bg-sage-400 dark:text-sage-950 dark:shadow-sage-400/30 dark:hover:bg-sage-300"
          >
            Jelajahi Galeri
            <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href="#kegiatan"
            className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 px-7 py-3.5 text-base font-semibold text-sage-900 transition-all hover:scale-105 hover:bg-white/80 dark:border-sage-700 dark:bg-sage-950/50 dark:text-sage-200 dark:hover:bg-sage-900/60"
          >
            Lihat Kegiatan
          </a>
        </div>

        {/* Stats */}
        <div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 opacity-0"
          style={{ animation: "var(--animate-fade-up)", animationDelay: "0.6s" }}
        >
          {[
            { value: "7", label: "Kategori Kegiatan" },
            { value: "21+", label: "Momen Terabadikan" },
            { value: "1", label: "Angkatan, Satu Keluarga" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/50 bg-white/50 px-4 py-5 backdrop-blur dark:border-sage-900 dark:bg-sage-950/40"
            >
              <div className="font-display text-3xl font-extrabold text-sage-800 dark:text-sage-400">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-sage-950/60 dark:text-sage-200/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
