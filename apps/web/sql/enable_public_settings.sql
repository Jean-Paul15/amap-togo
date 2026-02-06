-- Enable public read access on 'system_settings'
begin;
  alter table if exists system_settings enable row level security;
  
  -- Drop existing policy if it conflicts or is too restrictive
  drop policy if exists "Enable read access for all users" on system_settings;
  
  create policy "Enable read access for all users"
  on system_settings for select
  using ( true );
commit;
