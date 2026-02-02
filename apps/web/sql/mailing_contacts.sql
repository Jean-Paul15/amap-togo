-- Table pour les contacts manuels (mailing list)
create table if not exists public.mailing_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nom text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.mailing_contacts enable row level security;

create policy "Admin only access mailing"
  on public.mailing_contacts
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profils
      join public.roles on profils.role_id = roles.id
      where profils.id = auth.uid()
      and roles.nom = 'admin'
    )
  );
