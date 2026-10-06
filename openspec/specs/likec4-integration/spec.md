# Spécification : Intégration et Embarquement LikeC4

## Purpose
Cette spécification définit les mécanismes d'intégration, de chargement asynchrone sécurisé, de contrôle de l'état d'affichage et d'automatisation du viewport des rendus graphiques LikeC4 embarqués via iframe dans les diapositives.

## Requirements

### Requirement: Embarquement isolé via iframe pour builds single-file LikeC4
Les modèles d'architecture LikeC4 doivent être compilés sous forme de bundles statiques mono-fichiers autonomes (`assets/coffee-v1-single/index.html`, `assets/coffee-v2-single/index.html`) et projetés dans le DOM via des éléments `<iframe>` pour garantir l'étanchéité CSS et JS vis-à-vis du diaporama parent.

#### Scenario: Rendu d'une vue LikeC4 spécifique
- **WHEN** L'iframe d'un projet LikeC4 est chargée avec une URL ciblée (ex: `assets/coffee-v2-single/index.html#/project/coffee-v2/view/c2_containers?theme=dark`)
- **THEN** Le composant LikeC4 s'exécute dans son sandbox, adopte le thème sombre et présente la vue d'architecture demandée sans interférer avec le style global de la présentation.

---

### Requirement: Chargement différé et interception par IntersectionObserver (Lazy Loading)
Afin d'éviter de saturer le réseau ou le moteur de rendu dès le démarrage de la présentation, les iframes LikeC4 ne doivent charger leur source que lorsque la diapositive parente approche ou entre dans le champ visuel.

#### Scenario: Diapositive éloignée de la vue courante
- **WHEN** La diapositive se situe hors de l'écran lors du chargement initial
- **THEN** L'attribut `src` de l'iframe reste non assigné et seule la cible est conservée dans l'attribut `data-src`.

#### Scenario: Approche de la diapositive dans le champ de vision
- **WHEN** La diapositive franchit le seuil d'intersection configuré (seuil de 10% de visibilité) ou devient active via `SlideEngine.goTo()`
- **THEN** Le moteur déclenche l'affectation du `data-src` vers `src` pour les embeds en mode automatique (`loadSlideEmbeds`) et amorce le téléchargement des assets.

---

### Requirement: Chargement transparent et direct des intégrations LikeC4
Les conteneurs LikeC4 doivent charger leur vue directement sans afficher de bloc ou bouton intrusif (« Chargement LikeC4… »), préservant la fluidité visuelle et la propreté de l'écran lors du défilement.

#### Scenario: Rendu immédiat à l'affichage de la diapositive
- **WHEN** La diapositive contenant un modèle LikeC4 devient active
- **THEN** L'iframe charge son bundle localement en arrière-plan sans insérer de bloc d'attente obstruant la vue, et affiche le diagramme dès son initialisation.

---

### Requirement: Détection d'incident et affichage de secours (Fallback Timeout)
En cas d'échec de chargement réseau, de blocage de script ou de restriction de sécurité du navigateur, un mécanisme de secours discret doit proposer un lien direct vers la vue.

#### Scenario: Dépassement du délai de chargement (Timeout)
- **WHEN** Le délai alloué (`data-embed-timeout`, par défaut 4000ms) s'écoule sans confirmation de rendu valide
- **THEN** La classe `.is-fallback` est appliquée si l'iframe n'a pas pu charger sa source. En protocole local (`file://`) ou contextes restreints, l'exception d'accès DOM inter-origines ne déclenche pas de faux positif si la source est activement chargée.

#### Scenario: Tentative de rechargement depuis le bandeau de secours
- **WHEN** L'utilisateur clique sur le bouton de rechargement `[↻]` dans la barre d'outils `.embed-controls`
- **THEN** Le temporisateur est réinitialisé et une nouvelle tentative de chargement forcé (`forceReload: true`) est lancée.

---

### Requirement: Redimensionnement adaptatif et proportionnel des diffs visuels en PR (Sliders interactifs)
Les aperçus de pull request intégrant des diffs d'images avec curseurs glissants (`swipe` et `onion-skin`) DOIVENT (SHALL) s'adapter dynamiquement à la largeur de l'écran et à une proportion de l'espace vertical disponible, sans boucle d'agrandissement indésirable.

#### Scenario: Consultation d'un diff visuel sur smartphone ou écran restreint
- **WHEN** Le diff d'image (848px de largeur native) est affiché sur un écran mobile en portrait ou paysage
- **THEN** La vue est mise à l'échelle via `scale = Math.min(1, maxW / naturalW, maxH / naturalH)` où `maxH` représente une fraction maîtrisée de la hauteur d'écran (~40% à ~52%), et le conteneur ajuste sa hauteur de façon stable et synchrone sans dériver ni s'agrandir en boucle.

---

### Requirement: Ajustement automatique du cadrage LikeC4 (Viewport Auto-Tuning)
Pour éviter que les diagrammes LikeC4 basés sur ReactFlow apparaissent trop rapprochés ou tronqués, le parent doit pouvoir simuler les clics d'ajustement du canvas.

#### Scenario: Exécution du FitView et du ZoomOut automatisés
- **WHEN** L'iframe LikeC4 a fini son chargement avec les attributs `data-likec4-fit-on-load="true"` et `data-likec4-zoomout-steps="1"`
- **THEN** Des requêtes DOM internes ciblent les boutons `.react-flow__controls-fitview` puis `.react-flow__controls-zoomout` pour ajuster et aérer instantanément la perspective du diagramme.

---

### Requirement: Commandes d'ouverture externe
Chaque conteneur LikeC4 doit disposer d'un bouton d'ouverture externe permettant à l'orateur de basculer la vue en plein écran dans un onglet distinct si un membre de l'audience demande un zoom approfondi.

#### Scenario: Clic sur le bouton d'exportation externe
- **WHEN** L'orateur clique sur l'icône d'ouverture `[↗]` de la barre d'outils `.embed-controls`
- **THEN** L'URL effective de la vue LikeC4 courante est ouverte dans une nouvelle fenêtre ou un nouvel onglet via `window.open(url, '_blank')`.
