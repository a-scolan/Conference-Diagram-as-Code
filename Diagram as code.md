# CFP — Ne dessinez plus vos architectures : codez-les !

> Proposition de résumé et de plan pour soumission de conférence (format 45 min).

## Abstract

Une architecture naît souvent sur un tableau blanc, finit exportée en image, puis vieillit en silence. Pendant que le code évolue à chaque sprint, la cartographie se fige dans un wiki — et les équipes apprennent à vivre avec cet écart.

Cette session propose une rupture méthodique : traiter l’architecture comme un artefact de développement à part entière. 
À travers le cas concret **AleFest Coffee** (un stand de festival passant d’une commande au comptoir synchrone à un service mobile événementiel), nous partirons d’un besoin métier formalisé dans un **ADR**, construirons en direct un modèle **C4** avec **LikeC4**, puis nous le ferons évoluer comme du code : **vue de contexte (C1)**, zoom sur les **conteneurs (C2)**, **scénarios dynamiques**, revue visuelle en **Pull Request**, pipeline **CI/CD** et **portail vivant navigable**.

L’objectif : démontrer comment des choix d’architecture deviennent explicites, versionnés, relus et partageables avec le même niveau d’exigence que le code applicatif. 
Les assistants IA et serveurs MCP accélèrent l'écriture du modèle, mais la véritable valeur réside dans le workflow collectif d'ingénierie : diff, relecture transverse, automatisation et documentation vivante.

Une session concrète et outillée pour passer définitivement du dessin artisanal à l’architecture vivante.

## Plan détaillé de la session (45 min)

**1. Le constat : la faillite du schéma statique (5 min)**

- Le cycle de mort silencieuse des schémas exportés (PNG/Visio) et la dette documentaire.
- Changer de paradigme : séparer le **Modèle sémantique** (source unique de vérité) des **Vues projetées**.
- La méthode : **C4 Model** (l'analogie Google Maps : zoomer du contexte au conteneur sans redessiner la carte).
- L’outil : **LikeC4**, compilateur d'architecture typé et déclaratif.

**2. Partie 1 : Du besoin métier au modèle (10 min)**

- **Scénario :** départ depuis l'**ADR-001** (« Digitaliser le stand café » pour résorber la file d'attente au comptoir).
- **Action :** extraction d'un premier modèle LikeC4 depuis le texte.
- **Approche :** l'IA (Copilot) comme accélérateur d'amorçage, sous contrôle et validation humaine à 100 %.
- **Résultat :** génération de la **vue de contexte (C1)** sans positionnement manuel (zéro X/Y), puis modélisation des premières briques conteneurs (**C2 V1 synchrone** : tablettes, services, base, bus).

**3. Partie 2 : Évoluer & éprouver le système (10 min)**

- **Scénario :** évolution métier majeure (**ADR-002**) — permettre la commande depuis l'application mobile du festival avec notifications push.
- **Action :** live coding du diff d'architecture (intégration partenaire Système Festival, service de notification, asynchronisme RabbitMQ/WebSocket).
- **Technique :** génération de la vue comportementale (**séquence dynamique / dynamic view**) sur les composants réels du modèle.
- **Résultat :** validation précoce du parcours avec le Product Owner et démonstration de l'impact UX direct des choix d'architecture.

**4. Partie 3 : Collaboration et revue d'architecture (7 min)**

- **Organisation :** découpage modulaire du dépôt (spécifications partagées `shared/` vs modèles métier `coffee-v2/`).
- **Workflow :** cycle d'évolution en **Pull Request** avec bot de **diff visuel automatique**.
- **Revue collective :** grille de relecture d'architecture en équipe (ce qui entre, ce qui bouge, ce qui devient sensible).

**5. Partie 4 : Industrialisation & CI/CD (4 min)**

- **Pipeline de validation :** contrôles automatisés via le CLI LikeC4 (zéro lien orphelin, intégrité du graphe sémantique).
- **Intégration continue :** compilation automatique des assets autonomes et déploiement du cockpit dans le cycle de développement logiciel.

**6. Partie 5 : Bilan, cockpit vivant & passage à l'échelle (9 min)**

- **Le livrable :** démonstration du **portail vivant LikeC4** (application React navigable avec liens vers le code).
- **Éclairage outillage :** *Pourquoi pas juste du Mermaid ?* (description visuelle vs modèle de graphe typé) et atouts de LikeC4 (open source, licences permissives, souveraineté Git, serveurs MCP).
- **Passage à l'échelle :** stratégie *Strangler Fig* sur le legacy, cartographie des zones de déploiement (DMZ, App, Data) et dérivation automatique des matrices de flux réseau.
- **Takeaway :** feuille de route en 3 étapes (S'inspirer, Manipuler, Approfondir) et session de Q&A.

## Quelques références

- [Diagram as Code en 2025 : Le repas de famille des outils](https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp) — article comparatif publié sur dev.to / onepoint.
- [Support de présentation interactif](https://a-scolan.github.io/Conference-Diagram-as-Code/presentation-diagram-as-code.html) — slides de la conférence en ligne avec cockpit et notes.
- [c4-hands-on-demo](https://github.com/a-scolan/c4-hands-on-demo) — dépôt GitHub complet prêt à forker (cas AleFest Coffee V1 & V2, modèles, scripts).
- [Documentation officielle LikeC4](https://likec4.dev) — documentation, syntaxe du DSL et extension VS Code.
- [Template LikeC4](https://github.com/a-scolan/c4-template) — template de démarrage pour nouveaux projets.

