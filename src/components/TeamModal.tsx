import { useEffect } from 'react';
import { X, ExternalLink, Code2, Sparkles } from 'lucide-react';
import type { TeamMember } from '@/lib/supabase';

type TeamModalProps = {
  open: boolean;
  onClose: () => void;
  members: TeamMember[];
  loading: boolean;
};

export default function TeamModal({ open, onClose, members, loading }: TeamModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-sage-950/80 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      style={{ animation: 'var(--animate-fade-in)' }}
    >
      <div
        className="relative my-8 w-full max-w-4xl rounded-3xl border border-sage-200 bg-cream-50 p-6 shadow-2xl sm:p-8 dark:border-sage-800 dark:bg-sage-950"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'var(--animate-scale-in)' }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition hover:bg-sage-200 dark:bg-sage-900 dark:text-sage-300 dark:hover:bg-sage-800"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-400 text-sage-950 shadow-lg shadow-sage-400/30">
            <Sparkles size={28} />
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-sage-900 dark:text-sage-100">
            Tim Pengembang
          </h2>
          <p className="mt-2 text-sage-800/70 dark:text-sage-200/70">
            Di balik website galeri angkatan ini, ada tim yang berdedikasi.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-sage-100 dark:bg-sage-900/40" />
            ))}
          </div>
        )}

        {/* Member cards */}
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {members.map((m, i) => (
              <div
                key={m.id}
                className="group flex items-start gap-4 rounded-2xl border border-sage-100 bg-white p-5 transition-all hover:shadow-lg hover:shadow-sage-400/10 dark:border-sage-900 dark:bg-sage-900/30"
                style={{
                  animation: 'var(--animate-fade-up)',
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="relative flex-shrink-0">
                  {m.photo_url ? (
                    <img
                      src={m.photo_url}
                      alt={m.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-sage-200 text-xl font-bold text-sage-700">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-400 text-[10px] font-bold text-sage-950 ring-2 ring-white dark:ring-sage-950">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-sage-900 dark:text-sage-100">
                    {m.name}
                  </h3>
                  <p className="text-sm font-medium text-sage-500">{m.role}</p>
                  {m.bio && (
                    <p className="mt-1.5 text-sm leading-relaxed text-sage-800/60 line-clamp-2 dark:text-sage-200/60">
                      {m.bio}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.portfolio_url && (
                      <a
                        href={m.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sage-400 px-3 py-1.5 text-xs font-semibold text-sage-950 transition hover:bg-sage-300"
                      >
                        <ExternalLink size={13} />
                        Portofolio
                      </a>
                    )}
                    {m.github_url && (
                      <a
                        href={m.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sage-200 bg-cream-50 px-3 py-1.5 text-xs font-semibold text-sage-700 transition hover:bg-sage-100 dark:border-sage-800 dark:bg-sage-950 dark:text-sage-300 dark:hover:bg-sage-900"
                      >
                        <Code2 size={13} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-sage-800/50 dark:text-sage-200/50">
          Dibuat dengan dedikasi untuk Angkatan XXV Ganespic
        </p>
      </div>
    </div>
  );
}
