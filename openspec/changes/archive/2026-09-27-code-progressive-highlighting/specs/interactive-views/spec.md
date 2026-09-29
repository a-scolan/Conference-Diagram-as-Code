## ADDED Requirements

### Requirement: Surlignage progressif des extraits de code par étapes
Les cadres d'aperçu de code des diapositives techniques clés (Slide 11 C1, Slide 13 C2, Slide 18 Séquence dynamique) DOIVENT (SHALL) proposer une barre de contrôle d'étapes permettant au présentateur de guider l'attention de l'auditoire en surlignant séquentiellement des portions de code tout en atténuant le reste.

#### Scenario: Affichage initial avec vue complète par défaut
- **WHEN** Une diapositive de code équipée de la barre d'étapes est affichée
- **THEN** Le bouton "Tout" est actif par défaut, l'attribut `data-active-step="all"` est appliqué et toutes les lignes de code conservent leur lisibilité standard sans atténuation.

#### Scenario: Sélection d'une étape d'explication spécifique
- **WHEN** L'utilisateur clique sur le bouton d'une étape donnée (ex: "1 · Acteurs", "2 · Bus", "3 · Flux")
- **THEN** Le bouton sélectionné reçoit la classe `.is-active`, l'attribut `data-active-step` prend la valeur de l'étape, les lignes associées à cette étape reçoivent une bordure d'accentuation et une opacité maximale ($1.0$), tandis que les autres lignes de code sont atténuées avec une opacité réduite ($\approx 0.3$).

#### Scenario: Réinitialisation vers la vue complète
- **WHEN** L'utilisateur clique sur le bouton "Tout" après avoir navigué dans les étapes
- **THEN** L'attribut `data-active-step` repasse à `"all"` et l'ensemble du bloc de code redevient pleinement visible sans atténuation.
