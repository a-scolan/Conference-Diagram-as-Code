## Context

La présentation actuelle est un artefact riche et complexe comportant 35+ diapositives, des intégrations dynamiques Mermaid, des modèles LikeC4 embarqués en sandbox, des effets scéniques (laser virtuel, cristaux polygonaux) et des contrôles de zoom/pan interactifs.
Cependant, l'ensemble réside dans un seul fichier statique de 855 Ko (`presentation/public/presentation-diagram-as-code.html`), sans découpage modulaire ni chaîne d'assemblage. Cela freine considérablement les évolutions futures, la refactorisation de contenu et la maintenance corrective.

## Goals / Non-Goals

### Goals
- Scinder le fichier monolithique en sous-ensembles modulaires clairs : logique JS, styles CSS, fragments de slides et assets.
- Externaliser les images binaires base64 vers des fichiers dédiés pour alléger les sources textuelles.
- Conserver 100% des fonctionnalités existantes (défilement snap-scroll, auto-fit Mermaid, contrôles de zoom, embeds LikeC4, laser pointer, pop-up Codespace).
- Préserver le comportement de déploiement autonome : le livrable de production reste un fichier HTML servi statiquement par Express ou GitHub Pages.

### Non-Goals
- Changer la technologie de base vers un framework lourd (ex: Next.js ou Angular) : un outillage de bundling léger (Vite ou Rollup) ou un assembleur de templates statique (ex: script Node.js standard avec template strings) suffit amplement.
- Modifier le contenu ou la trame narrative dans ce change (réservé aux changes dédiés).

## Proposed Solution

1. **Arborescence Source (`presentation/src/`)** :
   - `presentation/src/styles/` :
     - `tokens.css` (variables de couleur, typographie, espacements)
     - `reset.css` (réinitialisation et styles de base du document)
     - `deck.css` (layout plein écran, snap-scroll, barre de progression, fil d'Ariane)
     - `slides.css` (layouts de contenu : split, quote, bleed, diagram, code)
     - `components.css` (zoom controls, embed wraps, laser pointer, boutons)
   - `presentation/src/scripts/` :
     - `engine.js` (classe `SlideEngine`, gestion du clavier, hash et historique)
     - `mermaid-controller.js` (initialisation de Mermaid, auto-fit, calculs de viewBox, zoom/pan)
     - `likec4-controller.js` (lazy loading, états CTA, détection de timeout, viewport auto-tuning)
     - `ux-effects.js` (pointeur laser, injection des cristaux, adaptation typographique)
   - `presentation/src/slides/` :
     - Un fichier par diapositive ou groupe logique (ex: `00-titre.html`, `01-speaker.html`, `10-adr001.html`, etc.) assemblé selon un ordre séquentiel défini dans un manifeste `slides.json`.

2. **Pipeline d'assemblage et dualité Localhost / GitHub Pages (`build-deck.js`)** :
   - Un script de compilation Node.js simple (sans framework lourd, compatible environnement CI/CD et Windows/Unix) qui :
     - Concatène et minifie les styles CSS.
     - Assemble les modules JavaScript.
     - Injecte les fragments de diapositives dans le gabarit parent.
     - Génère `presentation/public/presentation-diagram-as-code.html`.
   - **Mode Localhost (`npm start` / `npm run dev`)** : Le serveur Express existant ([presentation/server.js](presentation/server.js)) sert directement `presentation/public` sur `http://localhost:4000/`, ce qui résout les contraintes d'iframe locales. En mode dev, un watch recharge l'assemblage à chaud.
   - **Mode GitHub Pages (`npm run build`)** : La chaîne CI/CD (.github/workflows/github-pages.yml) déclenche `npm run build`, qui génère les single-file LikeC4 ET assemble le deck HTML dans `presentation/public`. GitHub Pages déploie le dossier `public` sous forme 100% statique sans nécessiter de serveur Node.js en production.

3. **Intégration dans `package.json`** :
   - `npm run build` : exécute `build-single-assets.js` (LikeC4) puis `build-deck.js` (Présentation).
   - `npm run dev` : lance l'observateur de fichiers et le serveur Express local avec rafraîchissement.

## Risks / Trade-offs

- **Risque d'altération de sélecteurs ou de timings JS** : En modularisant le code, des écouteurs d'événements (`DOMContentLoaded`, `IntersectionObserver`) pourraient s'exécuter dans un ordre différent.
  - *Atténuation* : Rédiger un jeu de tests de régression ou une checklist de validation manuelle couvrant chaque élément interactif avant bascule.
- **Complexité de l'outillage de build** : Introduire trop de dépendances pourrait rendre l'installation fragile.
  - *Atténuation* : Privilégier une solution sans configuration lourde, s'appuyant sur les capacités natives de Node.js ou un bundler éprouvé.
