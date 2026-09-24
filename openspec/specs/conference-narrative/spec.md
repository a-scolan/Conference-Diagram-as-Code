# Spécification : Trame Narrative et Déroulé de Conférence (Conference Narrative)

## Purpose
Cette spécification définit l'architecture narrative, l'argumentaire technique, la progression pédagogique et les grandes étapes du discours pour la conférence « Ne dessinez plus vos architectures : codez-les ! », afin de permettre l'étude, la transmission ou l'évolution du contenu de la session.

## Requirements

### Requirement: Acte 0 — L'Accroche et le Constat de Faillite du Schéma Statique
La conférence doit débuter par une interpellation directe de l'auditoire exposant le coût caché de la dette documentaire des architectures logicielles.

#### Scenario: Exposition du problème réel
- **WHEN** L'orateur introduit le sujet (diapositives 0 à 6)
- **THEN** Le discours pose les questions fondamentales : qui a déjà fait un dessin de système devenu obsolète 6 mois plus tard ? Pourquoi a-t-on résolu la gestion du code (Git, PR, CI/CD) mais pas celle des schémas d'architecture qui finissent sous forme de PNG morts dans des wikis ?

#### Scenario: Énonciation des trois principes du changement de paradigme
- **WHEN** La diapositive « Changer de paradigme » est présentée
- **THEN** Trois principes directeurs sont affirmés :
  1. Une unique source de vérité sémantique pour tout le système
  2. Des perspectives multiples (différentes vues générées depuis un seul modèle)
  3. Un cycle de vie aligné sur le code (Git, pull requests, revues visuelles et CI/CD).

#### Scenario: Introduction de la métaphore C4
- **WHEN** La slide C4 zoom est abordée
- **THEN** Le modèle C4 est introduit via l'analogie avec Google Maps (zoom du contexte C1 aux conteneurs C2, composants C3 et code C4) pour normaliser le vocabulaire d'échange.

---

### Requirement: Acte 1 — De l'ADR au Modèle de Contexte (C1)
La première démonstration doit prouver qu'une modélisation architecturale démarre d'un texte exprimant une intention métier claire (Architecture Decision Record) et non d'un schéma vide.

#### Scenario: Présentation de l'ADR-001 (Le stand café)
- **WHEN** L'acte 1 est déroulé
- **THEN** L'orateur présente l'ADR-001 « Digitaliser le stand café » résolvant l'engorgement du stand AleFest Coffee par une prise de commande numérique au comptoir.

#### Scenario: Dérivation de la vue de contexte (C1)
- **WHEN** Le modèle initial LikeC4 est inspecté
- **THEN** Le système fait émerger les frontières du système et ses acteurs principaux : le `Festivalier`, le `Barista` et le système `AleFest Café`, sans encombrer la vue de détails d'implémentation prématurés.

---

### Requirement: Acte 2 — Conteneurs et Comportements Événementiels (C2 & Dynamique)
La deuxième partie zoome dans les entrailles du système pour faire comprendre comment des choix techniques traduisent une expérience utilisateur.

#### Scenario: Zoom sur les conteneurs (C2 statique)
- **WHEN** La vue C2 est exposée
- **THEN** L'architecture met en scène les front-ends (Application Festival mobile, Counter App comptoir, Barista Screen), les services backend (Order Service, Preparation Service, Notification Service), le broker RabbitMQ et la base PostgreSQL.

#### Scenario: Narration du flux comportemental (Vue dynamique / séquence)
- **WHEN** Le scénario dynamique est projeté
- **THEN** L'orateur détaille le trajet d'une commande : passage de commande mobile $\to$ publication de l'événement `order.placed` $\to$ affichage WebSocket pour le barista $\to$ notification push Firebase au festivalier lorsque la boisson est prête.

#### Scenario: Bilan d'impact UX (Avant / Après)
- **WHEN** La diapositive d'impact est affichée
- **THEN** La session démontre que l'architecture as-code permet de relier directement un choix technique (asynchronisme RabbitMQ/WebSocket) à un bénéfice humain immédiat (le festivalier profite du festival au lieu d'attendre au comptoir).

---

### Requirement: Acte 3 — Collaboration, Revue et Diff Visuel en Pull Request
La troisième partie déplace l'enjeu de l'outil individuel vers la collaboration d'équipe, en montrant comment une Pull Request documente un saut architectural.

#### Scenario: Exposition de l'arborescence et séparation des spécifications
- **WHEN** La slide « Specs & arborescence » est commentée
- **THEN** L'orateur montre comment le dépôt sépare les spécifications d'éléments réutilisables (`shared/`) des modèles métier concrets (`coffee-v2/`).

#### Scenario: Revue d'architecture en Pull Request
- **WHEN** La slide « La pull request » est analysée
- **THEN** Le diff Git et les diagrammes Mermaid `gitGraph` illustrent que la revue d'architecture s'opère sur les branches de code, permettant aux relecteurs d'identifier immédiatement les nouveaux flux, les nouveaux services et les dépendances introduites.

---

### Requirement: Acte 4 — Industrialisation, Portail Vivant et Synthèse
La clôture de la session démontre que le modèle as-code s'exporte en portail de documentation interactif et navigable pour l'ensemble des parties prenantes.

#### Scenario: Démonstration du portail vivant
- **WHEN** L'orateur manipule le portail généré par LikeC4
- **THEN** Il illustre la navigation interactive par clic, les liens directs vers les fichiers de code et la capacité pour différents publics (développeurs, architectes, PO) d'explorer le même système à leur niveau d'intérêt.

#### Scenario: Matrice de synthèse Avant / Après
- **WHEN** La slide de tableau comparatif final est présentée
- **THEN** Cinq dimensions clés sont résumées : source de vérité (wiki vs Git), mise à jour (redessiner vs refactorer), validation (tardive vs automatisée en PR), intégration (séparée vs continue), et usage de l'IA (génération approximative vs copilote de code C4).
