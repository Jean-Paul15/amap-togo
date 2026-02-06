-- Create actualites (news/blog) table
-- This table stores news articles and blog posts for the AMAP-TOGO website

-- 1. Create the actualites table
CREATE TABLE IF NOT EXISTS actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenu TEXT NOT NULL,
  extrait TEXT,
  image_url TEXT,
  categorie TEXT DEFAULT 'général',
  auteur_id UUID REFERENCES profils(id) ON DELETE SET NULL,
  publie BOOLEAN DEFAULT false,
  date_publication TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_actualites_publie ON actualites(publie);
CREATE INDEX IF NOT EXISTS idx_actualites_date_publication ON actualites(date_publication DESC);
CREATE INDEX IF NOT EXISTS idx_actualites_categorie ON actualites(categorie);
CREATE INDEX IF NOT EXISTS idx_actualites_slug ON actualites(slug);

-- 3. Enable RLS
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Public can read published articles
CREATE POLICY "Public can view published articles"
ON actualites
FOR SELECT
TO public
USING (publie = true);

-- Authenticated users can view all articles (for preview)
CREATE POLICY "Authenticated can view all articles"
ON actualites
FOR SELECT
TO authenticated
USING (true);

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
ON actualites
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- Admins can update articles
CREATE POLICY "Admins can update articles"
ON actualites
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
ON actualites
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

-- 5. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_actualites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actualites_updated_at
BEFORE UPDATE ON actualites
FOR EACH ROW
EXECUTE FUNCTION update_actualites_updated_at();

-- 6. Add storage policy for article images (in 'actualites' folder)
CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'actualites'
  AND EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'actualites'
  AND EXISTS (
    SELECT 1 FROM profils p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()
    AND r.nom = 'admin'
  )
);

CREATE POLICY "Public can view article images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'actualites'
);

-- Note: Execute this script in your Supabase SQL Editor
