# CONVENTIONS.md - Conventions de code

## Regles generales

- Maximum 100 lignes par fichier
- Une seule responsabilite par fichier
- Zero emoji dans le code
- Accents obligatoires pour les textes francais
- Commentaires en francais

## TypeScript

### Types

```typescript
// Preferer interface pour les objets
interface Produit {
  id: string
  nom: string
  prix: number
}

// Type pour les unions
type StatutCommande = 'en_attente' | 'confirmee' | 'livree'
```

### Fonctions

```typescript
// Typage explicite des parametres et retours
function calculerTotal(items: LigneCommande[]): number {
  return items.reduce((acc, item) => acc + item.prixTotal, 0)
}

// Arrow functions pour les callbacks
const produitsActifs = produits.filter((p) => p.actif)
```

## React

### Composants

```typescript
// Props typees avec interface
interface ProductCardProps {
  produit: Produit
  onAjouter: (id: string) => void
}

// Export nomme, pas default
export function ProductCard({ produit, onAjouter }: ProductCardProps) {
  return (...)
}
```

### Hooks

```typescript
// Prefix use obligatoire
export function useProducts() {
  // ...
}

// Hooks personnalises dans /hooks
```

## Imports

Ordre strict :
1. React et Next.js
2. Bibliotheques externes
3. Composants internes
4. Hooks internes
5. Utilitaires
6. Types

## Nommage fichiers

- Composants : kebab-case (product-card.tsx)
- Pages : kebab-case dans dossiers
- Hooks : use-nom.ts
- Types : types.ts ou nom.types.ts
- Utils : nom-action.ts

## Gestion erreurs

```typescript
// Try-catch avec messages francais
try {
  await creerCommande(data)
} catch (error) {
  toast.error('Erreur lors de la creation de la commande')
}
```

## Constantes

```typescript
// Dans /lib/constants.ts
export const DEVISE = 'FCFA'
export const FRAIS_LIVRAISON_DEFAUT = 800
```
