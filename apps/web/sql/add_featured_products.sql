-- Add featured flag to products table
-- This allows admins to select which products appear on the homepage

-- 1. Add the 'en_vedette' column to produits table
ALTER TABLE produits 
ADD COLUMN IF NOT EXISTS en_vedette BOOLEAN DEFAULT false;

-- 2. Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_produits_en_vedette 
ON produits(en_vedette) 
WHERE en_vedette = true AND actif = true;

-- 3. Mark some initial products as featured (optional - you can do this via admin UI later)
-- Example: Mark the first 6 active products as featured
UPDATE produits 
SET en_vedette = true 
WHERE id IN (
  SELECT id 
  FROM produits 
  WHERE actif = true 
  ORDER BY nom 
  LIMIT 6
);

-- Note: After running this script, you can manage featured products via the admin UI
-- by adding a toggle in the products list page
