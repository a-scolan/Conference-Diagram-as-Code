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
- **WHEN** La diapositive franchit le seuil d'intersection configuré (seuil de 10% de visibilité)
- **THEN** L'IntersectionObserver déclenche l'affectation du `data-src` vers `src` pour les embeds en mode automatique et amorce le téléchargement des assets.

---

### Requirement: Modes de chargement explicite (Manuel vs Automatique) et CTA dédié
Certains blocs LikeC4 complexes doivent pouvoir être déclenchés uniquement sur action délibérée de l'orateur, signalée par un bouton d'action primaire (`.embed-likec4-cta`).

#### Scenario: Présentation avec mode manuel
- **WHEN** Le conteneur `.embed-wrap` porte l'attribut `data-load-mode="manual"`
- **THEN** Le chargement automatique est inhibé, un écran d'attente affiche le bouton `"Charger le rendu LikeC4"` et le navigateur n'initie aucune requête réseau pour l'iframe.

#### Scenario: Clic sur le bouton de déclenchement du rendu
- **WHEN** L'orateur clique sur le bouton `.embed-likec4-cta` ou `.embed-loader__button`
- **THEN** Le conteneur passe en état `.is-loading`, le label devient `"Chargement LikeC4…"`, le bouton est désactivé et l'iframe charge sa ressource.

#### Scenario: Fin de chargement réussi
- **WHEN** L'événement `load` de l'iframe est émis
- **THEN** La classe `.is-loading` est retirée, la classe `.is-loaded` est ajoutée, l'écran de chargement disparaît et le bouton s'efface pour laisser place à la vue LikeC4 active.

---

### Requirement: Détection d'incident et affichage de secours (Fallback Timeout)
En cas d'échec de chargement réseau, de blocage de script ou de restriction de sécurité du navigateur, un mécanisme de secours automatique doit proposer un lien direct vers la vue.

#### Scenario: Dépassement du délai de chargement (Timeout)
- **WHEN** Le délai alloué (`data-embed-timeout`, par défaut 10000ms en manuel ou 6000ms en automatique) s'écoule sans confirmation de rendu valide
- **THEN** La classe `.is-fallback` est appliquée et l'élément `.embed-fallback` s'affiche avec le message d'erreur et un lien hypertexte ouvrant la vue LikeC4 dans un nouvel onglet.

#### Scenario: Tentative de rechargement depuis le bandeau de secours
- **WHEN** L'utilisateur clique sur le bouton de rechargement `[↻]` dans la barre d'outils `.embed-controls`
- **THEN** Le temporisateur est réinitialisé et une nouvelle tentative de chargement forcé (`forceReload: true`) est lancée.

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
