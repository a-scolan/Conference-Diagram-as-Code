# Déroulé de la conférence — Version fidèle aux slides (35 diapositives, 00 à 34)

Source : [presentation/src/slides/slides.json](presentation/src/slides/slides.json) compilé dans [presentation/public/presentation-diagram-as-code.html](presentation/public/presentation-diagram-as-code.html)

Ce document reflète la réalité exacte du deck HTML projeté lors de la session **« Ne dessinez plus vos architectures : codez-les ! »** (Atlantique Day 2026 — Alexis Scolan, architecte technique onepoint).

---

## Acte 0 : L'Accroche et le Changement de Paradigme (Slides 00 à 07)

### 0. Texte d'ouverture à lire (Verbatim d'entrée sur scène — 60 secondes)

> « Bonjour à toutes et à tous.
>
> Pour cette conférence, je vous propose d'examiner l'état de la documentation technique dans la plupart de nos organisations : le code progresse à chaque commit, les fonctionnalités sont livrées en continu, mais la cartographie de nos systèmes meurt en silence dans un wiki ou un dossier partagé.
>
> On a donc résolu la gestion du code avec Git, les revues collaboratives avec les Pull Request et l'automatisation en CI/CD. Mais dès qu'il s'agit d'architecture, on retombe dans le dessin artisanal : des boîtes et des flèches tracées à la main, déconnectées de la réalité du terrain et impossibles à maintenir dans le temps.
>
> L'objectif de ces 45 minutes : réconcilier l'architecture avec les pratiques modernes du génie logiciel. 
> 
> Un avertissement préalable : nous ne sommes pas ici pour débattre de la conception du système que vous allez voir. Nous sommes ici pour observer comment des choix d'architecture actés s'écrivent en code, se relisent visuellement en Pull Request et se compilent en documentation vivante.
>
> Ne dessinez plus vos architectures : codez-les ! »

---

> **Consignes orateur (Retours d'expérience) :**
> - **Posture :** Pas de « je » complaisant. Poser la voix, regarder la salle, sourire.
> - **Cadrage impératif (Règle d'or Nicolas) :** Préciser immédiatement qu'on ne vient pas débattre de *conception logicielle* (pourquoi tel microservice ou telle queue), mais de *modélisation* (comment faire vivre et partager des décisions déjà prises).
> - **Setup technique :** VS Code en thème clair (LIGHT) zoomé, navigateur en vrai plein écran (F11), chrono visible sur smartphone.

---

## Les 4 Règles d'Or d'Impact Scénique (Garder la salle active & impliquée)

1. **Les 5 temps d'arrêt et respirations (sur les slides callout 03, 07, 17, 20, 25) :**  
   Ne jamais paraphraser ni meubler une slide de citation. Arriver dessus, poser la phrase d'une voix calme, planter son regard dans la salle et **marquer une pause de 3 à 4 secondes**. Laisser le public lire, digérer et imprimer le principe sans distraction verbale.
2. **L'incarnation sensorielle (l'ancrage humain) :**  
   Ne jamais parler d'un « utilisateur » ou d'un « acteur » abstrait. Raconter la scène : Thomas, festivalier sous 30°C, qui entend au loin les premières notes de basse de son groupe préféré alors qu'il est bloqué depuis 18 minutes devant un comptoir saturé.
3. **Les micro-engagements de la salle :**  
   Impliquer physiquement le public : le double filtre à main levée en slide 02 (faire lever les mains puis les faire toutes retomber), les questions d'observation sur le diff (« *Regardez la ligne 12...* »), le questionnement direct sur leurs propres revues d'architecture.
4. **La rupture de posture scénique :**  
   - *Phase conceptuelle & valeur :* corps ouvert au centre de la scène, face au public, bras décroisés, regard direct.  
   - *Phase technique & code :* quart de tour vers l'écran, pointer précisément du doigt la ligne commentée, puis se retourner vers la salle pour livrer l'explication.

---

### Slide 00 — Titre
- **Fichier :** [presentation/src/slides/00-titre.html](presentation/src/slides/00-titre.html)
- **Contenu projeté :**
  - Titre : *Ne dessinez plus vos architectures : codez-les !*
  - Contexte : Conférence Architecture & Tech · Atlantique Day 2026
  - Orateur : Alexis Scolan
- **Checklist avant-scène :**
    - Navigateur public : Plein écran réel (F11), résolution 16:9 sans rognage, blackout (.) testé
    - VS Code (Live coding) : Thème clair (LIGHT), police zoomée (+2/+3), arborescence gauche masquée
    - Onglets de secours : PR GitHub #1 et portail LikeC4 local (localhost:3000) ouverts en arrière-plan
    - Pas d'interruptions : Fermer Teams, Outlook, autres fenêtres..., désactiver la veille écran et PC
    - Matériel & Confort : Ordinateur branché sur secteur (ou batterie pleine), bouteille d'eau ouverte sur le pupitre
- **Action scénique :** Debout au centre, regard direct balayant toute la salle, voix posée, aucun mot d'hésitation.

- **Mots-clés :**
    - Code = versionné, testé, déployé
    - Architecture = dessin artisanal mort dans un wiki
    - Objectif : réconcilier l'architecture avec le génie logiciel
    - Ne dessinez plus vos architectures : codez-les !
- **Verbatim oral (45 s) :**
  > « Bonjour à tous. Regardez comment nous fabriquons du logiciel aujourd'hui : chaque ligne de code est versionnée dans Git, chaque modification est passée au crible d'une Pull Request, testée automatiquement et déployée en continu. Mais dès qu'il s'agit d'expliquer comment tout cela tient ensemble... nous retombons dans l'artisanat. Nous ouvrons un outil de dessin, nous traçons des rectangles et des flèches à la main, nous exportons une image, et nous la collons dans un wiki où elle commence immédiatement à mourir. L'objectif de ces 45 minutes : réconcilier l'architecture avec le génie logiciel. Ne dessinez plus vos architectures : codez-les ! »
- **Substance & Preuve :** Pose la promesse centrale en rupture directe avec le dessin conventionnel.
- **Beat narratif :** Accroche. Déclare la thèse : le schéma artisanal est une impasse.

### Slide 01 — Speaker
- **Fichier :** [presentation/src/slides/01-speaker.html](presentation/src/slides/01-speaker.html)
- **Contenu projeté :**
  - Alexis Scolan — Architecte technique onepoint
  - Message : *Aligner l'architecture et le développement sur le terrain : des modèles versionnés, relus en Pull Request et maintenus sans redessiner.*
  - Badges : Diagram as Code, C4 model, Architecture agile
- **Action scénique :** Sourire franc, posture ouverte, transition rapide sans s'attarder (15 secondes chrono).

- **Mots-clés :**
    - Alexis Scolan · Architecte technique onepoint
    - Sujet né des frictions et frustrations du terrain
    - Aligner architecture et dev sans redessiner
- **Verbatim oral (15 s) :**
  > « Je m'appelle Alexis Scolan, architecte technique chez onepoint. Au quotidien, j'accompagne des équipes de développement et des DSI. Ce dont nous allons parler aujourd'hui ne sort pas d'un manuel théorique : c'est une méthode de terrain née de la frustration de voir des schémas d'architecture devenir faux dès le lendemain de leur publication. »
- **Substance & Preuve :** Légitimité de terrain sans étalage personnel.
- **Beat narratif :** Ancrage de posture : praticien parlant à des praticiens.

### Slide 02 — Le problème réel
- **Fichier :** [presentation/src/slides/02-le-probleme-reel.html](presentation/src/slides/02-le-probleme-reel.html)
- **Contenu projeté :**
  - Deux colonnes en contraste :
    - *Point de situation :* « Qui a déjà fait un dessin pour expliquer un système ? », « Qui l'a vu devenir obsolète six mois plus tard ? », « Qui ose encore dire "cette image reflète l'état de notre système" ? »
    - *Le vrai coût caché :* L'image exportée meurt en silence, le code évolue, la dette documentaire s'installe.
- **Action scénique :** **Micro-engagement public (le double filtre).** Lever la main soi-même pour inciter la salle.

- **Mots-clés :**
    - Double filtre : Qui a fait un schéma ? / Qui est à jour à 6 mois ?
    - Le code avance, la carte reste figée
    - L'image exportée meurt en silence
- **Verbatim oral (45 s) :**
  > « Faisons un sondage rapide. Levez la main si vous avez déjà passé du temps à concevoir un beau schéma d'architecture pour votre équipe. *(Attendre que les mains se lèvent)* Très bien. Maintenant, gardez la main levée UNIQUEMENT si ce schéma est encore parfaitement à jour en production six mois plus tard. *(Observer la quasi-totalité des mains retomber avec un sourire complice)* Regardez autour de vous : tout le monde baisse la main. Le code progresse à chaque sprint, mais la carte reste figée. Et le vrai drame, ce n'est pas qu'elle soit obsolète : c'est qu'elle meurt en silence sans que personne ne s'en rende compte. »
- **Substance & Preuve :** Diagnostic partagé du cycle d'abandon documentaire dans toutes les organisations.
- **Beat narratif :** Tension. L'auditoire admet l'échec universel du schéma statique.

### Slide 03 — Le problème réel — message
- **Fichier :** [presentation/src/slides/03-le-probleme-reel-message.html](presentation/src/slides/03-le-probleme-reel-message.html)
- **Contenu projeté :**
  - Callout vert en pleine page : *« Le problème c'est de pouvoir faire vivre ces connaissances dans le temps. »*
- **Action scénique :** Regard calme vers la salle, enchaînement direct vers la slide 04 sans temps mort pour garder le rythme.

- **Mots-clés :**
    - Transition vive sans temps mort
    - Faire vivre les connaissances dans le temps
    - L'adversaire : l'entropie dans la durée
- **Verbatim oral (15 s) :**
  > « Le problème n'a jamais été d'expliquer le système le premier jour... Le vrai problème, c'est de faire vivre cette connaissance dans le temps. Regardez pourquoi : »
- **Substance & Preuve :** Déplacement de l'enjeu. Le sujet n'est pas esthétique, il est temporel et collaboratif.
- **Beat narratif :** Pivot. L'adversaire n'est pas le dessin en soi, c'est l'entropie dans la durée.

### Slide 04 — Le problème réel — dessin
- **Fichier :** [presentation/src/slides/04-le-probleme-reel-dessin.html](presentation/src/slides/04-le-probleme-reel-dessin.html)
- **Contenu projeté :**
  - Titre : *Pas la qualité du dessin.*
  - Visuel : Capture d'un diagramme Draw.io réel plein de boîtes et de flèches entremêlées (`assets/drawio.png`).
- **Action scénique :** Pointer l'image du bras sans se détourner du public.

- **Mots-clés :**
    - Le dessin Draw.io est propre et soigné
    - Ajouter un service = déplacer 40 boîtes et 35 flèches à la main
    - Mise en page vs ingénierie logicielle
- **Verbatim oral (30 s) :**
  > « Regardez ce schéma. Il est propre, bien aligné, fait avec soin. Le problème ne vient pas de l'outil graphique, ni du talent de celui qui l'a dessiné. Le piège se referme le jour où vous ajoutez un service : pour insérer une seule boîte au milieu, vous devez déplacer à la main 40 composants et réaligner 35 flèches. À cet instant précis, vous ne faites plus de l'architecture : vous faites de la mise en page. Et comme personne n'a le temps de faire de la mise en page, on abandonne. »
- **Substance & Preuve :** Preuve visuelle. Même avec un dessin soigné, un fichier binaire ou un SVG plat n'a aucune sémantique exécutable.
- **Beat narratif :** Confrontation. Démonstration par l'absurde de la limite de l'outil graphique.

### Slide 05 — Changer de paradigme
- **Fichier :** [presentation/src/slides/05-changer-de-paradigme.html](presentation/src/slides/05-changer-de-paradigme.html)
- **Contenu projeté :**
  - 3 piliers enrichis avec descriptions et points d'ancrage :
    1. **Une unique source de vérité** (modèle sémantique unifié, typé : chaque brique n'est définie qu'une fois, et réutilisée à l'infini en restant à jour)
    2. **Des perspectives multiples** (détailler le système et filtrer ses composants selon le besoin et le public)
    3. **Un cycle de vie logiciel** (versionné dans Git, diffs visuels en PR, validation et CI/CD)
- **Action scénique :** Égrener les trois points sur les doigts, posture stable, ancrage au sol.

- **Mots-clés :**
    - 1. Source de vérité unique (chaque brique définie une fois, réutilisée à l'infini en restant à jour)
    - 2. Perspectives multiples (détailler le système, filtrer les composants selon le besoin)
    - 3. Cycle de vie logiciel (Git, PR, validation, CI/CD)
- **Verbatim oral (60 s) :**
  > « Pour casser cette fatalité, nous devons appliquer à l'architecture les mêmes règles qu'au logiciel. Premièrement : une source de vérité unique. Fini les boîtes redessinées dans dix documents. On déclare chaque brique une seule fois dans un modèle typé, et elle est réutilisée à l'infini en restant à jour. Deuxièmement : des perspectives multiples. Depuis ce modèle unique, on peut détailler le système à n'importe quelle échelle et filtrer ses composants selon le besoin exact de nos interlocuteurs. Troisièmement : un cycle de vie logiciel. L'architecture vit dans Git, se révise en Pull Request et se compile en continu. »
- **Substance & Preuve :** Cadre théorique fondateur du Diagram as Code.
- **Beat narratif :** Résolution conceptuelle. Pose la base des actes suivants.

### Slide 06 — C4 zoom
- **Fichier :** [presentation/src/slides/06-c4-zoom.html](presentation/src/slides/06-c4-zoom.html)
- **Contenu projeté :**
  - Titre : *Le modèle C4 : quatre niveaux pour hiérarchiser la composition de vos systèmes*
  - Texte explicatif : C1 (Contexte), C2 (Containers), C3 (Components), C4 (Code), complétés de deux vues orthogonales : Dynamique (flux et scénarios d'usage) et Déploiement (infrastructure, zones, VM).
  - Schéma vectoriel SVG animé illustrant l'emboîtement hiérarchique et les systèmes voisins.
- **Action scénique :** Suivre visuellement l'animation SVG de zoom progressif.

- **Mots-clés :**
    - Fin des schémas fourre-tout (bouton, service, cluster mélangés)
    - C1 Contexte · C2 Conteneurs · C3 Composants · C4 Code
    - Focus de la conférence : C1, C2 et flux dynamiques
- **Verbatim oral (60 s) :**
  > « Pour structurer ce modèle sans se noyer, Simon Brown a créé le standard C4. C'est la fin des schémas où l'on mélange sur la même feuille un bouton React, un microservice Java et un cluster Kubernetes. C1, c'est le Contexte : avec qui notre système interagit-il ? C2, les Conteneurs : quelles sont les applications, les API et les bases qui le composent ? C3, les Composants internes, et C4 le Code. Aujourd'hui, nous allons nous focaliser sur le C1, le C2 et les parcours dynamiques, qui couvrent 90 % des arbitrages techniques en équipe. »
- **Substance & Preuve :** Définition opérationnelle de la norme C4 (Simon Brown) appliquée au modèle.
- **Beat narratif :** Ancrage terminologique (*grounding* de C1 et C2).

### Slide 07 — C4 zoom — image mentale
- **Fichier :** [presentation/src/slides/07-c4-zoom-image-mentale.html](presentation/src/slides/07-c4-zoom-image-mentale.html)
- **Contenu projeté :**
  - Callout bleu : *« C4, c'est comme Google Maps : un seul territoire, plusieurs niveaux de détail. On ne dessine pas chaque niveau, on zoome dans un modèle unique. »*
- **Action scénique :** **Temps d'arrêt (3s).** Poser la voix sur l'analogie et marquer une pause.

- **Mots-clés :**
    - Pause (3s)
    - Métaphore Google Maps : un seul territoire, plusieurs niveaux de détail
    - On ne redessine pas chaque niveau, on zoome dans un modèle unique
- **Verbatim oral (15 s) :**
  > « Gardez cette image en tête : C4, c'est exactement Google Maps. Sur Maps, vous ne redessinez pas la carte de France quand vous zoomez sur une rue de Nantes. Le territoire est unique, ce sont vos niveaux de détail qui changent. On ne dessine pas chaque niveau : on zoome dans un modèle unique. »  
  > *(Silence de 3 secondes).*
- **Substance & Preuve :** Analogie universelle qui clarifie immédiatement la non-redondance du modèle.
- **Beat narratif :** Image mentale définitive. Fin de l'Acte 0.

---

## Acte 1 : Du Besoin Métier au Modèle (Slides 08 à 13)

### Slide 08 — Partie 1 (Intertitre)
- **Fichier :** [presentation/src/slides/08-partie-1.html](presentation/src/slides/08-partie-1.html)
- **Contenu projeté :**
  - Numéro : 01
  - Titre : *Du besoin métier au modèle*
  - Sous-titre : AleFest Coffee · poser les premières frontières du système
- **Action scénique :** Enchaîner avec énergie pour lancer l'histoire, corps tourné vers la salle.

- **Mots-clés :**
    - Partie 1 : Du besoin métier au modèle
    - Quitter la théorie pour le terrain
    - Cas d'étude AleFest Coffee
- **Verbatim oral (10 s) :**
  > « Première partie : quittons la théorie. Allons sur le terrain avec un cas d'étude concret. »
- **Substance & Preuve :** Transition vers l'étude de cas pratique.
- **Beat narratif :** Lancement du cas concret.

### Slide 09 — Cas d'étude
- **Fichier :** [presentation/src/slides/10-cas-d-etude.html](presentation/src/slides/10-cas-d-etude.html)
- **Contenu projeté :**
  - Titre : *AleFest Coffee : vendre vite, servir mieux*
  - Points concrets : pics massifs de commandes entre deux concerts, festivalier captif qui attend sur place et manque le show, baristas sous tension.
  - Badges : *Commandes manuelles*, *Files d'attente*, *Insatisfaction*.
  - Visuel : image d'illustration du stand (`assets/plan.webp`).
- **Action scénique :** **Incarnation sensorielle.** Mettre en scène l'atmosphère du festival avec les mains, faire ressentir le stress du stand.

- **Mots-clés :**
    - Festival : entracte de 15 minutes, 300 personnes d'un coup
    - 100% manuel : tickets papier, cash, 20 min d'attente
    - Festivaliers frustrés (ratent le show), baristas sous l'eau
    - Objectif : digitaliser le stand pour fluidifier le service
- **Verbatim oral (40 s) :**
  > « Bienvenue à AleFest, grand festival de musique. Au milieu du site : notre stand, AleFest Coffee. Le décor : 15 minutes d'entracte entre deux têtes d'affiche. 300 festivaliers se ruent en même temps sur le stand pour avoir leur dose de caféine. Le système actuel est 100 % manuel : commande au comptoir, tickets volants, paiement cash. Résultat : 20 minutes d'attente, des festivaliers frustrés qui ratent le début du concert, et des baristas sous l'eau qui gèrent les priorités en criant par-dessus le bruit de la foule. Objectif du festival : digitaliser le stand pour accélérer le service. »
- **Substance & Preuve :** Tension métier concrète : perte de chiffre d'affaires et insatisfaction festivaliers.
- **Beat narratif :** Enjeu métier tangible.

### Slide 10 — ADR-001
- **Fichier :** [presentation/src/slides/11-adr-001.html](presentation/src/slides/11-adr-001.html)
- **Contenu projeté :**
  - Split 50/50 :
    - Volet gauche : document ADR-001 formaté et mis en page sans syntaxe Markdown brute (`Contexte`, `Décision`, `Contraintes & Conséquences`), complété d'un encart en bas rappelant que la clarté de l'état et de la cible permet d'utiliser l'IA comme accélérateur d'amorçage optionnel.
    - Volet droit : Iframe interactive du prompt Copilot replay (`assets/replay_ADR.html`).
- **Action scénique :** Pointer le volet texte à gauche, puis l'animation replay à droite.

- **Mots-clés :**
    - Pas de page blanche graphique : rédaction d'un ADR
    - Décision : borne comptoir, écran barista, RabbitMQ, PostgreSQL
    - Accélérateur IA optionnel : texte clair → premier squelette de code en secondes
- **Verbatim oral (60 s) :**
  > « Comment commence notre travail d'architecte ? Pas en ouvrant un éditeur graphique pour jeter des boîtes au hasard, mais en écrivant un ADR : un Architecture Decision Record. En trois paragraphes Markdown, nous posons le contexte, la décision technique — une tablette comptoir, un écran barista, deux services découplés par un bus RabbitMQ et PostgreSQL — et les conséquences. Et regardez à droite : le modèle LikeC4 s'écrit très bien à la main, mais parce que cette décision est rédigée en langage clair et structuré, un assistant de code IA peut en extraire le premier squelette en quelques secondes. L'IA reste un accélérateur optionnel : elle supprime la friction de démarrage, mais c'est nous qui validons chaque ligne. »
- **Substance & Preuve :** Démontre qu'on ne part pas d'un schéma vide, mais d'une décision textuelle structurée, transformable par outillage / IA optionnel.
- **Beat narratif :** Étape fondatrice : le texte brut devient le déclencheur du modèle.

### Slide 11 — C1 généré
- **Fichier :** [presentation/src/slides/12-c1-genere.html](presentation/src/slides/12-c1-genere.html)
- **Contenu projeté :**
  - Titre : *Vue C1 : les frontières du système en quelques lignes*
  - Split 50/50 :
    - Volet gauche avec 2 onglets : `system-model.c4` (déclaration des acteurs et du système) et `system-views.c4` (déclaration de la vue avec `include`).
    - Iframe compilée LikeC4 en direct : Vue C1 `c1_context` de `coffee-v1`.
- **Action scénique :** Basculer entre l'onglet `system-model.c4` et l'onglet `system-views.c4` pour montrer la séparation entre déclaration des entités et projection de la vue, puis pointer le schéma interactif à droite.

- **Mots-clés :**
    - Deux onglets : modèle (entités) vs vue (projection / include)
    - Zéro coordonnées X/Y, zéro layout manuel
    - Vue C1 navigable générée par le compilateur
- **Verbatim oral (50 s) :**
  > « Regardez à gauche : nous avons séparé le modèle de sa vue. Dans le premier onglet, le modèle déclare nos entités — deux acteurs et notre système AleFest Coffee. Dans le second onglet, la vue C1 spécifie simplement les éléments qu'elle souhaite projeter grâce au mot-clé include. À droite, le schéma se compile en direct. Remarquez bien : nous n'avons spécifié aucune coordonnée X/Y, aucune couleur de boîte, aucune position de flèche. Le compilateur LikeC4 calcule la disposition sémantique tout seul. Les frontières du système sont posées. »
- **Substance & Preuve :** Première preuve d'exécution : la séparation modèle / vue produit un schéma de contexte interactif et navigable.
- **Beat narratif :** Première victoire technique tangible.

### Slide 12 — Grammaire du modèle
- **Fichier :** [presentation/src/slides/12b-grammaire-du-modele.html](presentation/src/slides/12b-grammaire-du-modele.html)
- **Contenu projeté :**
  - Titre : *Définir la grammaire de vos systèmes*
  - Message clé : *« LikeC4 ne vous impose pas un vocabulaire rigide : vous définissez la grammaire des systèmes de votre entreprise une fois pour toutes. »*
  - 3 cartes conceptuelles :
    - *01 Acteurs :* Rôles & personas (`Actor_Person`, `Actor_Staff`).
    - *02 Typologie d'éléments :* Systèmes, Conteneurs & Librairies (`System_New`, `System_External`, `Container_Spa`, `Container_Api`, `Component`, `Library`, `Queue`, `Database`).
    - *03 Sémantique des relations :* Flux & Technologies (`-[calls]->` HTTPS, `-[async]->` AMQP, `-[writes]->` SQL, `-[uses]->`).
- **Action scénique :** Balayer les trois colonnes d'un geste englobant, insister sur le couplage entre intention de relation et technologie sous-jacente.

- **Mots-clés :**
    - Message clé : grammaire d'entreprise définie une fois pour toutes
    - Éléments : systèmes, conteneurs, composants, librairies
    - Relations : nature du flux (calls, async, writes) + technologie (HTTPS, AMQP, SQL)
    - Zéro flèche anonyme, zéro boîte générique
- **Verbatim oral (45 s) :**
  > « Vous avez sans doute remarqué ces types : Actor_Person, Container_Spa, Container_Api, ou les flèches calls et async. Ces mots-clés ne sont pas imposés par LikeC4. C'est nous qui les avons déclarés dans nos spécifications. Retenez ce principe fondamental : LikeC4 ne vous impose pas un vocabulaire rigide. Vous définissez la grammaire des systèmes de votre entreprise une fois pour toutes. Du système macro jusqu'à la librairie logicielle, et de la nature d'un appel jusqu'à sa technologie sous-jacente — comme HTTPS ou AMQP. Vos équipes n'ont plus à réinventer la charte graphique, les formes ou les icônes : elles instancient simplement ces types dans leurs projets métiers. »
- **Substance & Preuve :** Démontre comment LikeC4 standardise le vocabulaire d'architecture à l'échelle de l'organisation.
- **Beat narratif :** Clarté conceptuelle : ancrage de la grammaire partagée avant d'entrer dans les conteneurs V1.

### Slide 13 — Briques C2
- **Fichier :** [presentation/src/slides/13-briques-c2.html](presentation/src/slides/13-briques-c2.html)
- **Contenu projeté :**
  - Titre : *Illuminer la boîte noire : définir les applications et les services*
  - Cartes conceptuelles spacieuses et réparties :
    - *01 Frontends :* Counter App (SPA Comptoir), Barista Screen (SPA Écran temps réel).
    - *02 Services :* Order Service (API), Preparation Service (API), RabbitMQ (Queue AMQP), PostgreSQL (Database).
- **Action scénique :** Balayer les deux colonnes (front à gauche, services à droite), expliquer l'arbitrage RabbitMQ.

- **Mots-clés :**
    - Zoom intérieur : ouvrir la boîte AleFest Coffee
    - Fronts : tablette comptoir + écran barista temps réel
    - Services : Order + Preparation, PostgreSQL
    - RabbitMQ : découplage asynchrone pour absorber les pics
- **Verbatim oral (30 s) :**
  > « Maintenant, zoomons : ouvrons la boîte noire AleFest Coffee pour concevoir notre niveau C2. Côté utilisateurs : une application tablette au comptoir et un écran temps réel pour les baristas. Côté traitement : un service de commandes, un service de préparation, et surtout, un bus RabbitMQ pour découpler les deux. Pourquoi RabbitMQ ? Parce qu'en plein pic de charge, la prise de commande ne doit jamais ralentir si la machine à café prend du retard. »
- **Substance & Preuve :** Explicitation des sous-systèmes techniques de la V1 avant de projeter le diagramme C2.
- **Beat narratif :** Grounding des composants internes V1.

### Slide 14 — C2 généré
- **Fichier :** [presentation/src/slides/14-c2-genere.html](presentation/src/slides/14-c2-genere.html)
- **Contenu projeté :**
  - Titre : *Le modèle s'enrichit par extension (C2)*
  - Split 50/50 :
    - Volet gauche à deux onglets avec défilement pas-à-pas en allers-retours :
      - *Onglet 1 (`system-model.c4`) :* extension du modèle (`extend alefestCoffee`) avec ses conteneurs internes, puis ses flux (`calls`, `async`, `writes`).
      - *Onglet 2 (`system-views.c4`) :* sélecteurs de vue (wildcard `include alefestCoffee.*`, sélecteurs de relations `include -> alefestCoffee`, `include alefestCoffee ->`, ciblage précis `include festivalier -> alefestCoffee.counterApp`).
    - Iframe compilée LikeC4 : Vue C2 `c2_containers` de `coffee-v1`.
- **Action scénique :** **Rupture de posture :** quart de tour vers l'écran. Avancer pas à pas au clavier pour faire observer les allers-retours entre le modèle (déclaration) et la vue (sélecteurs directionnels et wildcards), puis pointer le diagramme réorganisé à droite.

- **Mots-clés :**
    - Allers-retours model ↔ view : déclarer puis projeter
    - Wildcard : include alefestCoffee.* (projette tous les conteneurs d'un coup)
    - Flux qualifiés : calls HTTP, async RabbitMQ, writes SQL
    - Sélecteurs de voisinage : include -> alefestCoffee et alefestCoffee ->
- **Verbatim oral (55 s) :**
  > « Regardez comment nous construisons ce niveau C2 grâce à une continuité parfaite entre modèle et vue. D'abord, dans system-model.c4, nous étendons le système existant — extend alefestCoffee — pour déclarer nos applications et services. Ensuite, regardez la bascule vers system-views.c4 : comment projeter d'un coup tous ces conteneurs sans les réécrire un par un ? Grâce au sélecteur wildcard include alefestCoffee.*. Puis, retour dans le modèle : nous câblons les flux synchrones HTTP, la file asynchrone RabbitMQ et la persistance PostgreSQL. Et dans la vue, observez ces sélecteurs de relations plus puissants : include -> alefestCoffee et alefestCoffee ->. Ces deux lignes suffisent pour faire apparaître automatiquement le festivalier et le barista dès qu'un flux les relie au stand, sans jamais forcer un placement manuel. Le graphe sémantique C2 à droite est complet, typé et interactif. »
- **Substance & Preuve :** Démonstration de la synergie entre déclaration sémantique (modèle) et sélecteurs expressifs (wildcard, voisinage relationnel dans les vues).
- **Beat narratif :** Clôture de l'architecture V1 avec maîtrise du modèle et des sélecteurs de vues.

---

## Acte 2 : Évoluer & Éprouver (Slides 15 à 21)

### Slide 15 — Partie 2 (Intertitre)
- **Fichier :** [presentation/src/slides/15-partie-2.html](presentation/src/slides/15-partie-2.html)
- **Contenu projeté :**
  - Numéro : 02
  - Titre : *Évoluer & éprouver*
  - Sous-titre : Faire évoluer l'architecture et l'éprouver avec des scénarios.
- **Action scénique :** Haussement de ton léger, marquer une relance dynamique.

- **Mots-clés :**
    - Partie 2 : Évoluer & éprouver
    - Le système vivant évolue : nouvelle demande métier
    - Passage à la commande mobile V2
- **Verbatim oral (10 s) :**
  > « Partie 2 : notre V1 tourne au festival. Mais un système vivant n'attend pas : le métier revient avec une nouvelle exigence. »
- **Substance & Preuve :** Transition vers l'évolution majeure du système (le passage à la commande mobile V2).
- **Beat narratif :** Relance de la dynamique narrative.

### Slide 16 — V1 vs V2
- **Fichier :** [presentation/src/slides/16-v1-vs-v2.html](presentation/src/slides/16-v1-vs-v2.html)
- **Contenu projeté :**
  - Comparatif en deux colonnes :
    - *V1 Le comptoir :* Système local, festivalier captif, attente physique au stand.
    - *V2 Le café mobile :* Système intégré à l'app festival, Notification Service push, festivalier libéré qui retourne au concert.
- **Action scénique :** Incarner le contraste entre l'attente subie et la liberté du festivalier.

- **Mots-clés :**
    - V1 : saisie comptoir, mais festivalier toujours captif devant le stand
    - V2 : commande mobile depuis la fosse pendant le concert
    - Notification push : venir au stand uniquement quand c'est prêt
    - Intégration partenaire externe (App Festival)
- **Verbatim oral (40 s) :**
  > « Le retour du terrain est sans appel : la saisie numérique au comptoir est rapide, mais les festivaliers continuent de faire la queue devant le stand pour attendre leur boisson. Le métier nous demande la V2 : intégrer la commande de café directement dans l'application officielle du festival. Le festivalier commande depuis la fosse pendant un concert, continue d'écouter la musique, et ne vient au comptoir que lorsqu'il reçoit une notification : "Votre flat white est prêt au stand B". Architectoniquement, ce n'est plus un système en vase clos : nous devons nous brancher à un système tiers et ajouter un service de notifications push. »
- **Substance & Preuve :** Énonciation de l'impact architectural : passage d'un système fermé à une intégration externe événementielle.
- **Beat narratif :** Problématique de l'évolution architectural.

### Slide 17 — Évolution du modèle
- **Fichier :** [presentation/src/slides/17-live-coding.html](presentation/src/slides/17-live-coding.html)
- **Contenu projeté :**
  - Titre : *Faire évoluer le diagramme d'architecture devient simple comme bonjour*
  - Vue détaillée en split direct à 2/3 (code large) :
    - Volet gauche à deux onglets avec badge *diff* :
      - *Onglet 1 (`system-model.c4`) :* ajouts en vert du système partenaire `festivalSystem`, du `notificationService` branché sur RabbitMQ, et des flux commande mobile / Firebase.
      - *Onglet 2 (`system-views.c4`) :* mise à jour du sélecteur pour inclure le système partenaire `festivalSystem, festivalSystem.*` et colorer le bus en ambre.
    - Iframe LikeC4 interactive de `coffee-v2` affichant la nouvelle architecture conteneurs.
- **Action scénique :** Ralentir le débit de voix. Avancer au clavier pour révéler les ajouts dans le modèle, puis basculer automatiquement sur la vue pour montrer l'inclusion du partenaire.

- **Mots-clés :**
    - Split 2/3 code large avec badge 'diff'
    - 1. Modèle : Système partenaire + Notification Service + flux
    - 2. Vues : inclusion de festivalSystem.* et mise en valeur du bus
    - Le graphe C2 s'adapte automatiquement sans souris
- **Verbatim oral (75 s — rythme calme et posé) :**
  > « Regardez ce diff. En vert : exactement ce que nous ajoutons. D'abord dans system-model.c4 : nous déclarons le système externe du festival avec son application mobile, nous ajoutons un notificationService branché sur notre bus RabbitMQ existant sans toucher au reste, puis nous tirons les nouvelles flèches de commande mobile et de push notification. Ensuite, basculons sur system-views.c4 : nous ajoutons simplement le système partenaire dans notre sélecteur include festivalSystem, festivalSystem.*. Regardez à droite : le diagramme C2 a intégré le système partenaire et réorganisé le graphe instantanément. En quelques lignes de code partagées entre modèle et vue, l'architecture a absorbé l'intégration sans qu'on ait déplacé un seul rectangle à la souris. »
- **Substance & Preuve :** Moment fort de démonstration : le passage V1 → V2 se lit comme un simple `git diff` de modèle et de vue projetée.
- **Beat narratif :** Climax démonstratif de l'Acte 2. Le diff d'architecture en direct.

### Slide 18 — Cas d'étude — promesse
- **Fichier :** [presentation/src/slides/18-cas-d-etude-promesse.html](presentation/src/slides/18-cas-d-etude-promesse.html)
- **Contenu projeté :**
  - Callout bleu : *« Le diagramme doit raconter la promesse métier en plus de servir de référence. »*
- **Action scénique :** **Temps d'arrêt (2-3s).** Poser la question, regarder la salle et laisser infuser l'interrogation.

- **Mots-clés :**
    - Pause (2-3s)
    - Le diagramme statique montre les tuyaux
    - Prouve-t-il au PO que le parcours fonctionne réellement ?
- **Verbatim oral (10 s) :**
  > « Une cartographie de boîtes montre les connexions techniques. Mais est-ce qu'elle prouve au Product Owner que le parcours utilisateur fonctionne réellement de bout en bout ? »  
  > *(Silence de 2 secondes).*
- **Substance & Preuve :** Principe d'architecture vivante : la technique doit incarner le parcours utilisateur.
- **Beat narratif :** Ancrage conceptuel avant la vue dynamique.

### Slide 19 — Séquence mobile
- **Fichier :** [presentation/src/slides/19-sequence-mobile.html](presentation/src/slides/19-sequence-mobile.html)
- **Contenu projeté :**
  - Titre : *Vue dynamique : dérouler le scénario étape par étape*
  - Split deux tiers / un tiers :
    - Code source DSL `dynamic view order_mobile_flow` : étapes chronologiques (1. Commande, 2. Préparation barista, 3. Notification & retrait) avec note de synchronisation sur les identifiants réels.
    - Iframe compilée LikeC4 Use Case / Dynamic view navigable.
- **Action scénique :** Pointer les trois blocs de commentaires dans le code (1. Commande, 2. Préparation, 3. Notification), insister sur la synchronisation garantie.

- **Mots-clés :**
    - dynamic view : scénario sur les composants réels du modèle
    - 1. Commande mobile → 2. Préparation barista → 3. Push & retrait
    - Synchronisation stricte : zéro divergence possible avec les IDs réels
- **Verbatim oral (60 s) :**
  > « Habituellement, pour valider un scénario, on ouvre un autre outil et on dessine un diagramme de séquence UML qui sera oublié dans deux semaines. Regardez ce que permet LikeC4 : une dynamic view. Dans le même modèle, nous décrivons la chronologie : étape 1, commande depuis l'app festival ; étape 2, préparation par le barista ; étape 3, notification push et retrait au stand. Et observez le diagramme à droite : LikeC4 numérote les flux directement sur les composants réels de notre architecture. Comme ces étapes s'appuient sur les identifiants stricts de nos conteneurs réels, si un service est renommé ou supprimé, la séquence reste synchronisée ou la CI lève une erreur. Votre diagramme de séquence ne peut plus mentir. »
- **Substance & Preuve :** LikeC4 sait générer des vues comportementales séquentielles directement sur le modèle statique, sans recréer un diagramme de séquence jetable.
- **Beat narratif :** Preuve du dynamisme comportemental sur source unique.

### Slide 20 — Impact UX & As-Code
- **Fichier :** [presentation/src/slides/20-impact-ux.html](presentation/src/slides/20-impact-ux.html)
- **Contenu projeté :**
  - Titre : *Le parcours utilisateur enfin fluide vs Valider le scénario avant d'écrire le code*
  - Deux colonnes à fort contraste opérationnel :
    - *Côté festivalier :* Commande passée sur smartphone pendant le concert, retrait sur notification, fin de la cohue au stand.
    - *Bénéfice As-Code :* Détection précoce du rôle indispensable du service de notification et du bus, zéro désynchronisation avec le C2 réel, contrat d'arbitrage partagé entre métier et tech.
- **Action scénique :** Mettre en valeur la colonne de droite (la valeur d'ingénierie logicielle), ton posé et valorisant.

- **Mots-clés :**
    - Festivalier : attente subie transformée en expérience libre
    - As-Code : validation précoce du rôle du bus et des notifications
    - Arbitrage commun entre Product Owner et développeurs
- **Verbatim oral (40 s) :**
  > « Quel est le bénéfice réel de cette vue dynamique ? Côté festivalier, le gain est évident : il ne fait plus la queue. Mais côté architecture, le gain est colossal : en écrivant ce flux dynamique, nous avons immédiatement identifié que sans bus d'événements pour relier la préparation aux notifications, notre API bloquait. Nous avons validé la solidité du scénario avant même que les développeurs n'écrivent le moindre contrôleur d'API. L'architecture redevient un outil d'ingénierie précoce, pas un dessin post-mortem. »
- **Substance & Preuve :** Démontre la valeur concrète de l'approche As-Code : la vue dynamique n'est pas qu'un joli schéma, elle a servi d'outil d'ingénierie précoce pour valider les flux et révéler les briques indispensables avant le moindre commit applicatif.
- **Beat narratif :** Validation conjointe du bénéfice métier et du gain de modélisation logicielle.

### Slide 21 — Portail vivant — bénéfice
- **Fichier :** [presentation/src/slides/21-portail-vivant-benefice.html](presentation/src/slides/21-portail-vivant-benefice.html)
- **Contenu projeté :**
  - Deux panneaux côte à côte : *Vision Produit (PO & Métier)* (scénarios d'usage validés avec une compréhension simple de leurs mécanismes techniques, diagramme unique sans documents éparpillés, fin de l'effet boîte noire) vs *Ingénierie (Développeurs & Archi)* (flux et protocoles explicites avec besoins d'ouverture réseau, validation d'intégrité en CI, co-évolution Git).
  - Callout de synthèse en bas : *« Les diagrammes interactifs permettent d'éprouver et d'arbitrer le fonctionnement prévu du système et de le partager en équipe. »*
- **Action scénique :** Montrer alternativement le volet gauche (produit) et le volet droit (ingénierie) avec les mains, ton énergique et rassembleur.

- **Mots-clés :**
    - Un même modèle pour deux publics
    - PO : parcours lisible, diagramme unique sans éparpillement, fin de l'effet boîte noire
    - Devs : flux explicites et besoins d'ouverture, validation d'intégrité en CI, co-évolution Git
    - Éprouver, arbitrer et partager en équipe
- **Verbatim oral (35 s) :**
  > « Ce modèle unique répond à deux attentes : pour le Product Owner, c'est un parcours utilisateur limpide et un diagramme unique portant toutes les vues sans documents éparpillés ; pour les développeurs et architectes, ce sont des flux et protocoles explicites pour anticiper les ouvertures réseau, une validation d'intégrité en CI et une co-évolution dans Git au même rythme que le code applicatif. Les diagrammes interactifs permettent ainsi d'éprouver et d'arbitrer le fonctionnement prévu du système, et de le partager en équipe. »
- **Substance & Preuve :** Fin du cloisonnement documentaire : une seule source pour tous les niveaux d'abstraction.
- **Beat narratif :** Conclusion de l'Acte 2.

---

## Acte 3 : Collaboration, Revue & Diff Visuel (Slides 22 à 25)

### Slide 22 — Partie 3 (Intertitre)
- **Fichier :** [presentation/src/slides/22-partie-3.html](presentation/src/slides/22-partie-3.html)
- **Contenu projeté :**
  - Numéro : 03
  - Titre : *Collaborer*
  - Sous-titre : Quand le modèle évolue, la review devient visuelle.
- **Action scénique :** Ouvrir les bras vers la salle, poser le problème de l'échelle humaine et de l'équipe.

- **Mots-clés :**
    - Partie 3 : Collaborer
    - Passage à l'échelle : 20 devs, 3 architectes
    - Quand le modèle évolue, la review devient visuelle
- **Verbatim oral (10 s) :**
  > « Partie 3 : jusqu'ici, j'étais seul sur mon poste de travail. Mais comment fait-on quand nous sommes 20 développeurs, 3 architectes et plusieurs équipes qui modifient le système en parallèle ? »
- **Substance & Preuve :** Déplacement du sujet vers le travail d'équipe et la gouvernance.
- **Beat narratif :** Transition vers l'ingénierie collaborative.

### Slide 23 — Specs & arborescence
- **Fichier :** [presentation/src/slides/23-specs-amp-arborescence.html](presentation/src/slides/23-specs-amp-arborescence.html)
- **Contenu projeté :**
  - Titre : *Organiser le projet : séparer le socle commun des modèles métiers*
  - Arborescence ASCII resserrée à gauche : `projects/shared/` (spécifications réutilisables) et `projects/coffee-v2/` (implémentation du domaine), avec mise en évidence dynamique selon l'étape active.
  - Panneau à onglets à droite avec parcours automatique par étapes :
    - *Étape 1 (`system-model.c4`) :* le modèle métier instancie les conteneurs (`counterApp`, `orderService`, etc.).
    - *Étape 2 (`spec-containers.c4`) :* le socle partagé définit les types transverses, notations, icônes et styles.
- **Action scénique :** Avancer au clavier pour faire basculer l'onglet vers `spec-containers.c4` et observer la synchronisation instantanée du badge actif dans l'arborescence à gauche.

- **Mots-clés :**
    - Rigueur logicielle : séparation socle / modèles métiers
    - Étape 1 model : l'équipe projet instancie les briques
    - Étape 2 spec : shared/ définit le vocabulaire d'entreprise
    - 1 modif dans shared/ → tout le SI se recompile
- **Verbatim oral (50 s) :**
  > « On applique au modèle d'architecture la même rigueur qu'à une base de code partagée. Regardez d'abord l'onglet system-model.c4 : l'équipe projet écrit uniquement sa logique métier en instanciant des conteneurs. Maintenant, avançons d'un pas vers l'onglet spec-containers.c4 : dans ce dossier shared/, nous isolons les spécifications transverses de l'entreprise — ce qu'est une base de données sécurisée, une application mobile, la charte graphique et les icônes. Dans le projet, on ne redéfinit rien. Si demain la direction de la sécurité impose un nouveau standard ou que la charte visuelle change, on modifie une ligne dans le socle partagé, et l'ensemble des diagrammes du système d'information se recompilent automatiquement. »
- **Substance & Preuve :** Révèle comment modulariser et factoriser un référentiel d'architecture comme une bibliothèque logicielle.
- **Beat narratif :** Rigueur d'ingénierie et passage à l'échelle.

### Slide 24 — Questions de review
- **Fichier :** [presentation/src/slides/24-questions-de-review.html](presentation/src/slides/24-questions-de-review.html)
- **Contenu projeté :**
  - Titre : *En revue, la question devient simple : qu'est-ce qui change dans l'architecture ?*
  - 3 cartes d'interrogation :
    - *01 Ce qui entre :* Quels nouveaux composants ou partenaires apparaissent ?
    - *02 Ce qui bouge :* Qui parle à qui après le changement ?
    - *03 Ce qui devient sensible :* Crée-t-on un point chaud, une boucle ou un couplage fort ?
- **Action scénique :** Rythmer les 3 questions en regardant différentes sections de la salle. Faire sourire la salle sur l'impasse des schémas graphiques.

- **Mots-clés :**
    - Fin du 'Binary files differ' des fichiers Visio/Draw.io
    - 1. Ce qui entre (nouveaux composants/partenaires)
    - 2. Ce qui bouge (dépendances réseau, protocoles)
    - 3. Ce qui devient sensible (couplages, boucles asynchrones)
- **Verbatim oral (45 s) :**
  > « Comment se déroule une revue d'architecture traditionnelle ? Qui parmi vous a déjà essayé de faire relire un diff d'architecture sur un fichier `.drawio`, un `.vsdx` ou une image PNG dans une Pull Request ? *(Sourire, attendre la réaction du public)* Git vous répond gentiment : "Binary files differ". C'est impossible à relire. Résultat : on finit en réunion de deux heures où l'on débat pendant 45 minutes pour savoir si la boîte doit être bleue ou grise. Quand l'architecture est du code, la revue se concentre sur trois questions factuelles : 1. Ce qui entre : quels nouveaux composants s'invitent dans notre périmètre ? 2. Ce qui bouge : qui parle à qui après le changement ? 3. Ce qui devient sensible : est-ce qu'on crée un point de contention ou une boucle asynchrone ? »
- **Substance & Preuve :** Formalisation de la grille d'analyse d'une revue d'architecture.
- **Beat narratif :** Problématisation du processus de review.

### Slide 25 — La pull request
- **Fichier :** [presentation/src/slides/25-la-pull-request.html](presentation/src/slides/25-la-pull-request.html)
- **Contenu projeté :**
  - Parcours intégré en 3 temps (pilotable au clavier ou au clic) :
    - *Étape 1 :* Diagramme Mermaid `gitGraph` interactif (zoom/pan) montrant la branche `feat/alefest_coffee_v2` divergeant de `main`, les commits `fix #1` et `fix #2` sur `main`, et le bouton `Ouvrir la PR`.
    - *Étape 2 :* Ouverture de la Pull Request directement positionnée sur l'onglet **Code C4** (`diff` du code source LikeC4).
    - *Étape 3 :* Bascule sur le **Diff visuel (slider)** avant/après manipulable en direct.
- **Action scénique :** Présenter d'abord la branche sur le GitGraph (Étape 1). Appuyer sur la touche suivante pour ouvrir la PR sur le diff de code C4 (Étape 2), commenter la concision des modifications. Appuyer à nouveau pour basculer sur le diff visuel et faire glisser le slider devant la salle (Étape 3).

- **Mots-clés :**
    - Étape 1 : GitGraph (branche feat/alefest_coffee_v2)
    - Étape 2 : Ouverture PR sur le Diff de code LikeC4
    - Étape 3 : Bascule sur le Diff visuel interactif avec slider
    - Relecture transverse : dev, archi, sécurité avant merge sur main
- **Verbatim oral (60 s) :**
  > « Et où pose-t-on ces questions ? Là où les développeurs travaillent déjà : dans la Pull Request. Regardez ce GitGraph : la branche feat/alefest_coffee_v2 porte les modifications du modèle. Avançons d'un cran : la Pull Request s'ouvre. Nous inspectons d'abord le code source LikeC4 : les développeurs retrouvent la syntaxe familière d'un git diff textuel. Avançons encore d'un cran : le bot d'automatisation LikeC4 a posté le diff visuel avant/après. L'architecte commente la ligne de dépendance, le tech lead valide les contrats d'API, et l'équipe sécurité inspecte les flux sortants avant de donner son feu vert pour fusionner sur main. »
- **Substance & Preuve :** Preuve tangible que l'architecture vit au cœur de GitHub/GitLab. La PR devient le lieu officiel de validation.
- **Beat narratif :** Intégration de l'architecture dans le flux naturel des développeurs.

---

## Acte 4 : Industrialisation & CI/CD (Slides 26 à 27)

### Slide 26 — Partie 4 (Intertitre)
- **Fichier :** [presentation/src/slides/27-partie-4.html](presentation/src/slides/27-partie-4.html)
- **Contenu projeté :**
  - Numéro : 04
  - Titre : *L'industrialisation*
  - Sous-titre : ADR, modèle, validation, rendu et publication à chaque push.
- **Action scénique :** Transition résolue vers l'automatisation.

- **Mots-clés :**
    - Partie 4 : L'industrialisation
    - Une documentation manuelle est une documentation morte
    - Automatiser toute la chaîne de production à chaque push
- **Verbatim oral (10 s) :**
  > « Partie 4 : une documentation que l'on doit régénérer à la main est une documentation condamnée à mourir. Voyons comment rendre cette chaîne totalement autonome. »
- **Substance & Preuve :** Annonce de la chaîne d'automatisation.
- **Beat narratif :** Passage au mode chaîne de production.

### Slide 27 — Le cycle de développement élargi à l'architecture
- **Fichier :** [presentation/src/slides/28-pipeline-ci-cd.html](presentation/src/slides/28-pipeline-ci-cd.html)
- **Contenu projeté :**
  - Diagramme de cycle de développement unifié à 4 phases avec double flux (Architecture en bleu, Code en or) :
    1. *Évolution (branche Git)* : `model.c4` + `ADR.md` aux côtés de `src/**`
    2. *Revue conjointe* : Pull Request unifiée (Diff de code + Bot Visual Diff LikeC4)
    3. *Intégration Continue (CI)* : Tests & build logiciel exécutés en parallèle de la validation LikeC4 CLI (intégrité, zéro relation orpheline)
    4. *Livraison Continue (CD)* : Déploiement applicatif en production et publication automatique du portail d'architecture vivant.
    5. *Aboutissement* : Zéro dérive documentaire (miroir de la production).
  - Note de preuve par l'exemple : tous les diagrammes interactifs projetés dans ce site de présentation sont directement issus d'un build LikeC4 produit en CI.
- **Action scénique :** Pointer les flux en parallèle sur la gauche, insister sur le pilier CI/CD et sur le fait que la présentation elle-même dogfoode ce pipeline.

- **Mots-clés :**
    - Cycle de développement élargi : l'architecture comme citoyen de premier rang du cycle logiciel
    - Même repo, même branche, même Pull Request pour devs et architectes
    - CI unifiée : likec4 check (intégrité) + tests unitaires
    - CD unifiée : likec4 build -o dist/ + déploiement applicatif
    - Preuve par l'exemple : la présentation utilise ce build CI
- **Verbatim oral (60 s) :**
  > « La clé de voûte de cette démarche, c'est l'intégration complète au cycle de développement : le cycle logiciel élargi. L'architecture n'est plus un exercice isolé sur un wiki ; elle devient un citoyen de premier rang du projet logiciel. Sur une même branche de feature, le modèle .c4 et l'ADR évoluent aux côtés du code applicatif. Dans la Pull Request, développeurs et architectes relisent ensemble l'implémentation et le diff visuel généré automatiquement. Dans la CI, LikeC4 valide l'intégrité avec likec4 check et compile le bundle web avec likec4 build en même temps que vos tests unitaires et votre build. Et la meilleure preuve : tous les diagrammes interactifs que vous manipulez dans ce site de présentation sont directement issus d'un build LikeC4 généré en CI. Ce que vous voyez sur cet écran, c'est exactement ce que votre CI publie. »
- **Substance & Preuve :** Démontre la convergence des pratiques de dev et d'architecture au sein de la même chaîne d'outillage (Git, PR, CI/CD).
- **Beat narratif :** L'architecture réconciliée avec le quotidien des équipes logicielles.

---

## Acte 5 : Bilan, Outillage & Conclusion (Slides 28 à 34)

### Slide 28 — Partie 5 (Intertitre)
- **Fichier :** [presentation/src/slides/29-partie-5.html](presentation/src/slides/29-partie-5.html)
- **Contenu projeté :**
  - Numéro : 05
  - Titre : *Et alors ?*
  - Sous-titre : Que retenir et comment repartir avec du concret.
- **Action scénique :** Sourire, marquer le début de la conclusion active.

- **Mots-clés :**
    - Partie 5 : Et alors ?
    - Prise de hauteur : que retenir de cette démarche ?
    - Comment démarrer concrètement dès lundi ?
- **Verbatim oral (10 s) :**
  > « Cinquième et dernière partie : prenons de la hauteur. Qu'avons-nous concrètement entre les mains, et comment démarrez-vous dès lundi ? »
- **Substance & Preuve :** Transition vers la prise de recul et les livrables à emporter.
- **Beat narratif :** Début de l'épilogue actif.

### Slide 29 — Mermaid vs LikeC4
- **Fichier :** [presentation/src/slides/32-vue-c2-likec4.html](presentation/src/slides/32-vue-c2-likec4.html)
- **Contenu projeté :**
  - Titre : *Pourquoi pas juste du Mermaid ? L'image face au modèle*
  - Parcours intégré en 2 temps (pilotable au clavier ou par le bouton `Vue LikeC4 ↗`) :
    - *Étape 1 :* Vue Mermaid avec code source `.mmd` et diagramme visuel zoomable.
    - *Étape 2 :* Bascule automatique sur la vue LikeC4 avec modèle `.c4` et cockpit interactif navigable en direct.
- **Action scénique :** Présenter d'abord la vue Mermaid (Étape 1). Appuyer sur la touche suivante pour basculer automatiquement sur la vue LikeC4 (Étape 2), démontrer la supériorité du graphe sémantique typé et manipuler le cockpit en direct devant l'audience.

- **Mots-clés :**
    - Étape 1 : Mermaid = croquis visuel ponctuel (aucun modèle sous-jacent)
    - Étape 2 : LikeC4 = graphe sémantique typé, 1 modif met à jour 20 vues
    - Livrable : une vraie app React autonome et navigable (cockpit vivant)
    - Multi-exports natifs : Mermaid, D2, PlantUML, PNG (zéro enfermement)
- **Verbatim oral (60 s) :**
  > « Une question revient systématiquement : "Pourquoi ne pas simplement écrire du Mermaid dans nos fichiers Markdown ?" Mermaid est un excellent outil pour faire un schéma d'appoint dans une issue ou un README. Mais Mermaid n'a aucun modèle sémantique sous-jacent : c'est une description visuelle pure. Si vous renommez un service, vous devez rouvrir vos 15 fichiers Mermaid pour corriger la chaîne de caractères à la main. Avançons d'un cran : basculons sur LikeC4. Ici, vous avez un graphe orienté et typé : une modification met à jour l'ensemble des vues sans risque d'incohérence. Et surtout, le livrable final n'est pas une image statique : c'est une application React complète, autonome et explorable au clic par toute votre équipe, avec liens vers le code et exports natifs en D2, PlantUML, Mermaid ou PNG. Vous n'êtes enfermés dans aucun format propriétaire. »
- **Substance & Preuve :** Comparaison objective et argumentée : démontre la supériorité du graphe sémantique typé et révèle le cockpit vivant React comme livrable logiciel d'entreprise.
- **Beat narratif :** Éclairage comparatif et ancrage du choix d'ingénierie.

### Slide 30 — Choisir LikeC4
- **Fichier :** [presentation/src/slides/33-choisir-likec4.html](presentation/src/slides/33-choisir-likec4.html)
- **Contenu projeté :**
  - Deux volets de conviction :
    - *Pourquoi LikeC4 ? (100% Open source, zéro enfermement) :* licences permissives (MIT/Apache), indépendance totale sans cloud obligatoire, interopérabilité native (D2, PlantUML, Mermaid, React) et souveraineté des données dans Git.
    - *Partage & dynamisme (Écosystème vivant & contributions) :* packs de spécifications mutualisés, intégration IDE/MCP/Copilot, retours de terrain et dynamique communautaire.
- **Action scénique :** Insister sur la souveraineté des données et l'outillage IA moderne (MCP).

- **Mots-clés :**
    - 1. 100% Open source (MIT/Apache), souveraineté, modèles dans Git
    - 2. Écosystème actif (packs cloud, extension VS Code)
    - 3. Outillage IA moderne : serveurs MCP pour Copilot
- **Verbatim oral (50 s) :**
  > « Pourquoi faire ce choix aujourd'hui ? D'abord, pour la souveraineté totale : LikeC4 est 100 % open source, sous licences permissives MIT et Apache. Aucun abonnement cloud, aucune fuite de vos topologies de production sur des serveurs externes. Vos modèles restent dans vos dépôts Git. Ensuite, pour sa compatibilité avec les outils d'aujourd'hui : LikeC4 propose des serveurs MCP pour connecter vos assistants IA. Un agent Copilot peut lire votre modèle, vous suggérer un refactoring ou vérifier la conformité d'une PR en interrogeant directement le compilateur LikeC4. »
- **Substance & Preuve :** Répond directement à la question « Pourquoi choisir cet outil précis plutôt qu'un outil propriétaire ? ».
- **Beat narratif :** Consolidation du choix technologique.

### Slide 31 — Généraliser la pratique
- **Fichier :** [presentation/src/slides/34-generaliser-la-pratique.html](presentation/src/slides/34-generaliser-la-pratique.html)
- **Contenu projeté :**
  - Titre : *Passer à l'échelle : legacy, réseau et gouvernance*
  - 3 pistes concrètes pour passer à l'échelle au-delà des besoins ponctuels :
    1. *Stratégie d'attrition & Strangler Fig :* modélisation ciblée des nouveautés et transformations, migration progressive au fur et à mesure sans tout réécrire.
    2. *Déploiement & topologie réseau :* raccordement de la logique applicative aux zones réelles (DMZ, App, Data) et calcul automatique des matrices de flux pare-feux.
    3. *Cadres d'entreprise (TOGAF & ArchiMate) :* urbanisation à l'échelle par réutilisation de code (spécifications partagées) et maintien à jour centralisé depuis Git.
- **Action scénique :** Désamorcer l'objection du "grand soir" avec un ton pragmatique et rassurant.

- **Mots-clés :**
    - Pas de grand soir : pattern Strangler Fig sur le legacy
    - Déploiement : cartographier zones (DMZ, App, Data) et VM
    - Calcul automatique des matrices de flux réseau et pare-feu
- **Verbatim oral (50 s) :**
  > « J'entends déjà la question légitime : "Alexis, ton stand café est neuf et propre. Mais comment fait-on quand on a 15 ans d'historique et un SI tentaculaire ?" Ne faites pas de grand soir. Appliquez le pattern Strangler Fig : ne modélisez pas tout votre existant. Modélisez uniquement les nouveaux périmètres et les frontières des services que vous transformez. De plus, LikeC4 supporte la modélisation des zones de déploiement (DMZ, App, Data) et des machines physiques : vous pouvez aller jusqu'à dériver automatiquement vos matrices de flux réseau et règles pare-feu depuis votre modèle. »
- **Substance & Preuve :** Démontre la scalabilité de la méthode pour des organisations complexes et du legacy.
- **Beat narratif :** Élargissement stratégique et vision à l'échelle.

### Slide 32 — Avant / Après
- **Fichier :** [presentation/src/slides/30-avant-apres.html](presentation/src/slides/30-avant-apres.html)
- **Contenu projeté :**
  - Titre : *Ce qui change*
  - Grille comparative en 3 piliers :
    1. *Source de vérité & évolution :* Visio/Confluence redessinée à la main vs Modèle unique `.c4` dans Git refactorable.
    2. *Revue & collaboration :* Validation tardive/informelle vs Diff visuel en PR et revue collective.
    3. *Cycle de vie & industrialisation :* Schémas exportés morts à 6 mois vs Pipeline CI/CD, portail vivant et copilote IA.
- **Action scénique :** Marquer le contraste en insistant sur chaque ligne, voix posée et convaincue.

- **Mots-clés :**
    - Source : dessin artisanal éparpillé → Modèle unique .c4 dans Git
    - Revue : validation tardive/informelle → Diff visuel en Pull Request
    - Cycle : image morte à 6 mois → Portail vivant compilé en CI/CD
- **Verbatim oral (45 s) :**
  > « Récapitulons ce que nous avons changé : Avant : des schémas éparpillés dans des outils de dessin, qu'il faut redessiner à chaque changement. Aujourd'hui : un modèle unique dans Git, refactorable avec le code applicatif. Avant : des revues d'architecture tardives ou informelles. Aujourd'hui : un diff visuel partagé et relu en Pull Request avant chaque mise en production. Avant : des images mortes au bout de six mois. Aujourd'hui : un portail vivant, compilé et testé automatiquement par la CI/CD. »
- **Substance & Preuve :** Récapitulatif à fort contraste des gains organisationnels : ce qui change concrètement au quotidien.
- **Beat narratif :** Résolution complète du problème initial et cristallisation de la conviction.

### Slide 33 — Ressources
- **Fichier :** [presentation/src/slides/35-ressources.html](presentation/src/slides/35-ressources.html)
- **Contenu projeté :**
  - Titre : *Pour démarrer*
  - Parcours linéaire en 3 rangées horizontales immersives :
    1. *01 S'inspirer · Retex :* article comparatif *Le repas de famille des outils* sur dev.to/onepoint.
    2. *02 Manipuler · Hands-on :* démo de C4 avec LikeC4 sur `c4-hands-on-demo` (cas d'étude complet et templates).
    3. *03 Approfondir · Docs :* portail officiel `likec4.dev` (DSL, extension VS Code, CI/CD).
  - Citation conclusive en pied de slide préparant la conclusion.
- **Action scénique :** Présenter les trois étapes comme un plan d'action prêt à l'emploi.

- **Mots-clés :**
    - 1. S'inspirer : article Dev.to (Le repas de famille des outils)
    - 2. Manipuler : repo c4-hands-on-demo prêt à forker
    - 3. Approfondir : documentation officielle likec4.dev
- **Verbatim oral (40 s) :**
  > « Pour démarrer dès lundi avec votre équipe, voici votre feuille de route en trois étapes : 1. S'inspirer : retrouvez mon article complet sur Dev.to, qui compare l'ensemble des solutions de Diagram as Code et détaille les retours d'expérience. 2. Manipuler : le dépôt GitHub c4-hands-on-demo contient tout ce que vous avez vu aujourd'hui — le modèle AleFest Coffee V1 et V2, les scripts et le pipeline. Vous le clonez, et vous testez en local en 5 minutes. 3. Approfondir : rendez-vous sur likec4.dev pour installer l'extension VS Code avec la prévisualisation en direct. »
- **Substance & Preuve :** Plan d'action concret en 3 temps, immédiatement actionnable dès la sortie de salle.
- **Beat narratif :** Transmission et mise en mouvement.

### Slide 34 — Merci
- **Fichier :** [presentation/src/slides/34-merci.html](presentation/src/slides/34-merci.html)
- **Contenu projeté :**
  - Titre : *Merci !*
  - Message de conclusion : *Ne dessinez plus vos architectures : codez-les*
  - Badges : Architecture, Diagram as code, C4 Model, LikeC4
  - Signature : Alexis Scolan — Architecte technique
  - QR Code menant directement à la présentation publique en ligne.
- **Action scénique :** Regarder l'ensemble de la salle, voix chaleureuse et affirmée, pointer le QR Code.

- **Mots-clés :**
    - Punchline finale : Ne dessinez plus vos architectures : codez-les !
    - Support complet via QR Code
    - Place aux questions / réponses
- **Verbatim oral (30 s) :**
  > « Retenez une seule chose : la meilleure documentation d'architecture, c'est celle qui évolue au même rythme que vos systèmes. Ne dessinez plus vos architectures : codez-les ! Vous retrouverez l'ensemble de cette présentation et des liens en scannant ce QR code. Merci à tous pour votre attention, et je réponds avec grand plaisir à vos questions ! »
- **Substance & Preuve :** Appel final aux questions / réponses et mise à disposition immédiate du support complet.
- **Beat narratif :** Fermeture de la conférence sur la punchline initiale.

---

## Résumé en une phrase

La conférence montre, sur le cas **AleFest Coffee**, comment partir d’un **besoin métier formalisé en ADR**, le transformer en **modèle C4 versionné**, en produire des **vues statiques et dynamiques**, puis intégrer ces artefacts dans un **workflow de review visuelle et de portail vivant**.

---

