# Spécification : Expérience Visuelle et Effets Scéniques (Presentation UX)

## Purpose
Cette spécification définit les modules d'ambiance scénique et d'expérience visuelle du diaporama, comprenant le pointeur laser virtuel interactif, les cristaux décoratifs d'arrière-plan, l'ajustement dynamique des citations et des métriques KPI, ainsi que le positionnement calculé des projecteurs QR Code.

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

### Requirement: Injection dynamique des polygones décoratifs (Cristaux)
Pour habiller le fond sombre sans alourdir manuellement le balisage de chaque diapositive, un ensemble de facettes polygonales translucides (effet signature "cristaux") doit être injecté dynamiquement dans toutes les diapositives de contenu.

#### Scenario: Génération des cristaux au chargement
- **WHEN** Le script d'initialisation s'exécute
- **THEN** Toutes les diapositives autres que la slide de titre reçoivent un calque SVG vectoriel `.slide-crystals` composé de 6 polygones aux teintes bleutées semi-transparentes (`rgba(18,28,70,0.50)` à `rgba(15,22,55,0.30)`), avec `pointer-events: none` et `z-index: -1`.

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
