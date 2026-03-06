# ADR-001: Commander depuis son téléphone

## Statut
Accepté

## Contexte
V1 fonctionne mais les festivaliers se plaignent :
- Ils ratent des concerts à cause de la file au comptoir
- Ils ne savent pas quand leur café sera prêt
- Aux pics (entre deux concerts), la file devient ingérable
- Le polling HTTP gaspille de la bande passante

## Décision
Permettre la commande mobile avec notification push :
- Le festivalier commande depuis l'app festival sur son téléphone
- Il reçoit une notification quand son café est prêt
- Il vient récupérer au comptoir sans avoir fait la queue

## Impact architectural

### Nouveau frontend
- **Festival App** (React Native) : commande mobile avec push notifications

### Découpage du monolithe
- **Coffee Service V1** est splité en 2 services :
  - **Order Service** : gestion des commandes uniquement
  - **Preparation Service** : gestion de la file barista uniquement

### Nouveau composant event-driven
- **RabbitMQ** : message broker pour découpler commande et préparation
- **Notification Service** : envoi de push notifications Firebase

### Amélioration technique
- Remplacement du polling HTTP par WebSocket (Barista Screen)
- Communication asynchrone via events :
  - `order.placed` : nouvelle commande
  - `order.preparing` : commande en cours
  - `order.ready` : commande prête
  - `order.picked_up` : commande récupérée

## Conséquences

### Positives
- Meilleure expérience festivalier (peut profiter du concert)
- Scalabilité : chaque service peut scaler indépendamment
- Résilience : si Notification Service est down, les messages sont bufferisés dans RabbitMQ
- Temps réel : WebSocket élimine le polling

### Négatives
- Complexité accrue : 3 services au lieu de 1
- Infrastructure supplémentaire : RabbitMQ, Firebase
- Coûts opérationnels : plus de monitoring, logs, déploiements

### Risques
- Dépendance à Firebase pour les notifications
- Nécessité de gérer les tokens devices
- Complexité du debugging (flux asynchrone)

## Alternative considérée
Garder le monolithe et ajouter juste l'app mobile avec polling HTTP.

**Rejeté car :**
- Polling HTTP ne scale pas avec 1000+ festivaliers
- Pas de séparation de responsabilités
- Difficulté à maintenir un gros monolithe
