# Spécification : Moteur de Diaporama (Slide Engine)

## Purpose
Cette spécification définit l'architecture et le fonctionnement du moteur d'exécution du diaporama web (SlideEngine), assurant le défilement fluide par accrochage magnétique, la navigation au clavier et au toucher, le calcul des indicateurs de progression, la synchronisation des ancres d'URL et la gestion des sections thématiques.

## Requirements

### Requirement: Défilement vertical avec accrochage magnétique (Snap-Scroll)
Le conteneur principal du diaporama (`.deck`) doit présenter chaque diapositive (`.slide`) en plein écran (100vh / 100vw) avec un accrochage vertical fluide, sans risque de décalage ou de superposition instable.

#### Scenario: Navigation par défilement à la molette
- **WHEN** L'utilisateur fait défiler la page verticalement à l'aide de la molette ou du pavé tactile
- **THEN** Le moteur temporise le défilement et force l'alignement (`snapToNearest`) sur la diapositive la plus proche avec une animation fluide (`behavior: smooth`).

#### Scenario: Redimensionnement de la fenêtre
- **WHEN** La fenêtre du navigateur est redimensionnée en cours de présentation
- **THEN** Le diaporama recalcule l'offset de la diapositive active et conserve son plein cadrage sans perte de contexte.

---

### Requirement: Contrôle au clavier et navigation tactile
Le moteur doit écouter les événements clavier globaux et les gestes tactiles verticaux pour permettre au présentateur de piloter son discours sans souris.

#### Scenario: Avancement à la diapositive suivante
- **WHEN** L'utilisateur presse la touche `Flèche Droite`, `Flèche Bas`, `Espace` ou `PageDown`
- **THEN** Le diaporama bascule immédiatement vers la diapositive suivante si l'index courant est inférieur au total.

#### Scenario: Retour à la diapositive précédente
- **WHEN** L'utilisateur presse la touche `Flèche Gauche`, `Flèche Haut` ou `PageUp`
- **THEN** Le diaporama revient immédiatement vers la diapositive précédente.

#### Scenario: Saut aux extrémités
- **WHEN** L'utilisateur presse la touche `Home` ou `End`
- **THEN** Le diaporama se positionne instantanément sur la première diapositive (pour `Home`) ou la dernière diapositive (pour `End`).

#### Scenario: Balayage tactile sur appareil mobile ou écran tactile
- **WHEN** L'utilisateur effectue un balayage vertical (`touchstart` / `touchend`) d'une amplitude supérieure à 50 pixels
- **THEN** Le moteur interprète le vecteur de déplacement pour avancer (swipe haut) ou reculer (swipe bas).

#### Scenario: Isolation des zones interactives
- **WHEN** Le focus utilisateur ou la cible de l'événement clavier se situe à l'intérieur d'un diagramme zoomable (`.mermaid-wrap`), d'un tableau défilant (`.table-scroll`), d'un bloc de code (`.code-scroll`) ou d'un champ éditable
- **THEN** Les raccourcis clavier du diaporama sont ignorés afin de préserver l'interaction locale du composant.

---

### Requirement: Barre de progression et compteur de diapositives
Le moteur doit maintenir en permanence deux indicateurs visuels non intrusifs : une barre de progression continue et un compteur textuel.

#### Scenario: Mise à jour continue de la progression
- **WHEN** La diapositive active change pour atteindre l'index $i$ sur un total $N$
- **THEN** La largeur de l'élément `.deck-progress` est ajustée à la valeur calculée $((i + 1) / N) \times 100\%$ et le compteur `.deck-counter` affiche la chaîne formatée `"i + 1 / N"`.

---

### Requirement: Fil d'Ariane et navigation contextuelle par points (Breadcrumb & Dots)
Une barre de navigation escamotable (`.deck-nav`) doit afficher le titre de la section et un ensemble de points interactifs (`.deck-dot`) correspondant aux diapositives, colorés selon la section thématique d'appartenance.

#### Scenario: Survol du fil d'Ariane
- **WHEN** Le curseur survole le bouton fil d'Ariane (`.deck-breadcrumb`) ou le panneau des points (`.deck-dots`)
- **THEN** Le panneau de navigation s'ouvre (`.is-open`), l'attribut `aria-expanded` passe à `true` et les titres de diapositives deviennent accessibles.

#### Scenario: Clic sur un point de navigation
- **WHEN** L'utilisateur clique sur un point de navigation spécifique
- **THEN** Le diaporama navigue directement vers la diapositive ciblée, ferme le menu escamotable et applique le style d'activation (`.active`) au point sélectionné.

#### Scenario: Mode dense pour les présentations longues
- **WHEN** Le nombre total de diapositives dépasse 20
- **THEN** La classe CSS `.deck-dots--dense` est automatiquement appliquée pour réduire l'encombrement et assurer la lisibilité de la barre.

---

### Requirement: Synchronisation de l'ancre URL et historique de navigation
Le moteur doit synchroniser l'URL du navigateur avec la diapositive affichée afin de permettre le partage de liens directs et l'usage des boutons précédent/suivant du navigateur.

#### Scenario: Navigation vers une slide avec persistance dans l'URL
- **WHEN** Une nouvelle diapositive devient active
- **THEN** L'historique du navigateur est mis à jour via `history.replaceState` avec le fragment d'ancre `#slide-{numéro}`.

#### Scenario: Chargement initial avec ancre d'URL
- **WHEN** La page est chargée avec une URL comportant une ancre valide (ex: `#slide-12`)
- **THEN** Le moteur SlideEngine saute directement à la diapositive correspondante sans animer tout le parcours depuis le début.

#### Scenario: Utilisation de l'historique du navigateur (boutons retour/avance)
- **WHEN** L'événement `popstate` est émis par le navigateur
- **THEN** Le moteur analyse le hash résultant et cale l'affichage sur la diapositive demandée.
