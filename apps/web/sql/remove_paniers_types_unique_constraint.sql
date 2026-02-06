-- Remove unique constraint on 'type' column in paniers_types
-- This allows multiple basket types with the same type (e.g., multiple "Petit" baskets)

-- Drop the unique constraint
ALTER TABLE paniers_types DROP CONSTRAINT IF EXISTS paniers_types_type_key;

-- Verify the constraint is removed
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'paniers_types'::regclass;
