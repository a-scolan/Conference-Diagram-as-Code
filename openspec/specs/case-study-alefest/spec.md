# Spécification : Cas d'Étude AleFest Coffee (Case Study)

## Purpose
Cette spécification formalise le cas d'étude métier « AleFest Coffee », fil rouge de la conférence, décrivant la transition architecturale entre une V1 synchrone au comptoir et une V2 mobile événementielle distribuée, servant de socle aux démonstrations Diagram-as-Code.

## Requirements

### Requirement: Définition du domaine métier et du contexte festif
Le cas d'étude doit mettre en scène un stand de café artisanal installé au cœur d'un festival de musique (« AleFest »), soumis à des pics massifs d'affluence entre deux représentations scéniques.

#### Scenario: Contrainte temporelle des festivaliers
- **WHEN** Les concerts se terminent ou marquent une pause
- **THEN** Les festivaliers affluent vers le stand café sans vouloir sacrifier 15 minutes d'attente physique au détriment des prochains concerts (« Don't miss the show for a shot of espresso »).

---

### Requirement: Architecture V1 — Le Comptoir (Prise de commande numérique locale)
La version V1 doit concrétiser les choix de l'ADR-001 « Digitaliser le stand café » en introduisant une prise de commande numérique sur place avec écran barista dédié.

#### Scenario: Modélisation des composants de la V1
- **WHEN** L'architecture V1 est inspectée au niveau C2
- **THEN** Elle comprend les briques suivantes :
  - **Acteurs :** `Festivalier` (passe commande sur borne), `Barista` (prépare les cafés).
  - **Frontends :** `Application Comptoir` (SPA de commande sur borne/tablette), `Écran Barista` (SPA temps réel connectée en WebSocket).
  - **Services :** `Service de Commandes` (ingestion des commandes et persistance), `Service Préparation` (gestion de la file d'attente et ordonnancement).
  - **Infrastructure :** `RabbitMQ` (bus d'événements pour distribuer `order.placed` et `order.ready`), `PostgreSQL` (stockage des commandes et états).

#### Scenario: Flux d'exécution V1
- **WHEN** Une commande est saisie au comptoir
- **THEN** Le `Service de Commandes` enregistre la commande, émet l'événement `order.placed` sur RabbitMQ, le `Service Préparation` le consomme pour mettre à jour l'écran du barista, et le festivalier attend au comptoir jusqu'à la remise en main propre.

---

### Requirement: Architecture V2 — Le Café Mobile (Écosystème distribué événementiel)
La version V2 doit concrétiser les choix de l'ADR-002 « Commander depuis son téléphone », en intégrant le stand café à l'application officielle du festival avec notification push mobile.

#### Scenario: Modélisation des ajouts architecturaux en V2
- **WHEN** L'architecture V2 est comparée à la V1
- **THEN** Les éléments suivants sont intégrés dans le modèle :
  - **Système externe partenaire :** `Système Festival` comprenant l'`Application Festival` (React Native/Expo) et le `Service Festival` (API Node.js).
  - **Nouveau service interne :** `Notification Service` (consommateur d'événements chargé d'émettre des notifications push via Firebase Cloud Messaging vers l'application mobile).
  - **Nouveaux flux asynchrones :** consommation de `order.ready` sur RabbitMQ par le `Notification Service`, puis transmission de la notification push au smartphone du festivalier.

#### Scenario: Bénéfice métier et liberté du festivalier
- **WHEN** Un festivalier passe commande depuis son smartphone via l'application du festival
- **THEN** Il quitte la zone du stand pour profiter de l'événement et ne revient récupérer son café que lorsqu'une alerte push l'informe que sa commande est prête au bar.
