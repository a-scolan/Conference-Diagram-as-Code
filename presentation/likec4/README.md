# LikeC4 workspace — AleFest Coffee

Ce sous-dossier regroupe les projets **LikeC4** utilisés pour la conférence **Diagram as Code**.

## Projets disponibles

- `projects/coffee-adr001` — ADR-001 fidèle au besoin initial comptoir (borne, écran barista, backends découplés)
- `projects/coffee-v1` — AleFest Coffee V1, Le Comptoir (version démo conférence)
- `projects/coffee-v2` — AleFest Coffee V2, Mobile + notifications (version démo conférence)
- `projects/alefest-v1` — AleFest Coffee V1, architecture synchrone au comptoir (version originale)
- `projects/alefest-v2` — AleFest Coffee V2, architecture event-driven et mobile (version originale)
- `projects/exemple-likeC4` — exemple minimal pédagogique
- `projects/shared` — spécifications, styles et images partagés

## Lancer un projet LikeC4

Depuis ce dossier `likec4/` :

```bash
cd projects/coffee-v2
npx likec4 serve
```

Pour comparer avec la version initiale :

```bash
cd projects/coffee-v1
npx likec4 serve
```

Pour explorer l'interprétation fidèle de l'ADR initial :

```bash
cd projects/coffee-adr001
npx likec4 serve
```

## Reconstruire les builds single-file utilisés par la présentation

Depuis le dossier `presentation/` :

```bash
npm run build
```

Cette commande :

- rebuild `projects/coffee-v1` vers `public/assets/coffee-v1-single/`
- rebuild `projects/coffee-v2` vers `public/assets/coffee-v2-single/`
- génère un `index.html` autonome et un `404.html` miroir pour chaque build
- utilise la dépendance locale `../node_modules/likec4` (pas un binaire global)

Le projet `coffee-adr001` reste pour l'instant un projet de modélisation local séparé : il n'est pas inclus dans les assets single-file de la présentation.

## Fichiers clés

- `projects/coffee-adr001/system-model.c4`
- `projects/coffee-adr001/system-views.c4`
- `projects/coffee-v2/system-model.c4`
- `projects/coffee-v2/system-views.c4`
- `projects/coffee-v1/system-model.c4`
- `projects/coffee-v1/system-views.c4`
- `../build-single-assets.js`
- `projects/shared/spec-*.c4`

## Lien avec la présentation

La présentation HTML principale du talk se trouve dans le dossier `presentation/` :

- `../public/presentation-diagram-as-code.html`

Elle s'appuie sur le cas d'étude AleFest et sur les builds single-file présents dans `../public/assets/`.

## Ressources

- [LikeC4](https://likec4.dev)
- [Extension VS Code LikeC4](https://marketplace.visualstudio.com/items?itemName=likec4.likec4-vscode)
- [Template C4 LikeC4](https://github.com/a-scolan/c4-template)
