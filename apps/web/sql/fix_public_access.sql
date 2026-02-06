begin;

-- 1. Fix System Settings Access
alter table if exists system_settings enable row level security;
drop policy if exists "Enable read access for all users" on system_settings;
create policy "Enable read access for all users"
on system_settings for select
using ( true );

-- 2. Fix Storage Access (Images)
drop policy if exists "Public Read Access" on storage.objects;
create policy "Public Read Access"
on storage.objects for select
using ( bucket_id = 'images' );

commit;
