# LikeC4 workspace — AleFest Coffee

Ce sous-dossier regroupe les projets **LikeC4** utilisés pour la conférence **Diagram as Code**.

## Projets disponibles

- `projects/alefest-v1` — AleFest Coffee V1, architecture synchrone au comptoir
- `projects/alefest-v2` — AleFest Coffee V2, architecture event-driven et mobile
- `projects/exemple-likeC4` — exemple minimal pédagogique
- `projects/shared` — spécifications, styles et images partagés

## Lancer un projet LikeC4

Depuis ce dossier `likec4/` :

```bash
cd projects/alefest-v2
npx likec4 serve
```

Pour comparer avec la version initiale :

```bash
cd projects/alefest-v1
npx likec4 serve
```

## Fichiers clés

- `projects/alefest-v2/ADR/ADR-001-commande-mobile.md`
- `projects/alefest-v2/system-model.c4`
- `projects/alefest-v2/system-views.c4`
- `projects/shared/spec-*.c4`

## Lien avec la présentation

La présentation HTML principale du talk se trouve au niveau supérieur du workspace :

- `../server/public/presentation-diagram-as-code.html`

Elle s'appuie sur le cas d'étude AleFest et sur le QR OpenFeedback présent dans `../server/public/assets/image.png`.

## Ressources

- [LikeC4](https://likec4.dev)
- [Extension VS Code LikeC4](https://marketplace.visualstudio.com/items?itemName=likec4.likec4-vscode)
- [Template C4 LikeC4](https://github.com/a-scolan/c4-template)
