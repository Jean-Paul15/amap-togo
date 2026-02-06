-- Fix RLS policies for paniers_types table
-- The error "new row violates row-level security policy" means we need proper policies

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to paniers_types" ON paniers_types;
DROP POLICY IF EXISTS "Allow authenticated users to manage paniers_types" ON paniers_types;
DROP POLICY IF EXISTS "Allow admin to manage paniers_types" ON paniers_types;

-- Enable RLS on the table
ALTER TABLE paniers_types ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow everyone to read active basket types (for public pages)
CREATE POLICY "Allow public read access to paniers_types"
ON paniers_types
FOR SELECT
TO public
USING (true);

-- Policy 2: Allow authenticated users to insert/update/delete basket types
-- (You can restrict this to admin only if needed)
CREATE POLICY "Allow authenticated users to manage paniers_types"
ON paniers_types
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'paniers_types';
