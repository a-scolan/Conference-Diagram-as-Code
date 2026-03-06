## CFP : Ne dessinez plus vos architectures : codez-les 

### Abstract
Nous connaissons tous ce scénario : une architecture née sur un tableau blanc, figée dans un schéma statique puis lentement oubliée. Le code continue d'évoluer, mais la carte ne correspond plus au territoire. Ce fossé crée une dette de documentation que nous finissons par accepter comme une fatalité.

Pourtant, le **Diagram-as-Code** change la donne. En traitant les diagrammes comme du code source, nous gagnons la puissance du versionning (Git), l'analyse des changements (Diffs) et l'automatisation (CI/CD). Mieux encore, l'augmentation des outil de code par l'IA nous permet désormais de générer et maintenir ces modèles très aisément.

Dans cette session de **Live Coding**, nous dépasserons la théorie. Nous partirons d'un besoin métier brut (un ADR en Markdown) pour construire, itération après itération, une **cartographie vivante** avec **LikeC4**.
Nous verrons comment réconcilier la **vision** (le _Pourquoi_) et **l'implémentation** (le _Comment_) dans un modèle unique, navigable et interactif, intégré au cycle de vie du logiciel.

Fini les gribouillis obsolètes : compilons la documentation.

### Références 
## Plan détaillé de la session (45 min)

**1. Le constat : La faillite du schéma statique (5 min)**
-   Pourquoi nos diagrammes meurent-ils ? (La complexité, l'ambiguité, la friction de la mise à jour).
-   Le changement de paradigme : Séparer le **Modèle** (la vérité structurelle unique) de la **Vue** (projection contextuelle).
	-   La méthode : C4 et le découpage en niveaux de vue (Context, Containers, Components, Code). 
-   L'outil : LikeC4, un DSL unifié pour générer toutes les vues à partir d'une source de vérité unique.

**2. Live Demo Partie 1 : De l'ADR au Modèle (10 min)**
-   *Scénario :* Point de départ avec un "Architecture Decision Record" textuel décrivant une nouvelle feature. Approfondissement des premiers niveaux de C4.
-   *Action :* Production de code LikeC4 assistée par IA, pour extraire les entités et relations des ADR et modéliser superficiellement le système cible.
-   *Résultat :* Génération immédiate d'une **Vue de Contexte** (C4 Level 1) pour valider le périmètre fonctionnel avec le métier.

**3. Live Demo Partie 2 : Le niveau Conteneurs (C2) et les comportements (15 min)**
-   *Scénario :* On "zoome" à l'intérieur du système pour raffiner les choix techniques (**Niveau C2 - Containers**).
-   *Action :* Raffinement du modèle pour détailler les briques logicielles (API, SPA, BDD, Bus) et lever les ambiguïtés structurelles.
-   *Technique :* Utilisation des propriétés et prédicats pour générer deux perspectives complémentaires :
	-   **Vue Statique :** La cartographie des services et leurs interactions (qui parle à qui).
	-   **Vue séquence :** Le scénario d'exécution d'une requête traversant ces conteneurs (Activités).
-   *Résultat :* Navigation interactive drill-down (du système global vers le détail des conteneurs) dans le diagramme interactif

**4. Live Demo Partie 3 : La Collaboration (10 min)**
-   *Le Workflow :* Simulation d'une évolution d'architecture via une **Pull Request**.
-   *L'Architecture Diff :* Démonstration de l'outil de revue visuelle (ce lien est rouge = supprimé, ce lien est vert = ajouté). C'est la preuve par l'image de l'intérêt du "As Code" pour la validation humaine.
-   *(Bonus/Off)* : Aperçu du pipeline CI/CD complet qui déploie la documentation statique.

**5. Conclusion et Q&A (5 min)**
-   Synthèse : Le diagramme n'est plus un artefact mort, mais un produit vivant.

## Quelques références 
- https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp : article publié pour l'advent of code. Le JUG Nantes m'a demandé un talk suite à cet article par ailleurs
- Repo de démo (architecture monilithique et refactor microservices), produit avec copilot : https://github.com/a-scolan/c4-hands-on-demo
- Github Page de la démo : https://a-scolan.github.io/c4-hands-on-demo/#/
- Un template de projet LikeC4 : https://github.com/a-scolan/c4-template
- Github page lié au repo démo : https://a-scolan.github.io/c4-hands-on-demo/#/projects/

