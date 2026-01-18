# CONTEXT.md - Contexte metier AMAP TOGO

## LIRE CE FICHIER EN PREMIER

Ce fichier explique le metier. Sans cette comprehension, le code sera faux.

## Qu'est-ce que AMAP TOGO ?

AMAP = Association pour le Maintien d'une Agriculture Paysanne

C'est une association au Togo qui :
- Vend des produits agricoles bio et locaux
- Connecte directement producteurs et consommateurs
- Propose des paniers hebdomadaires pre-composes
- Livre principalement a Lome

## Comment ca fonctionne ?

### 1. Les produits

L'AMAP vend des produits agricoles en plusieurs categories :
- Legumes locaux (Ademe, Gboma, Gombo, Ignames...)
- Legumes exotiques (Carotte, Tomate, Chou...)
- Fruits (Ananas, Mangue, Papaye...)
- Herbes aromatiques (Basilic, Menthe, Persil...)
- Cereales (Riz, Mais, Haricot...)
- Viandes locales (Poulet, Pintade, Lapin...)
- Produits transformes (Confiture, Miel, Gari...)
- Plants en mottes (pour jardiner)

Les prix sont en FCFA (Franc CFA). Exemples :
- Tomate : 2200 FCFA/kg
- Gombo : 1500 FCFA/kg
- Poulet bicyclette : 5500 FCFA/piece

### 2. Les paniers AMAP

Chaque semaine, l'admin compose 3 types de paniers :
- Petit panier classique : 4 500 FCFA
- Grand panier classique : 8 000 FCFA
- Panier local : 4 000 FCFA (100% produits locaux)

Le contenu change chaque semaine selon la saison et les recoltes.
L'admin decide quels produits mettre dans chaque panier.

### 3. Les utilisateurs

Types d'utilisateurs :
- Admin : controle total (produits, paniers, commandes, clients)
- Vendeur : peut vendre sur place, gerer les commandes
- Producteur : consulte les commandes (pour plus tard)
- Adherent : client fidele avec systeme de credit prepaye
- Client : achat ponctuel sans engagement

Difference adherent vs client :
- Adherent : peut prepayer et avoir un solde credit
- Client : paie a chaque commande

### 4. Le processus de commande

1. Le client visite le site
2. Il ajoute des produits OU un panier au panier
3. Il passe commande avec son adresse
4. AMAP recoit la commande
5. AMAP contacte un livreur externe
6. Le livreur donne son prix
7. AMAP contacte le client pour confirmer
8. Livraison le mercredi a partir de 11h30

### 5. La livraison

IMPORTANT : AMAP ne gere pas la livraison directement.
- Le client donne son adresse et quartier
- AMAP contacte un livreur independant
- Le livreur fixe son prix selon la distance
- Pas de tarifs fixes dans le systeme

Point de retrait : Ancien Centre Mytro Nunya, Adidogome

### 6. Les paiements

Methodes acceptees :
- Especes (a la livraison)
- TMoney (mobile money Togocel)
- Flooz (mobile money Moov)
- Credit (solde prepaye, adherents uniquement)

Pour TMoney/Flooz : le client paie via son telephone.
Reference de transaction enregistree dans le systeme.

## Ce que le site doit faire

### Site public (clients)

Page d'accueil :
- Presentation AMAP et valeurs bio/local
- Produits de la semaine
- Paniers disponibles cette semaine

Catalogue produits :
- Liste par categorie
- Recherche par nom
- Fiche produit avec prix et unite

Paniers AMAP :
- Les 3 types avec prix
- Contenu de la semaine
- Commander un panier

Panier d'achat :
- Ajouter/retirer produits
- Ajouter un panier AMAP
- Voir le total

Commande :
- Formulaire adresse livraison
- Choix methode paiement
- Validation

Espace client :
- Historique commandes
- Suivi commande en cours
- Solde credit (adherents)

### Back-office (admin/vendeur)

Produits :
- Ajouter/modifier/supprimer
- Gerer le stock
- Activer/desactiver pour la semaine

Paniers :
- Creer les paniers de la semaine
- Choisir les produits dans chaque panier

Commandes :
- Voir toutes les commandes
- Changer le statut
- Enregistrer les paiements

Clients :
- Liste des clients et adherents
- Ajouter du credit (adherents)
- Voir historique

## Informations de contact

- Telephone : +228 92 71 95 96 / 92 64 70 61 / 91 67 87 40
- Email : amap.togo@gmail.com
- Adresse : Ancien Centre Mytro Nunya, Adidogome (pres de l'OTR)
- Livraison : Mercredi a partir de 11h30
