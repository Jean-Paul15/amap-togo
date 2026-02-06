-- Fix product image upload permissions
-- This script adds the necessary RLS policies for uploading product images

-- 1. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Allow authenticated admins to upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'produits'
  AND EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- 3. Policy: Allow authenticated admins to update product images
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'produits'
  AND EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- 4. Policy: Allow authenticated admins to delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'produits'
  AND EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- 5. Policy: Allow public read access to product images
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'produits'
);

-- Note: Execute this script in your Supabase SQL Editor
-- After running, try uploading a product image again
