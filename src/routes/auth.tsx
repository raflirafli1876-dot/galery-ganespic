import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { next?: string } =>
    typeof s["next"] === "string" ? { next: s["next"] } : {},
  head: () => ({
    meta: [
      { title: "Masuk Admin — Ganespic XXV" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const ADMIN_EMAIL_DOMAIN = "@ganespic.local";

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        if (safeNext) window.location.replace(safeNext);
        else navigate({ to: "/admin", replace: true });
      } else {
        setChecking(false);
      }
    });
  }, [navigate, safeNext]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    
    const input = username.trim().toLowerCase();
    if (!input || !password) {
      setError("Username dan kata sandi wajib diisi.");
      return;
    }
    
    setLoading(true);
    
    // Determine if input is email or username
    const email = input.includes("@") ? input : `${input}${ADMIN_EMAIL_DOMAIN}`;
    
    // Login to Supabase auth
    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      setLoading(false);
      setError("Username atau kata sandi salah. Periksa kembali lalu coba lagi.");
      return;
    }
    
    // Check if user has admin role in user_roles table
    if (data.user?.id) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single();
      
      if (roleError || !roleData) {
        setLoading(false);
        setError("User ini bukan admin. Akses ditolak.");
        await supabase.auth.signOut();
        return;
      }
    }
    
    setLoading(false);
    toast.success("Selamat datang kembali, Admin.");
    if (safeNext) window.location.assign(safeNext);
    else navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link to="/" className="font-serif text-3xl tracking-tight text-foreground">
              Ganespic <span className="text-accent-strong">XXV</span>
            </Link>
            <h1 className="mt-8 font-serif text-3xl tracking-tight text-foreground">
              Dasbor Kurator
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Area khusus admin arsip Angkatan XXV.
            </p>
          </div>

          {checking ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">Memeriksa sesi…</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-elegant"
            >
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Username
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="adminganespic"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent-strong"
                />
              </label>

              <label className="mt-5 block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Kata Sandi
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent-strong"
                />
              </label>

              {error && (
                <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-full bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Memproses…" : "Masuk ke Dasbor"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center">
            <Link
              to="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
