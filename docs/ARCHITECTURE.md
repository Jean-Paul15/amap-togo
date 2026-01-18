# ARCHITECTURE.md - Structure du projet

## Monorepo structure

```
amap-togo/
├── apps/
│   ├── web/              # Site client Next.js
│   └── admin/            # Back-office Refine
├── packages/
│   ├── ui/               # Composants partages
│   ├── database/         # Types et client Supabase
│   └── utils/            # Fonctions utilitaires
├── DATABASE_SCHEMA.json
└── docs/
```

## Site client (apps/web)

```
apps/web/
├── app/
│   ├── (site)/           # Pages publiques
│   │   ├── page.tsx      # Accueil
│   │   ├── produits/
│   │   ├── paniers/
│   │   └── contact/
│   ├── (auth)/           # Authentification
│   │   ├── connexion/
│   │   └── inscription/
│   ├── compte/           # Espace client
│   │   ├── commandes/
│   │   └── profil/
│   ├── api/              # Routes API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/           # Header, Footer, Nav
│   ├── produits/         # Cartes, listes produits
│   ├── panier/           # Panier d'achat
│   ├── commande/         # Formulaire commande
│   └── ui/               # Composants shadcn
├── hooks/
├── lib/
│   ├── supabase/
│   ├── constants.ts
│   └── utils.ts
├── stores/               # Zustand
└── types/
```

## Back-office (apps/admin)

```
apps/admin/
├── app/
│   ├── produits/
│   ├── commandes/
│   ├── clients/
│   ├── paniers/
│   └── parametres/
├── components/
│   ├── layout/
│   └── forms/
├── providers/
└── lib/
```

## Packages partages

```
packages/database/
├── src/
│   ├── client.ts         # Client Supabase
│   ├── types.ts          # Types generes
│   └── queries/          # Requetes reutilisables
└── index.ts

packages/ui/
├── src/
│   ├── button.tsx
│   └── ...
└── index.ts

packages/utils/
├── src/
│   ├── format-price.ts
│   ├── format-date.ts
│   └── ...
└── index.ts
```

## Regles d'architecture

- Composants max 100 lignes
- Une page = un fichier page.tsx
- Logique metier dans /lib ou /hooks
- Types partages dans packages/database
- Composants UI partages dans packages/ui
