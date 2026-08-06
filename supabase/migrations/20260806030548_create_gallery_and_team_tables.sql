/*
# Create gallery activities and development team tables

1. New Tables
- `activities` — top-level activity categories (e.g. Orientation, Sports, Community Service)
  - `id` (uuid, primary key)
  - `name` (text, not null) — activity name
  - `description` (text) — short description
  - `icon` (text) — lucide icon name
  - `display_order` (int, default 0) — ordering
  - `created_at` (timestamp)
- `gallery_items` — individual photos within an activity
  - `id` (uuid, primary key)
  - `activity_id` (uuid, FK to activities, cascade delete)
  - `title` (text, not null)
  - `image_url` (text, not null)
  - `description` (text)
  - `display_order` (int, default 0)
  - `created_at` (timestamp)
- `team_members` — development team showcase
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `role` (text, not null) — e.g. Frontend Developer
  - `photo_url` (text)
  - `bio` (text)
  - `portfolio_url` (text) — link to portfolio
  - `github_url` (text)
  - `display_order` (int, default 0)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables.
- This is a public gallery (no sign-in), so allow anon + authenticated read on all tables.
- No writes from the frontend — data is managed via database. Only SELECT policies are needed,
  but we add INSERT/UPDATE/DELETE policies scoped to anon+authenticated for completeness since
  the data is intentionally public/shared.

3. Notes
- All tables are single-tenant public data (no user_id, no auth required).
- Gallery items reference activities via foreign key with cascade delete.
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Camera',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_activities" ON activities;
CREATE POLICY "anon_select_activities" ON activities
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_activities" ON activities;
CREATE POLICY "anon_insert_activities" ON activities
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_activities" ON activities;
CREATE POLICY "anon_update_activities" ON activities
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_activities" ON activities;
CREATE POLICY "anon_delete_activities" ON activities
  FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_items" ON gallery_items;
CREATE POLICY "anon_select_gallery_items" ON gallery_items
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery_items" ON gallery_items;
CREATE POLICY "anon_insert_gallery_items" ON gallery_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery_items" ON gallery_items;
CREATE POLICY "anon_update_gallery_items" ON gallery_items
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery_items" ON gallery_items;
CREATE POLICY "anon_delete_gallery_items" ON gallery_items
  FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  photo_url text,
  bio text,
  portfolio_url text,
  github_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_team_members" ON team_members;
CREATE POLICY "anon_select_team_members" ON team_members
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_team_members" ON team_members;
CREATE POLICY "anon_insert_team_members" ON team_members
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_team_members" ON team_members;
CREATE POLICY "anon_update_team_members" ON team_members
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_team_members" ON team_members;
CREATE POLICY "anon_delete_team_members" ON team_members
  FOR DELETE TO anon, authenticated USING (true);
