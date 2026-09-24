# Spécification : Expérience Visuelle et Effets Scéniques (Presentation UX)

## Purpose
Cette spécification définit les modules d'ambiance scénique et d'expérience visuelle du diaporama, comprenant le pointeur laser virtuel interactif, les ornements blueprint et réglettes d'étalonnage, l'ajustement dynamique des citations et des métriques KPI, le positionnement calculé des projecteurs QR Code, ainsi que le calibrage typographique et les cartes d'impact pour grands écrans.

## Requirements

### Requirement: Pointeur laser virtuel haute précision
Le diaporama doit intégrer un pointeur laser virtuel (`.laser-pointer`) qui remplace le curseur natif sur les périphériques de type souris ou stylet afin de faciliter l'accroche visuelle en salle de conférence.

#### Scenario: Activation sur déplacement du pointeur
- **WHEN** L'utilisateur déplace la souris sur la fenêtre (`pointermove`)
- **THEN** Le curseur natif du document est masqué (`cursor: none`), la classe `laser-cursor-enabled` est activée, et le disque laser suit les coordonnées du pointeur avec une synchronisation par `requestAnimationFrame`.

#### Scenario: Effet d'impulsion au clic
- **WHEN** L'utilisateur appuie sur le bouton de la souris (`pointerdown`)
- **THEN** L'élément laser reçoit la classe `.is-active`, son échelle visuelle est augmentée (facteur $1.06$), et l'anneau lumineux externe s'intensifie pour simuler l'appui sur une télécommande laser de scène.

#### Scenario: Masquage automatique sur écran tactile ou sortie de fenêtre
- **WHEN** L'interaction provient d'un écran tactile (`pointerType === 'touch'`), que le curseur quitte la fenêtre (`mouseout`) ou que la page perd le focus (`blur`, `pagehide`)
- **THEN** Le laser est instantanément masqué (`is-visible` retiré) et le curseur natif est restauré.

---

### Requirement: Injection dynamique des ornements blueprint et réglettes de calibration
Pour renforcer l'identité d'ingénierie technique et de modélisation vivante, un ensemble de repères blueprint (mires d'alignement, échelle quadrichromie CMYK, hachures biseautées) DOIT (SHALL) être injecté dynamiquement dans toutes les diapositives de contenu, complété de réglettes de calibration sur les composants de cartes.

#### Scenario: Génération des repères blueprint d'angles
- **WHEN** Le script d'initialisation du moteur de diaporama s'exécute
- **THEN** Toutes les diapositives autres que la slide de titre reçoivent quatre ornements vectoriels SVG discrets positionnés aux quatre coins (`.blueprint-deco--tl`, `.blueprint-deco--tr`, `.blueprint-deco--bl`, `.blueprint-deco--br`), avec `pointer-events: none` et `z-index: 1`.

#### Scenario: Injection des barrettes de calibration sur les cartes
- **WHEN** Les cartes de concept ou de bénéfices sont rendues (`.concept-card`, `.benefit-card`)
- **THEN** Une réglette SVG de micro-hachures biseautées (`.card-calibration-strip`) est automatiquement insérée en lisière inférieure de chaque carte sans alourdir le balisage statique initial.

---

### Requirement: Ajustement typographique adaptatif (Quotes & KPIs Auto-Fit)
Pour prévenir les débordements de texte sur différentes résolutions d'écran ou vidéoprojecteurs, les blocs de citations et les grandes valeurs KPI doivent automatiquement ajuster leur échelle.

#### Scenario: Réduction de la taille de police d'une citation longue
- **WHEN** Le texte d'une citation dans `.slide--quote blockquote` dépasse 100 caractères
- **THEN** La taille de police est réduite proportionnellement (`scale = Math.max(0.5, 100 / length)`), avec un plancher minimal de 16 pixels.

#### Scenario: Mise à l'échelle des métriques numériques KPI
- **WHEN** La largeur du contenu textuel `.slide__kpi-val` dépasse la largeur disponible de son conteneur
- **THEN** Une transformation CSS `scale(s)` est appliquée avec pour origine `left top` pour garantir que le nombre reste intégralement visible.

---

### Requirement: Positionnement dynamique du projecteur QR Code (Merci / Feedback)
Sur la diapositive de conclusion et de remerciement, le bloc contenant le QR code OpenFeedback doit être centré verticalement par rapport à l'espace libre au-dessus du sous-titre.

#### Scenario: Calcul géométrique de l'espacement
- **WHEN** La diapositive de remerciements (`Merci`) est affichée ou redimensionnée
- **THEN** La fonction `updateMerciQrSpotlightPosition` mesure la hauteur disponible entre le haut de la diapositive et le sous-titre, calcule le décalage optimal et met à jour la variable CSS locale `--merci-qr-top` pour équilibrer la composition.

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
