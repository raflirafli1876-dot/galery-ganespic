-- Disable RLS sementara untuk development
-- PERINGATAN: Ini hanya untuk development! Jangan gunakan di production!

-- Disable RLS untuk activities
alter table public.activities disable row level security;

-- Disable RLS untuk activity_photos  
alter table public.activity_photos disable row level security;