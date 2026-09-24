## Why

Le diaporama actuel est condensé dans un unique fichier monolithique de plus de 850 Ko et 4 600 lignes (`presentation/public/presentation-diagram-as-code.html`). Ce fichier mélange des données binaires base64 lourdes, 2 400 lignes de styles CSS globaux, plus de 35 sections HTML intriquées et 1 200 lignes de JavaScript non modularisé.
Cette architecture monolithique pose d'importantes difficultés de maintien :
1. Toute modification d'un texte, correction de coquille ou ajout d'une slide impose d'éditer ce fichier gigantesque au risque d'introduire des régressions visuelles ou d'invalider des sélecteurs JS.
2. Les diagrammes Mermaid et les modèles LikeC4 sont dupliqués ou injectés en dur, rendant difficile la synchronisation avec les sources de modélisation réelles.
3. L'absence de modularité interdit le test unitaire des fonctions du moteur (zoom, auto-fit, calculs géométriques) et empêche la réutilisation du moteur pour d'autres présentations.

Il est nécessaire de refactoriser ce support vers une architecture modulaire séparant le contenu des diapositives, le moteur d'exécution et les feuilles de style, tout en conservant l'exactitude des fonctionnalités interactives et la possibilité de générer un livrable autonome pour GitHub Pages.

## What Changes

- Découpage du fichier monolithique en modules spécialisés :
  - `src/engine/` : Moteur SlideEngine et gestionnaires d'événements (clavier, tactile, hash URL).
  - `src/diagrams/` : Gestionnaire Mermaid (auto-fit, zoom, pan, thémage).
  - `src/embeds/` : Gestionnaire d'iframes LikeC4 (lazy loading, auto-tuning, détection de timeout).
  - `src/ux/` : Pointeur laser, cristaux décoratifs, ajustements typographiques adaptatifs.
  - `src/styles/` : Feuilles de style CSS découpées (tokens, reset, layout des slides, composants, thèmes).
  - `slides/` : Définition des diapositives sous forme de fragments modulaires (Markdown avec frontmatter ou composants HTML sémantiques).
- Mise en place d'un pipeline d'assemblage et de build moderne (Vite ou Rollup léger) générant le bundle statique de production sans impacter la simplicité du `npm start`.
- Externalisation des images base64 volumineuses vers le dossier des assets statiques publics avec compression adéquate.
- Préservation de la rétrocompatibilité complète avec le serveur local Express et le workflow GitHub Pages existant.

## Capabilities

### Modified Capabilities
- `build-and-delivery`: Ajout des exigences d'assemblage modulaire et de pipeline de build pour la compilation du diaporama et la gestion optimisée des assets statiques.

## Impact

- Fichiers source : Remplacement de l'édition directe de `presentation/public/presentation-diagram-as-code.html` par une arborescence source `presentation/src/` et `presentation/slides/`.
- Outillage : Intégration d'un outillage de build standard dans `presentation/package.json` (`npm run build:deck`, `npm run dev:deck`).
- CI/CD : Mise à jour transparente du job GitHub Pages pour compiler la présentation modulaire avant déploiement.
- Taille du repo : Réduction drastique de la taille des fichiers sources versionnés par l'élimination des doublons base64.
