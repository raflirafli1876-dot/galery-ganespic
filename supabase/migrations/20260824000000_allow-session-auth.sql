-- Policy sementara untuk mengizinkan authenticated user melakukan operasi admin
-- PERINGATAN: Ini untuk development/testing. Untuk production, gunakan proper role-based access control
-- TODO: Ganti ini dengan policy yang lebih ketat setelah setup Supabase auth yang proper

-- Drop existing policies if they exist
drop policy if exists "Admin dapat menambah kegiatan" on public.activities;
drop policy if exists "Admin dapat mengubah kegiatan" on public.activities;
drop policy if exists "Admin dapat menghapus kegiatan" on public.activities;
drop policy if exists "Admin dapat menambah foto" on public.activity_photos;
drop policy if exists "Admin dapat mengubah foto" on public.activity_photos;
drop policy if exists "Admin dapat menghapus foto" on public.activity_photos;
drop policy if exists "Admin dapat mengunggah foto galeri" on storage.objects;
drop policy if exists "Admin dapat memperbarui foto galeri" on storage.objects;
drop policy if exists "Admin dapat menghapus foto galeri" on storage.objects;

-- Create new development policies
create policy "Authenticated dapat menambah kegiatan (dev)"
  on public.activities for insert to authenticated
  with check (true);

create policy "Authenticated dapat mengubah kegiatan (dev)"
  on public.activities for update to authenticated
  using (true)
  with check (true);

create policy "Authenticated dapat menghapus kegiatan (dev)"
  on public.activities for delete to authenticated
  using (true);

create policy "Authenticated dapat menambah foto (dev)"
  on public.activity_photos for insert to authenticated
  with check (true);

create policy "Authenticated dapat mengubah foto (dev)"
  on public.activity_photos for update to authenticated
  using (true)
  with check (true);

create policy "Authenticated dapat menghapus foto (dev)"
  on public.activity_photos for delete to authenticated
  using (true);

create policy "Authenticated dapat mengunggah foto galeri (dev)"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "Authenticated dapat memperbarui foto galeri (dev)"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery');

create policy "Authenticated dapat menghapus foto galeri (dev)"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');
