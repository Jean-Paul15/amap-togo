# DATABASE_GUIDE.md - Guide base de donnees

## Consulter le schema

Le fichier DATABASE_SCHEMA.json contient la structure complete.

### Recherche rapide

```bash
# Linux / Mac / Git Bash
grep -r "nom_table" DATABASE_SCHEMA.json
grep -r "nom_colonne" DATABASE_SCHEMA.json

# Windows PowerShell
Select-String -Path "DATABASE_SCHEMA.json" -Pattern "nom_table"
```

## Tables principales

### categories
Contient les categories de produits (legumes locaux, fruits, etc.)

### produits
Catalogue des produits avec prix, stock, disponibilite.

### profils
Utilisateurs lies a Supabase Auth. Roles : admin, vendeur, producteur, adherent, client.

### paniers_types
Types de paniers fixes : petit (4500F), grand (8000F), local (4000F).

### paniers_semaine
Paniers de chaque semaine avec dates de validite.

### paniers_contenu
Produits dans un panier de la semaine donnee.

### commandes
Commandes clients avec statut, montants, adresse livraison libre.
Note : pas de zones fixes, le livreur externe fixe son prix.

### commandes_lignes
Produits individuels dans une commande.

### commandes_paniers
Paniers AMAP dans une commande.

### paiements
Paiements recus (especes, TMoney, Flooz, credit).

### mouvements_credit
Historique du credit prepaye des adherents.

## Types enumeres

- user_role : admin, vendeur, producteur, adherent, client
- order_status : en_attente, confirmee, preparee, livree, annulee
- payment_status : en_attente, partiel, paye, rembourse
- payment_method : especes, tmoney, flooz, credit
- product_unit : kg, botte, piece, litre, pot, main, plateau
- basket_type : petit, grand, local

## Relations cles

- produits -> categories (categorie_id)
- commandes -> profils (client_id)
- commandes_lignes -> commandes, produits
- paniers_semaine -> paniers_types
- paniers_contenu -> paniers_semaine, produits

## Securite RLS

Toutes les tables ont RLS active.
- Lecture publique : categories, produits, paniers
- Lecture privee : profils, commandes (propre ou staff)
- Ecriture : staff uniquement sauf insertion commande

## Fonctions utiles

- auth_role() : retourne le role de l'utilisateur connecte
- is_staff() : true si admin ou vendeur
- generate_order_number() : cree numero AMAP-2025-00001
- calculate_order_total(order_id) : calcule total commande
