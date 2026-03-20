# Déroulé de la conférence — version fidèle aux slides

Source : `presentation/public/presentation-diagram-as-code.html`

Ce document reprend le **déroulé réel de la conférence tel qu’il apparaît dans les slides** du deck HTML, dans l’ordre de présentation.

---

## Ouverture

### 0. Arrivée sur scène

**Texte possible :**

> Bonjour à toutes et à tous.
>
> Merci d’être là, et merci aux organisateurs et à Onepoint
>
> C'est un vrai plaisir de partager ce sujet avec un public étendu, hors du cadre des réunions du quotidien. 
> Parce que l'architecture, c'est typiquement le genre de sujet qui réunit vite une grande diversité de profils. Mais rarement pour parler de la méthode de travail, seulement du contenu.
> Et c'est justement ce qui va nous intéresser : comment faire vivre une architecture, qu'on puisse la partager, la faire évoluer, et qu'elle ne finit pas oubliée dans un dossier ou un wiki.
>
> Avec l'ambition de vous faire interroger quelques façons de travailler bien ancrées.

**Intention orale :**
- Saluer la salle et installer une adresse directe aux personnes présentes.
- Introduire le sujet sans dévoiler trop tôt le fond de la démonstration.
- Préparer une transition fluide vers le titre **« Ne dessinez plus vos architectures : codez-les ! »**.

### 1. Titre
**Slide :** _Ne dessinez plus vos architectures : codez-les !_

- Atlantique Day 2026
- Alexis Scolan
- Angle de la session : architecture + diagram as code

**Intention orale :**
- Ouvrir avec une promesse claire et provocatrice.
- Poser immédiatement l’idée centrale : un diagramme d’architecture ne devrait pas être un livrable figé, mais un artefact vivant, versionné et exploitable.

### 2. Speaker
**Slide :** _Alexis Scolan_

- Architecte technique chez onepoint
- Sujet : architecture, intégration d'applicatifs, documentation des systèmes
- Focus : architecture vivante
- Format : démo et coding

**Intention orale :**
- Se positionner rapidement.
- Expliquer que le sujet n’est pas « faire de jolis schémas », mais **faire vivre une source de vérité** compréhensible par plusieurs publics.

### 3. Le problème réel
**Slide :** _Qui a déjà fait un dessin pour expliquer un système ?_

- Qui l’a vu devenir obsolète six mois plus tard ?
- Qui sait encore où est la bonne version ?
- Qui ose encore dire qu’un PNG reflète l’état réel du système ?
- La mise à jour devient un coût caché.
- Cette dette documentaire finit par être acceptée comme une fatalité.

**Message clé :**
> Le problème, ce n’est pas de dessiner. C’est de faire vivre la connaissance dans le temps.

### 4. Changer de paradigme
**Slide :** _Trois principes pour une architecture vivante_

1. **Une unique source de vérité**
   - Une sémantique complète pour représenter clairement le système.
2. **Des perspectives multiples**
   - Contexte, containers, comportements : plusieurs vues, un seul système.
3. **Un vrai cycle de vie**
   - CI/CD, PR, review, build : la documentation devient un livrable à part entière.

**Transition :**
- On ne va pas juste parler de théorie.
- On va dérouler un cas concret, du besoin jusqu’au portail vivant.

### 5. Fil rouge
**Slide :** _Le cas d’étude_

**Cas choisi :** AleFest Coffee

- Un stand café fictif mais réaliste.
- Suffisamment simple pour être lisible.
- Suffisamment riche pour montrer l’évolution d’une architecture.

**Roadmap annoncée :**
1. Partir d’un **ADR** et modéliser un système général avec l’aide de l’IA.
2. Détailer au **niveau C2** pour rendre le système compréhensible.
3. Raconter le comportement avec un **diagramme dynamique**.
4. Terminer par une **PR** et un **portail interactif** qui vivent avec le code.

### 6. C4 zoom
**Slide :** _C4 = un découpage simple de vos architectures_

- **C1 — Contexte** : avec quoi interagit ce système ?
- **C2 — Containers** : comment le système fonctionne-t-il ?
- **C3 — Components** : comment se compose un container ?
- **C4 — Code** : quelles classes / quels modules implémentent les composants ?
- **Optionnel — Dynamique / Déploiement** : comment ça s’exécute, où ça tourne ?

**Punchline :**
> C4, c’est Google Maps : un même territoire, plusieurs niveaux de zoom, sans perdre la cohésion.

---

## Partie 1 — De l’ADR au modèle

### 7. Intertitre partie 1
**Slide :** _De l’ADR au modèle_

- AleFest Coffee
- Besoin métier → vue de contexte validable

**Rôle dans le déroulé :**
- Annoncer le premier mouvement de la démo.
- Montrer qu’on part d’un besoin et non d’un schéma vide.

### 8. Cas d’étude
**Slide :** _AleFest Coffee : vendre vite, servir mieux_

- Stand café en festival, avec pics de commandes entre deux concerts.
- V1 : commande au comptoir, attente sur place.
- V2 : commande depuis le téléphone, notification quand c’est prêt.

**Message clé :**
- Le diagramme doit raconter à la fois la **structure** du système et la **promesse métier** : libérer le festivalier pendant l’attente.

### 9. V1 vs V2
**Slide :** _V1 vs V2_

#### V1 — Le comptoir
- Commande via **Application Comptoir**.
- **Service de Commandes** et **Service Préparation** déjà découplés en interne.
- **RabbitMQ** notifie l’équipe barista.
- Le festivalier reste captif au stand.

#### V2 — Le café mobile
- Intégration avec **l’app du festival** et le **Service Festival**.
- Ajout d’un **Notification Service**.
- **RabbitMQ** reste le socle événementiel.
- Le café devient une expérience fluide.

**Intention orale :**
- Montrer qu’on ne part pas de zéro : l’architecture évolue.
- Insister sur le changement de valeur métier, pas juste de techno.

### 10. ADR-001
**Slide :** _ADR-001 : digitaliser le stand café_

**Contenu présenté dans la slide :**
- Problèmes : file d’attente, manque de visibilité, baristas débordés.
- Décision : prise de commande numérique au comptoir.
- Contraintes : marquer une commande prête en un tap ; attente encore synchrone en V1.
- Conséquences : réduction de la file, meilleure visibilité, base pour une évolution mobile.

**Intention orale :**
- Montrer qu’on part d’un texte simple.
- Expliquer que l’ADR porte déjà assez de sens pour amorcer une modélisation.

### 11. C1 généré
**Slide :** _La spec devient une vue navigable du système…_

- À partir du début du modèle `projects/coffee-v1/system-model.c4`
- Apparition du périmètre **C1** de V1 :
  - `Festivalier`
  - `Barista`
  - `AleFest Café`
- Relations visibles :
  - le festivalier utilise le système pour commander au comptoir
  - le barista utilise le système pour préparer et suivre les commandes
- Les containers et les relations internes arrivent dans le zoom **C2**, juste après

**Message clé :**
- Le texte et la modélisation donnent une **vue navigable**, pas juste un dessin.

### 12. C1 / C2 détaillé
**Slide :** _… qui peut être détaillée_

- Même modèle source
- Nouvelle vue générée : C2
- On garde la cohérence entre le modèle et les vues

**Intention orale :**
- Insister sur la continuité : on ne refait pas le diagramme.
- On change simplement de niveau de zoom.

---

## Partie 2 — Containers & comportements

### 13. Intertitre partie 2
**Slide :** _Containers & comportements_

- C2, cas d’usage, évolution du diagramme

### 14. Briques C2
**Slide :** _On zoome dans le système et on explicite les briques_

**Question posée :**
- Quelles responsabilités logicielles portent l’expérience V2 ?

**Frontends**
- Festival App : commande mobile + push
- Counter App : compatibilité comptoir
- Barista Screen : file temps réel

**Services**
- Order Service : prise de commande
- Preparation Service : gestion de la file barista
- Notification Service : push Firebase

**Infrastructure**
- RabbitMQ : découplage événementiel
- PostgreSQL : persistance

**Intention UX**
- Le festivalier repart écouter le concert
- Le barista ne dépend plus du polling

**Message clé :**
- Une seule source sert ensuite à produire la vue statique, les flows et les diffs.

### 15. Code C2
**Slide :** _Le modèle V2 tient en DSL lisible_

**Idée mise en avant :**
- Le modèle `projects/coffee-v2/system-model.c4` reste compact et lisible.
- On y voit immédiatement :
  - les containers,
  - les responsabilités,
  - les relations synchrones et asynchrones.

**Intention orale :**
- Dédramatiser la modélisation as code.
- Montrer qu’on est plus proche d’un DSL métier que d’un fichier ésotérique.

### 16. Vue C2
**Slide :** _La vue C2 expose le pattern event-driven_

**Le diagramme montre :**
- Festivalier et Barista
- Frontends : Festival App, Counter App, Barista Screen
- Services : Order Service, RabbitMQ, Preparation Service, Notification Service
- Base de données PostgreSQL

**Flux visibles :**
- `POST /orders`
- WebSocket côté barista
- `order.placed`
- `order.ready`
- Push Firebase

**Message clé :**
- Le pattern event-driven devient visible immédiatement.

### 17. Flow mobile likeC4
**Slide :** _Le scénario mobile en likeC4 + aperçu C2_

**Scénario raconté dans le code :**
1. Le festivalier commande un cappuccino.
2. L’app appelle `Order Service`.
3. `Order Service` publie `order.placed`.
4. `Preparation Service` consomme l’événement.
5. Le barista reçoit la nouvelle commande en WebSocket.
6. `Preparation Service` publie `order.ready`.
7. `Notification Service` consomme l’événement.
8. L’app reçoit un push Firebase.

**Intention orale :**
- Faire le pont entre structure statique et comportement métier.

### 18. Séquence mobile
**Slide :** _Une vue comportementale raconte le gain utilisateur_

**Scénario détaillé :**
- Le festivalier commande depuis l’app du festival.
- Le Service Festival relaie vers `AleFest Coffee`.
- `Order Service` écrit en base et publie `order.placed`.
- `Preparation Service` alimente l’écran barista.
- Le barista passe la commande en préparation puis en prête.
- `Notification Service` envoie une notification à l’app.
- Le festivalier revient récupérer sa boisson.

**Message clé :**
- La vue comportementale ne raconte pas seulement des appels techniques.
- Elle raconte une **amélioration d’expérience utilisateur**.

### 19. Impact UX
**Slide :** _Avant / Après_

#### Avant — V1
- Temps mort subi
- Polling HTTP bruyant
- Le barista rafraîchit la file au lieu de la suivre en temps réel

#### Après — V2
- Attente transformée en **expérience libre**
- WebSocket côté barista, push côté festivalier
- Le flow technique rend visible un **gain métier immédiat**

**Transition :**
- On ne produit donc pas juste une vue de plus.
- On produit un support de discussion partagé entre métier, architecture et développement.

### 20. Portail vivant
**Slide :** _LikeC4 ne produit pas une image, mais une app_

- Navigation par clic
- Liens vers les fichiers du modèle
- Plusieurs publics, plusieurs lectures
- Une seule source
- Une “Google Map” du système plutôt qu’un screenshot figé

**Message clé :**
- Le modèle devient un **portail vivant**.

### 21. Live coding
**Slide :** _Le vrai repo AleFest, en direct_

- Démo du repo dans un Codespace
- Point d’appui : `projects/coffee-v2/system-model.c4` et `system-views.c4`
- Copilot peut accélérer l’amorçage
- La validation humaine garde la main sur le sens

**Intention orale :**
- Montrer que ce n’est pas une maquette hors-sol.
- Raccrocher les slides au vrai repo.

---

## Partie 3 — Collaboration & diff

### 22. Intertitre partie 3
**Slide :** _Collaboration & diff_

- Quand le modèle évolue, la review devient visuelle

### 23. Specs & arborescence
**Slide :** _Le repo sépare les spécifications partagées du modèle V2_

- À gauche : deux extraits de code, `spec-containers.c4` puis `system-model.c4`
- L’extrait de spec montre aussi que les types portent leur **notation** et leur **style visuel** (`shape`, `icon`)
- À droite : arborescence ASCII du dossier `projects/`
- Message : `shared` porte le vocabulaire commun ; `coffee-v2` porte le modèle métier concret

**Intention orale :**
- Montrer que la lisibilité ne tient pas qu'aux vues générées : elle tient aussi à l'organisation du repo.
- Préparer la transition vers le diff : quand c'est structuré, la review devient plus claire.

### 24. Questions de review
**Slide :** _La revue de code devient aussi une revue d’architecture_

**Questions mises en avant :**
- Quel nouveau service entre dans le jeu ?
- Qui parle à qui après le changement ?
- Crée-t-on un nouveau point chaud, une dépendance ou une boucle ?
- L’IA peut proposer ; les humains valident la logique.

**Intention orale :**
- Poser d’abord la vraie question de la review : **qu’est-ce qui change vraiment ?**
- Annoncer clairement ce que la PR devra rendre visible ensuite, d’un coup d’œil.

### 25. La pull request
**Slide :** _La pull request_

- Titre d'ouverture : **Revue d'architecture**
- Un badge **Open · PR #1** la rend identifiable instantanément
- Un diagramme Mermaid `gitGraph` plus GitHub-like montre la branche `v2_png` issue de `main`
- Le bloc Mermaid est volontairement plus zoomé pour que la branche de review domine visuellement
- Les labels de commits restent courts pour laisser lire la divergence et le commit repère
- Le bouton GitHub reste disponible en bas pour ouvrir directement le diff

**Intention orale :**
- Montrer que la PR répond précisément aux questions posées juste avant.
- Déplacer la discussion d’architecture dans le terrain naturel des équipes : la PR.
- Montrer que la review ne parle pas seulement de fichiers, mais d'une branche et d'une histoire de changements.

> Remarque : une partie “industrialisation / pipeline CI-CD” existe dans le HTML mais elle est commentée, donc non affichée dans la version actuelle des slides.

---

## Partie 5 — Bilan & conclusion

### 26. Intertitre partie 5
**Slide :** _Bilan & conclusion_

- Ce qu’on retient
- Ce qu’on embarque
- Comment repartir avec du concret

### 27. Avant / Après
**Slide :** _Le paradoxe réconcilié : avant / après_

| Sujet | Avant · PNG statique | Après · Diagram as Code |
|---|---|---|
| Source de vérité | Entre Visio, Confluence et les souvenirs | Le modèle `.c4` dans Git |
| Mise à jour | Il faut redessiner | On refactorise le code du modèle |
| Validation | Ambiguë, tardive | Vue générée, diff lisible, review partagée |
| Git / PR | Diagramme séparé du code | La PR expose l’intention architecturale |
| CI/CD | Manuel, fragile | Validation et publication automatisées |
| IA | Difficile de générer un schéma fiable | Facile d’amorcer du code de modélisation puis de le valider |

**Message clé :**
- Le diagram as code réconcilie lisibilité, collaboration, industrialisation et outillage moderne.

### 28. Ressources & QR
**Slide :** _Pour refaire ça chez vous_

**Ressources montrées :**
- `https://likec4.dev`
- `https://github.com/a-scolan/c4-hands-on-demo`
- `https://github.com/a-scolan/c4-template`
- `https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp`

**Élément visuel important :**
- QR code OpenFeedback pour recueillir les retours.

### 28. Merci / Q&A
**Slide :** _Merci !_

- Questions / réponses
- Message final :
  - Ne dessinez plus vos architectures
  - Codez-les
  - Versionnez-les
  - Publiez-les

**Ouverture finale :**
- Et ensuite ?
  - génération depuis le code existant,
  - graphes inter-projets,
  - davantage d’automatisation utile.

---

## Résumé en une phrase

La conférence montre, sur le cas **AleFest Coffee**, comment partir d’un **besoin métier formalisé en ADR**, le transformer en **modèle C4 versionné**, en produire des **vues statiques et dynamiques**, puis intégrer ces artefacts dans un **workflow de review visuelle et de portail vivant**.
