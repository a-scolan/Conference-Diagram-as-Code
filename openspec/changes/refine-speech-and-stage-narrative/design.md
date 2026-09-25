## Context

Le support de présentation HTML modulaire (35 slides compilées par `build-deck.js`) est désormais stabilisé et réactif. L'enjeu critique s'est déplacé vers la performance scénique de l'orateur : la clarté du message, l'économie de mots (zéro slop), la rigueur pédagogique et la capacité à captiver une salle hétérogène (développeurs, architectes, agilistes, managers) sans se perdre dans des débats d'implémentation.

Voir `proposal.md` pour la motivation et `specs/conference-narrative/spec.md` pour les exigences de comportement.

## Goals / Non-Goals

**Goals:**
- Fournir un runbook de scène unifié et infaillible dans `deroule-conference-slides.md`.
- Éliminer le jargon mou et les superlatifs d'IA (`simple-english`).
- Découper la narration en battements unitaires sans temps mort (`writing-beats`).
- Sécuriser les 5 phases de présentation avec des repères chronométriques stricts (45 min).

**Non-Goals:**
- Modifier le code applicatif du cas d'étude AleFest Coffee ou les modèles `.c4` existants.
- Refaire le moteur de rendu CSS ou le compilateur de slides (déjà traités).
- Entrer dans le détail de la gouvernance d'architecture d'entreprise type TOGAF.

## Decisions

### 1. Synchronisation rigide Runbook $\leftrightarrow$ Manifeste de slides
- **Choix :** `deroule-conference-slides.md` référence exactement les 35 entrées de `slides.json` (Slide 00 à Slide 34) avec fichier source, contenu projeté, intention orale et beat narratif.
- **Alternative rejetée :** Conserver un texte de déroulé narratif libre en paragraphes. *Raison du rejet :* provoque des désynchronisations en répétition dès qu'une slide est découpée ou réordonnée.

### 2. Triple filtre stylistique (`simple-english`, `writing-beats`, `writing-shape`)
- **Choix :**
  - `simple-english` : Règle stricte de l'acteur nommé (*« Le Notification Service publie... »* et non *« La notification est envoyée »*), suppression des métaphores lyriques (*« palpitant »*).
  - `writing-beats` : Les diapositives de citation plein écran (slides 03, 07, 18, 21, 26) servent de ruptures visuelles pour ramener l'attention sur l'orateur.
  - `writing-shape` : Transition accélérée sur l'Acte 1 (slides 08-10 traversées en 1 minute max pour être sur l'ADR à la 5ᵉ minute).
- **Alternative rejetée :** Style oratoire improvisé sur slides descriptives. *Raison du rejet :* amène l'orateur à lire ses diapositives au lieu d'incarner une démonstration.

### 3. Protocole de Live-Coding "Levé de tête & Respiration"
- **Choix :** Lors du passage sur la slide 17, l'orateur marque un arrêt de 4 secondes avant de parler, regarde la salle, puis commente exclusivement les lignes de diff vertes.
- **Alternative rejetée :** Balayer l'écran de haut en bas ou naviguer dans l'arborescence de fichiers en direct. *Raison du rejet :* génère un stress cognitif élevé pour le fond de salle.

## Risks / Trade-offs

- **[Risk]** L'auditoire pose une question sur un choix technique (ex: *« Pourquoi RabbitMQ plutôt que Kafka ? »*) pendant la session.  
  → **Mitigation :** Cadrage initial répété : *« C'est une excellente question pour le Q&A final ou la pause café. Ici, nous démontrons comment modéliser ce choix acté, quel qu'il soit. »*

- **[Risk]** Une iframe LikeC4 tarde à charger sur un réseau Wi-Fi de conférence saturé.  
  → **Mitigation :** Tous les assets sont compilés en local dans `presentation/public/assets/` et accessibles sans connexion Internet.
