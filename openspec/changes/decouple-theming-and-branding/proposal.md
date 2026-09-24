## Why

La présentation est actuellement fortement couplée à l'événement passé « Atlantique Day 2026 » et à la charte d'entreprise « onepoint » :
1. Les couleurs d'accentuation (`--accent: #fbfe7a`, `--bg: #080d2a`) et les dégradés sont disséminés dans le code avec des valeurs en dur.
2. Un module JavaScript injecte systématiquement des cristaux polygonaux SVG propres à l'identité visuelle d'un sponsor spécifique sur chaque diapositive.
3. Les informations de la conférence (nom de l'événement, date, lieu, speaker, entreprise, QR code OpenFeedback de la session 2026) sont inscrites en dur dans le balisage des diapositives.

Pour réutiliser et faire vivre ce talk lors de futures conférences (Devoxx, BreizhCamp, TechDays, meetups internes) ou pour le refactoriser graphiquement sans risque, il est impératif de découpler la thématique visuelle et les métadonnées de l'événement du contenu pédagogique de la présentation.

## What Changes

- Création d'un système de configuration d'événement (`event.config.json`) centralisant :
  - Métadonnées de l'événement (nom de la conférence, édition/année, ville).
  - Profil de l'orateur (nom, titre, entreprise/communauté, liens sociaux).
  - Liens interactifs de conclusion (URL de feedback, image du QR code, ressources recommandées).
- Abstraction du système de thèmes visuels :
  - Création du thème de référence **Google Blueprint Light** : un thème clair moderne inspiré de l'esthétique Google (Google Cloud / Google Design / Material 3 épuré), alliant simplicité, clarté absolue, surfaces blanches et gris doux (`#ffffff`, `#f8f9fa`, `#f1f3f4`), encre charbon ultra-lisible (`#202124` / `#3c4043`), bleu d'ingénierie Google (`#1a73e8`), et discrets rappels de « blueprint vivant » (trame technique en filigrane à 5% d'opacité, mires de cadrage `+` aux coins des blocs de code/schémas, badges monospace nets).
  - Intégration d'un sélecteur de thème dynamique dans le code (attribut `data-theme`, raccourci clavier `T` et paramètre URL `?theme=...`) pour basculer facilement entre le nouveau thème clair et d'autres variantes lors des répétitions et tests.
  - Découplage complet de l'ancien habillage événementiel Atlantique Day (suppression des cristaux en dur et des logos spécifiques).
- Création d'un fichier de métadonnées déclaratif (`event.config.json`) pour piloter les informations de la conférence et de l'orateur.

## Capabilities

### Modified Capabilities
- `content-theme`: Définition des exigences de configurabilité du thème visuel, de dissociation des habillages décoratifs et de centralisation des métadonnées d'événement.

## Impact

- Diapositives : Remplacement des textes et logos en dur (Atlantique Day, OnePoint, liens de session) par des variables ou balises interpolées.
- Style : Les variables CSS fondamentales sont chargées depuis un fichier de thème sélectionnable au lieu d'être figées dans le corps du style.
- Polyvalence : Capacité de rebrander l'ensemble de la présentation en moins de 5 minutes pour n'importe quelle nouvelle conférence.
