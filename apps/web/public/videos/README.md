# Vidéo de fond pour la page d'accueil

## Fichier requis
`amap-hero-background.mp4`

## Spécifications techniques

### Format
- **Type** : MP4 (H.264)
- **Résolution recommandée** : 1920x1080 (Full HD) ou 1280x720 (HD)
- **Taille maximale** : 2-3 MB (optimisé pour le web)
- **Durée** : 10-20 secondes (en boucle)
- **Frame rate** : 24-30 fps

### Optimisation
Pour optimiser la vidéo pour le web, utilisez FFmpeg :

```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast -vf "scale=1280:720" -an amap-hero-background.mp4
```

## Thématiques recommandées

Recherchez sur **Pexels**, **Pixabay** ou **Unsplash** :

### Mots-clés en anglais
- "african farm"
- "organic vegetables"
- "local market africa"
- "farmers working field"
- "fresh vegetables harvest"
- "agriculture africa"
- "togo agriculture" (si disponible)

### Mots-clés en français
- "agriculture biologique"
- "légumes frais"
- "marché local"
- "agriculteurs au travail"
- "récolte de légumes"

## Style visuel

✅ **À privilégier** :
- Champs verdoyants, agriculteurs au travail
- Gros plans de légumes frais et colorés
- Marché local animé avec des produits
- Couleurs vives et naturelles
- Lumière naturelle du jour
- Mouvements lents et fluides

❌ **À éviter** :
- Vidéos trop sombres ou sous-exposées
- Mouvements brusques ou saccadés
- Contenu générique sans lien avec l'agriculture
- Vidéos de mauvaise qualité

## Alternatives si pas de vidéo

Si vous n'avez pas de vidéo, vous pouvez :

1. **Utiliser une image statique** : Remplacez `<video>` par `<Image>` dans `hero-section.tsx`
2. **Utiliser un gradient animé** : Supprimez la vidéo et gardez seulement le gradient
3. **Utiliser une API d'images** : Unsplash Source API pour des images aléatoires

## Placement du fichier

Placez simplement `amap-hero-background.mp4` dans ce dossier (`apps/web/public/videos/`)

La vidéo sera automatiquement accessible via `/videos/amap-hero-background.mp4`
