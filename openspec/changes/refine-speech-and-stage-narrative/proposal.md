## Why

Les retours d'expérience consignés dans `Retours de conf.md` ont mis en évidence des écueils majeurs lors des répétitions et précédentes présentations :
1. Une introduction parasitée par l'auto-présentation de l'orateur plutôt que par l'interpellation directe sur le problème vécu en équipe.
2. Un risque récurrent de dérive où l'auditoire bloque sur des débats de conception logicielle (ex. choix de RabbitMQ, microservices) au lieu de comprendre la méthode de modélisation as-code et son cycle de vie.
3. Une incompréhension potentielle de la méthode C4 par les profils non-développeurs (PO, agilistes) faute d'une analogie concrète immédiate et de l'introduction précoce de LikeC4.
4. Une surinterprétation du rôle de l'IA perçue à tort comme le cœur décisionnel de la conférence, alors qu'elle n'est qu'un accélérateur de saisie.
5. Une gestion de rythme trop précipitée pendant le live-coding et les moments clés de démonstration.

Ce changement formalise les exigences narratives, les garde-fous oraux et le protocole scénique pour garantir un discours percutant, inclusif et démonstratif sans "AI slop".

## What Changes

- **Recadrage d'intention fondateur (Règle Nicolas)** : Explicitation dès l'introduction que la session traite de la *modélisation et du maintien dans le temps de décisions déjà actées*, et non de la *conception de systèmes*.
- **Épuration de la posture orateur (Anti-« Je » & Attaque directe)** : Remplacement de l'auto-présentation longue par une accroche immédiate sur la douleur universelle du schéma mort dans un wiki.
- **Démystification de l'outillage & du C4 pour tous les profils (Conseil Yohann)** : Intronisation du C4 comme moyen de clarifier les niveaux d'abstraction (C1 pour le PO, C2 pour le dev) et citation précoce de LikeC4 dès l'Acte 0.
- **Recadrage du périmètre de l'IA (Conseil Nicolas)** : Positionnement strict de Copilot/LLM comme accélérateur d'amorçage de modèle à partir d'ADR textuels, avec validation 100 % humaine en PR.
- **Protocole de respiration et de conduite du Live Coding** : Règles strictes de tempo scénique (marquer 4 secondes de silence, lever la tête, pointer les lignes modifiées une à une).

## Capabilities

### New Capabilities
<!-- Aucune nouvelle capability requise -->

### Modified Capabilities
- `conference-narrative`: Évolution des scénarios des Actes 0, 1, 2, 3 et 4 pour intégrer la règle de neutralisation des débats de conception, le protocole scénique sans « je », l'introduction précoce de LikeC4 et la démythification du rôle de l'IA.

## Impact

- Spécification : Mise à jour de la spec de référence `openspec/specs/conference-narrative/spec.md`.
- Déroulé d'animation : Alignement de `deroule-conference-slides.md` comme runbook de régie fidèle au mot près.
- Support de présentation : Réglage du texte des diapositives d'accroche et de citation.
