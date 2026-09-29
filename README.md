# Diagram as Code — AleFest Coffee

Ce dépôt contient les supports et modèles utilisés pour la conférence **Diagram as Code** à l'Atlantique Day.

Le fil rouge du talk est **AleFest Coffee** : une évolution d'architecture entre une **V1 synchrone** (commande au comptoir) et une **V2 event-driven** (commande mobile, RabbitMQ, WebSocket, notifications push).

## Démarrer la présentation

La présentation HTML enrichie se trouve dans `presentation/public/presentation-diagram-as-code.html`.

Pour reconstruire les builds LikeC4 single-file utilisés par les iframes, puis servir la présentation localement :

```bash
cd presentation
npm install
npm start            # Déclenche automatiquement le build complet vers public puis démarre le serveur local Express
```

Des scripts ciblés restent également disponibles :
- `npm run build` : génère les QR codes, les builds LikeC4 single-file et assemble le deck dans `public/`.
- `npm run build:deck` : génère le QR code support et réassemble les slides modulaires vers `public/`.

Puis ouvrez `http://localhost:4000/presentation-diagram-as-code.html`.

Pour développer et modifier les slides en direct avec rechargement automatique :

```bash
npm run dev:deck
```

Les vues **LikeC4** intégrées dans les slides se chargent désormais **à la demande** : le bouton *Rendu LikeC4* est visible avant chargement puis disparaît automatiquement une fois le schéma affiché, avec un délai de fallback plus tolérant pour éviter les faux échecs au démarrage.

Les slides **Mermaid** interactives utilisent désormais un cadrage plus large, un recentrage fiable, le zoom via boutons ou molette sur les vues dédiées, et un **mouse-pan** par glisser-déposer quand le diagramme dépasse le cadre.

### Raccourcis et fonctionnalités orateur en séance

- **Touche P** : Ouvre instantanément la **vue présentateur double écran** (`presenter-view.html`) sur moniteur secondaire, synchronisée en temps réel via `BroadcastChannel` (chronomètre de session, 5 jalons d'Actes, slide active, slide suivante, notes d'orateur mot à mot avec mise en valeur des *Silences Sacrés* et zoom typographique de pupitre `A-` / `A+`).
- **Touches Flèches / Espace / Télécommande** : Déroulent les **étapes de code progressives** sur les diapositives techniques (Slide 11 C1, Slide 13 C2, Slide 16 Live coding, Slide 18 Séquence) sans nécessiter de clic à la souris, avant de basculer sur la slide suivante.
- **Touche C** : Bascule le **mode confort & fort contraste** fond de salle (`data-readability="high-contrast"`, `--font-bump: 6.5px`) pour les vidéoprojecteurs délavés.
- **Touche T** : Alterne le thème visuel (*Google Blueprint Light* / *Slate Architect*).
- **Touche . (point) ou B** : Occulte l'écran public (mode écran noir) pour concentrer l'attention sur l'orateur.

## Publier la présentation sur GitHub Pages

Un workflow CI/CD est fourni dans `.github/workflows/github-pages.yml`.

Il :

- installe les dépendances dans `presentation/`
- reconstruit les assets LikeC4 (`npm run build`)
- publie `presentation/public` sur GitHub Pages

Pour l'activer :

1. Dans GitHub, allez dans **Settings → Pages**
2. Dans **Build and deployment**, sélectionnez **GitHub Actions**
3. Poussez sur la branche `main` (ou lancez le workflow manuellement depuis l'onglet **Actions**)

Une fois le workflow terminé, l'URL publique est visible dans le job `deploy`.

### Publication minimale automatisée vers `likec4-presentation`

Des scripts sont disponibles pour publier uniquement le strict nécessaire dans le repo cible `a-scolan/likec4-presentation` :

- Bash : `scripts/publish-likec4-presentation.sh`
- PowerShell : `scripts/publish-likec4-presentation.ps1`

Ils :

- exportent un repo minimal (build + `public/` + modèles LikeC4 nécessaires)
- ajoutent des redirections racine (`/` et `/presentation-diagram-as-code.html`)
- reconstruisent les assets
- pushent sur `main` du repo cible

## Explorer les modèles LikeC4

Les projets sont situés dans `presentation/likec4/projects/` :

- `presentation/likec4/projects/coffee-v1` — **AleFest Coffee V1 - Le Comptoir** (version démo conférence synchrone)
- `presentation/likec4/projects/coffee-v2` — **AleFest Coffee V2 - Le Café Mobile** (version démo conférence asynchrone & notifications)
- `presentation/likec4/projects/shared` — **Spécifications et ressources partagées** (vocabulaire C4, conteneurs, composants, styles et icônes)

Pour lancer un projet LikeC4 en local :

```bash
cd presentation/likec4/projects/coffee-v2
npx likec4 serve
```

Vous pouvez faire la même chose avec `presentation/likec4/projects/coffee-v1` pour explorer l'architecture initiale.

## Fichiers clés

- `presentation/likec4/projects/AleFest.md` — décision architecturale et contexte métier source (ADR-001 & ADR-002)
- `deroule-conference-slides.md` — déroulé détaillé synchronisé avec les diapositives
- `presentation/likec4/projects/coffee-v1/system-model.c4` — modèle système V1 (Le Comptoir)
- `presentation/likec4/projects/coffee-v1/system-views.c4` — vues C1, C2 et dynamique V1
- `presentation/likec4/projects/coffee-v2/system-model.c4` — modèle système V2 (Le Café Mobile)
- `presentation/likec4/projects/coffee-v2/system-views.c4` — vues C1, C2 et dynamiques V2
- `presentation/public/assets/coffee-v1-single/index.html` — build single-file LikeC4 pour la V1
- `presentation/public/assets/coffee-v2-single/index.html` — build single-file LikeC4 pour la V2
- `presentation/build-single-assets.js` — script de synchronisation des builds LikeC4 vers les assets publics, en utilisant la dépendance locale `presentation/node_modules/likec4`
- `presentation/build-deck.js` — assemblage modulaire du deck HTML à partir de `src/`
- `openspec/` — spécifications formelles (fonctionnalités interactives, contenu, narration) et propositions de changements

## Structure du projet

```text
├── openspec/                          # Spécifications OpenSpec et suivi des changements
│   ├── specs/                         # Spécifications de référence (techniques & contenus)
│   └── changes/                       # Changements actifs et archives
├── presentation/                      # Application de présentation et modèles LikeC4
│   ├── src/                           # Code source modulaire du diaporama
│   │   ├── slides/                    # Templates unitaires HTML et slides.json
│   │   ├── scripts/                   # Modules JS (engine, embeds, controls, runner)
│   │   └── styles/                    # Styles CSS (tokens, deck, components, slides)
│   ├── public/                        # Site web statique distribué
│   │   ├── assets/                    # Bundles LikeC4 compilés (single-file) et médias
│   │   └── presentation-diagram-as-code.html
│   ├── likec4/
│   │   └── projects/                  # Modèles LikeC4 sources (coffee-v1, coffee-v2, shared)
│   ├── build-deck.js                  # Assemblage modulaire du deck HTML autonome
│   ├── build-single-assets.js         # Compilation LikeC4 vers assets publics
│   ├── event.config.json              # Configuration centralisée de l'événement et du speaker
│   ├── package.json                   # Dépendances Node.js et scripts de build/dev
│   └── server.js                      # Serveur local Express anti-restrictions iframe
├── scripts/                           # Scripts d'exportation et publication minimale
└── deroule-conference-slides.md       # Déroulé synchronisé avec les slides
```

## Ressources utiles

- [LikeC4](https://likec4.dev)
- [Repo démo hands-on](https://github.com/a-scolan/c4-hands-on-demo)
- [Template C4 LikeC4](https://github.com/a-scolan/c4-template)
- [« Diagram as Code en 2025 : Le repas de famille des outils » sur dev.to](https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp)
