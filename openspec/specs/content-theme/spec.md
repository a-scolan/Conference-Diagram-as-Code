# Spécification : Thème Visuel et Identité Graphique (Content & Theme)

## Purpose
Cette spécification définit l'identité visuelle de la présentation, son système de tokens de design (thème "Electric Navy" issu de l'Atlantique Day / OnePoint), la typographie, la signalétique colorée par partie, ainsi que les points d'ancrage requis pour adapter le thème à d'autres événements ou conférences.

## Requirements

### Requirement: Système de tokens de couleur (Design Tokens)
L'apparence de la présentation repose sur des variables CSS déclarées à la racine (`:root`), composant une palette contrastée sur fond bleu marine sombre avec des couleurs d'accentuation fonctionnelles.

#### Scenario: Palette de base du thème actuel (Electric Navy)
- **WHEN** Le diaporama est rendu avec son thème par défaut
- **THEN** Les variables fondamentales suivantes sont appliquées :
  - Fond d'écran sombre : `--bg: #080d2a`
  - Surfaces et cartes : `--surface: #0c1238`, `--surface2: #101848`, `--surface-elevated: #162058`
  - Textes : `--text: #e8f0f8` (primaire), `--text-dim: #c1d5e8` (secondaire), `--text-subtitle: #d7e5f2`
  - Accent jaune électrique principal : `--accent: #fbfe7a`
  - Accents secondaires : `--accent2: #f08848` (orange), `--accent3: #38b4e8` (cyan/bleu ciel), `--accent4: #f43f5e` (rose/framboise), `--green: #5cc038` (vert validation).

#### Scenario: Adaptation en vue d'un rethémage futur (Theming Hook)
- **WHEN** L'utilisateur souhaite adapter le jeu de diapositives à une autre conférence (ex: Devoxx, BreizhCamp, Paris JUG)
- **THEN** La modification des seules variables CSS `:root` et du logo permet de transformer l'ambiance visuelle sans avoir à modifier le balisage individuel des diapositives.

---

### Requirement: Typographie hiérarchisée
La présentation doit employer une combinaison typographique claire et lisible à distance, séparant distinctement le texte éditorial du code technique.

#### Scenario: Utilisation de la police sans-serif moderne pour le contenu
- **WHEN** Des titres, sous-titres, étiquettes ou paragraphes sont affichés
- **THEN** La famille `Poppins` (graisses 300, 400, 700, 900) est appliquée avec un espacement adapté et des tailles dynamiques basées sur `clamp()`.

#### Scenario: Utilisation de la police à chasse fixe pour le code et les DSL
- **WHEN** Un bloc de code, un extrait C4, un diagramme Mermaid ou une commande terminal est affiché
- **THEN** La police `JetBrains Mono` est employée pour garantir l'alignement strict des indentations et des symboles de modélisation.

---

### Requirement: Signalétique colorimétrique par partie (Section Mapping)
Chaque grande partie de la conférence possède un code couleur d'identification unique répercuté sur le numéro de partie, les étiquettes, la barre d'onglets et les points de navigation.

#### Scenario: Affectation des couleurs de section
- **WHEN** Le moteur construit la table des sections (`buildSectionMap`)
- **THEN** Les correspondances suivantes sont appliquées aux indicateurs :
  - **Partie 0 (Introduction & Constat) :** Gris neutre (`--part0-neutral-gray`, `#b4bdc8`)
  - **Partie 1 (De l'ADR au modèle C1) :** Jaune vif (`--accent`, `#fbfe7a`)
  - **Partie 2 (Containers & comportements C2) :** Bleu cyan (`--accent3`, `#38b4e8`)
  - **Partie 3 (Collaboration & diff en PR) :** Orange vif (`--accent2`, `#f08848`)
  - **Partie 4 (Industrialisation & CI/CD) :** Vert clair (`--green`, `#5cc038`)
  - **Partie 5 (Bilan & conclusion) :** Framboise (`--accent4`, `#f43f5e`).

---

### Requirement: Habillage géométrique et éléments décoratifs de fond
Des dégradés radiaux asymétriques et des formes polygonales géométriques doivent structurer l'espace visuel sans concurrencer la lecture des schémas.

#### Scenario: Rendu des fonds de diapositives
- **WHEN** Une diapositive de contenu est affichée
- **THEN** Elle combine un dégradé radial localisé (ex: `radial-gradient(ellipse at 80% 80%, var(--accent2-dim) 0%, transparent 45%)`) et l'overlay SVG translucide des cristaux.
