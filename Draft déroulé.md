# Diagram as Code : Déroulé détaillé - Live Coding (45 min)

## 🎯 Objectif global

Montrer comment passer d'une décision architecturale (ADR textuelle) à une **cartographie vivante et navigable** via **LikeC4**, démontrant que le Diagram-as-Code réconcilie la **vision métier** avec l'**implémentation technique**.

**Cas d'étude**: AleFest Coffee - une évolution d'architecture de la V1 (synchrone) à la V2 (event-driven).

---

## 📋 Partie 0 : Introduction (5 min)

### Se présenter

### Contexte : Le problème réel

**Mise en scène** (slide + question audience):
- "Qui a déjà fait un dessin pour expliquer un système ?"
- "Qui a vu ce dessin devenir obsolète 6 mois plus tard ?"

**Le constat :**
- Une architecture née sur un tableau blanc → figée en PNG/SVG
- Le code évolue, la carte reste statique → **fossé croissant**
- La mise à jour du diagramme devient un coût caché → **vite abandonnée**
- Résultat : une dette de documentation acceptée comme fatalité

### Changer de paradigme

**Trois principes :**

1. Une source de vérité unique : le code du modèle
   - Versionné, diffable, auditable
   - Peut être généré par l'IA ou écrit à la main - et éventuellement, sur la base du code applicatif existant !

2. Des vues générées automatiquement à partir du modèle
   - Toujours à jour, cohérentes avec le modèle
   - Adaptées à différents publics (métier, architectes, devs)

3. Des outils intégrables au cycle de vie du projet
   - Génération dans la CI/CD
   - Visual Diffs dans les PRs

---


## 🎬 LIVE DEMO Partie 1 : De l'ADR au Modèle (10 min)

---
TODO : quelques slide de présentation du projet AleFest Coffee (contexte métier, V1 vs V2)
Use case de commande

---

### Contexte : L'ADR en Markdown

**Scénario** : On part d'une décision architecturale brute

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
alefestCoffee = System_New 'AleFest Coffee' {
  
  // Frontends
  festivalApp = Container_MobileApp 'Festival App' {
    technology 'React Native, Expo, WebSocket'
    description 'Commande mobile + notifications push'
  }
  
  baristaScreen = Container_Spa 'Barista Screen' {
    technology 'React, TypeScript, WebSocket'
    description 'File en temps réel (WebSocket vs polling V1)'
  }

  // Services
  orderService = Container_Api 'Order Service' {
    technology 'Node.js, Express, RabbitMQ'
    description 'Réception commandes, publish order.placed'
  }

  preparationService = Container_Service 'Preparation Service' {
    technology 'Node.js, RabbitMQ consumer'
    description 'Écoute order.placed, gère file de préparation'
  }

  notificationService = Container_Service 'Notification Service' {
    technology 'Node.js, Firebase Cloud Messaging'
    description 'Envoie notifications push quand commande prête'
  }

  eventBus = Container_MessageBroker 'RabbitMQ' {
    technology 'RabbitMQ'
    description 'Découplage asynchrone entre services'
  }

  database = Container_Database 'PostgreSQL' {
    technology 'PostgreSQL 16'
    description 'Persistance commandes + menu'
  }

  // Relations (qui parle à qui)
  festivalApp -[async]-> orderService 'POST /orders'
  orderService -[publishes]-> eventBus 'order.placed'
  eventBus -[consumes]-> preparationService
  preparationService -[publishes]-> eventBus 'order.ready'
  eventBus -[consumes]-> notificationService
  notificationService -[async]-> festivalApp 'Push FCM'
}
```

### Résultat : Deux vues complémentaires

#### Vue 1 : **Containers statique** (Qui parle à qui ?)
- Diagramme des services et leurs flux
- Relations synchrones vs asynchrones
- Cible : architecture/lead
- **Point clé** : Le diagramme expose le pattern event-driven

#### Vue 2 : **Sequence** (Scenario d'une commande)

```
Festivalier          Festival App    Order Service    RabbitMQ    Prep Service    Notification    Barista
    |                    |                 |              |             |              |              |
    |--- Tap Commande--->|                 |              |             |              |              |
    |                    |-- POST /orders->|              |             |              |              |
    |                    |                 |-- publish -->|             |              |              |
    |                    |<-- 200 OK ------|              |             |              |              |
    |<-- Receipt --------|                 |              |             |              |              |
    |                    |                 |              |-> consume ->|             |              |
    |                    |                 |              |             |-- publish ->|              |
    | [Écoute concert]   |                 |              |             |             |-> FCM push --|
    |                    |                 |              |             |             |<-- Ack -----|
    |<-- Notification ---|<-- WebSocket ---|              |             |<-- Webhook-|              |
    |                    |                 |              |             |             |              |
    |-- Va chercher --->|                 |              |     [Order ready] <---|
    |                    |                 |              |             |             |              |-- ✅
    |<-- Cafe -----------|                 |              |             |             |              |
```

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

## 🎯 Conclusion (5 min)

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

- Allez essayer **LikeC4** : https://likec4.dev
- Fork le repo démo : https://github.com/a-scolan/c4-hands-on-demo
- Lire l'article : https://dev.to/onepoint/diagram-as-code-en-2025-le-repas-de-famille-des-outils-1gdp

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


