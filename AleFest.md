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

Le fil rouge est simple : **V1 structure déjà le domaine en services découplés en interne**, **V2 ouvre le système vers l'écosystème festival (mobile + notifications)**. Ce delta est le cœur du diff visuel en Demo 3.

---

## ADR-001 : Digitaliser le stand café

```markdown
# Status
Accepted

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
- Les baristas doivent pouvoir marquer une commande "prête" en un tap
- Le festivalier attend au comptoir (V1 = synchrone)

# Conséquences
- Réduit la file physique au comptoir
- Donne une meilleure visibilité aux baristas sur les commandes en cours
- Pose une base simple pour une évolution mobile ultérieure
```

---

## Architecture V1 — "Le Comptoir" (synchrone)

### Principe
Le festivalier **commande au comptoir et attend sur place**. Tout reste dans le périmètre du stand café. La coordination interne est assurée par événements (RabbitMQ), sans notification externe.

### Schéma C2 — Containers
voir LikeC4 V1

### Description concise (alignée sur les diagrammes LikeC4)

**Contexte (C1)**
- **Festivalier** : passe commande au comptoir
- **Barista** : prépare et met à jour les statuts
- **AleFest Café** : système interne du stand

**Containers (C2)**
- `Application Comptoir` (SPA)
- `Écran Barista` (SPA WebSocket)
- `Service de Commandes`
- `Service Préparation`
- `RabbitMQ` (bus d'événements)
- `PostgreSQL` (persistance)

**Flux fonctionnel V1 (résumé)**
1. Commande au comptoir via `Application Comptoir`
2. `Service de Commandes` crée la commande et publie `order.placed`
3. `Service Préparation` consomme l'événement et alimente l'écran barista en temps réel
4. Le barista fait évoluer le statut (`preparing`, `ready`)
5. Le festivalier récupère sa boisson au stand

**Limites V1**
- Pas d'intégration avec l'app mobile du festival
- Pas de notification push au festivalier
- Le retrait reste centré sur la présence physique au comptoir

---

## ADR-002 : Commander depuis son téléphone

```markdown
# Contexte
La V1 couvre correctement le flux comptoir, mais elle reste limitée :
- le festivalier doit rester proche du stand pour suivre sa commande
- il n'existe pas de canal de notification personnel
- le système AleFest Café n'est pas connecté à l'écosystème digital du festival

En parallèle, le festival dispose déjà d'un **Système Festival** externe
(application mobile + service backend partenaire) qui centralise les usages
des festivaliers.

# Décision
Faire évoluer l'architecture en V2 pour :
1. accepter les commandes depuis le **Système Festival** (externe)
2. conserver le parcours comptoir comme fallback
3. notifier le festivalier via l'application mobile officielle du festival

Le flux de notification retenu est le suivant :
- `Preparation Service` publie les événements métier (`order.preparing`, `order.ready`) dans RabbitMQ
- `Notification Service` consomme ces événements
- `Notification Service` envoie les push vers l'**Application Festival** (canal externe)

# Impact architectural
- Intégration explicite avec le **Système Festival** (Application Festival + Service Festival)
- Ajout d'un **Notification Service** dédié
- Contrat d'intégration partenaire (`POST /orders`, `GET /orders/:id`) entre Service Festival et Order Service
- Généralisation du pilotage par événements RabbitMQ entre services

# Conséquences
- Le festivalier peut commander et attendre hors du stand
- Le stand café reste opérationnel en mode comptoir si besoin
- La responsabilité des notifications est isolée (scalabilité et résilience)
- Dépendance maîtrisée à un système externe (festival), nécessitant un contrat d'API clair
```

---

## Architecture V2 — "Le Café Mobile" (asynchrone)

### Principe
Le festivalier **commande depuis son téléphone et part écouter le concert**. La commande est publiée dans une queue. Le barista la traite quand il peut. Le festivalier est notifié quand c'est prêt. **On passe du synchrone au event-driven.**

### Schéma C2 — Containers
voir LikeC4 V2

### Delta V1 → V2 (ce que montre le diff)

```diff
🟢 NEW:  Système Festival (externe)   — app mobile + service partenaire
🟢 NEW:  Notification Service         — push notifications vers mobile
🟡 MOD:  Order Service                — exposé au Service Festival + écoute order.ready
🟡 MOD:  Flux utilisateur             — commande mobile distante + retrait différé
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

#### **Order Service** (service de commande)
- `POST /orders` — créer une commande
- `GET /orders/:id` — consulter le statut
- Publie l'événement `order.placed` dans RabbitMQ
- Écoute `order.ready` pour mettre à jour le statut

#### **Preparation Service** (service de file barista)
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

### **Demo 0 — C1 Context (10 min)** --> déjà fait avant la conf car pas le temps
**Objectif :** Extraire un modèle depuis l'ADR-001

- Partir de l'ADR-001 brut en Markdown
- Utiliser Copilot pour générer le modèle C1 LikeC4
- **Résultat :** Vue de contexte avec 2 acteurs + 1 système
- **Verbaliser :** "On a extrait la structure métier d'un texte libre. C'est le C1 : qui fait quoi, sans aucun détail technique."

**A. Vue statique (qui parle à qui)**
Montrer les 6 containers :
- 2 SPA (Counter App, Barista Screen)
- 2 services backend (Order Service, Preparation Service)
- 1 bus d'événements (RabbitMQ)
- 1 base (PostgreSQL)

**B. Vue séquence (comment ça marche)**
Flow comptoir piloté par événements : Commande → order.placed → préparation → prêt

**Points clés à verbaliser :**
- "La V1 est déjà propre techniquement : services séparés, RabbitMQ, WebSocket côté barista."
- "Mais côté expérience, le festivalier reste captif du comptoir : c'est là que la V2 change la donne."

### **Demo 1 — PR & Evolution V2 (10 min)**
**Objectif :** Prouver la valeur du Diagram-as-Code avec le diff V1→V2

**A. Modifier le modèle LikeC4 (assisté par Copilot)**
- **Étape 1 (C1 uniquement) :**
	- Ajouter `Système Festival` au niveau contexte
	- Ajouter les relations système : `Festivalier → Système Festival` et `Système Festival → AleFest Café`
	- Afficher/rendre le diagramme C1 immédiatement (premier "wow")
- **Étape 2 (zoom C1 → C2) :**
	- Ouvrir la vue C2 d'AleFest Café
	- Montrer le point de raccordement `Service Festival ↔ Order Service`
	- Expliquer que la frontière externe est maintenant matérialisée dans les containers
- **Étape 3 (C2 incrémental) :**
	- Ajouter `Notification Service`
	- Ajouter les relations événementielles et push (`RabbitMQ → Notification Service → Festival App`)
	- Re-rendre la vue C2 après chaque ajout (pas de rendu en one-shot)

**C. Montrer le diff visuel**
Le public voit immédiatement :
- Le diff C1 d'abord (nouveau système externe + relations)
- Puis le diff C2 (notification + nouvelles relations d'intégration)
- Les nouveaux éléments en vert et les liens modifiés en jaune, étape par étape
- "C'est exactement comme reviewer du code, mais pour l'architecture"

**D. Vue séquence V2**

-> ceci est préparé en amont pour ne pas le coder à la va-vite

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
| **Notification** | Affichage local barista/comptoir | Push vers l'app festival |
| **Services backend** | 2 (Order, Preparation) | 3 (+Notification) |
| **Frontends** | 2 (Counter, Barista) | 3 (+Festival App mobile) |
| **Communication interne** | Event-driven (RabbitMQ) | Event-driven (RabbitMQ) |
| **Intégration externe** | Aucune | Oui (Service Festival partenaire) |
| **Couplage métier** | Découplé en interne, fermé sur le stand | Découplé + ouvert à l'écosystème festival |
| **Événements clés** | `order.placed`, `order.preparing`, `order.ready` | Même base + consommation dédiée notifications |
| **Infra ajoutée** | RabbitMQ + PostgreSQL | Notification Service + intégration Festival |

---

## Justifications techniques (pour les questions)

### Pourquoi une V1 déjà découplée mais locale ?
- **Simplicité opérationnelle** : architecture propre sans dépendance externe
- **Robustesse stand** : le système café continue même sans app festival
- **Pédagogie** : on distingue bien la différence entre découplage technique et valeur utilisateur
- "V1 est solide côté architecture interne, mais limitée côté parcours festivalier."

### Pourquoi conserver RabbitMQ en V2 ?
- **Découplage** : Order Service n'a pas besoin de connaître Preparation Service
- **Résilience** : si le Notification Service est down, les messages sont bufferisés
- **Évolutivité** : la V2 ajoute des consommateurs sans casser la chaîne existante
- "Le pivot V2, ce n'est pas d'ajouter RabbitMQ, c'est d'exploiter RabbitMQ pour l'expérience mobile."

### Pourquoi un Notification Service dédié ?
- **Responsabilité claire** : préparer un café ≠ notifier un utilisateur
- **Scalabilité** : les push peuvent évoluer indépendamment de la préparation
- **Intégration maîtrisée** : un seul point de contact avec l'application festival

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
- **Si en retard :** limiter la V2 à l'ajout du Système Festival + Notification Service

### Gestion des questions pièges
**Q: "Pourquoi pas du serverless ?"**
→ _"Bonne question ! Lambda pourrait convenir pour Order Service. Mais ici l'objectif c'est montrer l'évolution architecturale, pas le choix d'infra."_

**Q: "RabbitMQ c'est pas overkill pour du café ?"**
→ _"Pour 4 events, oui. Mais c'est le pattern qui compte. En prod tu rajoutes analytics, billing, loyalty points... et là tu te dis merci RabbitMQ."_

**Q: "Pourquoi pas Kafka ?"**
→ _"Kafka c'est pour du streaming haute volumétrie. Ici on a 200 cafés/heure, pas 200 000. RabbitMQ suffit, et il est plus simple à expliquer en 5 min."_

**Q: "Et la sécurité ?"**
→ _"Bonne question ! En V2, chaque service peut gérer sa propre auth (JWT par exemple). En prod on rajoute HTTPS partout, secrets manager, rate limiting. Mais on n'est pas là pour faire du DevSecOps, on modélise l'architecture fonctionnelle."_
