## MODIFIED Requirements

### Requirement: Support responsive mobile avec verrouillage d'orientation paysage obligatoire
Le moteur de rendu DOIT (SHALL) exiger l'orientation paysage sur les écrans mobiles de petite taille (`@media (orientation: portrait) and (max-width: 899px)`), en bloquant l'affichage vertical inadapté et en adaptant la mise en page en mode horizontal (hauteur d'écran $\le 560$px) pour garantir l'intégrité des diagrammes et des codes.

#### Scenario: Ouverture sur smartphone en mode portrait (Verrouillage obligatoire)
- **WHEN** La page est consultée sur un écran mobile en orientation portrait
- **THEN** Un calque bloquant plein écran (`.orientation-lock-overlay`) s'affiche au premier plan, masquant la présentation et exigeant la rotation de l'appareil avec une animation de smartphone pivotant à 90 degrés et le message neutre et universel : *« Veuillez faire pivoter votre écran en mode paysage (horizontal). »*.

#### Scenario: Affichage sur smartphone en mode paysage (Déverrouillage et layout compact)
- **WHEN** L'appareil est tourné en mode paysage (hauteur d'écran comprise entre 320px et 560px)
- **THEN** Le calque bloquant disparaît instantanément, les paddings verticaux sont réduits au strict minimum (6px à 12px), les tailles de police s'ajustent via `clamp()`, les barres de défilement inesthétiques sont masquées tout en conservant le toucher (`scrollbar-width: none`), et les panneaux de contenu activent un défilement vertical interne (`overflow-y: auto`) si nécessaire pour empêcher tout débordement tronqué.

---

### Requirement: Sanctuaire tactile et isolation gestuelle mobile (Pinch-to-zoom & navigation autonome)
Le moteur de diaporama DOIT (SHALL) distinguer les interactions tactiles de lecture autonome (défilement de code, exploration de diagrammes, pinch-to-zoom) des gestes de navigation entre diapositives.

#### Scenario: Zoom multi-touch (Pinch-to-zoom)
- **WHEN** Deux doigts ou plus touchent l'écran simultanément ou que l'échelle du `visualViewport` est supérieure à $1.05$
- **THEN** Le pinch-to-zoom natif du navigateur est autorisé et le changement de diapositive (`next()` / `prev()`) est strictement verrouillé.

#### Scenario: Manipulation tactile au sein d'un composant de code ou de diagramme
- **WHEN** L'utilisateur glisse le doigt au sein d'un bloc de code (`.slide__code-block`, `pre`, `code`), d'un diagramme Mermaid (`.mermaid-wrap`), d'une iframe ou de commandes tactiles
- **THEN** L'événement de swipe global du diaporama est ignoré, permettant de faire défiler le contenu interne ou de manipuler les onglets sans sauter de slide.

---

### Requirement: Décorations adaptatives et masquage des superpositions en mode compact
Les éléments décoratifs (mires d'angles blueprint, barrettes de calibration biseautées) DOIVENT (SHALL) s'effacer automatiquement dès lors que la densité du contenu ou l'exiguïté de l'écran risquent de provoquer une superposition gênante.

#### Scenario: Consultation sur écran mobile ou de hauteur réduite
- **WHEN** La hauteur d'écran est inférieure ou égale à $560$px ou la largeur inférieure ou égale à $960$px
- **THEN** Les mires blueprint d'angle (`.blueprint-deco-frame`) et les barrettes de calibration (`.card-hatch-strip-wrap`) sont masquées (`display: none !important`), libérant la totalité de la surface pour le texte et les schémas.

#### Scenario: Diapositives comparatives denses ou interactives sur écran large
- **WHEN** Une diapositive dense (V1 vs V2, Avant / Après, Portail vivant) est affichée
- **THEN** Les hachures et mires d'angle sont automatiquement omises pour éviter tout télescopage avec les listes de points et les représentations graphiques.

---

### Requirement: Calibrage typographique pour visibilité en grand amphithéâtre
Le système de rendu du diaporama DOIT (SHALL) garantir des dimensions de police lisibles sans effort à plus de 15 mètres de distance sur vidéoprojecteur standard lors d'une projection sur grand écran.

#### Scenario: Rendu d'une diapositive de contenu en salle plénière
- **WHEN** Une diapositive de texte ou de concept est projetée sur un écran large ($\ge 1024$px)
- **THEN** Le corps de texte respecte une taille minimale absolue de 24 pixels (`clamp(24px, 2.2vw, 36px)`) et les titres principaux atteignent au minimum 48 pixels.

---

### Requirement: Remplacement des grilles tabulaires par des cartes visuelles séquencées
Les synthèses comparatives multicritères NE DOIVENT PAS (SHALL NOT) être rendues sous forme de grilles de texte denses, mais sous forme de cartes d'impact visuelles contrastant l'ancien et le nouveau paradigme.

#### Scenario: Consultation du bilan comparatif Avant/Après
- **WHEN** L'orateur arrive à la phase de conclusion de la conférence
- **THEN** La synthèse est présentée sous forme de cartes ou diapositives successives mettant en valeur un bénéfice architectural unique par écran (ex: Source de vérité, Cycle de vie Git, Validation visuelle en PR) avec icônes et contrastes marqués.

---

### Requirement: Mise en exergue dynamique du code et conteneurs auto-redimensionnables
Les fenêtres d'aperçu de code DOIVENT (SHALL) permettre l'accentuation visuelle de lignes spécifiques et proposer un bouton d'agrandissement de la zone de code pour faciliter la lecture des détails lors de la présentation.

#### Scenario: Présentation d'un extrait de modèle C4
- **WHEN** L'orateur commente une section spécifique du modèle `.c4`
- **THEN** Les lignes ciblées sont mises en valeur par une surbrillance contrastée (`line-highlight`), tandis que le reste du bloc est légèrement estompé pour guider le regard de l'auditoire.
