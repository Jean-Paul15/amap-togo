# STYLE_GUIDE.md - Guide de style UI

## Philosophie

Design minimaliste inspire d'Apple : sobre, elegant, fonctionnel.
Pas de degradés, pas d'effets excessifs, pas de conteneurs surdimensionnes.

## Couleurs

```css
/* Couleurs principales */
--background: #FAFAFA
--foreground: #1A1A1A
--primary: #2D5A27        /* Vert nature */
--primary-foreground: #FFFFFF
--secondary: #F5F5F5
--accent: #E8F5E3         /* Vert tres clair */
--muted: #737373
--border: #E5E5E5

/* Pas de degradés */
/* Pas de couleurs vives */
/* Contrast suffisant pour accessibilite */
```

## Typographie

```css
/* Police : Inter ou SF Pro */
font-family: 'Inter', system-ui, sans-serif

/* Hierarchie */
h1: 2.5rem, font-weight: 600
h2: 2rem, font-weight: 600
h3: 1.5rem, font-weight: 500
body: 1rem, font-weight: 400
small: 0.875rem

/* Pas de texte en gras excessif */
/* Line-height confortable : 1.6 */
```

## Espacements

```css
/* Systeme de 4px */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px

/* Marges laterales page : 24px mobile, 48px desktop */
/* Padding conteneurs : 16px a 24px */
```

## Composants

### Boutons
- Coins arrondis subtils (8px)
- Padding genereux (12px 24px)
- Transitions douces (150ms)
- Hover : leger assombrissement, pas de scale

### Cartes
- Background blanc
- Border subtile (#E5E5E5)
- Shadow tres legere ou aucune
- Coins arrondis (12px)

### Inputs
- Border visible mais discrete
- Focus : ring subtil vert
- Placeholder en gris moyen

## Animations

```typescript
// Framer Motion - Subtiles
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
}

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

// Pas d'animations longues
// Pas de bounce excessif
// Pas d'effets spectaculaires
```

## Icones

- Lucide Icons uniquement
- Taille : 20px standard, 24px pour actions
- Stroke width : 1.5 ou 2
- Couleur : muted par defaut, primary au hover

## Images

- Ratio preserve
- Object-fit: cover pour les produits
- Placeholder blur pendant chargement
- Alt text obligatoire en francais

## Responsive

- Mobile-first
- Breakpoints : sm(640), md(768), lg(1024), xl(1280)
- Navigation mobile : menu hamburger simple
- Grilles : 1 col mobile, 2 tablette, 3-4 desktop

## A eviter

- Degradés de couleur
- Ombres portees marquees
- Animations longues ou complexes
- Conteneurs trop larges (max 1200px)
- Texte centre partout
- Trop de couleurs
- Emoji dans l'interface (utiliser icones)
