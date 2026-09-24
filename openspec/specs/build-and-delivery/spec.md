# Spécification : Architecture de Build et Diffusion (Build & Delivery)

## Purpose
Cette spécification définit l'infrastructure logicielle d'exécution locale, de compilation des diagrammes LikeC4 en assets autonomes, ainsi que les chaînes de publication automatisée (CI/CD GitHub Pages et scripts d'exportation ciblée).

## Requirements

### Requirement: Serveur de présentation local anti-restrictions iframe
Un serveur Node.js / Express minimal (`presentation/server.js`) doit servir la présentation sur `http://localhost:4000/` pour contourner les blocages de sécurité des navigateurs (notamment Firefox et Chrome) qui interdisent l'inclusion d'iframes locales sous protocole `file://`.

#### Scenario: Démarrage standard du serveur local
- **WHEN** L'utilisateur lance `npm start` ou `node server.js` dans le répertoire `presentation/`
- **THEN** Le serveur initialise l'écoute sur le port 4000 (ou la variable d'environnement `PORT`), sert les fichiers statiques depuis `presentation/public` avec `index: 'presentation-diagram-as-code.html'` et résout automatiquement les extensions HTML.

#### Scenario: Gestion du conflit de port
- **WHEN** Le port demandé est déjà occupé par un autre processus (`EADDRINUSE`)
- **THEN** Le serveur intercepte l'erreur, affiche un message d'aide suggérant une commande alternative (ex: `PORT=4242 node server.js`) et s'interrompt avec un code de retour $1$.

---

### Requirement: Compilation des projets LikeC4 en artefacts single-file
Le script `presentation/build-single-assets.js` doit orchestrer la compilation des modèles LikeC4 source (`coffee-v1`, `coffee-v2`) en bundles HTML autonomes déposés dans le dossier des assets publics.

#### Scenario: Exécution de la commande de build LikeC4
- **WHEN** La commande `npm run build` est invoquée dans `presentation/`
- **THEN** Le script vérifie la présence du binaire LikeC4 dans `node_modules/likec4/bin/likec4.mjs`, purge les anciens dossiers de destination dans `presentation/public/assets/`, compile chaque projet avec les drapeaux `--output-single-file` et `--use-hash-history`, et duplique `index.html` en `404.html` pour compatibilité SPA.

---

### Requirement: Déploiement automatisé sur GitHub Pages
Le dépôt doit comporter un workflow GitHub Actions (`.github/workflows/github-pages.yml`) permettant le déploiement continu du site sur les Pages GitHub lors de chaque mise à jour de la branche principale.

#### Scenario: Push sur la branche principale
- **WHEN** Un commit est poussé sur la branche `main` ou que le workflow est déclenché manuellement (`workflow_dispatch`)
- **THEN** L'environnement exécute `npm install` et `npm run build` dans le sous-dossier `presentation/`, configure les pages GitHub, téléverse le contenu de `presentation/public` et déploie le site avec accès direct en HTTPS.

---

### Requirement: Scripts d'exportation vers un dépôt de présentation dédié
Des scripts en shell (`publish-likec4-presentation.sh`) et PowerShell (`publish-likec4-presentation.ps1`) doivent permettre d'extraire la présentation pour alimenter un dépôt miroir allégé.

#### Scenario: Lancement du script de publication minimale
- **WHEN** L'orateur exécute le script de publication
- **THEN** Le script génère un export épuré (contenant le build compilé, les modèles nécessaires et des redirections racine vers `presentation-diagram-as-code.html`) et pousse automatiquement le résultat sur la branche `main` du dépôt cible.

---

### Requirement: Pipeline d'assemblage modulaire du diaporama
Le système de build du projet DOIT (SHALL) fournir un mécanisme d'assemblage automatisé transformant les fichiers sources modulaires (templates de diapositives, modules JavaScript, styles CSS) en une page HTML finale distribuable dans `presentation/public/presentation-diagram-as-code.html`.

#### Scenario: Compilation du diaporama complet
- **WHEN** La commande `npm run build:deck` est exécutée
- **THEN** Le pipeline compile les modules JavaScript, injecte les fragments de diapositives ordonnés, fusionne les feuilles de style CSS et génère le fichier HTML autonome dans le répertoire de publication sans erreur.

#### Scenario: Mode développement avec rechargement à chaud
- **WHEN** Le développeur lance `npm run dev:deck`
- **THEN** Un serveur de développement local surveille les modifications apportées aux diapositives et aux styles pour rafraîchir instantanément la présentation dans le navigateur sans rechargement complet manuel.

---

### Requirement: Externalisation et optimisation des assets graphiques
Les images binaires et les ressources graphiques volumineuses NE DOIVENT PAS (SHALL NOT) être encodées en chaînes base64 à l'intérieur des fichiers de code ou de balisage, mais doivent être référencées comme des fichiers distincts optimisés dans le répertoire des assets.

#### Scenario: Référencement des images statiques
- **WHEN** Une diapositive requiert l'affichage d'un schéma ou d'une illustration
- **THEN** La ressource est servie depuis `assets/` sous un format optimisé (WebP, SVG ou PNG compressé) avec des dimensions explicites pour prévenir les décalages de mise en page.
