# CFP — Ne dessinez plus vos architectures : codez-les !

> Proposition de résumé et de plan pour soumission.

## Abstract

Une architecture naît souvent sur un tableau blanc, finit exportée en image, puis vieillit en silence. Pendant que le code évolue, la documentation se fige — et les équipes apprennent à vivre avec cet écart.

Cette session propose une autre approche : traiter l’architecture comme un artefact de développement à part entière. 
À partir d’un besoin métier formalisé dans un **ADR**, nous construirons en direct **une modélisation C4** avec **LikeC4**, puis nous le ferons évoluer comme du code : **vue de contexte**, zoom sur les **conteneurs**, **scénario dynamique**, revue en Pull Request, et portail navigable pour plusieurs publics.

L’objectif sera de montrer comment rendre des choix d’architecture explicites, versionnés, relus et partageables avec le même sérieux que le reste du logiciel. 
Les assistants IA peuvent accélérer l’amorçage du modèle.
La vraie valeur vient du workflow collectif : diff, review, validation et publication.

Une session concrète pour voir comment passer d’une documentation figée à une architecture vivante.

## Plan détaillé de la session (45 min)

**1. Le constat : la faillite du schéma statique (5 min)**

- Pourquoi nos diagrammes meurent : complexité, ambiguïté, friction de mise à jour.
- Changer de paradigme : séparer **Modèle** et **Vues**.
- La méthode : **C4** pour structurer les niveaux de lecture.
- L’outil : **LikeC4**, pour générer plusieurs vues depuis une source unique.

**2. Live Demo Partie 1 : de l’ADR au modèle (10 min)**

- **Scénario :** départ depuis un ADR décrivant un besoin métier.
- **Action :** construire un premier modèle LikeC4 à partir du texte.
- **Approche :** montrer comment l’IA peut aider à amorcer, sans remplacer la validation humaine.
- **Résultat :** générer une **vue de contexte (C1)** pour cadrer le périmètre.

**3. Live Demo Partie 2 : le niveau Conteneurs (C2) et les comportements (15 min)**

- **Scénario :** zoom dans le système pour détailler responsabilités et choix techniques.
- **Action :** enrichir le modèle avec les briques clés : frontends, API, base, bus, notifications.
- **Technique :** générer deux vues complémentaires :
  - **Vue statique :** qui parle à qui.
  - **Vue dynamique :** comment un cas d’usage traverse le système.
- **Résultat :** obtenir une lecture à la fois structurelle et comportementale du système.

**4. Live Demo Partie 3 : la collaboration (10 min)**

- **Workflow :** faire évoluer l’architecture dans un repo via **Pull Request**.
- **Review :** rendre visibles les changements d’architecture dans la discussion d’équipe.
- **Organisation :** distinguer specs partagées, modèle métier et vues générées.
- **Résultat :** montrer qu’un diagramme peut devenir un **portail vivant**, pas une image figée.
- **Bonus / off :** aperçu CI/CD, validation, publication, aides IA.

**5. Conclusion et Q&A (5 min)**

- Le diagramme n’est plus un livrable mort.
- Il devient un **artefact versionné, relu et navigable**.
- Ouverture : adoption progressive, industrialisation, IA en appui.

## Quelques références

- [Diagram as Code en 2025 : Le repas de famille des outils](https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp) — article publié sur dev.to.
- [c4-hands-on-demo](https://github.com/a-scolan/c4-hands-on-demo) — repo de démo.
- [GitHub Pages de la démo](https://a-scolan.github.io/c4-hands-on-demo/#/)
- [Template LikeC4](https://github.com/a-scolan/c4-template)
- [Vue publiée du repo de démo](https://a-scolan.github.io/c4-hands-on-demo/#/projects/)

