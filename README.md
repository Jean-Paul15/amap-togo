# AMAP TOGO - Monorepo

Plateforme e-commerce et gestion pour association agricole bio au Togo.

## Structure du projet

```
amap-togo/
├── apps/
│   ├── web/              # Site client Next.js
│   └── admin/            # Back-office Refine
├── packages/
│   ├── ui/               # Composants partagés
│   ├── database/         # Types et client Supabase
│   └── utils/            # Fonctions utilitaires
├── docs/                 # Documentation complète
├── features/             # Spécifications des fonctionnalités
└── sql/                  # Scripts SQL Supabase
```

## Démarrage rapide

```bash
# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Site client: http://localhost:3000
# Back-office: http://localhost:3001
```

## Documentation

### Pour démarrer
- [guides/START_HERE.md](guides/START_HERE.md) - **Commencez ici**
- [guides/INSTALL.md](guides/INSTALL.md) - Installation complète
- [guides/GUIDE_UTILISATEUR.md](guides/GUIDE_UTILISATEUR.md) - Travailler avec l'IA

### Instructions pour l'IA
- [CLAUDE.md](CLAUDE.md) - Instructions pour Claude Code
- [AGENTS.md](AGENTS.md) - Instructions pour GitHub Copilot

### Documentation technique
- [docs/CONTEXT.md](docs/CONTEXT.md) - Le métier AMAP (OBLIGATOIRE)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Structure du code
- [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Design UI (couleur principale: VERT)
- [DATABASE_SCHEMA.json](DATABASE_SCHEMA.json) - Schéma de la base

## Stack technique

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, TanStack Query
- **Monorepo**: Turborepo, pnpm workspaces

## Déploiement Vercel

Deux projets Vercel à créer :
1. Site client → apps/web
2. Back-office → apps/admin

Vercel détecte automatiquement le monorepo Turborepo.
