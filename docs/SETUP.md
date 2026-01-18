# SETUP.md - Installation du projet

## Prerequis

- Node.js 20+
- pnpm 8+
- Compte Supabase
- Compte Vercel (optionnel)

## Etape 1 : Creer le projet

```bash
# Creer le monorepo avec Turborepo
pnpm dlx create-turbo@latest amap-togo
cd amap-togo

# Structure initiale
mkdir -p apps/web apps/admin
mkdir -p packages/ui packages/database packages/utils
```

## Etape 2 : Configurer Supabase

1. Creer un projet sur supabase.com
2. Executer les fichiers SQL dans l'ordre (01 a 10)
3. Recuperer les cles API

```bash
# Variables d'environnement
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
```

## Etape 3 : Installer les dependances

```bash
# Dependencies communes
pnpm add -w typescript @types/node

# Site client (apps/web)
cd apps/web
pnpm add next@14 react react-dom
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form @hookform/resolvers zod
pnpm add framer-motion lucide-react
pnpm add tailwindcss postcss autoprefixer
pnpm add -D @types/react @types/react-dom

# shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input
```

## Etape 4 : Configurer Next.js

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' }
    ]
  }
}
module.exports = nextConfig
```

## Etape 5 : Configurer Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D5A27',
        accent: '#E8F5E3'
      }
    }
  },
  plugins: []
}
```

## Etape 6 : Back-office Refine

```bash
cd apps/admin
pnpm add @refinedev/core @refinedev/nextjs-router
pnpm add @refinedev/supabase
pnpm add @refinedev/react-hook-form
```

## Etape 7 : Generer les types Supabase

```bash
pnpm add -D supabase
npx supabase gen types typescript --project-id votre_id > packages/database/src/types.ts
```

## Etape 8 : Scripts package.json

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  }
}
```

## Etape 9 : Lancer le projet

```bash
pnpm dev
```

Site client : http://localhost:3000
Back-office : http://localhost:3001
