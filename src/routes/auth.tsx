import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

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

// Hardcoded credentials
const ADMIN_USERNAME = "adminganespic";
const ADMIN_PASSWORD = "ganespicxxvadmin";

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    
    const input = username.trim().toLowerCase();
    if (!input || !password) {
      setError("Username dan kata sandi wajib diisi.");
      return;
    }
    
    setLoading(true);
    
    // Simple credential check - hardcoded in code
    if (input === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoading(false);
      toast.success("Selamat datang kembali, Admin.");
      
      if (safeNext) window.location.assign(safeNext);
      else navigate({ to: "/admin" });
    } else {
      setLoading(false);
      setError("Username atau kata sandi salah. Periksa kembali lalu coba lagi.");
    }
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
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-10 text-sm text-foreground outline-none transition-colors focus:border-accent-strong"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
