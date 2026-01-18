# Strategie de Cache : Stale-While-Revalidate (SWR)

## Principe

L'application utilise une strategie de cache **Stale-While-Revalidate** pour offrir une experience utilisateur optimale :

1. **Affichage instantane** : Les donnees en cache sont affichees immediatement
2. **Revalidation silencieuse** : En arriere-plan, les donnees sont verifiees/mises a jour
3. **Mise a jour reactive** : L'UI se met a jour automatiquement si les donnees changent

## Implementation

### 1. Chargement SSR (Server-Side Rendering)

Les donnees sont chargees cote serveur dans `layout.tsx` :

```tsx
// apps/web/src/app/layout.tsx
export default async function RootLayout({ children }) {
  const [productsData, authData] = await Promise.all([
    getProductsData(),  // Charge produits depuis Supabase
    getAuthData(),      // Charge session utilisateur
  ])

  return (
    <AuthProvider initialUser={authData.user} initialProfile={authData.profile}>
      <ProductsProvider 
        initialProducts={productsData.produits}
        initialCategories={productsData.categories}
      >
        {children}
      </ProductsProvider>
    </AuthProvider>
  )
}
```

**Resultat** : Les donnees arrivent avec le HTML initial, pas de chargement visible.

---

### 2. Hydratation Synchrone (Zustand Store)

Le store Zustand est hydrate de maniere synchrone :

```tsx
// components/providers/products-provider.tsx
export function ProductsProvider({ initialProducts, initialCategories }) {
  const hasHydrated = useRef(false)

  // Hydratation SYNCHRONE (avant le premier rendu)
  if (!hasHydrated.current && initialProducts && initialCategories) {
    hasHydrated.current = true
    useProductsStore.setState({
      produits: initialProducts,
      categories: initialCategories,
      isLoaded: true,
    })
  }

  return <>{children}</>
}
```

**Resultat** : Le store est rempli AVANT le premier rendu des composants enfants.

---

### 3. Revalidation en Arriere-Plan

Quand l'utilisateur ouvre le POS, une revalidation silencieuse se declenche :

```tsx
// stores/products-store.ts
const CACHE_DURATION_MS = 2 * 60 * 1000  // 2 minutes

revalidate: async () => {
  const { lastFetchedAt } = get()
  
  // Ne pas revalider si cache encore frais
  if (lastFetchedAt && Date.now() - lastFetchedAt < CACHE_DURATION_MS) {
    return
  }

  // Recharger depuis Supabase
  const [produits, categories] = await fetchFromSupabase()
  set({ produits, categories, lastFetchedAt: Date.now() })
}
```

**Resultat** : L'utilisateur voit les produits instantanement, les mises a jour apparaissent apres quelques secondes.

---

### 4. Revalidation Auth au Focus

Pour l'authentification, une revalidation se fait au retour sur l'onglet :

```tsx
// providers/auth-provider.tsx
useEffect(() => {
  const handleFocus = () => {
    if (initialLoadDone.current) {
      refreshProfile()
    }
  }
  window.addEventListener('focus', handleFocus)
  
  // + Ecoute temps reel via Supabase onAuthStateChange
}, [])
```

**Resultat** : Si l'utilisateur se deconnecte sur un autre onglet, l'etat se met a jour au retour.

---

## Flux de Donnees

```
┌─────────────────────────────────────────────────────────────────┐
│                        SERVEUR (SSR)                            │
│  layout.tsx → getProductsData() + getAuthData()                 │
│       ↓                                                         │
│  HTML avec donnees pre-chargees                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT                                   │
│                                                                 │
│  1. Hydratation synchrone du store Zustand                      │
│     └→ Donnees disponibles IMMEDIATEMENT                        │
│                                                                 │
│  2. Composants se rendent avec donnees en cache                 │
│     └→ Affichage INSTANTANE (pas de spinner)                    │
│                                                                 │
│  3. Revalidation en arriere-plan (si cache > 2 min)             │
│     └→ Mise a jour SILENCIEUSE                                  │
│                                                                 │
│  4. Ecoute temps reel (auth)                                    │
│     └→ Connexion/Deconnexion REACTIVE                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fichiers Concernes

| Fichier | Role |
|---------|------|
| `lib/ssr/get-products.ts` | Chargement SSR des produits |
| `lib/ssr/get-auth.ts` | Chargement SSR de l'auth |
| `providers/auth-provider.tsx` | Contexte React pour l'auth |
| `components/providers/products-provider.tsx` | Hydratation du store produits |
| `stores/products-store.ts` | Store Zustand avec revalidation |
| `stores/cart-store.ts` | Store du panier (persiste en memoire) |

---

## Configuration

### Duree du Cache

```tsx
// stores/products-store.ts
const CACHE_DURATION_MS = 2 * 60 * 1000  // 2 minutes
```

Modifier cette valeur pour ajuster la frequence de revalidation.

### Forcer une Revalidation

```tsx
import { useProductsStore } from '@/stores/products-store'

// Dans un composant
const revalidate = useProductsStore((state) => state.revalidate)
revalidate()  // Force le rechargement
```

---

## Avantages

- **Performance** : Pas de chargement visible, affichage instantane
- **Fraicheur** : Les donnees sont toujours a jour apres quelques secondes
- **UX** : L'utilisateur n'attend jamais, pas de spinner
- **SEO** : Les donnees sont dans le HTML initial (SSR)
- **Resilience** : Fonctionne meme si la revalidation echoue (cache utilise)
