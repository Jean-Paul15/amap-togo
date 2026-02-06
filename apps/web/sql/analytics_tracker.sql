-- Table pour les statistiques de visites
CREATE TABLE IF NOT EXISTS public.analytics (
    page_path TEXT PRIMARY KEY,
    views BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer la racine si elle n'existe pas
INSERT INTO public.analytics (page_path, views)
VALUES ('/', 0)
ON CONFLICT (page_path) DO NOTHING;

-- Activer RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire (pour afficher le compteur)
CREATE POLICY "Public read access" ON public.analytics
    FOR SELECT USING (true);

-- Tout le monde peut incrémenter (via une fonction RPC ou server action qui a les droits service role)
-- Ici, on laisse l'insertion/update ouvert aux authentifiés ou on gère via Server Action (Service Role)
-- Pour simplifier avec Server Action : on peut laisser RLS restrictif et utiliser supabaseAdmin côté serveur.
