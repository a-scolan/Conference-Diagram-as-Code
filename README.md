# Diagram as Code — AleFest Coffee

Ce dépôt contient les supports et modèles utilisés pour la conférence **Diagram as Code** à l'Atlantique Day.

Le fil rouge du talk est **AleFest Coffee** : une évolution d'architecture entre une **V1 synchrone** (commande au comptoir) et une **V2 event-driven** (commande mobile, RabbitMQ, WebSocket, notifications push).

## Démarrer la présentation

La présentation HTML enrichie se trouve dans `presentation/public/presentation-diagram-as-code.html`.

Pour reconstruire les builds LikeC4 single-file utilisés par les iframes, puis servir la présentation localement :

```bash
cd presentation
npm install
npm run build
npm start
```

Puis ouvrez `http://localhost:4000/presentation-diagram-as-code.html`.

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

Les projets principaux sont :

- `projects/coffee-v1` — **AleFest Coffee V1 - Le Comptoir** (version démo conférence)
- `projects/coffee-v2` — **AleFest Coffee V2 - Le Café Mobile** (version démo conférence)
- `projects/alefest-v1` — AleFest Coffee V1 (version originale complète)
- `projects/alefest-v2` — AleFest Coffee V2 (version originale complète)
- `projects/exemple-likeC4` — exemple minimal pédagogique
- `projects/shared` — spécifications et ressources partagées

Pour lancer un projet LikeC4 en local :

```bash
cd projects/coffee-v2
npx likec4 serve
```

Vous pouvez faire la même chose avec `projects/coffee-v1` pour comparer les deux versions.

## Fichiers clés

- `AleFest.md` — décision architecturale et contexte métier source
- `projects/coffee-v2/system-model.c4` — modèle système V2
- `projects/coffee-v2/system-views.c4` — vues C1, C2 et dynamiques
- `presentation/public/assets/coffee-v1-single/index.html` — build single-file LikeC4 pour la V1
- `presentation/public/assets/coffee-v2-single/index.html` — build single-file LikeC4 pour la V2
- `presentation/build-single-assets.js` — script de synchronisation des builds LikeC4 vers les assets publics
- `Draft déroulé.md` — déroulé éditorial de la session

## Structure rapide

```text
projects/
├── coffee-v1/
├── coffee-v2/
├── alefest-v1/
├── alefest-v2/
│   └── ADR/
├── exemple-likeC4/
└── shared/
Test LikeC4/
presentation/
├── public/
│   ├── assets/
│   └── presentation-diagram-as-code.html
├── likec4/
│   └── projects/
├── build-single-assets.js
└── server.js
server/
├── public/
│   ├── assets/
│   └── presentation-diagram-as-code.html
└── server.js
```

## Ressources utiles

- [LikeC4](https://likec4.dev)
- [Repo démo hands-on](https://github.com/a-scolan/c4-hands-on-demo)
- [Template C4 LikeC4](https://github.com/a-scolan/c4-template)
- [« Diagram as Code en 2025 : Le repas de famille des outils » sur dev.to](https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp)
