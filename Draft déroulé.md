# Diagram as Code : Déroulé détaillé - Live Coding (45 min)

## 🎯 Objectif global

Montrer comment passer d'une décision architecturale (ADR textuelle) à une **cartographie vivante et navigable** via **LikeC4**, démontrant que le Diagram-as-Code réconcilie la modélisation avec l'implémentation.

**Cas d'étude**: AleFest Coffee - une évolution d'architecture de la V1 (synchrone au comptoir) à la V2 (mobile, event-driven et notifications push).

---

## 📋 Partie 0 : Introduction (5 min)

Slide d'accueil : mots clefs = Architecture as code, diagrammes, C4, Live coding.

### Se présenter
Alexis Scolan, architecte technique

Chez Onepoint, je travaille sur les sujets d'architecture technique : intégrer de nouvelles solutions à des systèmes d'information complexes, en participant à leur bonne gestion et cartographie, et en apportant l'innovation nécessaire pour rendre les systèmes compréhensibles, pas juste dessinés.

J'ai la conviction que les bonnes pratiques de code sont aussi applicables à la documentation technique, et que les outils de développement devraient être utilisés pour faire vivre nos architectures et documentations.
aime les modèles versionnés, diffables et utilisables en revue de code

Aujourd'hui, je vous le démontre sur un cas concret : AleFest Coffee, du texte d'ADR jusqu'au diagramme d'architecture interactif

L'encart speaker latéral n'est pas nécessaire.

### Contexte : Le problème réel

**Mise en scène** (slide + question audience):
Titre de la slide : **Point de situation**.
- "Qui a déjà fait un dessin pour expliquer un système ?"
- "Qui a vu ce dessin devenir obsolète 6 mois plus tard ?"

Formulation retenue : « ce PNG reflète l'état de notre système ».
Conclusion de la diapo (à cheval sur les deux colonnes) : « Le problème, ce n'est pas de dessiner. C'est de garder le sens vivant après l'export. »

**Le constat :**
- Une architecture née sur un tableau blanc → figée en PNG/SVG
- Le code évolue, la carte reste statique → **fossé croissant**
- La mise à jour du diagramme devient un coût caché → **vite abandonnée**
- Résultat : une dette de documentation acceptée comme fatalité

### Changer de paradigme

**Trois principes :**

1. Une source de vérité *unique* : le code du modèle
   - Versionné, diffable, auditable
   - Peut être généré par l'IA ou écrit à la main - et éventuellement, sur la base du code applicatif existant !

2. Des vues générées automatiquement à partir du modèle
   - Toujours à jour, cohérentes avec le modèle
   - Adaptées à différents publics (métier, architectes, devs)

3. Des outils intégrables au cycle de vie du projet
   - Génération dans la CI/CD
   - Visual Diffs dans les PRs

---

### Modélisation C4
présentation de la logique de modélisation C4 sur cet exemple

"Je vous emmène dans un voyage, du concept à la cartographie du système, du panorama à l'infiniment petit... Enfin juste vers des boites plus petites, mais on verra que ça fait toute la différence !" — C4, c'est le Google Maps de la modélisation.

#### Slide à ajouter : **C4 = le zoom intelligent de l'architecture**

**Intent de la slide** : faire comprendre en 20 secondes que C4 n'est pas "un diagramme", mais une suite de vues cohérentes.

**Contenu projeté (format 4 blocs)**

1. **C1 — Contexte**
  - Qui interagit avec le système ?
  - Frontière métier

2. **C2 — Containers**
  - Comment le système est construit ?
  - APIs, apps, bases, bus

3. **C3 — Components**
  - Qu'y a-t-il dans un container critique ?
  - Responsabilités techniques

4. **(Optionnel) Dynamique / Déploiement**
  - Comment ça s'exécute ? Où ça tourne ?

**Punchline speaker (bas de slide)**
> "C4, c'est Google Maps : même territoire, niveaux de zoom différents, sans perdre le sens."

**Note speaker (transition vers la démo)**
- "On part C1 depuis l'ADR pour aligner métier + périmètre."
- "Puis on zoome C2 pour rendre explicites les choix techniques."
- "Enfin on montre le comportement et les impacts de changement."

## 🎬 LIVE DEMO Partie 1 : Alefest Coffee


présentation du projet AleFest Coffee et son ADR [Alefest.md](AleFest.md)
présentation de la logique de modélisation C4 sur cet exemple

"Je vous emmène dans un voyage, du concept à la cartographie du système, du panorama à l'infiniment petit... Enfin juste vers des boites plus petites, mais on verra que ça fait toute la différence !" — C4, c'est le Google Maps de la modélisation.


### Contexte : L'ADR en Markdown

**Scénario** : On part d'une décision architecturale brute
Il  faudra ici
```markdown
# ADR-0006: Event-driven architecture pour AleFest Coffee V2

## Contexte
V1 permet de commander des boissons cafféinées au comptoir, mais les festivaliers doivent attendre au comptoir jusqu'à ce que leur commande soit prête. Cela crée des files d'attente et une mauvaise expérience utilisateur.
Les festivaliers doivent pouvoir être notifiés en temps réel lorsque leur commande est prête, afin qu'ils puissent profiter du festival pendant l'attente.

## Décision
Capitaliser sur l'architecture **asynchrone** avec **RabbitMQ**.
- Order Service reçoit les commandes
- Publication d'événements (order.placed, order.ready)
- Preparation Service écoute
- Notification Service envoie les push notifications

## Conséquences
✅ Festivaliers libérés dès la commande
✅ Meilleure scalabilité
❌ Complexité accrue (event sourcing)
```

### Action : Extraction et modélisation C1

**Éléments clés identifiés dans l'ADR :**
- **Acteurs** : Festivalier, Barista
- **Système** : AleFest Coffee
- **Interactions métier** : Commande, Notification, Préparation

**Code LikeC4 généré** (assisté par IA) :

```likec4
model {
  festivalier = Actor_Person 'Festivalier' {
    description '''
      Client du stand café au festival AleFest.
      
      V2: Commande depuis son téléphone, reçoit notification,
      vient récupérer quand c'est prêt.
    '''
  }

  barista = Actor_Staff 'Barista' {
    description '''
      Personnel du stand café.
      Consulte la file en temps réel (WebSocket).
      Prépare et marque comme "prêt".
    '''
  }

  alefestCoffee = System_New 'AleFest Coffee' {
    description '''
      Gestion de commandes pour stand café au festival.
      
      V2 - Architecture event-driven:
      - Commande mobile à distance
      - RabbitMQ pour communication asynchrone
      - Push notifications en temps réel
      - WebSocket pour mises à jour barista
    '''
  }
}
```

### Résultat : Vue de Contexte C1

**Vue générée automatiquement :**
- 2 acteurs (Festivalier, Barista)
- 1 système (AleFest Coffee)
- Relations claires (qui fait quoi)

**Validation avec le métier** : "Est-ce que ce périmètre correspond à ce qu'on veut ?"

**Avantage**: Même une ADR textuelle peut générer une visual 👍

---

## 🎬 LIVE DEMO Partie 2 : Containers (C2) + Comportements (15 min)
### Contexte : Affinage du modèle

On **"zoome"** à l'intérieur du système pour détailler les briques logicielles.

**Question de raffinage :**
- Quels services sont nécessaires ?
- Comment communiquent-ils ?
- Où réside la logique métier ?

### Action : Détail des Containers C2

**Briques logicielles identifiées :**

```
Frontend :
├── Festival App (React Native) → Commande mobile + notifications
├── Counter App (React/SPA) → Borne tactile (legacy V1)
└── Barista Screen (React/WebSocket) → Écran en temps réel

Backend :
├── Order Service → Reçoit commandes, publie event order.placed
├── Preparation Service → Écoute events, gère la file, publie order.ready
├── Notification Service → Consomme order.ready, envoie push FCM
├── Event Bus (RabbitMQ) → Découplage asynchrone
└── PostgreSQL → Persistance (commandes + menu)
```

**Code LikeC4 structurant le modèle** :

```likec4
model {
  alefestCoffee = System_New 'AleFest Coffee' {
    orderService = Container_Api 'Order Service'
    preparationService = Container_Api 'Preparation Service'
    notificationService = Container_Api 'Notification Service'
    eventBus = Container_Queue 'RabbitMQ'
    database = Container_Database 'PostgreSQL'

    orderService -[async]-> eventBus 'Publier order.placed'
    eventBus -[async]-> preparationService 'Consommer order.placed'
    preparationService -[async]-> eventBus 'Publier order.ready'
    eventBus -[async]-> notificationService 'Consommer order.ready'
  }
}
```

### Résultat : Deux vues complémentaires

#### Vue 1 : **Containers statique** (Qui parle à qui ?)
- Diagramme des services et leurs flux
- Relations synchrones vs asynchrones
- Cible : architecture/lead
- **Point clé** : Le diagramme expose le pattern event-driven

#### Vue 2 : **Sequence** (Scenario d'une commande)

**Scénario raconté** : 
1. Festivalier commande depuis son téléphone 📱
2. Order Service publie `order.placed` dans RabbitMQ
3. **Festivalier se libère → peut écouter le concert** 🎵
4. Preparation Service consomme l'événement
5. Barista voit la commande (WebSocket - temps réel, pas de polling)
6. Barista prépare et marque "prêt"
7. Notification Service envoie push FCM 📬
8. Festivalier vient récupérer ☕

**Contraste avec V1 :**
- V1 = Le festivalier attend au comptoir 😞
- V2 = Le festivalier profite du festival 😊

### Points d'apprentissage clés

1. **C2 expose la structure** : Chaque service a une responsabilité
2. **Relations sont explicites** : Synchrone, asynchrone, event-driven
3. **Vues multiples, source unique** : Une seule définition du modèle
4. **Les prédicats + propriétés** : Permettent différentes perspectives

---

## 🎬 LIVE DEMO Partie 3 : Collaboration & Architecture Diff (10 min)

### Contexte : Une évolution demandée

**Nouveau besoin** (ADR-0007) :
> "Les commandes VIP doivent être prioritaires. Ajouter un service Priority Queue."

**Question** : Comment démontrer l'impact du changement visuellement ?

### Action : Modification du modèle

On ajoute un nouveau container et une relation :

```likec4
alefestCoffee = System_New 'AleFest Coffee' {
  // ... autres services ...
  
  priorityQueueService = Container_Service 'Priority Queue' {
    technology 'Node.js, Redis'
    description 'Trie les commandes (standard vs VIP)'
  }

  preparationService -[consumes]-> priorityQueueService 'Commandes triées'
  notificationService -[publishes]-> priorityQueueService 'Metadata VIP'
}
```

### Résultat : Pull Request & Visual Diff

**Simulation d'une PR GitHub** :
- Changements dans `system-model.c4`
- Génération automatique d'une **Visual Diff** 🎨

**Ce que montre le diff** :
```
🔴 Lien supprimé : preparationService -[consumes]-> eventBus
🟢 Lien ajouté : preparationService -[consumes]-> priorityQueueService
🟢 New container: Priority Queue Service
```

**Impact visible** :
- Les architectes voient immédiatement ce qui change
- Les validations de logique sont possibles
- La revue de code devient une revue visuelle 👁️

**Exemple de questions que ça répond :**
- "Est-ce que ça crée une cyclo dans les dépendances ?"
- "Qui consomme ce nouveau service ?"
- "Y a-t-il d'autres impacts ?"

---

## 🎯 Partie 5 : Bilan & conclusion (5 min)

### Synthèse

**Le journey complet démontré** :

1. ✅ **ADR brute** (decision textuelle) → **C1 (Vue Contexte)**
   - Le métier valide le périmètre

2. ✅ **Raffinement structurel** → **C2 (Vue Containers)**
   - Les architectes déterminent les briques et patterns

3. ✅ **Comportement détaillé** → **Vues Sequence**
   - Les développeurs comprennent le flow d'exécution et les UX impacts

4. ✅ **Collaboration** → **Visual Diffs dans les PRs**
   - La revue humaine est facilitée par le visuel
   - L'IA peut générer, les humains valident

### Le paradoxe réconcilié

| | Avant (PNG statique) | Après (Diagram-as-Code) |
|---|---|---|
| **Vérité unique** | ? (Où est la source ?) | Code = source unique |
| **Mise à jour** | Coût élevé (re-dessiner) | Coût zéro (refactor code) |
| **Validation** | Texte + PNG (ambigu) | Visual + Diffs (clair) |
| **Versionning** | Git ignore le diagramme | Git track le modèle |
| **CI/CD** | Manuel | Automatisé |
| **IA génération** | Sketch 2D difficile | Code facile ✅ |

### Appel à action

**Fini les gribouillis obsolètes : compilons la documentation** 🚀

Idées à retenir : 
- un diagramme propre est focalisé sur un objectif (Modélisation C4)
- un diagramme focalisé est plus facile à maintenir et peut être généré à partir de la source de vérité (code du modèle)
- un diagramme généré evolue avec le projet, et peut être intégré dans les processus de développement, être produit en collaboration, et peu être validé par les humains grâce à des visual diffs et des builds pour les PR

A vous de jouer pour faire vivre vos architectures !

### Ressources pour approfondir
- Allez essayer **LikeC4** : https://likec4.dev
- Fork un repo démo : https://github.com/a-scolan/c4-hands-on-demo
- Lancez vous avec un template de modélisation C4 avec LikeC4 : https://github.com/a-scolan/c4-template
- Lire l'article **« Diagram as Code en 2025 : Le repas de famille des outils »** sur dev.to : https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp

 Ajouter le QR Code de OpenFeeback (très important, en grand et bien visible malgré sa transparence png) ![alt text](image.png)

### Et derrière pour l'avenir 
- génération de diagramme à partir d'une base de code existante (plans Helm, Azure et AWS services ?)
- intégration de projets entre eux et création d'une base de diagramme interconnectés ?
- automatiser au maximum la création de diagramme à partir de l'ADR, et faire en sorte que les humains n'aient plus qu'à valider et ajuster les détails (ex: description, propriétés) ?
- utiliser le diagramme comme source de vérité pour les évolutions d'architecture et d'infrastructure et planifier des travaux ?
- une implémentation des diagrammes archimate en LikeC4, avec ses skills pour automatiser par IA ? Mettre en relation du TOGAF ? => plus de standardisation, faciliter l'accès au framework complexe
- vos idées ?

### Q&A (10 min)

---

## 📚 Annexe : Références du projet AleFest

### Fichiers clés dans le repo

- **Modèle V1** : `likec4/projects/alefest-v1/system-model.c4`
  - Architecture synchrone, monolithe
  
- **Modèle V2** : `likec4/projects/alefest-v2/system-model.c4`
  - Architecture asynchrone, event-driven
  
- **Vues V2** : `likec4/projects/alefest-v2/system-views.c4`
  - Vue Contexte C1
  - Vue Containers C2
  - Vue Sequence (Scénario de commande)
  - Vue Event-Driven Pattern
  - Vue Evolution Frontends

### Pattern démontrés
- **V1** : Polling, Monolithe, Synchrone
- **V2** : Event-driven, Microservices, Asynchrone, WebSocket, Push notifications

---

## Diagram as Code  

Notes: 
A  main levé : Qui a déjà fait un dessin pour expliquer un système ? Du code ? 

---
## Pourquoi dessiner

Exprimer les éléments pour transmettre une idée structurée du sujet
syntaxe (structure) + sémantique (relations de sens)

---
### Comment bien dessiner

Modèle de Shannon & Weaver
Cerveau humain limité en attention et bande passante.
Jusque là c'est l'humain qui limite, notre capacité à saisir la complexité et y porter de l'attention est limitée par l'humain, pas encore par la machine

Deux contraintes : le temps et la complexité
⇒ maximiser la richesse sémantique = transmettre beaucoup de sens, en économisant le medium et les opportunités pour le "bruit" d'altérer le message
⇒ mettre en valeur et hiérarchiser les éléments importants du message  = limiter la charge d'interprétation

*Ce que l'on conçoit bien s’énonce clairement,*
*Et les mots pour le dire arrivent aisément*
Nicolas Boileau

---
###  Un compromis

négatif: 
	Reproduction de l'existant
	Maintien dans le temps
	Coût supplémentaire aux actes de conception
	Oblige à accorder une confiance à l'objet documentaire, qui fait intermédiaire à la source de vérité 
	
positif:
	Transmettre devient répétable et améliorable
	Anticiper les difficultés structurelles
	Abstraire

--- 
### La méthode classique

![[Draft déroulé-20260227023111.png]]

- "Le problème, ce n'est pas de dessiner. C'est que dès qu'on exporte en PNG, l'information meurt. Elle devient statique."
- "En 2025, on n'accepte plus de gérer notre infrastructure manuellement, pourquoi accepte-t-on encore de cliquer pour créer des schémas ?"
---
### Les outils existants 

![[Projects/OnePoint/Évènements/Le diagram as code en 2025/.assets/Le diagram as code en 2025-20251216091835.png]]
[Diagram as Code en 2025 : Le repas de famille des outils - DEV Community](https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp)

---
#### Comparatif

![[Draft déroulé-20260227022553.png]]

--- 


