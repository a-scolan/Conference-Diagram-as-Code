## ADDED Requirements

### Requirement: Diffusion d'état et pilotage distant pour mode présentateur
Le moteur d'exécution du diaporama (`SlideEngine`) DOIT (SHALL) émettre ses changements de diapositive vers le canal de communication local `dac-presenter-channel` et accepter les commandes de navigation distantes transmises par la console présentateur.

#### Scenario: Émission d'un changement de diapositive
- **WHEN** La diapositive active change sur l'écran public suite à une interaction locale
- **THEN** Le moteur publie un message `SLIDE_CHANGED` contenant l'index courant, l'identifiant de la slide et le timestamp sur `BroadcastChannel('dac-presenter-channel')` et met à jour la clé `dac_current_slide` dans `localStorage`.

#### Scenario: Réception d'une commande de navigation distante
- **WHEN** Un message `GOTO_SLIDE` avec un index valide est reçu sur le canal de synchronisation
- **THEN** Le diaporama public navigue immédiatement vers la diapositive demandée sans animation perturbatrice et met à jour l'ancre d'URL.

#### Scenario: Raccourci d'ouverture de la console présentateur
- **WHEN** L'orateur appuie sur la touche `P` sur la présentation principale
- **THEN** Une nouvelle fenêtre de navigateur est ouverte vers `presenter-view.html` avec les dimensions optimales pour écran secondaire (`width=1280, height=800`).
