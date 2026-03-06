# ADR-0008: Reverse Proxy Capsule avec Routage Hostname A Priori

## Statut

Accepté

## Contexte

Tous les sites web hébergés doivent être accessibles sur le port 80 utilisant des hostnames distincts. Les hostnames et enregistrements DNS sont définis **a priori** (avant déploiement) mais la configuration du reverse proxy doit être appliquée dynamiquement. Les containers de sites web s'exécutent comme processus non-privilégiés, qui ne peuvent pas se binder aux ports inférieurs à 1024.

Nous avons besoin d'une couche de routage qui :
- Écoute sur le port 80
- Route les requêtes par hostname vers le container de site web correct
- Supporte le mapping dynamique de hostname à mesure que de nouveaux sites web sont déployés
- Ne nécessite pas de logique SSL ou authentification par site dans les containers
- Préserve LemonLDAP comme point d'entrée SSO et HTTPS

## Décision

Nous déploierons un **reverse proxy Capsule** sur la VM Capsule pour gérer le routage basé sur hostname sur le port 80.

### Architecture
- **LemonLDAP** reste le point d'entrée externe HTTPS + SSO (port 443) ; pré-configuré par l'équipe LemonLDAP avec virtual host, cert SSL, et règles d'accès
- **Reverse proxy Capsule** écoute sur le port 80 et route par hostname vers les containers de sites web
- **Containers de sites web** écoutent sur le port 8080 (HTTP uniquement)
- **Enregistrements DNS et hostnames** sont définis a priori par les architectes système
- **Configuration du reverse proxy** (mappings hostname → port du container) est appliquée dynamiquement par l'agent OpenVox pendant le déploiement de site web en utilisant le reload graceful (pas de downtime)
- **Agent OpenVox** applique les mises à jour de configuration du reverse proxy Capsule dans le cadre du déploiement (utilise un volume de config monté)

## Conséquences

### Conséquences Positives
- **Routage cohérent** : Les hostnames et DNS sont stables et gérés centralement
- **Containers plus simples** : Pas de SSL dans les containers ; HTTP uniquement
- **Sécurité non-privilégiée** : Les containers restent sur le port 8080 ; port privilégié 80 géré par le proxy
- **Mises à jour proxy automatisées** : L'agent OpenVox gère la configuration du reverse proxy Capsule pendant le déploiement (pas de mises à jour proxy manuelles par site web)
- **Reload graceful** : Nginx supporte le reload sans downtime ; nouveaux sites web configurables sans interruption de service
- **Propriété claire** : DNS/hostnames possédés par les architectes ; config LemonLDAP possédée par l'équipe LemonLDAP ; config proxy Capsule automatisée par l'agent

### Conséquences Négatives
- **Hop supplémentaire** : Ajoute un hop reverse-proxy interne sur Capsule
- **Blocage LemonLDAP** : La configuration LemonLDAP est manuelle et bloquante—le déploiement de site web ne peut pas procéder jusqu'à ce que LemonLDAP soit prêt (ne peut pas être parallèle)
- **Gestion du proxy** : Le reverse proxy Capsule devient un composant à monitorer et maintenir

### Conséquences Neutres
- Le plan agent OpenVox reste l'endroit pour les limites de ressources par défaut
- La propriété de configuration du reverse proxy Capsule transférée des administrateurs à l'automatisation de l'agent OpenVox

## Notes

### Décisions Liées
- ADR-0002: Isolation par container par site web
- ADR-0003: Modèle de déploiement basé sur packages
- ADR-0005: Intégration reverse proxy LemonLDAP
- ADR-0007: Images de container minimales

### Exemple de Flux
```
User (HTTPS) → LemonLDAP (SSO + TLS) → Capsule Reverse Proxy → Website Container
  443             10.0.1.5:443                          10.0.2.10:80          10.0.2.10:8080
```
