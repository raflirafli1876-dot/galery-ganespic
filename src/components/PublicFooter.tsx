export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-3xl tracking-tight text-foreground">
              Ganespic <span className="text-accent-strong">XXV</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Arsip kenangan Angkatan 25 — dari langkah pertama di bangku MTs hingga hari kelulusan
              di MA. Setiap foto adalah halaman kecil dari kisah enam tahun kita bersama.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Era MTs 2023–2026 · Era MA 2026–2029
          </p>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-center font-serif text-lg italic text-accent-strong">
          “Melangkah ke Depan, Menuju Kemenangan”
        </p>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Keluarga Besar Angkatan XXV Ganespic.
        </div>
      </div>
    </footer>
  );
}
