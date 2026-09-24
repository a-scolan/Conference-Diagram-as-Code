# Spécification : Diagrammes Interactifs Mermaid

## Purpose
Cette spécification définit l'implémentation et le comportement dynamique des diagrammes d'architecture générés avec Mermaid au sein du diaporama, comprenant la détection de thème clair/sombre, le redimensionnement adaptatif (Auto-Fit), le zoom fluide, la manipulation par glisser-déposer (Pan) et le centrage automatique.

## Requirements

### Requirement: Initialisation contextuelle selon le thème utilisateur
Les diagrammes Mermaid doivent s'adapter automatiquement aux préférences de couleur du système (`prefers-color-scheme`) et aux variables CSS de la charte de présentation.

#### Scenario: Rendu en mode sombre par défaut
- **WHEN** La page charge sans préférence explicite pour le thème clair
- **THEN** Mermaid est initialisé avec une palette contrastée sur fond sombre (lignes bleutées `--text-dim`, nœuds accentués `--accent` et fond transparent).

#### Scenario: Rendu en mode clair
- **WHEN** L'environnement utilisateur signale une préférence active pour le thème clair (`prefers-color-scheme: light`)
- **THEN** Les variables de thème Mermaid basculent sur des encres sombres (`#080d2a`) avec des bordures et fonds clairs adaptés.

---

### Requirement: Calcul automatique du cadrage et de l'échelle (Auto-Fit)
Les éléments graphiques vectoriels générés par Mermaid doivent être dimensionnés pour occuper au mieux l'espace alloué sans déborder ni être coupés.

#### Scenario: Ajustement d'un diagramme sur écran standard
- **WHEN** Le SVG d'un diagramme est rendu dans son conteneur `.mermaid-wrap`
- **THEN** La fonction `autoFitMermaid` extrait la `viewBox` originale, applique une marge de sécurité (`padding`), calcule le ratio d'aspect par rapport à l'élément conteneur et fixe la largeur et hauteur effectives en pixels.

#### Scenario: Présence de modes de cadrage spécifiques
- **WHEN** L'attribut `data-fit-mode="cover"` est présent sur le conteneur
- **THEN** L'échelle sélectionnée privilégie le remplissage maximal de l'axe le plus contraignant (`Math.max(cw / vw, ch / vh)`), plafonné par `data-fit-scale-max`.

---

### Requirement: Commandes de zoom manuelles (+, -, réinitialisation)
Chaque diagramme Mermaid volumineux doit proposer une barre d'outils de zoom flottante (`.zoom-controls`) non intrusive.

#### Scenario: Clic sur le bouton de zoom avant
- **WHEN** L'utilisateur clique sur le bouton `[+]` d'un diagramme
- **THEN** Le niveau de zoom courant est multiplié par le facteur configuré (ex: `1.2`), borné par la valeur maximale autorisée (`data-zoom-max`), et le diagramme est réaligné sur son centre utile.

#### Scenario: Clic sur le bouton de zoom arrière
- **WHEN** L'utilisateur clique sur le bouton `[-]` d'un diagramme
- **THEN** Le niveau de zoom est réduit selon le facteur inverse (ex: `0.8`), dans la limite minimale autorisée (`data-zoom-min`).

#### Scenario: Réinitialisation du zoom
- **WHEN** L'utilisateur clique sur le bouton de réinitialisation `[↺]`
- **THEN** Le facteur de zoom revient exactement à la valeur initiale définie par `data-initial-zoom` (ou `1.0` par défaut).

---

### Requirement: Zoom à la molette (Wheel Zoom)
L'utilisateur doit pouvoir agrandir ou rétrécir un diagramme au moyen de la molette de la souris ou d'un geste de pincement.

#### Scenario: Utilisation de la molette sans touche modificatrice (mode free-wheel)
- **WHEN** L'élément porte l'attribut `data-wheel-zoom="true"` et que l'utilisateur tourne la molette
- **THEN** Le niveau de zoom est ajusté proportionnellement au delta vertical sans déclencher le défilement de la diapositive parent.

#### Scenario: Utilisation de la molette avec touche modificatrice
- **WHEN** Le conteneur ne porte pas `data-wheel-zoom="true"`
- **THEN** Le zoom n'intervient que si la touche `Ctrl` ou `Meta` (Cmd) est maintenue enfoncée, évitant les zooms accidentels lors d'un défilement normal.

---

### Requirement: Déplacement panoramique à la souris ou au doigt (Pan)
Lorsque le diagramme dépasse la zone visible de son conteneur, l'utilisateur doit pouvoir le glisser librement dans toutes les directions.

#### Scenario: Détection de la capacité de déplacement
- **WHEN** La taille calculée du diagramme dépasse la largeur ou la hauteur visible du conteneur `.mermaid-scroll`
- **THEN** La classe `.can-pan` est ajoutée au conteneur et le curseur prend l'apparence de préhension (`grab`).

#### Scenario: Manipulation par glisser-déplacer
- **WHEN** L'utilisateur maintient le bouton gauche de la souris enfoncé et déplace le curseur
- **THEN** Le conteneur capture le pointeur (`setPointerCapture`), passe en état actif `.is-panning` et ajuste les décalages `scrollLeft` et `scrollTop` en temps réel.

#### Scenario: Fin de la manipulation
- **WHEN** L'utilisateur relâche le bouton ou que le pointeur quitte le champ
- **THEN** L'état `.is-panning` est immédiatement retiré sans effet de rebond inattendu.

---

### Requirement: Centrage automatique lors de l'affichage (Auto-Centering on Reveal)
Lorsqu'une diapositive contenant un diagramme devient visible, la zone d'intérêt du diagramme doit être automatiquement positionnée au centre de la vue.

#### Scenario: Entrée dans une diapositive avec diagramme
- **WHEN** Une diapositive contenant un diagramme passe en état `.visible` via l'IntersectionObserver
- **THEN** Le moteur vérifie si `shouldCenterMermaidViewport` est vérifié et planifie un double calcul de coordonnées pour centrer le cadre englobant (bounding box) au milieu de la fenêtre visible.
