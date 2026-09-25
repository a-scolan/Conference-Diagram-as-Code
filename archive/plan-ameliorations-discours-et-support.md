# Plan d'Améliorations du Support & Conduite du Discours Oral

> **Document opérationnel d'alignement pour la conférence « Ne dessinez plus vos architectures : codez-les ! »**  
> Intègre l'historique des retours de répétition ([Retours de conf.md](Retours%20de%20conf.md)), les contraintes ergonomiques ([bilan-design-mobile.md](bilan-design-mobile.md)), et la triple grille critique `simple-english` (éradication du slop & clarté factuelle), `writing-beats` (ancrage & rythme unitaire) et `writing-shape` (justification de chaque écran).

---

## 1. Synthèse Thématique des Modifications Requises

### Thème 1 : Cadrage & Posture de l'Orateur (Fin du « Je », Règle Nicolas)
- **Le problème constaté :** L'orateur démarre en parlant de lui (*« Chez Onepoint je fais ceci, j'aime cela... »*), ce qui consomme l'attention initiale sans poser l'enjeu. De plus, les sachants (architectes seniors) bloquent sur les choix d'implémentation (RabbitMQ, Postgres) au lieu d'écouter la démarche d'outillage.
- **Actions sur le support :**
  - **Slide 00 (Titre) :** Remplacer le sous-titre générique par la promesse directe : *« L'architecture logicielle comme livrable vivant, versionné et testé en équipe. »*
  - **Slide 01 (Speaker) :** Réduire la surface visuelle du CV. Conserver 3 puces factuelles (Rôle terrain, SI complexes, alignement dev/archi) et traverser l'écran en 20 secondes.
- **Ajustement du discours oral :**
  - **Attaque directe sans « Je » :** Ouvrir par le problème de la salle : *« Dans chaque équipe technique, le code avance tous les jours pendant que la documentation d'architecture meurt dans un coin. L'objectif aujourd'hui : aligner la carte avec le terrain. »*
  - **La frontière fondatrice (Nicolas) :** Énoncer explicitement : *« Précisons un point clé : nous ne sommes pas réunis pour débattre de la conception du système d'AleFest Coffee. Nous sommes ici pour observer comment des décisions d'architecture s'écrivent, se relisent en Pull Request et s'automatisent. »*

---

### Thème 2 : Pédagogie C4 & Intronisation de l'Outil (Retour Yohann)
- **Le problème constaté :** Le public comprend des profils variés (développeurs, tech leads, mais aussi agilistes, Scrum Masters et Product Owners). Le C4 risque d'être perçu comme une énième lubie académique s'il n'est pas justifié par un gain d'équipe immédiat. De plus, LikeC4 était nommé trop tardivement.
- **Actions sur le support :**
  - **Slide 06 (C4 Zoom) :** Mentionner immédiatement **LikeC4** en étiquette haute pour que le public sache quel outil motorise les rendus.
  - **Slide 07 (Image mentale) :** Conserver la métaphore Google Maps en grand format : elle décomplexe les agilistes qui ont peur de l'UML.
- **Ajustement du discours oral :**
  - **Pourquoi C4 ? :** Expliquer le problème des schémas « fourre-tout » : *« Aujourd'hui, un schéma classique met sur le même plan un bouton d'écran, un conteneur Docker et un cluster Kubernetes. Personne ne sait à quel niveau d'abstraction il parle. C4 pose quatre niveaux de zoom clairs : le Contexte (C1) pour le Product Owner, les Conteneurs (C2) pour l'équipe de dev. »*

---

### Thème 3 : Repositionnement de l'IA (Retour Nicolas)
- **Le problème constaté :** Mentionner l'IA ou Copilot trop tôt ou trop fort fait dériver la conférence : l'auditoire pense assister à un pitch d'IA générative et guette les hallucinations, perdant de vue le cœur du sujet (le modèle textuel et sa compilation).
- **Actions sur le support :**
  - **Slide 11 (ADR-001 / Replay) :** Titrer *« Du texte métier au modèle »* plutôt que de mettre en avant « Génération IA ». L'encart Copilot replay reste un support secondaire de preuve d'accélération.
  - **Slide 33 (Ressources) :** Garder les extensions IA/skills pour le volet « Pour aller plus loin ».
- **Ajustement du discours oral :**
  - Démystifier en une phrase : *« L'IA n'est pas le pilote de l'architecture. Elle sert uniquement de copilote de saisie pour transcrire une note d'intention en quelques lignes de DSL. La décision et la validation restent 100 % entre les mains des humains. »*

---

### Thème 4 : Lisibilité, Zooms & Respiration du Live Coding (Retours Yohann & Taba)
- **Le problème constaté :** Slides trop denses sur petit écran ou fond de salle, code trop petit, débit trop rapide lors des transitions IDE / navigateur, manque de contact visuel pendant la démo.
- **Actions sur le support :**
  - **Slides de code (12, 14, 17, 19, 23) :** Taille de police calée au minimum à 13–14 px avec fort contraste de syntaxe.
  - **Slide 17 (Live coding launcher) :** Ne pas dépendre d'un switch d'écran risqué : le bouton ouvre directement le diff sur fond de diapositive avec les lignes vertes visibles du fond de salle.
  - **Slide 23 (Arborescence & specs) :** Remplacer le pavé triple par des onglets clairs (Spec vs Modèle) pour éliminer les barres de défilement multiples.
- **Ajustement du discours oral :**
  - **Poser la voix et lever la tête :** Quand l'écran change vers du code, marquer 4 secondes de silence. Laisser la salle lire le titre avant de parler.
  - **Pointer une seule zone à la fois :** Ne jamais commenter tout le fichier d'un coup. Annoncer la ligne : *« Regardez la ligne 12 : l'ajout du `notificationService`. C'est tout ce qui change dans notre modèle. »*

---

### Thème 5 : Refonte des Slides de Bilan & Fin de Session (Tableau vs Cartes)
- **Le problème constaté :** La slide 30 (Tableau comparatif Avant / Après) et la slide 32 (Vue C2 LikeC4 vs Mermaid) souffrent d'un effet d'essoufflement : le tableau 12 cases est trop verbeux à lire, et la slide 32 donne l'impression de revenir en arrière après la conclusion.
- **Actions sur le support :**
  - **Slide 30 (Avant / Après) :** Transformer le tableau dense en 3 fiches de confrontation binaires à fort contraste (01 Source unique Git, 02 Revue en PR, 03 Compilation CI/CD).
  - **Slide 31 & 32 (Ordre de fin) :** Utiliser la slide 32 (LikeC4 manipulé en direct) comme le bouquet final interactif (« le cockpit vivant »), avant d'afficher les QR codes de ressources (33) et de feedback (34).
- **Ajustement du discours oral :**
  - En slide 30, scander les trois victoires : *« Nous avons troqué un PNG mort contre un fichier Git. Nous avons remplacé une réunion de débat subjectif par un diff de Pull Request. Nous avons transformé un wiki abandonné en un portail compilé à chaque push. »*

---

## 2. Analyse Critique Approfondie par Compétence

### A. Épuration Factuelle & Anti-Slop (`simple-english`)
1. **Élimination des faux superlatifs :**
   - Remplacer *« architecture vivante et palpitante »* par *« architecture compilée et navigable »*.
   - Remplacer *« intégration fluide et transparente »* par *« communication asynchrone par messages AMQP »*.
   - Remplacer *« garantit une robustesse sans précédent »* par *« bloque les ruptures de contrat à la compilation »*.
2. **Structure des phrases pour l'orateur :**
   - Appliquer la règle : **Action $\to$ Acteur $\to$ Conséquence mesurable**.
   - Mauvais : *« Il est intéressant de voir que la vue de séquence permet aux équipes de mieux appréhender les cinématiques complexes. »*
   - Épuré : *« Cette vue dynamique montre au Product Owner où intervient le festivalier et à quel moment le barista reçoit l'alerte. »*

### B. Progression par Battements Unitaires (`writing-beats`)
Chaque diapositive doit correspondre à **un seul battement dramatique** :

```
[Accroche]
  Beat 01 (Slide 02) : Constat d'abandon de la doc (La douleur)
  Beat 02 (Slide 04) : La limite du dessin Draw.io (L'impasse)
  Beat 03 (Slide 05) : Les 3 principes As-Code (L'hypothèse)
  Beat 04 (Slide 06-07) : Le C4 et la métaphore Google Maps (Le cadre)

[Démonstration V1]
  Beat 05 (Slide 10-11) : L'ADR comme étincelle (L'intention)
  Beat 06 (Slide 12) : 10 lignes de LikeC4 font un C1 (La première preuve)
  Beat 07 (Slide 13-14) : Zoom C2 sans redessiner (La continuité hiérarchique)

[Épreuve V2 & Live Diff]
  Beat 08 (Slide 16) : L'évolution métier mobile (Le défi)
  Beat 09 (Slide 17) : Le diff textuel en direct (Le point culminant technique)
  Beat 10 (Slide 19) : La séquence dynamique sur modèle statique (La complétude)
  Beat 11 (Slide 20-21) : Le bénéfice utilisateur final (La justification humaine)

[Industrialisation & Gouvernance]
  Beat 12 (Slide 23) : Le partage des specs en bibliothèque (Le passage à l'échelle)
  Beat 13 (Slide 24-25) : La Pull Request et son graphe Git (Le quotidien des devs)
  Beat 14 (Slide 28) : Le pipeline CI/CD automatisé (L'absence d'effort résiduel)

[Atterrissage & Passage de relais]
  Beat 15 (Slide 30) : Le bilan avant/après (La conviction emportée)
  Beat 16 (Slide 31-32) : La navigation dans le cockpit (L'expérience concrète)
  Beat 17 (Slide 33-34) : Le template prêt à l'emploi (L'appel à l'action)
```

### C. Tension & Justification Visuelle (`writing-shape`)
- **Éviter le ventre mou aux slides 08–10 :** La transition vers la Partie 1 enchaînait trois diapositives de contextualisation sans technique (Partie 1 $\to$ Fil rouge $\to$ Cas d'étude). 
  - *Correction de rythme :* Passer la slide 08 en 5 secondes, combiner oralement le fil rouge et le cas d'étude (slides 09 et 10) en moins d'une minute, pour poser l'ADR (slide 11) dès la 5ᵉ minute de conférence.
- **Alternance Visuelle / Orateur :** Les diapositives de citation (callouts géants des slides 03, 07, 18, 21, 26) servent de **coupe-circuit visuel**. Elles forcent le public à détacher les yeux de l'écran pour écouter l'orateur. Il ne faut pas les lire : il faut les laisser en arrière-plan pendant qu'on parle à la salle les bras ouverts.

---

## 3. Conduite Orale Pas à Pas : Dynamique Scène & Support

### Phase 1 : L'Accroche & Le Choc Réel (Minutes 00 à 07 · Slides 00 à 07)
- **Objectif de phase :** Faire admettre à 100 % de la salle que leur méthode actuelle de documentation est en faillite, sans blesser personne.
- **Comportement orateur :** Debout au centre, pas d'ordinateur devant soi, télécommande en main.
- **Ce qui se passe à l'écran :**
  - Slide 02 : Deux colonnes contrastées. L'orateur demande : *« Levez la main si vous avez déjà vu un schéma d'architecture devenir faux en moins de trois mois. »* Attendre que les mains se lèvent.
  - Slide 04 : Affichage du schéma Draw.io touffu. Pause. *« Vous avez tous déjà produit ce dessin. Il est soigné. Mais ajoutez un service demain : vous passez votre vendredi à redessiner les flèches. »*
  - Slide 07 : Grande citation Google Maps. Poser la métaphore avec calme et assurance.

### Phase 2 : Du Texte à la Première Carte (Minutes 07 à 18 · Slides 08 à 14)
- **Objectif de phase :** Prouver la rentabilité immédiate : écrire quelques lignes de code produit un résultat plus puissant qu'un dessin manuel.
- **Comportement orateur :** Se rapprocher du pupitre pour la première interaction avec l'iframe LikeC4.
- **Ce qui se passe à l'écran :**
  - Slide 11 : Le Markdown de l'ADR à gauche, le prompt à droite. *« Tout commence par une décision écrite, pas par un tableau blanc. »*
  - Slide 12 : Montrer le C1 généré. Cliquer sur l'iframe pour zoomer et déplacer le diagramme. La salle doit comprendre que ce n'est pas une image PNG, mais un canvas vectoriel calculé.
  - Slide 14 : Zoom C2. Montrer la relation `extend alefestCoffee` dans le code.

### Phase 3 : L'Évolution V2 & Le Climax Technique (Minutes 18 à 30 · Slides 15 à 21)
- **Objectif de phase :** Le moment de vérité : faire vivre une rupture d'architecture en quelques modifications de code.
- **Comportement orateur :** Ralentir délibérément le tempo. Respirer. Parler distinctement.
- **Ce qui se passe à l'écran :**
  - Slide 16 : Comparatif V1 comptoir vs V2 mobile. Établir le gain métier : libérer le festivalier de la file d'attente.
  - Slide 17 : Cliquer sur `Live coding`. Montrer le diff vert. **Prendre le temps.** *« Regardez ces lignes vertes : l'application mobile, le Notification Service, la file AMQP. Rien n'a été redessiné. Le graphe s'est reconfiguré tout seul à la compilation. »*
  - Slide 19 : Dérouler la vue dynamique en trois temps (Commande $\to$ Préparation $\to$ Notification push).

### Phase 4 : L'Intégration d'Équipe & La Pull Request (Minutes 30 à 38 · Slides 22 à 28)
- **Objectif de phase :** Convaincre les décideurs, architectes et tech leads : montrer comment la méthode s'insère dans la gouvernance réelle.
- **Comportement orateur :** Posture d'ingénieur logiciel chevronné.
- **Ce qui se passe à l'écran :**
  - Slide 23 : Montrer le dossier `shared/`. Expliquer la séparation entre le standard d'entreprise et le domaine métier.
  - Slide 25 : Diagramme Mermaid GitGraph. Pointer la branche `feat/alefest_coffee_v2`. Cliquer sur le bouton *Ouvrir la PR* si le timing est bon pour montrer l'onglet GitHub avec les commentaires de diff.
  - Slide 28 : Suivre le pipeline CI/CD de gauche à droite. Souligner le `Visual diff` : le bot GitHub qui commente la PR avec l'image avant/après.

### Phase 5 : L'Atterrissage & L'Appel à l'Action (Minutes 38 à 45 · Slides 29 à 34)
- **Objectif de phase :** Donner envie de tester dès le lendemain et laisser une impression d'évidence méthodologique.
- **Comportement orateur :** Revenir sur l'avant de la scène, voix chaleureuse et mobilisatrice.
- **Ce qui se passe à l'écran :**
  - Slide 30 : Les trois piliers de contraste Avant / Après. Les parcourir sans lire les détails.
  - Slide 32 : Manipulation finale du portail LikeC4 en plein écran. Montrer la recherche globale, les métadonnées et la navigation par clic.
  - Slide 33 & 34 : Affichage des QR Codes (template prêt à cloner + support en ligne). Lancer la formule finale :  
    *« Ne perdez plus votre énergie à redessiner vos architectures : écrivez-les, testez-les, et faites-les vivre dans vos dépôts de code. Merci à tous ! »*

---

## 4. Checklist Technique & Logistique de Scène

- [ ] **Affichage :** Navigateur en plein écran réel (`F11`), résolution écran projeté testée (16:9 sans rognage).
- [ ] **Contraste :** Thème de présentation réglé sur un contraste élevé lisible même en salle éclairée.
- [ ] **Onglets de secours :** Deux onglets déjà ouverts en arrière-plan : la Pull Request GitHub #1 et le portail LikeC4 local (`localhost:3000`), au cas où un iframe refuserait de charger.
- [ ] **Minuteur :** Smartphone posé à plat au pied de l'écran avec minuterie dégressive de 45 minutes et alertes visuelles à 15 min, 30 min et 40 min.
- [ ] **Bouteille d'eau :** Placée sur le pupitre, accessible pour boire une gorgée lors de la transition vers la Partie 2 (slide 15) et la Partie 4 (slide 27).
