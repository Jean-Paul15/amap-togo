-- Create table for weekly products list
-- Allows admin to paste WhatsApp messages or text that displays on homepage

CREATE TABLE IF NOT EXISTS liste_produits_semaine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu TEXT NOT NULL,
  date_publication TIMESTAMPTZ DEFAULT NOW(),
  actif BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active list (only one should be active at a time)
CREATE INDEX IF NOT EXISTS idx_liste_produits_actif ON liste_produits_semaine(actif) WHERE actif = true;

-- Create index for date
CREATE INDEX IF NOT EXISTS idx_liste_produits_date ON liste_produits_semaine(date_publication DESC);

-- Enable RLS
ALTER TABLE liste_produits_semaine ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read active lists
CREATE POLICY "Allow public read access to active lists"
ON liste_produits_semaine
FOR SELECT
TO public
USING (actif = true);

-- Policy: Allow authenticated users to read all lists (for admin)
CREATE POLICY "Allow authenticated read access to all lists"
ON liste_produits_semaine
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to manage lists
CREATE POLICY "Allow authenticated users to manage lists"
ON liste_produits_semaine
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_liste_produits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_liste_produits_semaine_updated_at
BEFORE UPDATE ON liste_produits_semaine
FOR EACH ROW
EXECUTE FUNCTION update_liste_produits_updated_at();

-- Function to ensure only one active list at a time
CREATE OR REPLACE FUNCTION ensure_single_active_liste()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actif = true THEN
    UPDATE liste_produits_semaine
    SET actif = false
    WHERE id != NEW.id AND actif = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_liste_trigger
BEFORE INSERT OR UPDATE ON liste_produits_semaine
FOR EACH ROW
WHEN (NEW.actif = true)
EXECUTE FUNCTION ensure_single_active_liste();
