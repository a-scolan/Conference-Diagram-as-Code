# ADR-0007: Images de Container Minimales (Basées sur Alpine)

## Statut

Accepté

## Contexte

Chaque site web s'exécute dans un container dédié avec Nginx servant les fichiers statiques. Avec des ressources VM limitées, la taille de l'image de container et l'overhead runtime impactent directement la capacité d'hébergement.

**Options d'image de base :**
- **Alpine Linux** : Minimal (~5MB base, ~20MB avec Nginx)
  - musl libc au lieu de glibc
  - Gestionnaire de packages apk
  - Léger, axé sur la sécurité
  
- **Debian/Ubuntu** : Distributions standard (~50-80MB base, ~100-150MB avec Nginx)
  - glibc, compatibilité plus large
  - Gestionnaire de packages apt
  - Empreinte plus lourde
  
- **Distroless** : Images minimales de Google (~30-40MB)
  - Pas de shell ou gestionnaire de packages (plus dur à déboguer)
  - Conçu pour la sécurité
  
- **Scratch** : Image de base vide (binaires custom-built)
  - Minimalisme ultime
  - Nécessite compilation statique, pas d'outils de débogage

Pour l'hébergement de sites web statiques, nous avons besoin de :
- Serveur web Nginx
- Dépendances runtime minimales
- Empreinte mémoire faible
- Temps de démarrage rapide
- Sécurité (petite surface d'attaque)

## Décision

Nous utiliserons **Alpine Linux comme image de base** pour tous les containers de sites web.

### Structure d'Image
```dockerfile
FROM nginxinc/nginx-unprivileged:alpine-slim
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Guidelines Image
- Base : `nginxinc/nginx-unprivileged:alpine-slim`
- Packages : Éviter d'ajouter des packages sauf si requis (garder minimal)
- Configuration : Configs Nginx et fichiers statiques bakés dans l'image pour reproductibilité
- Builds multi-stage : Si modules Nginx custom nécessaires, builder dans un stage séparé et copier le binaire
- Cible de taille : <25MB par image

### Durcissement Sécurité
- Exécuter Nginx comme utilisateur non-root (Alpine le supporte nativement)
- Système de fichiers root en lecture seule : flag `--read-only` avec tmpfs pour `/var/run` et `/var/cache/nginx`
- Drop capabilities : `--cap-drop=ALL --cap-add=NET_BIND_SERVICE`
- Pas d'accès shell : Supprimer `/bin/sh` dans les images de production (optionnel)

## Conséquences

### Conséquences Positives
- **Efficacité des ressources** : ~15-20MB RAM par container vs ~50-80MB avec des images basées Debian/Ubuntu ; permet 3-4x plus de sites web par GB de RAM
- **Démarrage rapide** : Petite taille d'image signifie `podman pull` rapide et démarrage de container rapide (~100-200ms)
- **Sécurité** : Surface d'attaque minimale ; moins de packages = moins de CVEs ; musl libc a moins de vulnérabilités historiques que glibc
- **Efficacité disque** : Avec partage de couches, 10 sites web utilisant la même base Alpine = ~150MB total vs ~1GB avec Debian
- **Efficacité réseau** : Distribution d'image plus rapide depuis registry ou stockage de packages

### Conséquences Négatives
- **Problèmes de compatibilité** : musl libc vs glibc peut causer des problèmes avec des binaires pré-compilés (pas un problème pour sites web statiques)
- **Difficulté de débogage** : Toolset minimal ; pas de bash, utilitaires limités (peut monter des containers de debug via `podman exec`)
- **Disponibilité des packages** : Alpine apk a moins de packages que Debian apt (pas pertinent pour hébergement Nginx simple)
- **Familiarité de l'équipe** : L'équipe peut être plus familière avec l'écosystème Debian/Ubuntu

### Conséquences Neutres
- Besoin de tester toutes les configurations Nginx contre le Nginx packagé Alpine (peut avoir des flags de compilation différents)
- La syntaxe Dockerfile et bonnes pratiques doivent être documentées pour le processus de build OpenVox
- Le scanning de vulnérabilités doit utiliser des bases de données CVE spécifiques à Alpine

## Notes

### Décisions Liées
- ADR-0001: Podman plutôt que Docker (les containers Alpine fonctionnent sans problème avec Podman)
- ADR-0002: Isolation par container par site web (les images minimales rendent les containers par site réalisables)
- ADR-0003: Déploiement basé sur packages (images distribuées comme tarballs OCI)

### Exemples

**Dockerfile optimisé :**
```dockerfile
FROM nginxinc/nginx-unprivileged:alpine-slim

USER root
RUN rm -rf /usr/share/nginx/html/*
COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Podman run avec flags de sécurité :**
```bash
podman run -d --name mysite \
  --memory=128m --cpus=0.25 \
  --read-only \
  --tmpfs /var/run:rw,noexec,nosuid,size=1m \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=5m \
  --cap-drop=ALL --cap-add=NET_BIND_SERVICE \
  -p 8080:8080 \
  -v /opt/capsule/sites/mysite/nginx:/etc/nginx/conf.d:ro \
  -v /opt/capsule/sites/mysite/webroot:/usr/share/nginx/html:ro \
  capsule/static-nginx:alpine
```

**Comparaison taille d'image :**
```
REPOSITORY              TAG      SIZE
capsule/nginx-alpine    latest   23MB
capsule/nginx-debian    latest   142MB
```

### Références
- Alpine Linux : https://alpinelinux.org/
- Images Docker officielles Alpine : https://hub.docker.com/_/alpine
- Packages Nginx Alpine : https://pkgs.alpinelinux.org/packages?name=nginx
- Bonnes pratiques sécurité container : https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
- Containers lecture seule : https://docs.podman.io/en/latest/markdown/podman-run.1.html#read-only
