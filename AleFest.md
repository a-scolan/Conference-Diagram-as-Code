# ☕🎪 AleFest Coffee — Fiche d'identité du projet

## Concept
Stand de café artisanal au festival AleFest. Le système gère les commandes et la file d'attente pour que les festivaliers n'aient pas à poireauter devant le comptoir.

**Tagline :** *"Don't miss the show for a shot of espresso"*

---

## Objectif pédagogique (conférence)

Ce système est conçu pour illustrer **3 étapes clés** du Diagram-as-Code en live :

| Démo | Objectif | Ce qu'on montre |
|------|----------|-----------------|
| **Demo 1** — C1 Context | Extraire un modèle d'un ADR | Vision métier : acteurs + système |
| **Demo 2** — C2 Containers (V1) | Détailler l'implémentation | Vue statique + vue séquence synchrone |
| **Demo 3** — PR Evolution (V2) | Prouver la valeur du as-code | Diff visuel V1→V2, ajout de l'asynchronisme |

Le fil rouge est simple : **V1 est synchrone et couplé**, **V2 introduit un broker de messages** pour découpler commande et préparation. Ce delta est le cœur du diff visuel en Demo 3.

---

## ADR-001 : Digitaliser le stand café

```markdown
# Contexte
Le stand café du festival AleFest souffre de 3 problèmes :
- File d'attente physique : les festivaliers bloquent 15 min et ratent des concerts
- Pas de visibilité sur le temps d'attente
- Baristas débordés sans priorisation ni suivi des commandes

# Décision
Créer un système de prise de commande numérique au comptoir avec :
- Une borne/tablette pour saisir les commandes (staff ou self-service)
- Un écran barista affichant la file de préparation	
- Un backend simple gérant commandes et file d'attente

# Contraintes
- Le système doit fonctionner sur un réseau local festival (pas de cloud)
- Les baristas doivent pouvoir marquer une commande "prête" en un tap
- Le festivalier attend au comptoir (V1 = synchrone)
```

---

## Architecture V1 — "Le Comptoir" (synchrone)

### Principe
Le festivalier **commande et attend sur place**. Tout passe par un backend unique. Le flux est synchrone : la commande est créée, affichée au barista, préparée, puis le festivalier est appelé.

### Schéma C1 — Contexte

```
┌────────────┐                    ┌────────────┐
│ Festivalier│──── commande ────▶│  AleFest   │◀──── prépare ────│ Barista │
│            │                    │   Coffee   │                  │         │
└────────────┘                    └────────────┘                  └─────────┘
```

**Acteurs :**
- **Festivalier** : commande un café au comptoir
- **Barista** : prépare les commandes dans l'ordre de la file

**Système :**
- **AleFest Coffee** : gère la prise de commande et la file d'attente

### Schéma C2 — Containers

```
┌──────────────────┐              ┌──────────────────┐
│   Counter App    │              │  Barista Screen   │
│  (SPA - Tablette │              │  (SPA - Écran     │
│   au comptoir)   │              │   derrière bar)   │
└────────┬─────────┘              └────────┬──────────┘
         │ HTTP (REST)                     │ HTTP (polling)
         │                                 │
     ┌───▼─────────────────────────────────▼───┐
     │            Coffee Service               │
     │  (API Node.js — commandes + file)       │
     └─────────────────┬───────────────────────┘
                       │ SQL
                 ┌─────▼──────┐
                 │ PostgreSQL │
                 │ (commandes,│
                 │  file)     │
                 └────────────┘
```

### Composants V1

#### **Counter App** (SPA — tablette au comptoir)
- Carte des cafés (espresso, latte, filter...)
- Saisie de commande (choix + personnalisation)
- Affichage du numéro de commande et de la position dans la file
- Écran d'attente : "Commande #42 — 3ème dans la file"

#### **Barista Screen** (SPA — écran derrière le bar)
- File des commandes en attente (FIFO)
- Détail de chaque commande (boisson, extras)
- Action : marquer "en préparation" / "prêt"
- Compteur de commandes traitées

#### **Coffee Service** (API Node.js)
- `POST /orders` — créer une commande
- `GET /orders/queue` — liste la file d'attente
- `PATCH /orders/:id/status` — mettre à jour le statut (pending → preparing → ready → picked_up)
- `GET /orders/:id` — consulter une commande
- Logique de file FIFO simple
- Responsable de tout : commandes, file, statuts

#### **PostgreSQL**
- Table `orders` : id, items, status, created_at, updated_at
- Table `menu_items` : id, name, category, price
- Statuts : `pending` → `preparing` → `ready` → `picked_up`

### Flux V1 — Scénario synchrone

```
1. 👤 Festivalier choisit un latte sur la borne
2. 📱 Counter App → POST /orders → Coffee Service
3. 💾 Coffee Service enregistre en base, status = "pending"
4. 🖥️ Barista Screen polling GET /orders/queue → voit la commande
5. ☕ Barista tap "en préparation" → PATCH status = "preparing"
6. ✅ Barista tap "prêt" → PATCH status = "ready"
7. 📢 Counter App affiche : "Commande #42 PRÊTE !"
8. 👤 Festivalier récupère son café au comptoir
```

### Limitations V1
- ⏳ Le festivalier **attend au comptoir** sans pouvoir profiter du festival
- 🔄 Le Counter App fait du **polling** pour savoir si c'est prêt (gaspillage)
- 🏗️ Le **Coffee Service fait tout** : commandes, file, statuts → monolithe
- 📵 Pas de notification push → le festivalier doit surveiller l'écran

---

## ADR-002 : Commander depuis son téléphone

```markdown
# Contexte
V1 fonctionne mais les festivaliers se plaignent :
- Ils ratent des concerts à cause de la file au comptoir
- Ils ne savent pas quand leur café sera prêt
- Aux pics (entre deux concerts), la file devient ingérable

# Décision
Permettre la commande mobile avec notification push :
- Le festivalier commande depuis l'app festival (système externe) sur son téléphone
- Il reçoit une notification quand son café est prêt
- Il vient récupérer au comptoir sans avoir fait la queue

# Impact architectural
- Intégration avec le **Système Festival** (externe) : app mobile + service partenaire
- Découpage du monolithe : séparer Order Service et Preparation Service
- Nouveau composant : Message Broker (RabbitMQ) pour découpler commande/préparation
- Nouveau service : Notification Service pour les push notifications
- Le flux devient asynchrone : commander ≠ attendre
```

---

## Architecture V2 — "Le Café Mobile" (asynchrone)

### Principe
Le festivalier **commande depuis son téléphone et part écouter le concert**. La commande est publiée dans une queue. Le barista la traite quand il peut. Le festivalier est notifié quand c'est prêt. **On passe du synchrone au event-driven.**

### Schéma C2 — Containers

```
┌───────────────────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Système Festival (externe)    │   │   Counter App    │   │  Barista Screen   │
│  Festival App → Service Fest  │   │  (SPA - Tablette │   │  (SPA - Écran     │
└───────────┬───────────────────┘   │   au comptoir)   │   │   derrière bar)   │
            │ HTTPS (API partenaire)└────────┬─────────┘   └────────┬──────────┘
            │                                 │ HTTP                  │ WebSocket
            │                                 │                       │
┌───────────▼─────────┐               ┌──────▼──────────┐    ┌──────▼──────────┐
│     Order Service   │               │  Preparation    │    │  Notification   │
│     (commandes)     │               │    Service      │    │    Service      │
└───────────┬─────────┘               └──────┬──────────┘    └──────┬──────────┘
            │                                 │                       │
            └─────────┬───────────────────────┴───────────────────────┘
                      │
                 ┌────▼─────┐
                 │ RabbitMQ │
                 │ Event Bus│
                 └────┬─────┘
                      │
               ┌──────▼──────┐
               │ PostgreSQL  │
               └─────────────┘
```

### Delta V1 → V2 (ce que montre le diff)

```diff
🟢 NEW:  Système Festival (externe)   — app mobile + service partenaire
🟢 NEW:  RabbitMQ (Event Bus)         — découple commande et préparation
🟢 NEW:  Notification Service         — push notifications vers mobile
🟡 SPLIT: Coffee Service →  Order Service + Preparation Service
🟡 MOD:  Barista Screen               — passe de polling HTTP à WebSocket
```

### Nouveaux composants V2

#### **Système Festival (externe)**
**Festival App** (Mobile — festivalier)
- Carte des cafés avec photos
- Commande en un tap depuis n'importe où dans le festival
- Suivi en temps réel : "en file" → "en préparation" → "prêt !"
- Push notification : "☕ Votre latte est prêt ! Pickup au stand café"

**Service Festival** (API partenaire)
- Point d'entrée des commandes café côté festival
- Appelle `Order Service` (création + statut)
- Auth partenaire (JWT / token d'intégration)

#### **Order Service** (extrait de Coffee Service)
- `POST /orders` — créer une commande
- `GET /orders/:id` — consulter le statut
- Publie l'événement `order.placed` dans RabbitMQ
- Écoute `order.ready` pour mettre à jour le statut

#### **Preparation Service** (extrait de Coffee Service)
- Écoute `order.placed` → ajoute à la file barista
- Gère la file de préparation (FIFO avec priorité)
- Publie `order.preparing` et `order.ready`
- Alimente le Barista Screen en WebSocket

#### **Notification Service** (nouveau)
- Écoute `order.ready` → envoie push notification au festivalier
- Écoute `order.preparing` → notification "on prépare votre café"
- Canal : Firebase Cloud Messaging ou WebSocket direct

#### **RabbitMQ** (Event Bus)
- Queue `orders.placed` → consommée par Preparation Service
- Queue `orders.status` → consommée par Notification Service
- Garantit la livraison des messages même si un service est momentanément down

### Événements V2

```
order.placed      → {orderId, items[], customerId, timestamp}
order.preparing   → {orderId, baristaId, estimatedTime}
order.ready       → {orderId, pickupPoint}
order.picked_up   → {orderId, timestamp}
```

### Flux V2 — Scénario asynchrone

```
1.  📱 Festivalier choisit un flat white dans l'app mobile du festival
2.  📤 Festival App → Service Festival (API)
3.  📤 Service Festival → POST /orders → Order Service
4.  💾 Order Service enregistre, publie event "order.placed" → RabbitMQ
5.  📱 Service Festival retourne la confirmation à l'app
6.  📱 Festival App affiche : "Commande #42 reçue ! On vous notifie."
7.  👤 Festivalier retourne écouter le concert 🎵
8.  ☕ RabbitMQ → Preparation Service reçoit "order.placed"
9.  🖥️ Barista Screen affiche la commande (WebSocket push)
10. ☕ Barista tap "en préparation" → event "order.preparing" → RabbitMQ
11. 📱 Notification Service → push : "☕ On prépare votre flat white !"
12. ✅ Barista tap "prêt" → event "order.ready" → RabbitMQ
13. 🔔 Notification Service → push : "Votre café est prêt ! Stand A"
14. 👤 Festivalier récupère son café, retour au concert 🎶
```

---

## Points de démonstration pour la conf

### **Demo 1 — C1 Context (10 min)**
**Objectif :** Extraire un modèle depuis l'ADR-001

- Partir de l'ADR-001 brut en Markdown
- Utiliser Copilot pour générer le modèle C1 LikeC4
- **Résultat :** Vue de contexte avec 2 acteurs + 1 système
- **Verbaliser :** "On a extrait la structure métier d'un texte libre. C'est le C1 : qui fait quoi, sans aucun détail technique."

### **Demo 2 — C2 Containers V1 (15 min)**
**Objectif :** Zoomer dans le système, montrer les briques techniques

**A. Vue statique (qui parle à qui)**
Montrer les 4 containers :
- 2 SPA (Counter App, Barista Screen)
- 1 service (Coffee Service)
- 1 base (PostgreSQL)

**B. Vue séquence (comment ça marche)**
Flow synchrone : Commande → Coffee Service → Barista Screen → Prêt

**Points clés à verbaliser :**
- "4 containers, c'est simple. Mais on voit déjà : Counter App fait du polling. Coffee Service fait tout. C'est un monolithe déguisé."
- "Cette vue séquence montre que le festivalier attend tout le long. Le flow est bloquant."

### **Demo 3 — PR & Evolution V2 (10 min)**
**Objectif :** Prouver la valeur du Diagram-as-Code avec le diff V1→V2

**A. Créer la branche**
```bash
git checkout -b feat/mobile-ordering
```

**B. Modifier le modèle LikeC4 (assisté par Copilot)**
- Ajouter Festival App, RabbitMQ, Notification Service
- Splitter Coffee Service → Order Service + Preparation Service
- Modifier les relations (polling → WebSocket, direct → via broker)

**C. Montrer le diff visuel**
Le public voit immédiatement :
- Les nouveaux éléments en vert
- Les relations modifiées en jaune
- L'ajout du broker au centre du schéma
- "C'est exactement comme reviewer du code, mais pour l'architecture"

**D. Vue séquence V2**
Comparer visuellement le flow V1 (bloquant) et V2 (asynchrone) :
- V1 : le festivalier est impliqué du début à la fin
- V2 : le festivalier est libéré après l'étape 4

### **Demo 4 — Bonus (si temps) : CI/CD (3 min)**
- Pipeline qui publie les diagrammes en GitHub Pages à chaque merge
- "La doc d'architecture se déploie comme du code"

---

## Comparaison V1 vs V2

| Aspect | V1 "Le Comptoir" | V2 "Le Café Mobile" |
|--------|-------------------|---------------------|
| **Commande** | Au comptoir (borne) | Depuis le téléphone  |
| **Attente** | Sur place, devant le bar | Depuis n'importe où  |
| **Notification** | Écran partagé (polling) | Push notification |
| **Services backend** | 1 (Coffee Service) | 3 (Order, Preparation, Notification) |
| **Frontends** | 2 (Counter, Barista) | 3 (+Festival App mobile) |
| **Communication** | Synchrone (HTTP direct) | Asynchrone (RabbitMQ) |
| **Couplage** | Fort (monolithe) | Faible (event-driven) |
| **Événements** | 0 | 4 types |
| **Infra ajoutée** | — | RabbitMQ |

---

## Justifications techniques (pour les questions)

### Pourquoi un monolithe en V1 ?
- **Simplicité** : un seul service, une seule base, zéro overhead
- **MVP** : ça marche pour un festival à 1 stand café
- **Pédagogie** : montre le point de départ naturel avant d'introduire la complexité
- "Le monolithe n'est pas un anti-pattern. C'est un bon point de départ."

### Pourquoi RabbitMQ en V2 ?
- **Découplage** : Order Service n'a pas besoin de connaître Preparation Service
- **Résilience** : si le Notification Service est down, les messages sont bufferisés
- **Asynchrone** : la commande est confirmée instantanément, la préparation suit son rythme
- "C'est LE changement architectural clé. Tout le reste en découle."

### Pourquoi splitter Coffee Service ?
- **Single Responsibility** : prendre une commande ≠ préparer un café
- **Scalabilité** : on peut ajouter des baristas screen sans toucher à la prise de commande
- **Event-driven** : le split permet de placer le broker entre les deux

### Pourquoi PostgreSQL ?
- **Transactions** : éviter les commandes fantômes ou doublons
- **Simple** : pas besoin de NoSQL pour des commandes de café
- "On ne choisit pas sa base pour l'hype, mais pour le besoin"

---

## Tips pour le live coding

### Phrases d'accroche
- **Intro :** _"On va passer de 'schéma PowerPoint oublié' à 'documentation vivante'"_
- **C1 → C2 :** _"C1 c'est pour le PO. C2 c'est pour les devs."_
- **V1 → V2 :** _"Le festivalier ne devrait pas rater un concert pour un espresso."_
- **RabbitMQ :** _"Le broker, c'est le serveur du restaurant : il prend la commande et vous libère."_
- **PR Diff :** _"Imaginez reviewer une PR d'archi comme vous reviewez du code."_

### Gestion du timing
- **Si en avance :** ajouter un Stock Service (V3) qui alerte quand les grains de café sont bas
- **Si en retard :** garder Coffee Service monolithique en V2, ajouter juste le broker et la notification

### Gestion des questions pièges
**Q: "Pourquoi pas du serverless ?"**
→ _"Bonne question ! Lambda pourrait convenir pour Order Service. Mais ici l'objectif c'est montrer l'évolution architecturale, pas le choix d'infra."_

**Q: "RabbitMQ c'est pas overkill pour du café ?"**
→ _"Pour 4 events, oui. Mais c'est le pattern qui compte. En prod tu rajoutes analytics, billing, loyalty points... et là tu te dis merci RabbitMQ."_

**Q: "Pourquoi pas Kafka ?"**
→ _"Kafka c'est pour du streaming haute volumétrie. Ici on a 200 cafés/heure, pas 200 000. RabbitMQ suffit, et il est plus simple à expliquer en 5 min."_

**Q: "Et la sécurité ?"**
→ _"Bonne question ! En V2, chaque service peut gérer sa propre auth (JWT par exemple). En prod on rajoute HTTPS partout, secrets manager, rate limiting. Mais on n'est pas là pour faire du DevSecOps, on modélise l'architecture fonctionnelle."_
