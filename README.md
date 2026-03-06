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

## 🔗 Liens utiles

- [Documentation LikeC4](https://likec4.dev)
- [Extension VS Code LikeC4](https://marketplace.visualstudio.com/items?itemName=likec4.likec4-vscode)
