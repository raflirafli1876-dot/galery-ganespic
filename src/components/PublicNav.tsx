import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-xxv.png.asset.json";

const NAV_LINKS = [
  { to: "/", hash: "mts", label: "Era MTs" },
  { to: "/", hash: "ma", label: "Era MA" },
  { to: "/", hash: "portal", label: "Portal Admin" },
] as const;

export function PublicNav() {
  const [session, setSession] = useState<Session | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 font-serif text-2xl leading-none tracking-tight text-foreground"
        >
          <img
            src={logoAsset.url}
            alt="Logo Angkatan XXV Ganespic"
            className="h-10 w-10 rounded-full object-contain"
          />
          <span>
            Ganespic <span className="text-accent-strong">XXV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              to={link.to}
              hash={link.hash}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => (session ? navigate({ to: "/admin" }) : navigate({ to: "/auth" }))}
          className="rounded-full border border-primary/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {session ? "Dasbor Admin" : "Masuk Admin"}
        </button>
      </div>
      {pathname !== "/" && (
        <div className="mx-auto max-w-6xl px-6 pb-3 md:hidden">
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      )}
    </header>
  );
}
