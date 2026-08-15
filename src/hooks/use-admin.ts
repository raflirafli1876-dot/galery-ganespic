import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  const userQuery = useQuery({
    queryKey: ["auth-user"],
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
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((row) => row.role as string);
    },
  });

  const isLoading = userQuery.isLoading || (!!userId && rolesQuery.isLoading);
  const isAdmin = (rolesQuery.data ?? []).includes("admin");

  return { user: userQuery.data ?? null, isAdmin, isLoading };
}