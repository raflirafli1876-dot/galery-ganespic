import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Activity = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  display_order: number;
};

export type GalleryItem = {
  id: string;
  activity_id: string;
  title: string;
  image_url: string;
  description: string | null;
  display_order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  display_order: number;
};

export type ActivityWithItems = Activity & {
  items: GalleryItem[];
};

export async function fetchGallery(): Promise<ActivityWithItems[]> {
  const [{ data: activities, error: actError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase.from('activities').select('*').order('display_order', { ascending: true }),
      supabase.from('gallery_items').select('*').order('display_order', { ascending: true }),
    ]);

  if (actError) throw actError;
  if (itemError) throw itemError;

  const list = (activities ?? []) as Activity[];
  const photos = (items ?? []) as GalleryItem[];

  return list.map((a) => ({
    ...a,
    items: photos.filter((p) => p.activity_id === a.id),
  }));
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as TeamMember[];
}
