-- Drop existing storage policies and create more permissive ones for development
drop policy if exists "Foto galeri dapat dibaca publik" on storage.objects;
drop policy if exists "Authenticated dapat mengunggah foto galeri (dev)" on storage.objects;
drop policy if exists "Authenticated dapat memperbarui foto galeri (dev)" on storage.objects;
drop policy if exists "Authenticated dapat menghapus foto galeri (dev)" on storage.objects;

-- Create permissive policies for development
create policy "Foto galeri dapat dibaca publik"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated dapat mengunggah foto galeri (dev)"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "Authenticated dapat memperbarui foto galeri (dev)"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

create policy "Authenticated dapat menghapus foto galeri (dev)"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');