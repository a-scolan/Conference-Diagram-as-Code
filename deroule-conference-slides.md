# Déroulé de la conférence — Version fidèle aux slides (35 diapositives)

Source : [presentation/src/slides/slides.json](presentation/src/slides/slides.json) compilé dans [presentation/public/presentation-diagram-as-code.html](presentation/public/presentation-diagram-as-code.html)

Ce document reflète la réalité exacte du deck HTML projeté lors de la session **« Ne dessinez plus vos architectures : codez-les ! »** (Atlantique Day 2026 — Alexis Scolan, architecte technique onepoint).

---

## Acte 0 : L'Accroche et le Changement de Paradigme (Slides 00 à 07)

> **Consignes orateur (Retours d'expérience) :**
> - **Posture :** Pas de « je » complaisant. Poser la voix, regarder la salle, sourire.
> - **Cadrage impératif (Règle d'or Nicolas) :** Préciser immédiatement qu'on ne vient pas débattre de *conception logicielle* (pourquoi tel microservice ou telle queue), mais de *modélisation* (comment faire vivre et partager des décisions déjà prises).
> - **Setup technique :** VS Code en thème clair (LIGHT) zoomé, navigateur en vrai plein écran (F11), chrono visible sur smartphone.

### Slide 00 — Titre
- **Fichier :** [presentation/src/slides/00-titre.html](presentation/src/slides/00-titre.html)
- **Contenu projeté :**
  - Titre : *Ne dessinez plus vos architectures : codez-les !*
  - Contexte : Conférence Architecture & Tech · Atlantique Day 2026
  - Orateur : Alexis Scolan
- **Substance & Preuve :** Pose la promesse centrale en rupture directe avec le dessin conventionnel.
- **Intention orale :** Cadrer le sujet sans détour : *« L'objectif de ces 45 minutes : réconcilier la cartographie de nos systèmes avec le quotidien des équipes de développement. »*
- **Beat narratif :** Accroche. Déclare la thèse : le schéma artisanal est une impasse.

### Slide 01 — Speaker
- **Fichier :** [presentation/src/slides/01-speaker.html](presentation/src/slides/01-speaker.html)
- **Contenu projeté :**
  - Alexis Scolan — Architecte technique onepoint
  - Parcours : intégration, SI complexes, alignement équipes tech & produit
  - Règle du jeu : démo réelle, code versionné, pas de théorie creuse
- **Substance & Preuve :** Légitimité de terrain sans étalage personnel.
- **Intention orale :** Moins de 30 secondes. Se positionner comme praticien : le sujet est né des frustrations rencontrées sur le terrain avec les équipes.
- **Beat narratif :** Ancrage de posture : praticien parlant à des praticiens.

### Slide 02 — Le problème réel
- **Fichier :** [presentation/src/slides/02-le-probleme-reel.html](presentation/src/slides/02-le-probleme-reel.html)
- **Contenu projeté :**
  - Deux colonnes en contraste :
    - *Point de situation :* « Qui a déjà fait un dessin pour expliquer un système ? », « Qui l'a vu devenir obsolète six mois plus tard ? », « Qui ose encore dire "ce PNG reflète l'état de notre système" ? »
    - *Le vrai coût caché :* Le PNG meurt en silence, le code évolue, la dette documentaire s'installe.
- **Substance & Preuve :** Diagnostic partagé du cycle d'abandon documentaire dans toutes les organisations.
- **Intention orale :** Interpeller sur l'impact réel. Lever de main dans la salle. Remplacer le terme technique « PNG » par « l'image exportée » si l'audience est mixte. Clarifier : *« Attention : on ne critique pas la façon dont le système est conçu, mais la manière dont sa trace documentaire s'évapore. »*
- **Beat narratif :** Tension. L'auditoire admet l'échec universel du schéma statique.

### Slide 03 — Le problème réel — message
- **Fichier :** [presentation/src/slides/03-le-probleme-reel-message.html](presentation/src/slides/03-le-probleme-reel-message.html)
- **Contenu projeté :**
  - Callout vert en pleine page : *« Le problème c'est de pouvoir faire vivre ces connaissances dans le temps. »*
- **Substance & Preuve :** Déplacement de l'enjeu. Le sujet n'est pas esthétique, il est temporel et collaboratif.
- **Intention orale :** Marquer un silence. Répéter la phrase avec force pour ancrer le pivot intellectuel.
- **Beat narratif :** Pivot. L'adversaire n'est pas le dessin en soi, c'est l'entropie dans la durée.

### Slide 04 — Le problème réel — dessin
- **Fichier :** [presentation/src/slides/04-le-probleme-reel-dessin.html](presentation/src/slides/04-le-probleme-reel-dessin.html)
- **Contenu projeté :**
  - Titre : *Pas la qualité du dessin.*
  - Visuel : Capture d'un diagramme Draw.io réel plein de boîtes et de flèches entremêlées (`assets/drawio.png`).
- **Substance & Preuve :** Preuve visuelle. Même avec un dessin propre et soigné, un fichier binaire ou un SVG plat n'a aucune sémantique exécutable.
- **Intention orale :** « Ce dessin est propre. Vous l'avez tous déjà fait. Mais demain, quand vous ajoutez une brique, vous devez redessiner 40 flèches à la main. »
- **Beat narratif :** Confrontation. Démonstration par l'absurde de la limite de l'outil graphique.

### Slide 05 — Changer de paradigme
- **Fichier :** [presentation/src/slides/05-changer-de-paradigme.html](presentation/src/slides/05-changer-de-paradigme.html)
- **Contenu projeté :**
  - 3 piliers :
    1. **Une unique source de vérité sémantique** (modèle déclaratif en code)
    2. **Des perspectives multiples** (vues projetées depuis un seul modèle)
    3. **Un vrai cycle de vie logiciel** (Git, PR, review, CI/CD)
- **Substance & Preuve :** Cadre théorique fondateur du Diagram as Code.
- **Intention orale :** Poser les trois règles d'or. Si l'architecture est du code, elle profite de 50 ans d'outillage logiciel.
- **Beat narratif :** Résolution conceptuelle. Pose la base des actes suivants.

### Slide 06 — C4 zoom
- **Fichier :** [presentation/src/slides/06-c4-zoom.html](presentation/src/slides/06-c4-zoom.html)
- **Contenu projeté :**
  - Texte explicatif : C1 (Contexte), C2 (Containers), C3 (Components), C4 (Code), Dynamique / Déploiement.
  - Schéma vectoriel SVG animé illustrant l'emboîtement hiérarchique et les systèmes voisins.
- **Substance & Preuve :** Définition opérationnelle de la norme C4 (Simon Brown) appliquée au modèle.
- **Intention orale :** 
  - *Pourquoi C4 ? (Conseil Yohann) :* Expliquer la fin des schémas « fourre-tout » où un microservice, un bouton d'écran et un cluster Kubernetes sont dessinés au même niveau. C4 apporte un standard de vocabulaire lisible par les développeurs comme par les agilistes et les PO.
  - Citer LikeC4 dès maintenant pour fixer le nom de l'outil dans l'esprit du public.
- **Beat narratif :** Ancrage terminologique (*grounding* de C1 et C2).

### Slide 07 — C4 zoom — image mentale
- **Fichier :** [presentation/src/slides/07-c4-zoom-image-mentale.html](presentation/src/slides/07-c4-zoom-image-mentale.html)
- **Contenu projeté :**
  - Callout bleu : *« C4, c'est comme Google Maps : un territoire unique, plusieurs représentations, plusieurs niveaux de zoom, en conservant la cohésion. »*
- **Substance & Preuve :** Analogie universelle qui clarifie immédiatement la non-redondance du modèle.
- **Intention orale :** Utiliser la métaphore : sur Maps, vous ne redessinez pas la France quand vous zoomez sur une rue de Nantes.
- **Beat narratif :** Image mentale définitive. Fin de l'Acte 0.

---

## Acte 1 : Du Besoin Métier au Modèle (Slides 08 à 14)

### Slide 08 — Partie 1 (Intertitre)
- **Fichier :** [presentation/src/slides/08-partie-1.html](presentation/src/slides/08-partie-1.html)
- **Contenu projeté :**
  - Numéro : 01
  - Titre : *Du besoin métier au modèle*
  - Sous-titre : AleFest Coffee · besoin métier → représentation du système
- **Substance & Preuve :** Transition vers l'étude de cas pratique.
- **Intention orale :** Poser le début de la démonstration concrète.
- **Beat narratif :** Lancement du cas concret.

### Slide 09 — Fil rouge
- **Fichier :** [presentation/src/slides/09-fil-rouge.html](presentation/src/slides/09-fil-rouge.html)
- **Contenu projeté :**
  - Carte AleFest Coffee : stand café en difficulté en plein festival.
  - Feuille de route en 5 étapes : du besoin brut à l'IA, des mécanismes limpides, du premier jet au système mature, de la vue statique au comportement, et du document volant au livrable intégré.
- **Substance & Preuve :** Contrat de lecture de la conférence.
- **Intention orale :** Expliciter la trajectoire : nous allons construire ensemble ce système et le voir vivre.
- **Beat narratif :** Plan de vol de la démonstration.

### Slide 10 — Cas d'étude
- **Fichier :** [presentation/src/slides/10-cas-d-etude.html](presentation/src/slides/10-cas-d-etude.html)
- **Contenu projeté :**
  - Titre : *AleFest Coffee : vendre vite, servir mieux*
  - Points : pics entre deux concerts, festivalier captif qui attend sur place.
  - Visuel : image d'illustration du stand (`assets/plan.webp`).
- **Substance & Preuve :** Tension métier concrète : perte de chiffre d'affaires et insatisfaction festivaliers.
- **Intention orale :** Mettre en scène la scène : 10 minutes d'entracte, 200 personnes qui veulent un café, la queue déborde.
- **Beat narratif :** Enjeu métier tangible.

### Slide 11 — ADR-001
- **Fichier :** [presentation/src/slides/11-adr-001.html](presentation/src/slides/11-adr-001.html)
- **Contenu projeté :**
  - Split 50/50 :
    - Volet gauche : texte Markdown de l'ADR-001 (`Context`, `Decision`, `Constraints`, `Consequences`).
    - Volet droit : Iframe interactive du prompt Copilot replay (`assets/replay_ADR.html`).
- **Substance & Preuve :** Démontre qu'on ne part pas d'un schéma vide, mais d'une décision textuelle structurée, transformable par outillage / IA.
- **Intention orale :** 
  - *Rôle de l'IA (Conseil Nicolas) :* Présenter l'IA comme un simple accélérateur de saisie pour amorcer le modèle à partir du texte, et non comme le cœur du talk. Le cœur, c'est la structure en code et sa vérifiabilité humaine.
  - Définir brièvement l'ADR pour les non-sachants.
- **Beat narratif :** Étape fondatrice : le texte brut devient le déclencheur du modèle.

### Slide 12 — C1 généré
- **Fichier :** [presentation/src/slides/12-c1-genere.html](presentation/src/slides/12-c1-genere.html)
- **Contenu projeté :**
  - Split 50/50 :
    - Code source DSL LikeC4 : `festivalier`, `barista`, `alefestCoffee`, relations `uses`.
    - Iframe compilée LikeC4 en direct : Vue C1 `c1_context` de `coffee-v1`.
- **Substance & Preuve :** Première preuve d'exécution : 10 lignes de DSL LikeC4 produisent un schéma de contexte interactif et navigable.
- **Intention orale :** « En 10 lignes de texte lisible par un non-dev, nous avons notre C1. Pas de boîte à déplacer au pixel près. »
- **Beat narratif :** Première victoire technique tangible.

### Slide 13 — Briques C2
- **Fichier :** [presentation/src/slides/13-briques-c2.html](presentation/src/slides/13-briques-c2.html)
- **Contenu projeté :**
  - Cartes conceptuelles :
    - *01 Frontends :* Counter App (comptoir), Barista Screen (file temps réel).
    - *02 Services :* Order Service (prise de commande), Preparation Service (orchestration), RabbitMQ (découplage).
- **Substance & Preuve :** Explicitation des sous-systèmes techniques de la V1 avant de projeter le diagramme C2.
- **Intention orale :** Préparer le zoom intérieur : on ouvre la boîte `alefestCoffee` pour nommer ses conteneurs.
- **Beat narratif :** Grounding des composants internes V1.

### Slide 14 — C2 généré (coffee-v1)
- **Fichier :** [presentation/src/slides/14-c1-genere.html](presentation/src/slides/14-c1-genere.html)
- **Contenu projeté :**
  - Split 50/50 :
    - Code DSL `extend alefestCoffee` avec conteneurs (`Container_Spa`, `Container_Api`, `Container_Queue`, `Container_Database`) et relations synchrones / asynchrones.
    - Iframe compilée LikeC4 : Vue C2 `c2_containers` de `coffee-v1`.
- **Substance & Preuve :** Démonstration de l'imbrication C1 → C2 sans redondance. Le C2 prolonge le C1 par extension sémantique.
- **Intention orale :** Montrer la puissance du mot-clé `extend` : la hiérarchie est conservée, les flux sont typés.
- **Beat narratif :** Clôture de l'architecture V1 stable.

---

## Acte 2 : Évoluer & Éprouver (Slides 15 à 21)

### Slide 15 — Partie 2 (Intertitre)
- **Fichier :** [presentation/src/slides/15-partie-2.html](presentation/src/slides/15-partie-2.html)
- **Contenu projeté :**
  - Numéro : 02
  - Titre : *Évoluer & éprouver*
  - Sous-titre : Faire évoluer l'architecture et l'éprouver avec des scénarios.
- **Substance & Preuve :** Transition vers l'évolution majeure du système (le passage à la commande mobile V2).
- **Intention orale :** Annoncer le saut qualitatif : comment le modèle absorbe un changement d'échelle métier.
- **Beat narratif :** Relance de la dynamique narrative.

### Slide 16 — V1 vs V2
- **Fichier :** [presentation/src/slides/16-v1-vs-v2.html](presentation/src/slides/16-v1-vs-v2.html)
- **Contenu projeté :**
  - Comparatif en deux colonnes :
    - *V1 Le comptoir :* Système local, festivalier captif, attente physique au stand.
    - *V2 Le café mobile :* Système intégré à l'app festival, Notification Service push, festivalier libéré qui retourne au concert.
- **Substance & Preuve :** Énonciation de l'impact architectural : passage d'un système fermé à une intégration externe événementielle.
- **Intention orale :** Insister sur la valeur métier : ce n'est pas un refactoring technique pour le plaisir, c'est une libération du festivalier.
- **Beat narratif :** Problématique de l'évolution architecturale.

### Slide 17 — Live coding (coffee-v2 diff)
- **Fichier :** [presentation/src/slides/17-live-coding.html](presentation/src/slides/17-live-coding.html)
- **Contenu projeté :**
  - Bouton interactif déclencheur `Live coding`.
  - Vue détaillée en split :
    - Code diff couleur : ajouts du système partenaire `festivalSystem`, de `notificationService`, et des flux AMQP/Firebase.
    - Iframe LikeC4 interactive de `coffee-v2` affichant la nouvelle architecture conteneurs.
- **Substance & Preuve :** Moment fort de démonstration : le passage V1 → V2 se lit comme un simple `git diff` de modèle.
- **Intention orale :** 
  - *Gestion du rythme en direct (Conseils Nicolas & Yohann) :* 
    - **Ralentir et faire souffler l'auditoire.** Ne pas se précipiter dans le code.
    - **Lever la tête et regarder la salle** avant de pointer chaque bloc.
    - Vérifier que le zoom du texte et du code est maximal (visible du fond de salle).
    - Accompagner pas à pas : « Regardez ces 6 lignes vertes : elles suffisent à matérialiser l'arrivée du système partenaire. »
- **Beat narratif :** Climax démonstratif de l'Acte 2. Le diff d'architecture en direct.

### Slide 18 — Cas d'étude — promesse
- **Fichier :** [presentation/src/slides/18-cas-d-etude-promesse.html](presentation/src/slides/18-cas-d-etude-promesse.html)
- **Contenu projeté :**
  - Callout bleu : *« Le diagramme doit raconter la promesse métier en plus de servir de référence. »*
- **Substance & Preuve :** Principe d'architecture vivante : la technique doit incarner le parcours utilisateur.
- **Intention orale :** Marquer un temps d'arrêt. Un diagramme de boîtes sans scénario ne prouve rien.
- **Beat narratif :** Ancrage conceptuel avant la vue dynamique.

### Slide 19 — Séquence mobile
- **Fichier :** [presentation/src/slides/19-sequence-mobile.html](presentation/src/slides/19-sequence-mobile.html)
- **Contenu projeté :**
  - Split deux tiers / un tiers :
    - Code source DSL `dynamic view order_mobile_flow` : étapes chronologiques (1. Commande, 2. Préparation barista, 3. Notification & retrait).
    - Iframe compilée LikeC4 Use Case / Dynamic view navigable.
- **Substance & Preuve :** LikeC4 sait générer des vues comportementales séquentielles directement sur le modèle statique, sans recréer un diagramme de séquence jetable.
- **Intention orale :** Dérouler les étapes 1, 2, 3 en direct. Montrer que les mêmes composants participent au scénario.
- **Beat narratif :** Preuve du dynamisme comportemental sur source unique.

### Slide 20 — Impact UX
- **Fichier :** [presentation/src/slides/20-impact-ux.html](presentation/src/slides/20-impact-ux.html)
- **Contenu projeté :**
  - Deux colonnes :
    - *Avant (V1) :* Déplacement pour payer, attente subie, barista stressé.
    - *Après (V2) :* Commande distante, concert écouté, retrait instantané au push.
- **Substance & Preuve :** Relie explicitement les flux RabbitMQ/Push à la satisfaction de l'utilisateur final.
- **Intention orale :** Conclure la partie 2 en valorisant le travail d'architecte : nous créons de la valeur pour l'humain.
- **Beat narratif :** Validation du bénéfice métier.

### Slide 21 — Portail vivant — bénéfice
- **Fichier :** [presentation/src/slides/21-portail-vivant-benefice.html](presentation/src/slides/21-portail-vivant-benefice.html)
- **Contenu projeté :**
  - Callout vert : *« Le même modèle sert à discuter avec le métier, la maîtrise d'œuvre, et les développeurs. »*
- **Substance & Preuve :** Fin du cloisonnement documentaire : une seule source pour tous les niveaux d'abstraction.
- **Intention orale :** Souligner le dialogue retrouvé entre PO, devs et architectes autour du même artefact.
- **Beat narratif :** Conclusion de l'Acte 2.

---

## Acte 3 : Collaboration, Revue & Diff Visuel (Slides 22 à 26)

### Slide 22 — Partie 3 (Intertitre)
- **Fichier :** [presentation/src/slides/22-partie-3.html](presentation/src/slides/22-partie-3.html)
- **Contenu projeté :**
  - Numéro : 03
  - Titre : *Collaborer*
  - Sous-titre : Quand le modèle évolue, la review devient visuelle.
- **Substance & Preuve :** Déplacement du sujet vers le travail d'équipe et la gouvernance.
- **Intention orale :** Lancer le thème : que se passe-t-il quand nous sommes 10 ou 50 à modifier l'architecture ?
- **Beat narratif :** Transition vers l'ingénierie collaborative.

### Slide 23 — Specs & arborescence
- **Fichier :** [presentation/src/slides/23-specs-amp-arborescence.html](presentation/src/slides/23-specs-amp-arborescence.html)
- **Contenu projeté :**
  - Panneau à onglets : `spec-containers.c4` (vocabulaire, tags, styles, icônes) vs `system-model.c4`.
  - Arborescence ASCII : `projects/shared/` (spécifications réutilisables) et `projects/coffee-v2/` (implémentation du domaine).
- **Substance & Preuve :** Révèle comment modulariser et factoriser un référentiel d'architecture comme une bibliothèque logicielle.
- **Intention orale :** Expliquer le dossier `shared` : on normalise les styles, les icônes et les conteneurs une fois pour toute l'entreprise.
- **Beat narratif :** Rigueur d'ingénierie et passage à l'échelle.

### Slide 24 — Questions de review
- **Fichier :** [presentation/src/slides/24-questions-de-review.html](presentation/src/slides/24-questions-de-review.html)
- **Contenu projeté :**
  - 3 cartes d'interrogation :
    - *01 Ce qui entre :* Quels nouveaux composants ou partenaires apparaissent ?
    - *02 Ce qui bouge :* Qui parle à qui après le changement ?
    - *03 Ce qui devient sensible :* Crée-t-on un point chaud, une boucle ou un couplage fort ?
- **Substance & Preuve :** Formalisation de la grille d'analyse d'une revue d'architecture.
- **Intention orale :** Interroger la salle : comment faites-vous une revue d'archi aujourd'hui ? Par e-mail ? En réunion de 2h ?
- **Beat narratif :** Problématisation du processus de review.

### Slide 25 — La pull request
- **Fichier :** [presentation/src/slides/25-la-pull-request.html](presentation/src/slides/25-la-pull-request.html)
- **Contenu projeté :**
  - Diagramme Mermaid `gitGraph` interactif (zoom/pan) montrant la branche `feat/alefest_coffee_v2` divergeant de `main`.
  - Badge de statut de branche.
  - Bouton réel de redirection vers la PR GitHub #1 publique.
- **Substance & Preuve :** Preuve tangible que l'architecture vit au cœur de GitHub/GitLab. La PR devient le lieu officiel de validation.
- **Intention orale :** Présenter la PR : l'architecte commente la ligne de modèle exactement comme le tech lead commente le code.
- **Beat narratif :** Intégration de l'architecture dans le flux naturel des développeurs.

### Slide 26 — Review — bénéfice
- **Fichier :** [presentation/src/slides/26-review-benefice.html](presentation/src/slides/26-review-benefice.html)
- **Contenu projeté :**
  - Callout bleu : *« Outiller la revue, c'est permettre d'aller droit au but. »*
- **Substance & Preuve :** Fin des réunions interminables de débat sur les couleurs de boîtes : la discussion porte sur les dépendances réelles.
- **Intention orale :** Souligner le gain d'efficacité collective.
- **Beat narratif :** Ancrage du bénéfice collaboratif.

---

## Acte 4 : Industrialisation & CI/CD (Slides 27 à 28)

### Slide 27 — Partie 4 (Intertitre)
- **Fichier :** [presentation/src/slides/27-partie-4.html](presentation/src/slides/27-partie-4.html)
- **Contenu projeté :**
  - Numéro : 04
  - Titre : *L'industrialisation*
  - Sous-titre : ADR, modèle, validation, rendu et publication à chaque push.
- **Substance & Preuve :** Annonce de la chaîne d'automatisation.
- **Intention orale :** « Une doc qu'on doit générer manuellement est une doc morte. Voyons comment automatiser la chaîne. »
- **Beat narratif :** Passage au mode chaîne de production.

### Slide 28 — Pipeline CI/CD
- **Fichier :** [presentation/src/slides/28-pipeline-ci-cd.html](presentation/src/slides/28-pipeline-ci-cd.html)
- **Contenu projeté :**
  - Flowchart Mermaid LR avec commandes de zoom :
    `ADR Markdown` → `Modèle .c4` → `Pull Request` → `Validation LikeC4` → `Génération HTML/vues` → `Visual diff` → `Publication` → `Portail vivant`.
- **Substance & Preuve :** Chaîne complète de build d'architecture. Démontre l'existence de tests automatisés d'intégrité de modèle dans les GitHub Actions / GitLab CI.
- **Intention orale :** Expliquer le `Visual diff` : en PR, un bot commente avec l'image avant/après des diagrammes impactés.
- **Beat narratif :** Industrialisation complète démontrée.

---

## Acte 5 : Bilan, Cockpit Vivant & Conclusion (Slides 29 à 34)

### Slide 29 — Partie 5 (Intertitre)
- **Fichier :** [presentation/src/slides/29-partie-5.html](presentation/src/slides/29-partie-5.html)
- **Contenu projeté :**
  - Numéro : 05
  - Titre : *Et alors ?*
  - Sous-titre : Que retenir et comment repartir avec du concret.
- **Substance & Preuve :** Transition vers la prise de recul et les livrables à emporter.
- **Intention orale :** Engager l'atterrissage : qu'est-ce que vous pouvez faire dès lundi matin dans vos équipes ?
- **Beat narratif :** Début de l'épilogue actif.

### Slide 30 — Avant / Après
- **Fichier :** [presentation/src/slides/30-avant-apres.html](presentation/src/slides/30-avant-apres.html)
- **Contenu projeté :**
  - Grille comparative en 3 piliers :
    1. *Source de vérité & évolution :* Visio/Confluence redessinée à la main vs Modèle unique `.c4` dans Git refactorable.
    2. *Revue & collaboration :* Validation tardive/informelle vs Diff visuel en PR et revue collective.
    3. *Cycle de vie & industrialisation :* PNG figés morts à 6 mois vs Pipeline CI/CD, portail vivant et copilote IA.
- **Substance & Preuve :** Récapitulatif à fort contraste des gains organisationnels.
- **Intention orale :** Parcourir les trois lignes. Faire résonner le contraste avec le constat de la slide 02.
- **Beat narratif :** Résolution complète du problème initial.

### Slide 31 — Portail vivant
- **Fichier :** [presentation/src/slides/31-portail-vivant.html](presentation/src/slides/31-portail-vivant.html)
- **Contenu projeté :**
  - Arguments clés : application React intégrable, navigation au clic, liens bidirectionnels vers le code, intégration multi-modèles, multi-exports (D2, PlantUML, Mermaid, PNG).
  - Illustration SVG du cockpit navigable (`localhost:3000`).
- **Substance & Preuve :** Démonstration que LikeC4 ne génère pas de simples images, mais une application Web autonome pour l'entreprise.
- **Intention orale :** Insister sur l'indépendance d'export : vous n'êtes enfermés dans aucun outil propriétaire.
- **Beat narratif :** Élargissement des perspectives outillage.

### Slide 32 — Vue C2 + likeC4
- **Fichier :** [presentation/src/slides/32-vue-c2-likec4.html](presentation/src/slides/32-vue-c2-likec4.html)
- **Contenu projeté :**
  - Header avec toggle : bouton `Vue LikeC4 ↗`.
  - Double vue intégrée :
    - Vue Mermaid : code `coffee-v1/c2-containers.mmd` + diagramme Mermaid zoomable.
    - Vue LikeC4 : iframe interactive du modèle compilé permettant la manipulation en direct.
- **Substance & Preuve :** Comparaison objective de syntaxe et de rendu : Mermaid pour les diagrammes express, LikeC4 pour l'architecture système globale.
- **Intention orale :** Démontrer l'interaction en direct. Cliquer sur les éléments pour montrer la fluidité du modèle.
- **Beat narratif :** Preuve finale par la manipulation interactive.

### Slide 33 — Ressources
- **Fichier :** [presentation/src/slides/33-ressources-qr.html](presentation/src/slides/33-ressources-qr.html)
- **Contenu projeté :**
  - Liens : documentation LikeC4 (`likec4.dev`), dépôt de démo interactive (`a-scolan.github.io/c4-hands-on-demo/`), article dev.to Onepoint.
  - Perspectives futures : reprise d'infrastructures existantes, déduction de règles pare-feu, référentiels d'architecture d'entreprise.
- **Substance & Preuve :** Boîte à outils immédiatement exploitable dès la sortie de la salle.
- **Intention orale :** Donner des clés concrètes pour démarrer sans friction.
- **Beat narratif :** Transmission et passage de relais à l'auditoire.

### Slide 34 — Merci
- **Fichier :** [presentation/src/slides/34-merci.html](presentation/src/slides/34-merci.html)
- **Contenu projeté :**
  - Titre : *Merci !*
  - Message de conclusion : *Ne dessinez plus vos architectures : codez-les*
  - Badges : Architecture, Diagram as code, C4 Model, LikeC4
  - Signature : Alexis Scolan — Architecte technique
  - QR Code menant directement à la présentation publique en ligne.
- **Substance & Preuve :** Appel final aux questions / réponses et mise à disposition immédiate du support complet.
- **Intention orale :** Remercier chaleureusement la salle et ouvrir la session d'échange.
- **Beat narratif :** Fermeture de la conférence sur la punchline initiale.

---

## Résumé en une phrase

La conférence montre, sur le cas **AleFest Coffee**, comment partir d’un **besoin métier formalisé en ADR**, le transformer en **modèle C4 versionné**, en produire des **vues statiques et dynamiques**, puis intégrer ces artefacts dans un **workflow de review visuelle et de portail vivant**.
