import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Activity, ActivityPhoto, ActivityWithPhotos } from "./gallery-types";

const ACTIVITY_SELECT =
  "id, title, slug, description, era, grade_level, activity_date, cover_image_url, sort_order, activity_photos(id, activity_id, image_url, caption, sort_order)";

function createPublicGalleryClient(): SupabaseClient {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Opaque sb_ keys are not JWTs: send only apikey, not the Authorization bearer.
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function mapRows(rows: Record<string, unknown>[]): ActivityWithPhotos[] {
  return rows.map((row) => {
    const photos = ((row["activity_photos"] ?? []) as ActivityPhoto[])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order);
    const { activity_photos: _photos, ...activity } = row;
    return { ...(activity as unknown as Activity), photos };
  });
}

export async function fetchPublicActivities(): Promise<ActivityWithPhotos[]> {
  const supabase = createPublicGalleryClient();
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return mapRows((data ?? []) as Record<string, unknown>[]);
}

export async function fetchPublicActivityBySlug(slug: string): Promise<ActivityWithPhotos | null> {
  const supabase = createPublicGalleryClient();
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapRows([data as Record<string, unknown>])[0] ?? null;
}