# CLAUDE.md - Instructions pour Claude Code

## IMPORTANT : Lire en premier

1. CONTEXT.md - Comprendre le metier AMAP (OBLIGATOIRE)
2. PRICES.md - Les prix officiels des produits
3. DATABASE_SCHEMA.json - Structure de la base de donnees

## Projet

AMAP TOGO : plateforme e-commerce et gestion pour association agricole bio au Togo.

## Regles absolues

- Jamais d'emoji dans le code
- Accents obligatoires pour tous les textes francais
- Maximum 100 lignes par fichier
- Consulter DATABASE_SCHEMA.json avant toute operation sur les donnees
- Rechercher les tables avec : `grep -r "nom_table" DATABASE_SCHEMA.json`

## Avant de coder

1. Lire CONTEXT.md pour comprendre le metier
2. Lire CONVENTIONS.md pour le style de code
3. Lire ARCHITECTURE.md pour la structure des dossiers
4. Lire STYLE_GUIDE.md pour le design UI
5. Consulter DATABASE_SCHEMA.json pour les tables
6. Chercher sur internet les conventions 2025-2026 si necessaire

## Stack technique

### Site client (apps/web)
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui + Radix UI
- Lucide Icons
- Framer Motion
- Zustand
- React Hook Form + Zod
- TanStack Query

### Back-office (apps/admin)
- Refine
- Supabase connector
- Meme base UI

### Backend
- Supabase (PostgreSQL, Auth, Storage, RLS)

## Commandes utiles

```bash
# Demarrer le projet
pnpm dev

# Lint
pnpm lint

# Types
pnpm typecheck

# Rechercher dans le schema
grep -r "produits" DATABASE_SCHEMA.json
```

## Points de vigilance

- SSR/SSG pour pre-charger les donnees
- Pas de loading visible au chargement initial
- Responsive mobile-first
- SEO complet (metadata, sitemap, robots.txt)
- Securite : RLS active sur toutes les tables
