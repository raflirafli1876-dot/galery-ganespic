import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const localSessionQuery = useQuery({
    queryKey: ["local-admin-session"],
    queryFn: () => {
      if (typeof window === "undefined") return null;
      const session = sessionStorage.getItem("ganespic_admin_session");
      if (!session) return null;
      try {
        const parsed = JSON.parse(session);
        if (parsed && typeof parsed === "object" && parsed.username === "adminganespic") {
          return parsed;
        }
        return null;
      } catch {
        return null;
      }
    },
  });

  const localSession = localSessionQuery.data;

  const userQuery = useQuery({
    queryKey: ["auth-user"],
    enabled: !localSession,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data.user;
    },
    staleTime: 30_000,
  });

  const userId = userQuery.data?.id ?? null;

  const rolesQuery = useQuery({
    queryKey: ["my-roles", userId],
    enabled: !!userId && !localSession,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((row) => row.role as string);
    },
  });

  if (localSession) {
    return {
      user: { email: localSession.username || "adminganespic" },
      isAdmin: true,
      isLoading: false,
    };
  }

  const isLoading = userQuery.isLoading || (!!userId && rolesQuery.isLoading);
  const isAdmin = (rolesQuery.data ?? []).includes("admin");

  return { user: userQuery.data ?? null, isAdmin, isLoading };
}