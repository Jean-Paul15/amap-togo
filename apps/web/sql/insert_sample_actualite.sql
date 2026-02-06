-- Insérer une actualité de démonstration
-- Cette actualité présente une visite au marché local avec les producteurs

-- Note: Vous devrez remplacer 'YOUR_ADMIN_USER_ID' par votre véritable ID utilisateur admin
-- Pour obtenir votre ID, exécutez: SELECT id FROM profils WHERE role_id = (SELECT id FROM roles WHERE nom = 'admin') LIMIT 1;

INSERT INTO actualites (
  titre,
  slug,
  contenu,
  extrait,
  image_url,
  categorie,
  auteur_id,
  publie,
  date_publication
) VALUES (
  'Rencontre avec nos producteurs locaux au marché',
  'rencontre-producteurs-locaux-marche',
  'Une belle journée de rencontre et d''échanges avec nos producteurs partenaires au marché local de Lomé !

Cette semaine, nous avons eu le plaisir d''organiser une visite au marché pour rencontrer directement les agriculteurs qui cultivent les produits frais que vous retrouvez dans vos paniers AMAP.

C''était l''occasion de découvrir la diversité des produits locaux disponibles : légumes verts frais, bananes plantain, fruits de saison, et bien plus encore. Nos producteurs ont partagé avec passion leur savoir-faire et leur engagement pour une agriculture respectueuse de l''environnement.

Ces rencontres directes entre consommateurs et producteurs sont au cœur de notre démarche AMAP. Elles permettent de créer du lien, de comprendre d''où viennent nos aliments et de valoriser le travail des agriculteurs locaux.

Un grand merci à tous les participants et à nos producteurs pour leur accueil chaleureux !

Restez connectés pour nos prochaines visites et événements.',
  'Découvrez notre visite au marché local de Lomé où nous avons rencontré nos producteurs partenaires. Une belle journée d''échanges autour des produits frais et locaux.',
  '/images/actualites/visite-marche-local.jpg',
  'visite',
  (SELECT id FROM profils WHERE role_id = (SELECT id FROM roles WHERE nom = 'admin') LIMIT 1),
  true,
  NOW()
);

-- Vérifier l'insertion
SELECT id, titre, slug, categorie, publie, date_publication 
FROM actualites 
WHERE slug = 'rencontre-producteurs-locaux-marche';
