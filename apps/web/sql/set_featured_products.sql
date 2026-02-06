-- Mark specific products as featured for homepage display
-- These products will appear on the homepage in the "Produits de la semaine" section

-- First, unmark all products as featured
UPDATE produits SET en_vedette = false;

-- Then mark only the selected products as featured
UPDATE produits 
SET en_vedette = true 
WHERE nom IN (
  'Atokouma',
  'Aubergine blanche',
  'Aubergine violette',
  'Avocat',
  'Banane fruit',
  'Banane Plantain',
  'Patate douce',
  'Adémé'
);

-- Verify the changes
SELECT id, nom, en_vedette, actif 
FROM produits 
WHERE en_vedette = true
ORDER BY nom;
