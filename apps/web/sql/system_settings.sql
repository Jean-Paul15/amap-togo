-- Table pour les parametres systeme dynamiques
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des cles par defaut pour SMTP
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('smtp_user', '', 'Adresse email pour l''envoi SMTP'),
    ('smtp_password', '', 'Mot de passe d''application pour l''envoi SMTP')
ON CONFLICT (key) DO NOTHING;

-- Activer RLS (Row Level Security)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Politique : Seulement les admins peuvent voir/modifier
-- (Suppose que vous avez une fonction ou un claim pour verifier le role admin)
-- Pour simplifier ici, on autorise l'accès authentifié, mais idéalement restreindre aux admins
CREATE POLICY "Enable all for authenticated users" ON public.system_settings
    FOR ALL USING (auth.role() = 'authenticated');
