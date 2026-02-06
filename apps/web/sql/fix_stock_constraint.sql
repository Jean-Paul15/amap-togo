-- Fix stock constraint issue for order confirmation
-- This script investigates and fixes the produits_stock_check constraint violation

-- 1. Check existing constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'produits'::regclass
  AND conname LIKE '%stock%';

-- 2. Check for triggers on commandes table that might update stock
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'commandes';

-- 3. Check for triggers on produits table
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'produits';

-- 4. Temporary fix: Drop the stock check constraint if it's too restrictive
-- (You can re-add it later with a better threshold)
-- ALTER TABLE produits DROP CONSTRAINT IF EXISTS produits_stock_check;

-- 5. Better fix: Modify the constraint to allow negative stock (for backorders)
-- or set a reasonable minimum like -1000
-- ALTER TABLE produits DROP CONSTRAINT IF EXISTS produits_stock_check;
-- ALTER TABLE produits ADD CONSTRAINT produits_stock_check CHECK (stock >= -1000);

-- 6. Best fix: Remove automatic stock deduction on order confirmation
-- Stock should only be deducted when order is marked as 'preparee' or 'livree'
-- This requires finding and modifying the trigger that's causing the issue
