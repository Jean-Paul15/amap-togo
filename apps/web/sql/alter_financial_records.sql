-- Ajout de la colonne product_id pour lier une dépense/recette à un produit
alter table public.financial_records
add column if not exists product_id uuid references public.produits(id) on delete set null;

-- Création d'un index pour la performance
create index if not exists idx_financial_product on public.financial_records(product_id);
