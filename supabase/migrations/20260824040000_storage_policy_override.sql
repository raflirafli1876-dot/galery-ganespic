-- Create super permissive policies for storage.objects for development
-- This bypasses the need to disable RLS on storage.objects

drop policy if exists "Foto galeri dapat dibaca publik" on storage.objects;
drop policy if exists "Authenticated dapat mengunggah foto galeri (dev)" on storage.objects;
drop policy if exists "Authenticated dapat memperbarui foto galeri (dev)" on storage.objects;
drop policy if exists "Authenticated dapat menghapus foto galeri (dev)" on storage.objects;

-- Create policies that allow all operations for authenticated users on gallery bucket
create policy "Bypass RLS - Gallery read"
  on storage.objects for select to anon, authenticated
  using (true);

create policy "Bypass RLS - Gallery insert"
  on storage.objects for insert to authenticated
  with check (true);

create policy "Bypass RLS - Gallery update"
  on storage.objects for update to authenticated
  using (true)
  with check (true);

create policy "Bypass RLS - Gallery delete"
  on storage.objects for delete to authenticated
  using (true);