# 🎨 Principes de Modernisation UI - AMAP TOGO

Guide complet pour obtenir un design moderne et professionnel avec animations fluides.

---

## 📋 Table des matières
1. [Principes généraux](#principes-généraux)
2. [Boutons modernes](#boutons-modernes)
3. [Animations Framer Motion](#animations-framer-motion)
4. [Couleurs et gradients](#couleurs-et-gradients)
5. [Espacement et responsive](#espacement-et-responsive)
6. [Effets visuels](#effets-visuels)
7. [Checklist de modernisation](#checklist-de-modernisation)

---

## 🎯 Principes généraux

### 1. **Mobile-First obligatoire**
Toujours commencer par les tailles mobiles, puis augmenter :
```tsx
// ✅ BON
className="text-sm sm:text-base lg:text-lg"
className="px-4 sm:px-6 lg:px-8"

// ❌ MAUVAIS
className="lg:text-lg md:text-base text-sm"
```

### 2. **Pas d'emojis dans le code**
Sauf si explicitement demandé par le client.

### 3. **Accents français obligatoires**
- "Découvrir" ✅ pas "Decouvrir" ❌
- "Créé" ✅ pas "Cree" ❌
- "À partir de" ✅ pas "A partir de" ❌

### 4. **Design cohérent avec le thème**
Pour AMAP TOGO : **VERT** est la couleur principale
- Primary: `green-500` à `emerald-600`
- Accent: `green-400`
- Backgrounds: `green-50` à `green-100`

---

## 🔘 Boutons modernes

### Anatomie d'un bouton moderne

```tsx
<motion.button
  whileHover={{ scale: 1.08, y: -3 }}      // Grossit + monte au hover
  whileTap={{ scale: 0.95 }}                // Rétrécit au clic
  transition={{
    type: 'spring',                         // Animation spring (rebond)
    stiffness: 400,                         // Rigidité
    damping: 10                             // Amortissement
  }}
  className="
    px-8 sm:px-10 py-4 sm:py-5              // Padding généreux
    rounded-full                             // Complètement arrondi (pilule)
    bg-gradient-to-r from-green-500 to-emerald-600  // Gradient
    text-white font-bold                     // Texte blanc et gras
    shadow-2xl shadow-green-500/50          // Ombre colorée
    hover:shadow-green-500/70               // Ombre plus forte au hover
    border-2 border-white/20                // Bordure blanche transparente
    transition-all duration-300              // Transitions fluides
  "
>
  Texte du bouton
</motion.button>
```

### Boutons secondaires

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  className="
    px-6 py-3 rounded-full
    bg-white/15 backdrop-blur-xl           // Fond transparent avec blur
    border-2 border-white/40
    text-white font-semibold
    hover:bg-white/25
    shadow-xl shadow-white/10
  "
>
  Secondaire
</motion.button>
```

### Variantes de boutons

**Bouton Principal (CTA)** :
- `rounded-full` (pilule complète)
- Gradient vert : `from-green-400 via-green-500 to-emerald-600`
- Ombre colorée : `shadow-2xl shadow-green-500/50`
- Bordure : `border-2 border-white/20`
- Hover : scale 1.08 + monte de 3px

**Bouton Secondaire** :
- `rounded-full`
- Fond transparent : `bg-white/15 backdrop-blur-xl`
- Bordure : `border-2 border-white/40`
- Hover : scale 1.05

**Bouton Tertiaire** :
- `rounded-xl` (moins arrondi)
- Fond clair : `bg-green-50`
- Texte coloré : `text-green-700`
- Bordure : `border-2 border-green-200`

---

## 🎬 Animations Framer Motion

### Imports nécessaires

```tsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
```

### 1. Animations au chargement

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  Contenu
</motion.div>
```

### 2. Animations au scroll

```tsx
function Component() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        Contenu qui s'anime au scroll
      </motion.div>
    </section>
  )
}
```

### 3. Animations stagger (cascade)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,    // Délai entre chaque enfant
      delayChildren: 0.2       // Délai avant de commencer
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 4. Hover et Tap

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}     // Au survol
  whileTap={{ scale: 0.95 }}              // Au clic
  transition={{ duration: 0.2 }}
>
  Carte interactive
</motion.div>
```

### 5. Animations infinies

```tsx
// Flèche qui bouge
<motion.div
  animate={{ x: [0, 5, 0] }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  <ArrowRight />
</motion.div>

// Rotation infinie
<motion.div
  whileHover={{ rotate: 360 }}
  transition={{ duration: 0.6 }}
>
  Icône
</motion.div>
```

---

## 🌈 Couleurs et gradients

### Palette AMAP TOGO

```css
/* Couleurs principales */
--primary: #22c55e      /* green-500 */
--primary-dark: #16a34a /* green-600 */
--accent: #4ade80       /* green-400 */
--emerald: #10b981      /* emerald-500 */

/* Backgrounds */
--bg-light: #f0fdf4     /* green-50 */
--bg-medium: #dcfce7    /* green-100 */
```

### Gradients modernes

```tsx
// Gradient principal (boutons CTA)
className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600"

// Gradient de fond
className="bg-gradient-to-br from-green-50 via-white to-emerald-50/50"

// Gradient de texte
className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
```

### Ombres colorées

```tsx
// Ombre verte pour boutons
className="shadow-2xl shadow-green-500/50"
className="hover:shadow-green-500/70"

// Ombre subtile
className="shadow-lg shadow-green-500/20"

// Ombre blanche (pour fonds sombres)
className="shadow-xl shadow-white/10"
```

---

## 📏 Espacement et responsive

### Breakpoints Tailwind

```
sm:  640px   (mobile landscape / petite tablette)
md:  768px   (tablette)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

### Padding responsive

```tsx
// Containers
className="px-4 sm:px-6 lg:px-12"

// Sections verticales
className="py-12 sm:py-16 lg:py-24"

// Boutons
className="px-6 sm:px-8 py-3 sm:py-4"
```

### Texte responsive

```tsx
// Titres hero
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"

// Titres de section
className="text-2xl sm:text-3xl lg:text-4xl"

// Texte normal
className="text-sm sm:text-base lg:text-lg"

// Petits textes
className="text-xs sm:text-sm"
```

### Grilles responsives

```tsx
// Produits (2 → 3 → 4 colonnes)
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"

// Paniers (1 → 3 colonnes)
className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
```

---

## ✨ Effets visuels

### 1. Backdrop blur (flou d'arrière-plan)

```tsx
className="bg-white/10 backdrop-blur-md"  // Léger
className="bg-white/15 backdrop-blur-xl"  // Fort
```

### 2. Overlay sur vidéo/image

```tsx
<div className="relative">
  <video />

  {/* Filtre coloré transparent */}
  <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />

  {/* Gradient pour lisibilité */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60" />

  {/* Contenu par-dessus */}
  <div className="relative z-10">Texte</div>
</div>
```

### 3. Badges et pills

```tsx
<div className="
  inline-flex items-center gap-2
  px-4 py-2
  bg-white/10 backdrop-blur-md
  border border-white/20
  rounded-full
  text-sm font-medium
">
  <Sparkles className="w-4 h-4" />
  <span>Badge</span>
</div>
```

### 4. Cartes avec effet glass

```tsx
<div className="
  bg-white/95 backdrop-blur-md
  border-2 border-gray-100
  rounded-2xl
  shadow-xl
  hover:shadow-2xl
  transition-shadow duration-300
">
  Contenu
</div>
```

### 5. Particules flottantes

```tsx
{[...Array(6)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-2 h-2 bg-green-400/30 rounded-full"
    initial={{
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      scale: 0
    }}
    animate={{
      y: [null, Math.random() * -100 - 50 + '%'],
      scale: [0, 1, 0],
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  />
))}
```

### 6. Barre de progression (scroll)

```tsx
const { scrollYProgress } = useScroll()

<motion.div
  className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
  style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
/>
```

---

## ☑️ Checklist de modernisation

### Avant de commencer
- [ ] Identifier le thème de couleurs (vert pour AMAP)
- [ ] Lister tous les boutons à moderniser
- [ ] Repérer les sections qui ont besoin d'animations

### Pour chaque bouton
- [ ] Remplacer `rounded-lg` par `rounded-full`
- [ ] Ajouter `motion.button` avec hover/tap
- [ ] Utiliser gradient : `from-[couleur] via-[couleur] to-[couleur]`
- [ ] Ajouter ombre colorée : `shadow-2xl shadow-[couleur]/50`
- [ ] Ajouter bordure : `border-2 border-white/20`
- [ ] Font en `font-bold` au lieu de `font-medium`
- [ ] Padding généreux : `px-8 py-4` minimum

### Pour chaque section
- [ ] Ajouter `useRef` et `useInView`
- [ ] Animations d'entrée au scroll
- [ ] Animations stagger pour listes/grilles
- [ ] Badge décoratif en haut
- [ ] Titre avec gradient de texte

### Pour les cartes
- [ ] Border-radius : `rounded-2xl` minimum
- [ ] Hover : `whileHover={{ y: -8, scale: 1.02 }}`
- [ ] Ombres : `shadow-lg hover:shadow-2xl`
- [ ] Bordures : `border-2`
- [ ] Icônes qui tournent au hover

### Effets globaux
- [ ] Barre de progression en haut
- [ ] Bouton "retour en haut" après 50px de scroll
- [ ] Particules décoratives (6 max pour perfs)
- [ ] Scroll indicator animé

### Responsive
- [ ] Tous les textes ont 3+ tailles (base, sm:, lg:)
- [ ] Padding augmente : `px-4 sm:px-6 lg:px-12`
- [ ] Grilles s'adaptent : `grid-cols-1 md:grid-cols-3`
- [ ] Boutons tactiles : `min-w-[44px]` (touch target)

---

## 🎓 Exemples complets

### Page Hero complète

```tsx
<section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden">
  {/* Vidéo background */}
  <div className="absolute inset-0 z-0">
    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
      <source src="/video.mp4" type="video/mp4" />
    </video>

    {/* Filtre vert transparent */}
    <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />

    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60" />
  </div>

  {/* Contenu */}
  <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
        Titre principal
      </h1>

      <motion.div
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8"
      >
        <button className="
          px-10 py-5 rounded-full
          bg-gradient-to-r from-green-400 to-emerald-600
          text-white font-bold
          shadow-2xl shadow-green-500/50
          border-2 border-white/20
        ">
          Call to Action
        </button>
      </motion.div>
    </motion.div>
  </div>
</section>
```

---

## 💡 Conseils pro

1. **Animations** : Moins c'est mieux. 0.3-0.6s max.
2. **Couleurs** : Maximum 3 couleurs principales.
3. **Ombres** : Utilisez la transparence (`/50`, `/30`) pour subtilité.
4. **Hover** : Toujours un feedback visuel (scale, shadow, color).
5. **Mobile** : Testez TOUJOURS sur mobile en premier.
6. **Performance** : Limiter particules à 6-8 maximum.
7. **Accessibilité** : `aria-label` sur tous les boutons icônes.
8. **Cohérence** : Même style de bouton = même fonction.

---

## 🚀 Prompt pour IA

Utilisez ce prompt pour demander à une IA de moderniser votre interface :

```
Modernise cette interface en suivant ces principes :

1. BOUTONS :
- Tous `rounded-full` (pilules complètes)
- Gradient : `bg-gradient-to-r from-green-400 via-green-500 to-emerald-600`
- Ombre : `shadow-2xl shadow-green-500/50`
- Bordure : `border-2 border-white/20`
- Hover : scale 1.08 + monte de 3px
- Font : `font-bold`

2. ANIMATIONS (Framer Motion) :
- Au chargement : `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Au scroll : utiliser `useInView` avec `margin: '-100px'`
- Hover : `whileHover={{ scale: 1.05, y: -3 }}`
- Tap : `whileTap={{ scale: 0.95 }}`
- Stagger : délai de 0.1s entre éléments

3. COULEURS :
- Thème VERT (green-500, emerald-600)
- Gradients de texte : `bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`
- Ombres colorées vertes

4. RESPONSIVE (Mobile-first) :
- Texte : `text-sm sm:text-base lg:text-lg`
- Padding : `px-4 sm:px-6 lg:px-12`
- Grilles : `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

5. EFFETS :
- Backdrop blur sur fonds transparents
- Particules flottantes (6 max)
- Barre de progression au scroll
- Bouton "retour en haut"

6. CARTES :
- `rounded-2xl`
- Hover qui monte : `whileHover={{ y: -8 }}`
- Icônes qui tournent : `whileHover={{ rotate: 360 }}`

Design moderne, professionnel, qui donne envie d'acheter.
Tous les textes français avec accents corrects.
```

---

**Créé pour AMAP TOGO** - Guide de modernisation UI 2025
