## Le 'Diagram as Code' : pourquoi et comment en 2025 ?

En tant qu'architectes, nous sommes confrontés à un défi récurrent : présenter un système de manière claire et maintenable sans y consacrer un temps infini.

Notre joli gribouillis finit généralement sur une porte de frigo, admiré à quelques cérémonies matinales de standup meeting (au mieux), puis oublié dans une boite mail. 
Rarement tenu à jour, figé dans le temps tel une peinture rupestre de nos architectures primitives, parfois redécouvert au gré des fouilles de futurs archéologues.

> Votre superbe diagramme d'architecture a un défaut majeur : à la seconde où vous l'exportez en PNG, il est déjà en voie d'obsolescence.

En 2025 j'ai expérimenté quelques solutions de diagramme *as code*, dans l'objectif de trouver le meilleur ensemble de qualités pour mes missions d'architecture. Je vous ferai ici une synthèse de mes expérimentations.
Chaque outil proposant un compromis différent, et chaque situation ne se prêtant pas à tous les compromis, vos conclusions pourront bien sûr diverger.

Mon ambition est de vous démontrer que ce passage au code n'est pas qu'une mode technique ou une régression vers l'artisanat, mais une évolution nécessaire vers plus de rigueur et d'expressivité. L'écosystème a mûri : les outils actuels nous permettent enfin de combler le fossé entre la théorie du tableau blanc et la réalité du terrain, pour peu qu'on apprenne à leur parler.
Et j'espère vous convaincre que le code est désormais le vecteur privilégié de la schématisation des architectures, tout comme le cloud a enfoncé la porte de l'*Infrastructure as Code*.

### Un objectif : partager, ou comment la méthode amplifie nos capacités d'expression
Revenons un peu en arrière : comment matérialiser la pensée et l'échanger ? Par **le langage** bien sûr.  
**Si le visuel montre, le langage démontre.** Il est le support premier de la pensée structurée. Ainsi pourquoi ne pas commencer par le langage au lieu de se lancer dans une représentation artistique ? 

Sommes-nous condamnés à le réduire à de simples carrés et des flèches, là où **les mots** offrent une sémantique infiniment redéfinissable ?
En interprétant le code, la machine nous impose une syntaxe explicite, dissipant les flous du langage naturel.

Dès lors, pourquoi ne pas la laisser calculer les représentations optimales par une **interprétation rigoureuse**, plutôt que de nous épuiser en tâtonnements manuels et approximations graphiques.
Ce que nous verrons, c'est que le code permet aujourd'hui de produire (plutôt) aisément des représentations calculées, adaptables, reproductibles et intégrables à nos processus de traitement automatiques.

#### Structurer la pensée
Ce premier point est aujourd'hui assez généralement accepté : nous documentons nos systèmes, partageons dans nos langues, pour structurer une connaissance reproductible chez le collègue, l'organisation à laquelle nous prenons part, mais aussi le futur soi.
Le diagramme permettra de traiter de systèmes trop vastes pour être appréhendés d'un seul bloc, en explicitant les relations entre les éléments. 
Par cet exercice, nous faisons émerger des informations parfois implicites dans une expression explicite.

> Ce que l'on conçoit bien se modélise sans effort 😉

Le passage au diagramme constitue un test de cohérence : l'échec de la représentation visuelle trahit souvent une lacune dans l'analyse fonctionnelle, qu'il faudra combler ou non, selon nos objectifs (on en reparle plus bas).

![La structure des microservices Netflix en 2016 : on y comprend la forme générale du système](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o8o5zul4qa0j7uphx76q.png "La structure des microservices Netflix en 2016 : on y comprend la forme générale du système")

#### Standardiser la communication 
Une pensée structurée "s'imprime" d'autant plus facilement que sa forme est intuitive, proche de notre culture ou nos standards.
En utilisant des langages explicites, comme UML ou ArchiMate, on s'assure que "cette forme de carré avec cette couleur et ce symbole" veut dire la même chose pour tout le monde.
Mais ces deux standards peinent encore à s'imposer : bien qu'apportant des éléments de rigueur intéressants, leurs outils manquent d'utilisabilité et de progressivité.
Et c'est au moins un état de fait auquel tout le monde s'accordera : en 2025 nous ne partageons toujours pas de *lingua franca* pour schématiser au quotidien. Nous nous en remettons souvent au tableau blanc avec une sémantique improvisée. 
Cette improvisation génère une dette de communication : chaque nouvel arrivant doit réapprendre le dialecte de la tribu, et le diagramme est conçu comme  un artefact personnel, non reproductible.

Pour que la standardisation soit effective, elle nécessite adoption, et l'adoption est nécessairement progressive : généralement par le contact répété avec un outil suffisamment intuitif.
Certains langages sont restés abstraits et peu répandus car conçus comme des idéaux, sans soucis d'ergonomie intrinsèque pour en développer l'utilisabilité, et leurs outillages butent aujourd'hui sur l'héritage de cette complexité.

#### Gérer la complexité par la séparation des enjeux : l'abstraction
Les langages sont suffisamment complexes pour qu'on se permette d'économiser un peu de précieux cortex cérébral, en traitant avant tout les priorités et des objectifs. 
Nous éliminerons donc bien volontiers les détails inutiles pour nous concentrer sur les composants essentiels. 

Ici l'expérience de méthodologies sera utile. Et pour cela, citons le TOGAF, qui explicite certains concepts clés :
- **La Vue (View) :**  ce que l'on voit réellement (le diagramme spécifique d'un système donné).
- **Le Point de Vue (Viewpoint) :**  la "perspective" ou la grille de lecture. Il définit **pour qui** on dessine et **pourquoi**. 
Ceci permet par exemple de présenter les informations à des publics différents selon les enjeux.

> "Imaginez un bâtiment (le Modèle). Le plan électrique est une _Vue_ destinée à l'électricien (_Point de vue_), tandis que le plan de façade est une autre _Vue_ pour l'architecte des Bâtiments de France."

![Tout est dans le TOGAF (et ça rend fou)](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8b6rs8zq2uqfz0amh553.png "Tout est dans le TOGAF (et ça rend fou)")

Nous pouvons imaginer un unique modèle, avec séparation de ses objectifs (points de vue) et de ses représentations (vues). 
Et cela nécessite dès lors au moins trois langages : 
- Le langage pour **Modéliser** rigoureusement (e.g., langages spécifiques de modélisation).
- Le langage pour représenter les **Objectifs/Perspectives** (les Viewpoints TOGAF par exemple).
- Le langage **Visuel** d'interprétation (UML, C4, etc.)

Vous conviendrez que trois langages, c'est beaucoup à apprendre. Profitons un peu de nos machines pour nous faciliter le traitement.
Le "code" du Diagram as Code visera précisément à fusionner ou simplifier les langages 1 et 2 pour que la machine gère le dernier.

### La puissance cachée du Code : Intégration, Git et IA
Démystifions : le code n'est qu'un langage, dont la seule vertu est d'être [*formalisé*](https://fr.wikipedia.org/wiki/Langage_formel), c'est à dire que sa structure est régulière : simple, non contextuelle, sans ambigüité, pour en permettre le traitement procédural par nos petits amis les ordinateurs.

L'usage du code est donc avant tout de clarifier ce que nous attendons de la machine, et cela peut prendre des formes assez diverses. Certains d'entre vous auront développé en C#, Java ou encore Python…
Votre bagage de développement sera bien sûr un avantage d'aisance, mais pour produire des diagrammes nous limiterons un peu la richesse syntaxique et essaierons de maximiser l'expressivité sémantique, c'est-à-dire : *utiliser peu de mots pour exprimer beaucoup*.
L'objectif étant que nos machines sachent quoi nous montrer sans débats byzantins sur le sens des mots, en ayant peu d'effort d'explication à fournir.

C'est aussi là qu'un langage de code *intuitif* prendra toute son importance : des mots clairs pour des concepts que nous côtoyons déjà c'est quand même bien plus simple à prendre en main pour exprimer ce que l'on veut voir.

#### Intégration aux pratiques : Versionning et "Diffability"

Toute une industrie s'est construite autour du code et a abouti à des bonnes pratiques dont nous pouvons hériter. En utilisant du code, vous n'obtenez pas seulement une solution de dessin, mais tout un écosystème. L'avantage immédiat est la capacité à versionner avec **Git**, mais le véritable gain réside dans la **"diffability"** (la lisibilité des différences).

Contrairement à un fichier `.drawio` ou `.archimate` (souvent constitués de milliers de lignes de XML indigeste où le simple déplacement d'une boîte de trois pixels modifie 50 lignes de coordonnées), les langages de diagramme _as code_ sont sémantiques. 
Lors d'une revue de ce code, vous ne voyez pas seulement que le fichier a changé, vous lisez l'intention : une ligne rouge indique `- user -> database`, une ligne verte indique `+ user -> api -> database` soulignant ce qui a été modifié.
L'évolution de l'architecture devient **auditable** ligne par ligne, permettant une véritable revue de conception asynchrone entre membres de l'équipe, avant même que le diagramme ne soit généré.

![Un exemple de pull request sur Github.com](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w1j1invl79t0ng22n1d9.png "Un exemple de pull request sur Github.com")

#### Intégration aux traitements automatiques

Mais ce format textuel ouvre surtout la porte à l'industrialisation via l'**Intégration et le Déploiement Continus (CI/CD)**. Puisque vos diagrammes sont désormais des sources compilables, ils s'intègrent naturellement à vos pipelines de build (GitHub Actions, GitLab CI, etc.) au même titre que votre code applicatif. 

Concrètement, imaginez qu'à chaque nouvelle fonctionnalité dans le code, votre traitement d'intégration vérifie la syntaxe, régénère automatiquement les rendus des diagrammes, et publie la mise à jour sur votre portail de documentation. Sans aucune intervention humaine, ou du moins elle devient limitée.
C'est la garantie d'une **documentation vivante** (_Living Documentation_), enfin synchronisée avec la réalité du terrain, mettant un terme définitif aux schémas obsolètes copié-collés manuellement dans des documents Word oubliés.

#### Diagramme aidé par IA
*Et vous n'allez peut-être pas me croire mais récemment, ont émergé les…* **LLM et IA génératives** !😉 
Et leur spécialité, c'est *précisément* de générer du langage !
Je vous enjoins chaleureusement à tester leurs capacités. La qualité des ébauches générées est souvent bluffante ; il ne reste généralement qu'à les retoucher.
Exemple avec Mermaid : copiez votre classe Java ou votre description du système dans ChatGPT et demandez : _'Génère un diagramme de séquence Mermaid expliquant le flux de données de ce code'_. Copiez le résultat dans le [playground Mermaid](https://www.mermaidchart.com/play) : le résultat est immédiat.

### Comment comparer
On peut dégager quelques critères de cette introduction au principe du diagramme as code.

#### Critères d'Adoption et d'Usabilité (Prise en main)
Ces critères sont primordiaux pour l'**échange** et la **collaboration** au quotidien.

| Critère                       | Pourquoi est-ce important ?                                                                                                                                                                                                                                                                                                                   |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Courbe d'Apprentissage** | Facilité et rapidité pour une personne non familière avec l'outil à écrire un premier diagramme simple. Le DSL doit être **intuitif** et non verbeux.  (Mermaid, D2) favorise l'adoption rapide, même par le non-développeur.                                                                                                                 |
| **2. Facilité à se lancer**   | Rapidité à démarrer un nouveau diagramme sans devoir gérer une structure de modèle complexe au préalable, et des outils à installer parfois très techniques. Les outils orientés "scénario" ou "micro-diagramme" (Mermaid) sont excellents ici, contrairement aux outils orientés "modèle unique" avec une application serveur (Structurizr). |
| **3. Qualité du Rendu**       | Un diagramme plaisant et clair est plus vendeur, plus partagé et plus souvent mis à jour.                                                                                                                                                                                                                                                     |

#### Critères Techniques et Opérationnels (Intégration et Coût)
Ces critères sont essentiels pour la **documentation** et la **maintenabilité**.

| Critère                                    | Pourquoi est-ce important ?                                                                                                                                                                                                                                                                       |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **4. Coût et Licence**                     | Le coût d'utilisation de l'outil et de ses fonctionnalités (moteur de rendu, plugins, licences commerciales). Une solution _open source_ ou _gratuite_ favorise l'adoption à l'échelle de l'entreprise (PlantUML, Mermaid). Le coût de certaines fonctionnalités (e.g., Tala de D2) est un frein. |
| **5. Intégration dans l'Écosystème cible** | Disponibilité de plugins dans les outils quotidiens (VS Code, JetBrains, Confluence, GitHub/GitLab Markdown). Si l'équipe passe sa journée dans VS Code, un bon plugin PlantUML ou Mermaid est un must. Et une intégration aux produits IA/LLM, ça ne mangerait pas de pain !                     |

#### Critères Sémantiques (Rigueur et flexibilité)
Ces critères jugent de l'équilibre entre la rigueur (TOGAF, C4) et le pragmatisme.

| Critère                            | Pourquoi est-ce important ?                                                                                                                                                                                                                                                                    |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **6. Rigueur sémantique flexible** | Le niveau de formalisme absent ou imposé (note basse) ou supporté avec flexibilité (note haute). Il doit pouvoir être adapté au contexte pour ne pas nuire à la prise en main.                                                                                                                 |
| **7. Réutilisabilité**             | Capacité à générer des vues filtrées à partir d'un unique modèle de référence qui peut être composé du travail de plusieurs contributeurs. Essentiel pour reformuler le même modèle à des publics différents sans redessiner, et pour collaborer brique par brique vers un système plus grand. |

---
## Petit arbre généalogique 2025 : présentation de quelques membres émérites
Alors le diagramme et la modélisation, ce n'est pas nouveau et il existe déjà quantité d'outils, plus ou moins accessibles et intégrables à nos vies déjà bien chargées.

![Voici un petit arbre à la généalogie arbitraire pour faire un petit tour de l'existant.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8e29ltosp2c1xlmf72fu.png "Voici un petit arbre à la généalogie arbitraire pour faire un petit tour de l'existant.")

### 👵 Mamie Archimate
> "Archi is an open source modelling toolkit to create ArchiMate models and sketches. […] It is targeted toward all levels of Enterprise Architects and Modellers." [Archi – Open Source ArchiMate Modelling](https://www.archimatetool.com/)

| **Documentation Officielle**  | [Archi%20User%20Guide.pdf](https://www.archimatetool.com/downloads/archi/Archi%20User%20Guide.pdf)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Téléchargement de l'Outil** | https://www.archimatetool.com                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Fonctionnalité Clé**        | **Analyse d'Impact** : La capacité de tracer un lien de "Réalisation" depuis un serveur physique jusqu'à un objectif métier stratégique pour évaluer les risques                                                                                                                                                                                                                                                                                                                                                          |
| **Démonstration**             | [https://github.com/archimate-models/archisurance](https://github.com/archimate-models/archisurance) - Modèle complet de fusion d'entreprise<br><br>_Note : Archi est un client lourd (Desktop). Les modèles ne peuvent être visualisés en ligne._ D'autres outils permettent de modéliser à la façon de Archi, et sont consultables en ligne, comme ces exemples PlantUML : [Archimate-PlantUML \| PlantUML macros and other includes for Archimate Diagrams](https://plantuml-stdlib.github.io/Archimate-PlantUML/)<br> |
Mamie fait de la modélisation rigoureuse, trace au cordeau des architectures formelles et permet, à partir d'un modèle unique, de produire des vues sur le contenu selon les couches TOGAF. 
Attention, ça ne devient intéressant que si l'on maitrise ses concepts et qu'on y produise un modèle exhaustif… Et séparer le modèle de la présentation, on l'a dit, c'est souvent bien pratique (MVC tu connais). Difficile en tout cas de s'y mettre progressivement, et pour débuter je vous conseille d'utiliser une [antisèche](https://gbruneau.github.io/ArchiMate/).

![Exemple de diagramme Archimate réutilisant le modèle de données et proposant une vue en couche des différents points de vue](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9mowwldepdpcl34rpsnm.png "Exemple de diagramme Archimate réutilisant le modèle de données et proposant une vue en couche des différents points de vue")

*Ma conclusion :* si vous avez le temps de constituer un modèle bien à plat, c'est très puissant pour de l'architecture d'entreprise. Pour de l'architecture un peu moins abstraite, on aura du mal à trouver le temps de tenir ça à jour, surtout dans l'interface au clic…

### ✏️ Tata Draw.io/Diagram.net
>"security-first diagramming for teams. […] You choose where to store your data. We don't store your diagram data." — _[Diagrams.net Main page](https://www.diagrams.net/)_

| **Documentation Officielle** | https://www.drawio.com/doc/                                                                                                                                                                                       |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Éditeur en Ligne**         | [app.diagrams.net](https://app.diagrams.net/)                                                                                                                                                                     |
| **Fonctionnalité Clé**       | **Agnosticisme de Plateforme** : Sauvegarde directe en XML, PNG, SVG ou HTML sur votre disque local ou repo Git, sans cloud intermédiaire.                                                                        |
| **Démonstration**            | [Blog - Create a sequence diagram](https://www.drawio.com/blog/sequence-diagrams) - Exemples variés (Réseau, UML, BPMN) sinon : [Example draw.io diagrams and templates](https://www.drawio.com/example-diagrams) |

L'outil de diagramme intégrable un peu partout, disponible gratuitement sur le web, avec un export PNG qui intègre le xml qui a permis de le générer, et qui peut donc être réimporté. C'est assez canon pour balader son dessin. 
Son modèle de stockage est unique et constitue son "killer feature" pour les entreprises soucieuses de la confidentialité des données : l'outil adopte une approche "Bring Your Own Storage" (BYOS). Draw.io ne stocke pas vos diagrammes sur ses propres serveurs. Il agit comme une couche d'édition par-dessus vos fournisseurs de stockage existants : Google Drive, GitHub, OneDrive, Dropbox, ou simplement le système de fichiers local.
Elle dispose aussi d'une base d'icônes et de symboles gigantesques, ce qui n'est d'ailleurs pas toujours facile à naviguer.

Attention cependant, c'est tout au clic (ou presque) et il va falloir tracer des boites et des flèches en pagaille, puis tout réagencer.

![Exemple de modélisation Draw.Io / Diagrams.net](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m0ox3jxufpkfswzem33n.png "Exemple de modélisation Draw.Io / Diagrams.net")

*Ma conclusion :* Pour les artistes qui ne veulent aucune limite, et ne rien risquer de leurs données : ça fait tout. Mais il va falloir bricoler… 

### 🖱️ Mama yEd
>"yEd is a powerful desktop application that can be used to quickly and effectively generate high-quality diagrams. […] Its automatic layout algorithms arrange large data sets with just the press of a button." — _[yWorks Official Doc](https://www.yworks.com/products/yed)_

| **Documentation Officielle** | https://www.yworks.com/products/yed                                                                                                             |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Éditeur en Ligne**         | [yEd Live](https://www.yworks.com/yed-live/) (Version d'essai navigateur)                                                                       |
| **Téléchargement Desktop**   | [https://www.yworks.com/downloads#yEd](https://www.yworks.com/downloads#yEd) (Java Swing - version gratuite très limitée comparée à yEd Live !) |
| **Fonctionnalité Clé**       | **Disposition automatique** : Transformer un chaos de 1000 nœuds en une structure hiérarchique lisible en un clic. Import direct depuis Excel.  |
| **Démonstration**            | [https://www.yworks.com/pages/interactive-showcase-of-graph-layouts](https://www.yworks.com/pages/interactive-showcase-of-graph-layouts)        |

Comme sa sœur Draw.io, il va falloir bricoler laborieusement : placer des petites boites et les contourner avec des flèches en clicodrome. 
Ce dernier a au moins la présence d'esprit de structurer le dessin en hiérarchie (un graphe de noeuds xml), et de permettre (parfois) une disposition automatique avec son moteur d'arrangement. 
*Surtout si vous avez acheté une licence, coûteuse*.  

![Exemple d'utilisation de yEd Desktop (version gratuite): ce n'est plus mis à jour et ça commence à se ressentir. Tout se fait bien sûr avec votre pointeur.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kwpazvr3382t4hsltn8z.png "Exemple d'utilisation de yEd Desktop (version gratuite): ce n'est plus mis à jour et ça commence à se ressentir. Tout se fait bien sûr avec votre pointeur.")

*Ma conclusion :* Si vous aimez cliquer, et avez le portefeuille bien rempli, ça peut être un bon outil mais peu confortable pour travailler avec efficience.

### 📜 L'ainé PlantUML
>"PlantUML is an open-source tool allowing users to create diagrams from a plain text language. […] It can be used within many other tools." — _[PlantUML.com](https://plantuml.com/)_

| **Documentation Officielle**  | [PlantUML.com](https://plantuml.com/)                                                                               |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Téléchargement de l'Outil** | [https://plantuml.com/download](https://plantuml.com/download) ou Image Docker                                      |
| **Fonctionnalité Clé**        | **Standard Library & Macros** : Support étendu pour C4 Model et icônes Cloud (AWS/Azure) via inclusions `!include`. |
| **Démonstration**             | [https://www.planttext.com/](https://www.planttext.com/)                                                            |

C'est le top et le pionnier de cette génération, si vous aimez les DSL exotiques et verbeux. Il fait le pont entre la génération parentale et la fratrie "as code" de la famille. Les cas d'usages intégrés sont extrêmement divers, l'outil est flexible à l'envie et permet de tout customiser jusqu'aux options de disposition du Graphviz sous-jacent. 

Ses capacités sont très développées et gros point positif, il permet d'intégrer du code distant en le récupérant sur simple déclaration d'une URL, ce qui permet de réutiliser du PlantUML développé et diffusé par d'autres utilisateurs. 
Pour les téméraires, il est possible de se créer des définitions prédéfinies pour normaliser les diagrammes selon vos pratiques, et de les généraliser assez simplement.
Par contre vous allez répéter des incantations toute la journée, et le résultat est souvent bien austère et peu vendeur. Je ne peux que vous conseiller de chercher des [packs de styles](https://github.com/isaaceindhoven/plantuml-styler) pour le rendre plus appétissant.

![Exemple de PlantUML: c'est quand même très technique, et le résultat est un peu décevant visuellement même si impressionnant de stabilité](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g0cp2vti8sczqbmzznu2.png "Exemple de PlantUML: c'est quand même très technique, et le résultat est un peu décevant visuellement même si impressionnant de stabilité")

*Ma conclusion :* Cet outil est un excellent précurseur, mais il ne s'est pas débarrassé de tous les défauts du diagramme "dessiné" et cumule ceux du as-code avec un langage construit par accumulation de concepts.

### 🧜‍♀️ Cousine Mermaid
> "JavaScript based diagramming and charting tool that renders Markdown-inspired text definitions to create and modify diagrams dynamically." — _[Mermaid.js.org Intro](https://mermaid.js.org/intro/)_

| **Documentation Officielle**  | https://mermaid.js.org/intro/syntax-reference.html                                                                         |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Téléchargement de l'Outil** | [NPM / GitHub](https://github.com/mermaid-js/mermaid) (Mais souvent intégré nativement : GitHub, Notion, Obsidian)         |
| **Fonctionnalité Clé**        | **Rendu Natif** : Intégration transparente dans les fichiers Markdown (README.md) des plateformes de code (GitHub/GitLab). |
| **Démonstration**             | [Mermaid Live Editor](https://mermaid.live/)                                                                               |

C'est intégré dans pas mal de lecteurs Markdown, c'est plutôt joli, mais contrairement à la génération dessin, il va falloir se contenter des cas d'usages prédéfinis : à la façon de PlantUML finalement, dont la sirène s'est certainement bien inspirée !
Le rendu est très propre tant qu'on ne rentre pas dans des graphes imbriqués un peu plus complexes. 

![Exemple MermaidURL utilisé pour cet article : brouillon via Gemini, affinage par moi-même et décoration par le LLM pour la bannière de ce chapitre.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kaofdv73adyd2w38jqfz.png "Exemple MermaidURL utilisé pour cet article : brouillon via Gemini, affinage par moi-même et décoration par le LLM pour la bannière de ce chapitre.")

*Ma conclusion :* Parfait pour des petits diagrammes (la généalogie ci-dessus) avec des cas d'usages assez divers et particuliers (modélisation GIT!) , et de la génération par IA avec une syntaxe relativement accessible.

### 🌊 Le cadet D2
>"D2 is a domain-specific language (DSL) that turns text to diagrams. […] D2 is designed to be modern, hackable, and easy to read." — _[D2Lang.com Intro](https://d2lang.com/tour/intro/)_

| **Documentation Officielle**  | https://d2lang.com/tour/intro/                                                                                                |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Téléchargement de l'Outil** | [Install Guide (CLI)](https://d2lang.com/tour/install)                                                                        |
| **Fonctionnalité Clé**        | **Moteur TALA & SQL** : Moteur de disposition propriétaire optimisé pour l'esthétique et conversion automatique SQL vers ERD. |
| **Démonstration**             | [https://play.d2lang.com/](https://play.d2lang.com/)                                                                          |

Celui-là c'est un sous-marin. Peu discuté dans mon entourage (malgré des étoiles ⭐ Github), il a le mérite d'être très abouti visuellement, et de fournir une syntaxe très simple et raffinée.

Avec son langage, il permet de définir des vues complexes composées selon trois modes : [layers](https://d2lang.com/tour/layers/) (couches), [scénarios](https://d2lang.com/tour/scenarios/) (variantes d'un même diagramme), et steps ([déroulé](https://d2lang.com/tour/steps/)) mais dont l'export est assez limité (diapositives de svg ou pages de pdf…).
Il propose aussi de sympathiques [sélecteurs globs](https://d2lang.com/tour/globs/)qui permettent d'ajouter des relations, des styles, des attributs sur le modèle défini, plusieurs éléments à la fois. 
Enfin, il permet de composer du code avec des [imports](https://d2lang.com/tour/nested-composition/) (syntaxe de chemin relatif vers un fichier par son nom) et des [operateurs](https://d2lang.com/tour/vars/#spread-substitutions), ce qui peut s'avérer assez puissant pour [composer à partir de diagrammes existants](https://d2lang.com/tour/version-visualization/).

Il s'avère un peu moins bon pour modéliser à l'échelle d'équipes en collaboration, où l'on voudra des espaces de travail dans lesquels faire respecter des conventions communes, réemployer du code commun, pour obtenir une capacité à généraliser la représentation et cartographier précisément des systèmes de manière uniforme.

Son gros point fort (mais payant 🥲) c'est son [moteur de disposition Tala](https://terrastruct.com/tala/) : la structuration automatique des diagrammes est extrêmement puissante et démêle (vraiment) au maximum vos plats de spaghettis, tout en fusionnant les flèches et en alignant correctement sans déformations.  Tout ça est développé pour l'IDE de diagrammes D2 Studio de Terrastruct, et distribué principalement en SaaS (onPrem possible) mais sous license.
Il permet aussi du contrôle sur la direction de chaque sous graphe, résolvant une des limites de Graphviz (et donc PlantUML). 
C'est canon, mais ça coûte un peu cher, ce qui est généralement prohibitif pour l'adhésion par une équipe.

![Exemple de diagramme D2 produit avec Tala : le routage des flèches et le positionnement automatiques sont les meilleurs que j'aie vu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uk5dbv16rlc3dabsxcft.png "Exemple de diagramme D2 produit avec Tala : le routage des flèches et le positionnement automatiques sont les meilleurs que j'aie vu")

Un exemple plus orienté code : 
![Exemple de code D2 avec son rendu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pe5hhykvxm68ubc22ugf.png "Exemple de code D2 avec son rendu")

*Ma conclusion* : D2 est l'un des outils les plus puissants, de par ses sélecteurs très flexibles et son rendu extrêmement propre. Il pèche un peu lorsque l'on passe en mode "projet" et que l'on tente de normaliser un peu nos divers diagrammes dans une base de diagrammes commune. À surveiller de près, mais son modèle de financement n'est pas idéal pour l'adoption.

### 📐 La benjamine Structurizr
>"Allows you to create a software architecture model as code, and then visualize it using the C4 model. […] It's a way to create diagrams that are accurate and always up-to-date." — _[Structurizr.com](https://structurizr.com/)_

| **Documentation Officielle**  | https://docs.structurizr.com                                                                                                       |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Téléchargement de l'Outil** | [Structurizr Lite \| Structurizr](https://docs.structurizr.com/lite)                                                               |
| **Fonctionnalité Clé**        | **Séparation Modèle-Vue** : Définition d'un modèle unique (C4) permettant de générer automatiquement de multiples vues cohérentes. |
| **Démonstration**             | [https://structurizr.com/dsl](https://structurizr.com/dsl)                                                                         |

Celle-là, elle a de la suite dans les idées et elle monte tranquillement. 
L'outil reprend strictement les concepts de l'architecture C4 (c'est développé par Simon Brown lui-même). On impose une séparation modèle/vue (mais pas contrôlable, c'est l'outil qui a ses vues type C4 fixées) et on sort une belle appli pour présenter notre système. 

C'est joli, mais un peu restrictif. L'approche C4 est intéressante mais impose une sémantique essentialiste comme le fait ArchiMate, ce qui peut limiter les usages pratiques : il y a un gros travail intellectuel d'apprentissage et d'abstraction pour créer son modèle de données pour cet outil.
Pour définir des architectures et des systèmes de manière claire et simple, c'est excellent, mais difficile à intégrer (le résultat est dans une app entière) même s'il existe un générateur de site statique un peu primitif. 

![Exemple de diagramme produit par Structurizr](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hxgyja42ml9qix2s7ilf.png "Exemple de diagramme produit par Structurizr")

*Ma conclusion:* Gros potentiel, qui mérite encore un peu de maturation. Pas adapté aux pratiques d'architecture "maison", c'est un outil relativement rigoureux et qui propose de faire de l'*architecture as code* en intégrant aussi les *Architecture Decision Records* (ADR) par exemple.

### 👶 Le nourrisson prodige : Like C4

> "Architecture-as-code tool. […] Look at your architecture as a single model and generate different views from it.  _[LikeC4.dev Docs](https://likec4.dev/docs/)_ 
> Inspired by [C4 Model](https://c4model.com/) and [Structurizr DSL](https://github.com/structurizr/dsl), but provides some flexibility. You customize or define your own notation, element types, and any number of nested levels in architecture model. [GitHub - likec4/likec4](https://github.com/likec4/likec4)

| **Documentation Officielle**  | [https://likec4.dev/docs/](https://likec4.dev/docs/)                                                                                                                                                                    |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Téléchargement de l'Outil** | • **CLI :** `npm install -g likec4`<br>• **IDE :** Extension VS Code (LikeC4), et un tas d'autres IDE                                                                                                                   |
| **Fonctionnalité Clé**        | **Prédicats de Vue Dynamiques** : Génération automatique de diagrammes interactifs à partir d'un modèle unique ("Single Source of Truth"), permettant de filtrer ou d'inclure des composants via des requêtes logiques. |
| **Démonstration**             | [Site de démo](https://template.likec4.dev/view/index) et example : https://likec4.dev/showcases/bigbank/                                                                                 |

Ce qui distingue réellement le petit dernier, c'est son pragmatisme. Contrairement à Structurizr qui impose le carcan strict du C4, LikeC4 offre une typologie flexible. Mais sa vraie force réside dans la **génération de prédicats**.
Au lieu de dessiner manuellement chaque vue, vous dites à l'outil : _"Affiche-moi le service 'Paiement' et tout ce qui interagit directement avec lui à deux niveaux de profondeur"_. L'outil calcule alors la vue optimale et les liens implicites.
Des métadonnées peuvent aussi être insérées un peu partout pour documenter les éléments et permettent de ne rien perdre de votre architecture, même si vous ne souhaitez pas afficher ces données directement.

De plus, LikeC4 génère des composants React natifs. Votre diagramme n'est pas une image statique (PNG), mais un composant web interactif que vous pouvez embarquer directement dans votre documentation technique (Storybook, Docusaurus, ou site propre). C'est le pont tant attendu entre le code vivant et l'architecture documentée.
Et contrairement à une image statique, et tout comme Structurizr : LikeC4 permet de "cliquer pour entrer" dans une boîte (en langage C4, passer du Context au Container, puis au Component). C'est le "Google Maps" de l'architecture, impossible à faire avec PlantUML ou Draw.io qui produisent des export statiques.

{% embed https://vimeo.com/1147296526?share=copy&fl=sv&fe=ci %}

**Dernier atout : MCP**
Avec le **Model Context Protocol (MCP)**, LikeC4 ne parle plus seulement aux humains, [mais aussi aux machines](https://likec4.dev/tooling/mcp/). Cette fonctionnalité transforme vos diagrammes en une base de connaissance que vos assistants IA (comme Claude ou votre IDE) peuvent **interroger**. Votre compagnon IA peut interagir avec le modèle, vous accompagner et comprend désormais la structure réelle et les relations de votre système pour vous assister avec précision.

**Attention toutefois aux limites de la jeunesse et du paradigme.** 
En tant que "nouvel arrivant" de la bande, LikeC4 souffre encore d'un écosystème plus modeste comparé aux standards de facto comme PlantUML. Si l'outil est open-source, parier sur un DSL (Domain Specific Language) jeune comporte toujours un risque de **pérennité** : si le maintien de l'outil s'arrête, votre base de connaissance architecturale devient orpheline, là où un fichier Mermaid est rendu nativement par GitHub ou GitLab sans outil tiers.

De plus, son approche purement "Code-First" érige une **barrière à l'entrée** non négligeable. Contrairement à un outil hybride, il exclut de facto les profils moins techniques (Product Owners, Business Analysts) de la contribution directe. Ils ne pourront pas "déplacer une boîte" pour corriger une incompréhension sans passer par un IDE et un commit Git. Enfin, sa grande flexibilité est une arme à double tranchant : là où Structurizr impose la rigueur du C4, LikeC4 vous laisse libre. Sans une discipline d'équipe sur le typage et le nommage, votre modèle "vivant" risque de devenir un "plat de spaghettis syntaxique", reproduisant dans la documentation la dette technique de votre code.

*Ma conclusion :*
Avec ses premiers commits en mars 2023, c'est du tout récent. Mais avec un rythme effréné : 163 releases, chacune apportant des petites nouveautés réjouissantes.
Cet outil m'a convaincu de le soutenir, et pour cause, j'y retrouve les principales qualités que j'attends d'un outil de diagram as code :
- Un modèle unique pour une architecture, des vues customisables à loisir avec des sélecteurs
- La capacité à partager une specification des éléments, et partager des éléments de modèles avec des include (encore un peu sommaire mais ça fonctionne)
- Un potentiel explicatif énorme avec ses [vues dynamique "séquence"](https://likec4.dev/dsl/views/dynamic/#variants) que je vous invite à [tester interactivement](https://playground.likec4.dev/w/dynamic/):  c'est bluffant.

{% embed https://vimeo.com/1147297540?share=copy&fl=sv&fe=ci %}

## Comparons l'ensemble

Allez, petite photo de famille pour bien différencier tout ça. Et c'est plus facile à garder en souvenir !

L'évaluation devra être pondérée par votre contexte :
1. **Si l'objectif est la _collaboration_ rapide (tableaux blancs) :** Les critères de prise en main et esthétique prennent le dessus. **Mermaid** ou **D2** (sans Tala) sont d'excellents choix.
2. **Si l'objectif est la _documentation_ et la _maintenance_ :** Les critères opérationnels (technique et écosystème) sont les plus importants. **Structurizr** ou **Like C4** sont plus adaptés.
3. **Si l'objectif est la _standardisation_ à l'échelle de l'entreprise (Rigueur) :** Le critère de modèle et sémantique est essentiel. **ArchiMate** sera privilégié.

### Tableau comparatif

| **Outil**         | **Type**     | **Prise en Main** |  **Rigueur & Modèle**  | **Atout Majeur**                           | **Usage Recommandé**                         |
| :---------------- | :----------- | :---------------: | :--------------------: | :----------------------------------------- | :------------------------------------------- |
| **✏️ Draw.io**    | Dessin       |   🟢 Immédiate    |        🔴 Nulle        | Gratuité & Stockage (BYOS)                 | Schémas libres / Tableau blanc               |
| **🖱️ yEd**       | Dessin       |    🟠 Moyenne     | 🔴 Structure de graphe | Algorithmes de tri auto                    | Du schéma libre avec un peu d'automatisation |
| **👵 ArchiMate**  | Modélisation | 🔴 Très difficile |   🟠 Très normative    | Analyse d'impact & Normes                  | Architecture d'Entreprise                    |
| **📜 PlantUML**   | Code         |   🟠 Difficile    |     🟠 Scénarisée      | Écosystème immense                         | Ingénierie & Génération auto                 |
| **🧜‍♀️ Mermaid** | Code         |     🟢 Facile     |     🟠 Scénarisée      | Support natif (Git/Notion)                 | Documentation de proximité                   |
| **🌊 D2**         | Code         |   🟢 Intuitive    |        🟠 Libre        | Esthétique & Moteur Tala                   | Présentations & Slides                       |
| **📐Structurizr** | Modélisation |   🟠 Difficile    |      🟠 Normative      | Séparation Vue/Modèle                      | Cartographie pérenne (C4 pur)                |
| **👶 LikeC4**     | Code         |   🟢 Intuitive    |      🟢 Flexible       | Vues Dynamiques, prise en main progressive | **Architecture Agile & Vivante**             |

### Ma recommandation

Aucun outil n'est donc encore pleinement satisfaisant pour tous les usages. 
Je vous propose d'en utiliser plusieurs, de trouver ceux qui apportent un bon compromis d'approche en limitant la courbe  d'apprentissage à l'aide de LLM, et en ne nécessitant pas trop d'investissement en formation au préalable.
Pour moi, c'est vers ceux-ci que je me tournerais :
- Documenter les architectures en **LikeC4** car il permet de partager quelques pratiques standardisées pour collaborer à l'aide de ses fichiers de spécification du modèle et ses imports entre projets. Le résultat est navigable et interactif, pratique pour partager avec le reste des équipes techniques et projet. Le tout progressivement. Vous pouvez commencer petit puis normaliser au fur et à mesure.
- Les diagrammes plus opportunistes et brouillons : sur **mermaid** avec un LLM (*Gemini ou Github Copilot font du bon boulot*) et éventuellement sur **D2** pour les cas un peu plus complexes.

---
## Conclusion : Le retour du pragmatisme

Une petite matrice de conclusion (Merci Gemini pour cette dernière petite génération 😉 J'ai juste eu à ajuster les pondérations !)
![Matrice des différents outils, sur des axes liberté de dessin / structuration et manuel / traitement automatique](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ftwlr4nfmx9x2vxwfhv8.png "Matrice des différents outils, sur des axes liberté de dessin / structuration et manuel / traitement automatique")

Finalement, ne cherchons-nous pas simplement à démocratiser les concepts de TOGAF en les rendant enfin digestes ?

Le mouvement du _Diagram as Code_ en 2025 n'est *pas qu'une affaire d'outils ou de syntaxe*. C'est une tentative de réconcilier deux mondes qui s'ignoraient : les développeurs (qui vivent dans le code) et les architectes (qui vivent dans les concepts).

- L'outil parfait n'existe pas, mais la **méthode** parfaite commence par l'abandon du dessin manuel non-maintenable.
- Commencez petit : un fichier Mermaid dans votre repo git *décrivant effectivement le code* est infiniment plus explicatif qu'un diagramme ArchiMate complet mais périmé en 2 semaines.

Enfin un pari pour l'avenir ? Les outils tout-en-un vont s'effacer au profit des outils de code, accompagnés de LLM. 
Demain, cliquer sur une classe dans votre code ou un composant Spring générera la vue d'architecture LikeC4 correspondante en temps réel. 
En attendant, à vos claviers !