# Guide d'installation de la vidéo de fond

## Étape 1 : Télécharger une vidéo

### Option A : Sites gratuits (Recommandé)
1. **Pexels Videos** : https://www.pexels.com/videos/
2. **Pixabay Videos** : https://pixabay.com/videos/
3. **Coverr** : https://coverr.co/

### Option B : Créer sa propre vidéo
Filmez des scènes d'agriculture locale au Togo (agriculteurs, champs, légumes)

## Étape 2 : Rechercher la bonne vidéo

Sur Pexels ou Pixabay, recherchez :
- "agriculture"
- "farming"
- "vegetables"
- "farm field"
- "organic food"
- "farmers market"

**Critères de sélection** :
- ✅ Résolution HD (1280x720 minimum)
- ✅ Vidéo courte (10-30 secondes)
- ✅ Couleurs vives et naturelles
- ✅ Mouvements fluides
- ✅ Licence libre (Pexels/Pixabay)

## Étape 3 : Optimiser la vidéo

### Méthode 1 : En ligne (Facile)
1. Allez sur https://www.freeconvert.com/video-compressor
2. Uploadez votre vidéo
3. Réglez la qualité à "Medium" ou "High"
4. Téléchargez le résultat

### Méthode 2 : FFmpeg (Avancé)
```bash
# Installer FFmpeg : https://ffmpeg.org/download.html
# Puis exécuter :
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset fast -vf "scale=1280:720" -an amap-hero-background.mp4
```

**Paramètres expliqués** :
- `-crf 28` : Qualité (18=meilleur, 28=bon compromis, 35=faible)
- `scale=1280:720` : Résolution HD
- `-an` : Supprime l'audio (pas nécessaire)

## Étape 4 : Renommer et placer le fichier

1. Renommez la vidéo optimisée en : `amap-hero-background.mp4`
2. Placez-la dans : `apps/web/public/videos/`
3. Le chemin final doit être : `apps/web/public/videos/amap-hero-background.mp4`

## Étape 5 : Vérifier

1. Démarrez le projet : `pnpm dev`
2. Ouvrez http://localhost:3000
3. La vidéo devrait s'afficher en background sur la page d'accueil

## Dépannage

### La vidéo ne se lit pas
- Vérifiez le nom du fichier : `amap-hero-background.mp4` (sensible à la casse)
- Vérifiez l'emplacement : doit être dans `apps/web/public/videos/`
- Vérifiez que le fichier fait moins de 5 MB
- Essayez avec un autre navigateur

### La page est lente
- La vidéo est trop lourde : optimisez-la davantage
- Réduisez la résolution à 1280x720
- Augmentez le CRF à 30 ou 32

### Pas de vidéo disponible
- Utilisez le fond gradient vert par défaut (déjà configuré)
- La page restera belle sans vidéo !

## Recommandations de vidéos

Exemples de bonnes vidéos sur Pexels :
1. "Farm field sunset" par Taryn Elliott
2. "Vegetable garden" par Pixabay
3. "Organic farming" par Free Videos
4. "Fresh vegetables" par Taryn Elliott

Téléchargez en résolution "Original" puis optimisez avec FFmpeg ou FreeConvert.

## Taille cible

- **Idéal** : 1-2 MB
- **Maximum** : 3 MB
- **Résolution** : 1280x720 (HD) ou 1920x1080 (Full HD)
- **Durée** : 10-20 secondes (boucle parfaite)
