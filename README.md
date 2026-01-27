# AMAP TOGO

Plateforme e-commerce pour l'Association pour le Maintien d'une Agriculture Paysanne au Togo.

## Fonctionnalites

- Catalogue de produits bio et locaux
- Paniers AMAP hebdomadaires
- Point de vente (POS) pour les vendeurs
- Back-office de gestion (commandes, stocks, clients)
- Systeme RBAC (gestion des roles et permissions)

## Structure

```
amap-togo/
├── apps/web/          # Application Next.js
├── packages/
│   ├── database/      # Types et client Supabase
│   ├── ui/            # Composants partages
│   └── utils/         # Fonctions utilitaires
├── docs/              # Documentation technique
└── sql/               # Scripts SQL
```

## Installation

```bash
# Prérequis: Node.js 18+, pnpm

pnpm install

# Configurer l'environnement
cp .env.example .env
# Remplir les variables Supabase et Resend dans .env

# ⚠️ IMPORTANT : Nouvelles variables
# Si vous ajoutez une variable dans .env, ajoutez-la aussi dans turbo.json
# (globalEnv, tasks.build.env, tasks.dev.env) pour éviter les erreurs Vercel

pnpm sync-env    # Synchronise .env vers apps/
pnpm dev
# -> http://localhost:3000
```

## Stack technique

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **State**: Zustand, TanStack Query
- **Monorepo**: Turborepo, pnpm workspaces

## Scripts

```bash
pnpm dev       # Developpement
pnpm build     # Build production
pnpm lint      # Linting
```

## Contact AMAP TOGO

- **Telephone**: +228 92 71 95 96
- **Email**: amap.togo@gmail.com
- **Adresse**: Adidogome (pres de l'OTR), Lome, Togo
- **Livraisons**: Mercredi a partir de 11h30

---

© 2026 AMAP TOGO. Tous droits réservés.
