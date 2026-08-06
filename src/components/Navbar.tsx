import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X, Code2 } from 'lucide-react';

type NavbarProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenTeam: () => void;
};

const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Kegiatan', href: '#kegiatan' },
  { label: 'Tentang', href: '#tentang' },
];

export default function Navbar({ theme, onToggleTheme, onOpenTeam }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-950 text-sage-300 shadow-md shadow-sage-950/20 dark:bg-sage-400 dark:text-sage-950">
            <Code2 size={22} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-sage-950 dark:text-sage-200">
            Galeri<span className="text-sage-700 dark:text-sage-400">Angkatan</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-sage-950/70 transition-colors hover:bg-white/40 hover:text-sage-950 dark:text-sage-100/70 dark:hover:bg-sage-900/40 dark:hover:text-sage-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label="Ganti tema"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/60 text-sage-800 transition-all hover:scale-105 hover:bg-white/80 dark:border-sage-800 dark:bg-sage-950/50 dark:text-sage-300 dark:hover:bg-sage-900/60"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={onOpenTeam}
            className="hidden items-center gap-2 rounded-xl bg-sage-950 px-4 py-2.5 text-sm font-semibold text-sage-100 shadow-md shadow-sage-950/25 transition-all hover:scale-105 hover:bg-sage-900 sm:flex dark:bg-sage-400 dark:text-sage-950 dark:shadow-sage-400/30 dark:hover:bg-sage-300"
          >
            <Code2 size={16} />
            Tim Pengembang
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/60 text-sage-800 md:hidden dark:border-sage-800 dark:bg-sage-950/50 dark:text-sage-300"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-sage-200/50 glass px-5 py-4 md:hidden dark:border-sage-900">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-sage-950/80 hover:bg-white/40 dark:text-sage-100/80 dark:hover:bg-sage-900/40"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenTeam();
              }}
              className="mt-2 flex items-center gap-2 rounded-xl bg-sage-950 px-4 py-2.5 text-sm font-semibold text-sage-100 dark:bg-sage-400 dark:text-sage-950"
            >
              <Code2 size={16} />
              Tim Pengembang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
