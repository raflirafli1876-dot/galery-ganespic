create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Pengguna dapat membaca perannya sendiri"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  era text not null check (era in ('mts', 'ma')),
  grade_level integer not null check (grade_level between 7 and 12),
  activity_date date,
  cover_image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.activities to anon;
grant select, insert, update, delete on public.activities to authenticated;
grant all on public.activities to service_role;
alter table public.activities enable row level security;
create policy "Kegiatan dapat dibaca publik"
  on public.activities for select to anon, authenticated
  using (true);
create policy "Admin dapat menambah kegiatan"
  on public.activities for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat mengubah kegiatan"
  on public.activities for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat menghapus kegiatan"
  on public.activities for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create table public.activity_photos (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.activity_photos to anon;
grant select, insert, update, delete on public.activity_photos to authenticated;
grant all on public.activity_photos to service_role;
alter table public.activity_photos enable row level security;
create policy "Foto dapat dibaca publik"
  on public.activity_photos for select to anon, authenticated
  using (true);
create policy "Admin dapat menambah foto"
  on public.activity_photos for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat mengubah foto"
  on public.activity_photos for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat menghapus foto"
  on public.activity_photos for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Foto galeri dapat dibaca publik"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gallery');
create policy "Admin dapat mengunggah foto galeri"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat memperbarui foto galeri"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));
create policy "Admin dapat menghapus foto galeri"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));

insert into public.activities (id, title, slug, description, era, grade_level, activity_date, cover_image_url, sort_order) values
  ('11111111-1111-4111-8111-111111111107', 'MATSAMA: Hari Pertama di MTs', 'matsama-hari-pertama-mts', 'Masa Ta''aruf Siswa Madrasah — hari-hari pertama kami mengenakan seragam putih biru yang masih kaku dan ragu. Di aula dan lapangan madrasah, kami yang tadinya saling asing perlahan berpadu menjadi satu angkatan. Dari barisan upacara pertama inilah cerita Ganespic XXV dimulai.', 'mts', 7, '2018-07-16', '/__l5e/assets-v1/e7d835e0-ce77-4bae-98a5-7be902a0bd34/mpls-1.jpg', 1),
  ('11111111-1111-4111-8111-111111111108', 'Class Meeting Kelas 8', 'class-meeting-kelas-8', 'Kompetisi antar kelas pertama yang membakar semangat kami. Tarik tambang di lapangan berdebu, balap karung yang penuh tawa, sampai lomba kebersihan kelas — semua diperjuangkan habis-habisan. Kami pulang membawa medali sederhana dan cerita yang tak sederhana.', 'mts', 8, '2019-12-14', '/__l5e/assets-v1/a6595d04-de43-4a56-b632-bae926dc66cc/classmeeting-1.jpg', 2),
  ('11111111-1111-4111-8111-111111111109', 'Study Tour Yogyakarta', 'study-tour-yogyakarta', 'Tiga hari dua malam menjelajah Jogja: menyambut sunrise di Borobudur, berburu oleh-oleh di Malioboro, dan bernyanyi tanpa henti di dalam bus. Perjalanan pamungkas kami sebagai siswa MTs — sekaligus kenangan yang paling sering kami putar ulang.', 'mts', 9, '2020-03-07', '/__l5e/assets-v1/f4e69ef0-80c3-433c-a38c-7d600ffc838f/studytour-1.jpg', 3),
  ('11111111-1111-4111-8111-111111111110', 'Kemah Pramuka Kelas 10', 'kemah-pramuka-kelas-10', 'Tenda-tenda berdiri di tengah kabut pagi, bendera regu berkibar di tiang bambu. Api unggun, nasi hangat dari panci hitam, dan yel-yel yang menggema sampai larut — di perkemahan inilah kami paham bahwa angkatan ini lebih dari sekadar teman sekelas.', 'ma', 10, '2021-09-18', '/__l5e/assets-v1/dab95389-a04d-4df7-affd-2962c4603ae6/kemah-1.jpg', 4),
  ('11111111-1111-4111-8111-111111111111', 'Pentas Seni Kelas 11', 'pentas-seni-kelas-11', 'Panggung yang kami bangun dan hias sendiri, lampu warna-warni di senja hari, dan tepuk tangan yang tak pernah berhenti. Dari tari tradisional sampai band angkatan — malam itu Ganespic XXV bersinar paling terang di antara semua angkatan.', 'ma', 11, '2023-04-22', '/__l5e/assets-v1/39a16f58-c171-4bbb-9968-1bd19a29b5e6/pensi-1.jpg', 5),
  ('11111111-1111-4111-8111-111111111112', 'Wisuda & Perpisahan Kelas 12', 'wisuda-perpisahan-kelas-12', 'Toga, medali, dan confetti di udara. Enam tahun perjalanan dari gerbang MTs sampai panggung wisuda MA ditutup dengan pelukan, tanda tangan di seragam, dan satu janji: sekali Ganespic XXV, selamanya keluarga.', 'ma', 12, '2024-05-11', '/__l5e/assets-v1/e9ff0f02-c471-4571-a86d-87018d925c45/wisuda-1.jpg', 6);

insert into public.activity_photos (activity_id, image_url, caption, sort_order) values
  ('11111111-1111-4111-8111-111111111107', '/__l5e/assets-v1/e7d835e0-ce77-4bae-98a5-7be902a0bd34/mpls-1.jpg', 'Barisan pertama di lapangan madrasah', 0),
  ('11111111-1111-4111-8111-111111111107', '/__l5e/assets-v1/fcaae046-c5aa-4356-9f59-5a3b7d6ad661/mpls-2.jpg', 'Tawa pertama di kelas 7', 1),
  ('11111111-1111-4111-8111-111111111107', '/__l5e/assets-v1/d244f0eb-4dd6-40a8-81ff-e03ef540b2b5/mpls-3.jpg', 'Sepatu baru, cerita baru', 2),
  ('11111111-1111-4111-8111-111111111108', '/__l5e/assets-v1/a6595d04-de43-4a56-b632-bae926dc66cc/classmeeting-1.jpg', 'Tarik tambang paling sengit seangkatan', 0),
  ('11111111-1111-4111-8111-111111111108', '/__l5e/assets-v1/cb4578ab-8b6f-4d54-bd18-45fde17b35c4/classmeeting-2.jpg', 'Balap karung penuh tawa', 1),
  ('11111111-1111-4111-8111-111111111108', '/__l5e/assets-v1/b527f80d-3d4d-426e-9ed7-26853bb5254c/classmeeting-3.jpg', 'Medali kebanggaan kelas', 2),
  ('11111111-1111-4111-8111-111111111109', '/__l5e/assets-v1/f4e69ef0-80c3-433c-a38c-7d600ffc838f/studytour-1.jpg', 'Sunrise di Borobudur', 0),
  ('11111111-1111-4111-8111-111111111109', '/__l5e/assets-v1/234f4a5d-a9b4-4e95-bc26-34587343d080/studytour-2.jpg', 'Senja dari jendela bus', 1),
  ('11111111-1111-4111-8111-111111111109', '/__l5e/assets-v1/e6556b2e-6723-4c4b-a397-b70446f824c8/studytour-3.jpg', 'Berburu oleh-oleh di Malioboro', 2),
  ('11111111-1111-4111-8111-111111111110', '/__l5e/assets-v1/dab95389-a04d-4df7-affd-2962c4603ae6/kemah-1.jpg', 'Kabut pagi di bumi perkemahan', 0),
  ('11111111-1111-4111-8111-111111111110', '/__l5e/assets-v1/22ca8c99-0708-48dc-8158-f7a2113c2640/kemah-2.jpg', 'Nyanyian di depan api unggun', 1),
  ('11111111-1111-4111-8111-111111111110', '/__l5e/assets-v1/253ea6a3-ae7c-465c-a1a4-4992aa299857/kemah-3.jpg', 'Nasi hangat hasil kerja regu', 2),
  ('11111111-1111-4111-8111-111111111111', '/__l5e/assets-v1/39a16f58-c171-4bbb-9968-1bd19a29b5e6/pensi-1.jpg', 'Tari tradisional di senja hari', 0),
  ('11111111-1111-4111-8111-111111111111', '/__l5e/assets-v1/62511ef1-d684-453f-9bee-71a17cc94789/pensi-2.jpg', 'Band angkatan di atas panggung', 1),
  ('11111111-1111-4111-8111-111111111111', '/__l5e/assets-v1/b6fee9c8-a7bc-4664-a1a8-be5c6e23d321/pensi-3.jpg', 'Persiapan di balik panggung', 2),
  ('11111111-1111-4111-8111-111111111112', '/__l5e/assets-v1/e9ff0f02-c471-4571-a86d-87018d925c45/wisuda-1.jpg', 'Hari yang kami nantikan enam tahun', 0),
  ('11111111-1111-4111-8111-111111111112', '/__l5e/assets-v1/1ab39160-6c5c-4236-93b5-b7db1ec58093/wisuda-2.jpg', 'Pelukan perpisahan', 1),
  ('11111111-1111-4111-8111-111111111112', '/__l5e/assets-v1/cf9581a9-e1f0-436d-a0f7-68ff91d8de84/wisuda-3.jpg', 'Seragam penuh tanda tangan', 2);