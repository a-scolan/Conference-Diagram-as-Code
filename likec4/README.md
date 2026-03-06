# Atlantique Day - Architecture as Code with LikeC4

Ce dépôt contient le projet LikeC4 utilisé comme démo lors de la conférence **Diagram as Code** à l'Atlantique Day.

## 🚀 Démarrage rapide

### Avec GitHub Codespace

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/a-scolan/atlantique-day-likec4)

1. Cliquez sur le badge ci-dessus pour ouvrir un Codespace
2. Attendez l'installation automatique de LikeC4
3. Lancez le serveur de développement :
   ```bash
   cd projects/capsule
   npx likec4 serve
   ```

### En local

```bash
npm install -g likec4
cd projects/capsule
likec4 serve
```

## 📁 Structure du projet

```
projects/
├── capsule/                  # Projet principal - Hébergement Web Statique
│   ├── likec4.config.ts      # Configuration du projet
│   ├── system-model.c4       # Modèle système (éléments & relations)
│   ├── system-views.c4       # Vues système (C1, C2, C3)
│   ├── deployment.c4         # Modèle de déploiement
│   ├── deployment-views.c4   # Vues de déploiement
│   ├── ADR/                  # Architecture Decision Records
│   └── generators/           # Générateurs (matrice réseau)
├── exemple-likeC4/           # Exemple minimal pédagogique (modèle imbriqué)
│   ├── likec4.config.ts      # Configuration du projet d'exemple
│   └── main.c4               # Démo simple avec système + containers
└── shared/                   # Spécifications & ressources partagées
    ├── spec-*.c4             # Spécifications (kinds, tags, styles)
    └── images/               # Bibliothèque d'icônes (Lucide, Affinity)
```

## 🎨 Logos / icônes dans AleFest

Les projets `projects/alefest-v1` et `projects/alefest-v2` incluent désormais des logos au niveau des éléments dans `system-model.c4`.

- Les icônes locales utilisent l'alias `@` défini dans `likec4.config.ts` (`imageAliases`).
- Les logos sont appliqués avec la syntaxe LikeC4 `style { icon ... }` directement sur les éléments (système, apps, services, queue, base).
- Exemple utilisé : `icon tech:postgresql` pour la base PostgreSQL, et des icônes locales comme `@/lucide-static/coffee.svg`.

Cette approche permet de conserver les styles génériques des spécifications partagées (`projects/shared/spec-*.c4`) tout en personnalisant visuellement les scénarios AleFest.

## 🇫🇷 Langue des projets AleFest

Les projets `projects/alefest-v1` et `projects/alefest-v2` utilisent désormais des libellés et descriptions en français (modèles, vues et titres de configuration).

## �️ Build de l'exemple pour les slides

Le projet `projects/exemple-likeC4` peut être exporté en **fichier HTML unique** (monolithique, ~3 Mo) pour être facilement intégré dans une iframe sans dépendances externes :

```bash
cd projects/exemple-likeC4
npx likec4 build -o ./dist --output-single-file --use-hash-history
```

Le fichier généré (`dist/index.html`) est ensuite copié dans `server/public/exemple-likeC4/` pour un embed iframe dans la présentation.

**Utilisation actuelle dans les slides :**
- fichier : `server/public/presentation-diagram-as-code.html`
- URL d'embed : `./exemple-likeC4/index.html#/project/exemple/view/index`

## �🔗 Liens utiles

- [Documentation LikeC4](https://likec4.dev)
- [Extension VS Code LikeC4](https://marketplace.visualstudio.com/items?itemName=likec4.likec4-vscode)
