# AGENTS.md - Instructions pour GitHub Copilot

## IMPORTANT : Lire en premier

1. CONTEXT.md - Comprendre le metier AMAP (OBLIGATOIRE)
2. PRICES.md - Les prix officiels des produits
3. DATABASE_SCHEMA.json - Structure de la base de donnees

## Contexte projet

Plateforme AMAP TOGO : vente de produits agricoles bio, gestion adherents, paniers hebdomadaires.

## Regles de code

- Zero emoji dans le code
- Textes francais avec accents
- Fichiers de 100 lignes maximum
- Une responsabilite par fichier

## Recherche schema base de donnees

Avant toute manipulation de donnees, consulter le schema :

```powershell
# Windows PowerShell
Select-String -Path "DATABASE_SCHEMA.json" -Pattern "nom_table"
```

```bash
# Git Bash / WSL
grep -r "nom_table" DATABASE_SCHEMA.json
```

## Structure des imports

```typescript
// 1. Imports externes
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Imports internes
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/use-products'

// 3. Imports types
import type { Product } from '@/types/database'
```

## Nommage

- Composants : PascalCase (ProductCard.tsx)
- Hooks : camelCase avec prefix use (useProducts.ts)
- Utilitaires : camelCase (formatPrice.ts)
- Types : PascalCase (Product, Order)
- Variables : camelCase francais acceptable (produitActif)

## Fichiers a consulter

1. CONVENTIONS.md : regles de code
2. ARCHITECTURE.md : structure dossiers
3. STYLE_GUIDE.md : design UI
4. DATABASE_GUIDE.md : schema BDD
5. FEATURES.md : prompts des fonctionnalites

## Generation de code

- Privilegier les composants serveur Next.js
- Utiliser TanStack Query pour les mutations
- Zustand pour l'etat global (panier)
- Zod pour la validation
