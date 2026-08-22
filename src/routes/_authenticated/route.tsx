import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const localSession = typeof window !== "undefined" ? sessionStorage.getItem("ganespic_admin_session") : null;
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed && typeof parsed === "object" && parsed.username === "adminganespic") {
          return { user: { email: parsed.username } };
        }
      } catch {
        // Invalid session format, proceed to Supabase fallback
      }
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});