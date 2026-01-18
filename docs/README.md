# AMAP TOGO - Instructions de developpement

## Presentation

Plateforme e-commerce et gestion pour AMAP TOGO (Association pour le Maintien d'une Agriculture Paysanne).

## IMPORTANT : Ordre de lecture

1. **CONTEXT.md** - Comprendre le metier (LIRE EN PREMIER)
2. **PRICES.md** - Tous les prix officiels
3. **DATABASE_SCHEMA.json** - Structure BDD (a generer)

## Ou mettre DATABASE_SCHEMA.json ?

Apres avoir execute les fichiers SQL dans Supabase :
1. Executer sql/10_export_schema.sql dans Supabase SQL Editor
2. Copier le JSON retourne
3. Creer DATABASE_SCHEMA.json a la racine du projet
4. Coller le JSON dedans

## Fichiers d'instructions

| Fichier | Description |
|---------|-------------|
| CONTEXT.md | Contexte metier complet (LIRE EN PREMIER) |
| PRICES.md | Fiche de prix officielle |
| CLAUDE.md | Instructions pour Claude Code |
| AGENTS.md | Instructions pour GitHub Copilot |
| CONVENTIONS.md | Conventions de code |
| ARCHITECTURE.md | Structure des dossiers |
| STYLE_GUIDE.md | Guide UI minimaliste |
| DATABASE_GUIDE.md | Guide base de donnees |
| SETUP.md | Installation du projet |

## Fichiers SQL

Executer dans l'ordre dans Supabase SQL Editor :

1. sql/SCHEMA_01.sql : Extensions, types, categories, produits
2. sql/SCHEMA_02.sql : Profils, paniers, commandes
3. sql/SCHEMA_03.sql : Paiements, fonctions, triggers
4. sql/SCHEMA_04.sql : Row Level Security (RLS)

## Features (prompts etape par etape)

Voir features/INDEX.md pour l'ordre d'implementation.

## Stack technique

### Front-end
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui + Radix UI
- Lucide Icons
- Framer Motion
- Zustand
- TanStack Query

### Back-office
- Refine + Supabase connector

### Backend
- Supabase (PostgreSQL, Auth, Storage, RLS)

## Regles importantes

- Maximum 100 lignes par fichier
- Pas d'emoji dans le code
- Accents pour les textes francais
- Consulter DATABASE_SCHEMA.json avant toute operation BDD
- SSR/SSG pour pre-charger les donnees
- Design minimaliste style Apple

## Contact AMAP TOGO

- Telephone : +228 92 71 95 96 / 92 64 70 61 / 91 67 87 40
- Email : amap.togo@gmail.com
- Adresse : Ancien Centre Mytro Nunya, Adidogome, Lome
