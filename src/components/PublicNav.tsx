import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/Logo_xxvganespic.png";
import { developerData } from "@/config/developer-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const NAV_LINKS = [
  { to: "/", hash: "mts", label: "Era MTs" },
  { to: "/", hash: "ma", label: "Era MA" },
  { to: "/", hash: "portal", label: "Portal Admin" },
] as const;

export function PublicNav() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

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
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const localSession = typeof window !== "undefined" ? sessionStorage.getItem("ganespic_admin_session") : null;
      setIsLoggedIn(!!localSession || !!nextSession);
    });
    return () => subscription.unsubscribe();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          to="/"
          className="flex min-w-0 shrink items-center gap-2 font-serif text-lg leading-none tracking-tight text-foreground sm:gap-3 sm:text-2xl"
        >
          <img
            src={logoAsset}
            alt="Logo Angkatan XXV Ganespic"
            className="h-8 w-8 shrink-0 rounded-full object-contain sm:h-10 sm:w-10"
          />
          <span className="truncate">
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="hidden rounded-full border border-foreground/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background sm:inline-flex"
              >
                Developer
              </button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-full border border-foreground/30 p-2 text-foreground transition-colors hover:bg-foreground hover:text-background sm:hidden"
                aria-label="Developer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 20-5.5-5.5L10 9"/><path d="m14 4 5.5 5.5L14 15"/></svg>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Informasi Developer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 flex flex-col items-center">
                <h3 className="font-semibold text-xl text-center">{developerData.name}</h3>
                <div className="h-32 w-32 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
                  {developerData.photo ? (
                    <img
                      src={developerData.photo}
                      alt={developerData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <a
                  href={developerData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Lihat Portofolio
                </a>
                <div className="flex gap-4 w-full">
                  <a
                    href={developerData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 bg-secondary/20 rounded-md text-sm hover:bg-secondary/30 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={developerData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 bg-secondary/20 rounded-md text-sm hover:bg-secondary/30 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={() =>
              isLoggedIn ? navigate({ to: "/admin" }) : navigate({ to: "/auth" })
            }
            className="whitespace-nowrap rounded-full border border-primary/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.18em]"
          >
            {isLoggedIn ? "Dashboard" : "Masuk Admin"}
          </button>
        </div>
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