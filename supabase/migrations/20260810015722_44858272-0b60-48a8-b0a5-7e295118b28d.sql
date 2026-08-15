drop policy "Admin dapat menambah kegiatan" on public.activities;
drop policy "Admin dapat mengubah kegiatan" on public.activities;
drop policy "Admin dapat menghapus kegiatan" on public.activities;
drop policy "Admin dapat menambah foto" on public.activity_photos;
drop policy "Admin dapat mengubah foto" on public.activity_photos;
drop policy "Admin dapat menghapus foto" on public.activity_photos;
drop policy "Admin dapat mengunggah foto galeri" on storage.objects;
drop policy "Admin dapat memperbarui foto galeri" on storage.objects;
drop policy "Admin dapat menghapus foto galeri" on storage.objects;

drop function public.has_role(uuid, public.app_role);

create policy "Admin dapat menambah kegiatan"
  on public.activities for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat mengubah kegiatan"
  on public.activities for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat menghapus kegiatan"
  on public.activities for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "Admin dapat menambah foto"
  on public.activity_photos for insert to authenticated
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat mengubah foto"
  on public.activity_photos for update to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat menghapus foto"
  on public.activity_photos for delete to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "Admin dapat mengunggah foto galeri"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat memperbarui foto galeri"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
create policy "Admin dapat menghapus foto galeri"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));