-- Make storage policies super permissive for development
-- This ensures any authenticated user can do anything with storage

drop policy if exists "Bypass RLS - Gallery read" on storage.objects;
drop policy if exists "Bypass RLS - Gallery insert" on storage.objects;
drop policy if exists "Bypass RLS - Gallery update" on storage.objects;
drop policy if exists "Bypass RLS - Gallery delete" on storage.objects;

-- Create completely permissive policies
create policy "Dev - Storage read"
  on storage.objects for select to anon, authenticated
  using (true);

create policy "Dev - Storage insert"
  on storage.objects for insert to authenticated
  with check (true);

create policy "Dev - Storage update"
  on storage.objects for update to authenticated
  using (true)
  with check (true);

create policy "Dev - Storage delete"
  on storage.objects for delete to authenticated
  using (true);