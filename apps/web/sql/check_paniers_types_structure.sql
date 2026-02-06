-- Vérifier la structure de la table paniers_types
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'paniers_types'
ORDER BY ordinal_position;

-- Vérifier les contraintes
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'paniers_types'::regclass;
