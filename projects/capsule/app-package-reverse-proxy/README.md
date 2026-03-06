# Package d'App Reverse Proxy Capsule

Ce package d'app déploie le container reverse proxy Capsule qui gère le routage basé sur hostname sur le port 80.

## 📁 Structure du Package

```
app-package-reverse-proxy/
├── manifest.json          # Minimal metadata (site name, version)
├── Dockerfile             # Reverse proxy container build
└── nginx.conf             # Hostname routing configuration
```

## 🔧 Configuration

### Volume de Configuration Monté

Le fichier `nginx.conf` **doit être monté comme volume persistant** (pas baké dans l'image du container). Ceci permet à l'agent OpenVox de :
1. Ajouter de nouveaux mappings hostname → backend pendant le déploiement de site web
2. Effectuer un reload graceful (`nginx -s reload`) sans downtime

**Point de montage :** `/etc/nginx/conf.d/reverse-proxy.conf` (lecture-écriture)

Pendant le déploiement de site web, l'agent OpenVox :
- Extrait le nouveau mapping hostname du package de site web
- Ajoute le mapping au nginx.conf monté
- Envoie le signal de reload graceful au processus Nginx en cours d'exécution
- Le nouveau hostname est live en quelques secondes

### Format `nginx.conf`
- Définit les mappings hostname → backend dans les blocs `server` Nginx
- Les hostnames sont définis a priori par les architectes système et enregistrements DNS
- Les backends pointent vers les containers de sites web s'exécutant sur l'hôte Capsule (port 8080, 8081, etc.)
- Chaque déploiement de site web ajoute un nouveau bloc `server` avec son hostname

### Configuration Exemple

```nginx
# Base reverse proxy configuration for Capsule
upstream capsule_backends {
    # Dynamically populated by OpenVox agent
    server host.containers.internal:8080;
    server host.containers.internal:8081;
    server host.containers.internal:8082;
}

server {
    listen 80;
    server_name docs.internal.corp;
    location / {
        proxy_pass http://host.containers.internal:8080;
    }
}

server {
    listen 80;
    server_name wiki.internal.corp;
    location / {
        proxy_pass http://host.containers.internal:8081;
    }
}

# New sites appended here by OpenVox agent during deployment
```

## 🚀 Configuration Runtime

> Les limites de ressources sont appliquées par les défauts du plan de l'agent OpenVox.

Exécuter le container reverse proxy avec montages de volumes pour configuration persistante et état runtime :

### Rootless Port 80 (Option A)

Podman rootless ne peut pas se binder aux ports < 1024 sauf si l'hôte abaisse le seuil de port non-privilégié. Configurer l'hôte pour permettre le port 80 :

- Définir `net.ipv4.ip_unprivileged_port_start = 80`
- Appliquer via `/etc/sysctl.conf` ou un drop-in sysctl

Après ce changement, Podman rootless peut publier le port 80 (par ex., `-p 80:8080`).

Options runtime exemple (conceptuel) :
- Publier le port 80 vers le container 8080
- Ajouter `host.containers.internal` host-gateway si nécessaire

## 🔒 Sécurité
- HTTP uniquement dans le réseau Capsule
- LemonLDAP gère HTTPS et SSO en externe

## 📚 ADRs Liés
- ADR-0002: Isolation par container par site web
- ADR-0005: Intégration reverse proxy LemonLDAP
- ADR-0008: Reverse proxy Capsule avec routage hostname a priori
