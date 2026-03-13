# Diagram as Code — AleFest Coffee

Ce dépôt contient les supports et modèles utilisés pour la conférence **Diagram as Code** à l'Atlantique Day.

Le fil rouge du talk est **AleFest Coffee** : une évolution d'architecture entre une **V1 synchrone** (commande au comptoir) et une **V2 event-driven** (commande mobile, RabbitMQ, WebSocket, notifications push).

## Démarrer la présentation

La présentation HTML enrichie se trouve dans `server/public/presentation-diagram-as-code.html`.

Pour la servir localement :

```bash
cd server
npm install
npm start
```

Puis ouvrez `http://localhost:3000/presentation-diagram-as-code.html`.

## Explorer les modèles LikeC4

Les projets principaux sont :

- `projects/alefest-v1` — **AleFest Coffee V1 - Le Comptoir**
- `projects/alefest-v2` — **AleFest Coffee V2 - Le Café Mobile**
- `projects/exemple-likeC4` — exemple minimal pédagogique
- `projects/shared` — spécifications et ressources partagées

Pour lancer un projet LikeC4 en local :

```bash
cd projects/alefest-v2
npx likec4 serve
```

Vous pouvez faire la même chose avec `projects/alefest-v1` pour comparer les deux versions.

## Fichiers clés

- `projects/alefest-v2/ADR/ADR-001-commande-mobile.md` — décision architecturale source
- `projects/alefest-v2/system-model.c4` — modèle système V2
- `projects/alefest-v2/system-views.c4` — vues C1, C2 et dynamiques
- `server/public/assets/image.png` — QR code OpenFeedback utilisé dans la présentation
- `Draft déroulé.md` — déroulé éditorial de la session

## Structure rapide

```text
projects/
├── alefest-v1/
├── alefest-v2/
│   └── ADR/
├── exemple-likeC4/
└── shared/
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
