# ADR-0005: Intégration Reverse Proxy LemonLDAP

## Statut

Accepté

## Contexte

Tous les sites web hébergés doivent être accessibles uniquement via LemonLDAP, qui fournit :
- Terminaison SSL et gestion de certificats
- Authentification et autorisation (SSO)
- Politiques de contrôle d'accès basées sur les attributs utilisateurs
- Protection contre l'accès direct aux services backend

Capsule doit s'intégrer avec l'infrastructure LemonLDAP existante sans nécessiter de certificats SSL externes ou logique d'authentification dans les containers de sites web.

**Approches d'intégration :**
- **Exposition directe** : Les sites web gèrent SSL/auth eux-mêmes
  - Viole l'exigence d'accès LemonLDAP uniquement
  - Duplique la logique de sécurité
  
- **Délégation reverse proxy** : LemonLDAP proxie vers Capsule
  - Frontière de sécurité centralisée
  - Point unique de gestion de certificat SSL
  - Politiques d'auth cohérentes sur tous les services
  
**Stratégies de routage :**
- **Basé sur hostname** : Chaque site web obtient un sous-domaine unique (par ex., docs.internal.corp, wiki.internal.corp)
- **Basé sur path** : Domaine unique avec paths (par ex., portal.corp/docs, portal.corp/wiki)
- **Hybride** : Certains sites par hostname, d'autres par path

## Décision

Nous intégrerons Capsule avec **LemonLDAP comme reverse proxy exclusif** pour tout accès aux sites web.

### Architecture
- **Frontière externe** : LemonLDAP gère toutes les requêtes HTTPS entrantes (port 443)
- **Communication interne** : LemonLDAP transfère vers le reverse proxy Capsule sur HTTP
- **Routage** : Routage basé sur hostname (chaque site web obtient un sous-domaine ou hostname unique)
- **Pas d'accès direct** : Les containers de sites web écoutent uniquement sur le réseau interne ; pas exposés en externe

### Responsabilités LemonLDAP (Externe)
- Gérer la terminaison HTTPS et les politiques SSO
- Maintenir les définitions de routage basé sur hostname (a priori)
- Transférer les requêtes authentifiées vers le reverse proxy Capsule (port 80)

### Responsabilités Capsule
- Opérer un reverse proxy local (port 80) qui route par hostname vers les containers de sites web
- Assurer que les containers écoutent sur le port 8080 (HTTP non-privilégié)
- Pas de gestion SSL/TLS dans les containers (HTTP plain uniquement)
- Pas de logique d'authentification (faire confiance aux headers LemonLDAP comme `X-Remote-User`, `X-Remote-Groups`)

## Conséquences

### Conséquences Positives
- **Sécurité centralisée** : Toute la logique auth/SSL en un seul endroit (LemonLDAP) ; politiques cohérentes sur tous les sites web
- **Containers simplifiés** : Pas de certificats SSL, bibliothèques d'authentification, ou gestion de session dans les containers de sites web
- **Offloading SSL** : Terminaison SSL intensive en CPU gérée par l'infrastructure LemonLDAP dédiée, pas la VM Capsule contrainte en ressources
- **Contrôle d'accès** : Règles d'accès fine par site web sans changements applicatifs
- **Gestion de certificats** : Certificat unique (wildcard ou multi-SAN) géré par l'équipe LemonLDAP
- **Frontière zero trust** : Containers Capsule isolés des réseaux externes ; seul LemonLDAP a un chemin d'entrée

### Conséquences Négatives
- **Point de défaillance unique** : L'indisponibilité de LemonLDAP affecte tout l'accès aux sites web (bien que ceci soit déjà une dépendance organisationnelle)
- **Latence hop supplémentaire** : Hop réseau supplémentaire ajoute ~1-5ms de latence (négligeable pour sites web statiques)
- **Prérequis bloquant** : Chaque déploiement de site web nécessite une configuration LemonLDAP manuelle (hostname, cert SSL, règles d'accès) avant que l'agent OpenVox puisse déployer sur Capsule. Ceci ne peut pas être automatisé et doit être complété par les administrateurs LemonLDAP.
- **Complexité de débogage** : Le chemin de requête couvre deux systèmes (LemonLDAP → Capsule) ; logs répartis sur l'infrastructure

### Conséquences Neutres
- Besoin de connectivité réseau depuis la zone LemonLDAP vers la zone Capsule (règles firewall requises)
- Les containers doivent faire confiance aux headers `X-Remote-User` (acceptable car LemonLDAP est l'autorité d'authentification)
- La configuration LemonLDAP est hors scope de l'automatisation de l'agent OpenVox (doit être gérée manuellement par l'équipe LemonLDAP)

## Notes

### Décisions Liées
- ADR-0002: Isolation par container par site web (chaque container obtient un port unique pour le backend LemonLDAP)
- ADR-0004: Intégration orchestration OpenVox (OpenVox peut configurer LemonLDAP dans le cadre du déploiement)

### Exemples

**Déploiement container Capsule (pas de SSL) :**
```bash
podman run -d --name docs-site \
  -p 8080:8080 \
  -v /opt/capsule/sites/docs/webroot:/usr/share/nginx/html:ro \
  capsule/static-nginx:alpine
```

**Flux réseau :**
```
User (HTTPS) → LemonLDAP (SSL termination + auth) → Capsule Reverse Proxy → Website Container
  443             10.0.1.5:443                          10.0.2.10:80          10.0.2.10:8080
```

### Références
- Documentation LemonLDAP::NG : https://lemonldap-ng.org/
- Patterns reverse proxy : https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
- Sécurité trusted headers : https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
