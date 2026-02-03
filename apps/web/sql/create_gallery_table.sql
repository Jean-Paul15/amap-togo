-- Table pour la galerie dynamique (Nos Cultures)
create table if not exists gallery_media (
  id uuid default gen_random_uuid() primary key,
  title text,
  url text not null,
  type text default 'image' check (type in ('image', 'video')), -- Support image & video
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Sécurité)
alter table gallery_media enable row level security;

-- Tout le monde peut voir
create policy "Public can view gallery"
  on gallery_media for select
  using (true);

-- Seuls les admins peuvent modifier (à adapter selon ta logique auth, ici permissif pour dev ou basique)
-- Pour l'instant on ouvre l'écriture pour faciliter le dev admin, à restreindre ensuite
create policy "Admin can insert gallery"
  on gallery_media for insert
  with check (true);

create policy "Admin can delete gallery"
  on gallery_media for delete
  using (true);
