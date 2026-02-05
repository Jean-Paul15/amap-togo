-- Ajout de la colonne avatar_url a la table profils
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profils'
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.profils
        ADD COLUMN avatar_url TEXT;
    END IF;
END $$;
