-- Table pour la gestion financière (Recettes / Dépenses)
create table if not exists public.financial_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone not null default now(),
  type text not null check (type in ('recette', 'depense')),
  montant integer not null default 0,
  description text,
  categorie text, -- ex: 'Vente', 'Paiement Producteur', 'Transport'
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table public.financial_records enable row level security;

create policy "Admin only access"
  on public.financial_records
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
