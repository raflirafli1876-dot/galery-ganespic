import { Code2, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="tentang"
      className="relative border-t border-sage-700/50 bg-sage-800 py-16 dark:border-sage-900 dark:bg-sage-950/50"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-400 text-sage-950">
                <Code2 size={22} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight text-sage-100">
                Galeri<span className="text-sage-400">Angkatan</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sage-100/70">
              Website galeri kenangan Angkatan XXV Ganespic. Mengabadikan setiap momen kebersamaan
              dalam satu tempat.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-sage-300">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Beranda", href: "#home" },
                { label: "Galeri", href: "#galeri" },
                { label: "Kegiatan", href: "#kegiatan" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-sage-100/70 transition hover:text-sage-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Motto */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-sage-300">
              Motto Angkatan
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-sage-100/70">
              Satu angkatan, satu keluarga. Dengan semangat Ganespic, kami melangkah bersama menuju
              masa depan.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage-400/20 px-4 py-1.5 text-sm font-semibold text-sage-200">
              <Sparkles size={14} className="text-sage-400" />
              Melangkah Kedepan Menuju Kemenangan
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sage-700/50 pt-8 sm:flex-row dark:border-sage-900">
          <p className="text-sm text-sage-100/50">
            &copy; {new Date().getFullYear()} Angkatan XXV Ganespic. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-sage-100/50">
            Dibuat dengan <Heart size={14} className="text-sage-400" /> oleh Tim Pengembang
          </p>
        </div>
      </div>
    </footer>
  );
}
