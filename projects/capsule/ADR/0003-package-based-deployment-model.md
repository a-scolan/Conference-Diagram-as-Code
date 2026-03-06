# ADR-0003: Modèle de Déploiement Basé sur Packages

## Statut

Accepté

## Contexte

Capsule doit définir l'unité de déploiement lors de la construction de containers pour sites web statiques. Le package de déploiement doit contenir tout ce qui est nécessaire pour que l'agent OpenVox construise une image et provisionne un container sur Capsule.

**Options considérées :**
- **Option A: URLs de dépôts Git** - Capsule clone et construit depuis la source
  - Nécessite des outils de build sur la VM hôte
  - Temps et résultats de build imprévisibles
  - Incohérent entre environnements
  
- **Option B: Images Docker pré-construites uniquement** - L'agent pull des références d'image
  - Pas de flexibilité de configuration nginx par site
  - Fichiers statiques embarqués dans les images (rebuild pour changements de contenu)
  - Perd la séparation entre code et contenu
  
- **Option C: Package composite** - Package auto-contenu contenant :
  - Dockerfile (spécifie l'image de base, étapes de build)
  - Fichier(s) de configuration Nginx
  - Fichiers statiques HTML/CSS/JS
  - Métadonnées minimales (nom du site, version)

Le package est stocké dans Nexus (dépôt d'artifacts) et récupéré par l'agent OpenVox s'exécutant sur Capsule. L'agent construit l'image en utilisant Podman, puis déploie directement avec Podman et systemd.

## Décision

Nous utiliserons un **modèle de déploiement basé sur package composite** (Option C) stocké dans Nexus.

### Structure du Package
```
website-package/
├── manifest.json          # Minimal metadata (site name, version)
├── Dockerfile             # Alpine-based build (HTTP-only)
├── nginx.conf             # Nginx HTTP configuration (port 8080)
└── public/                # Static website content (HTML, CSS, JS, assets)
  ├── index.html
  ├── assets/
  └── ...
```

**Référence Template :** Voir le répertoire `app-package-template/` pour un template prêt pour la production avec :
- Manifest minimal (nom du site, version)
- Configuration Nginx HTTP (port 8080)
- Image basée sur Alpine minimale (~10-15MB)
- Script de build et documentation

### Clarification Clé
**Le package contient des artifacts de build, PAS un binaire d'image pré-construite.**
- Le Dockerfile spécifie : image de base (pullée depuis registry public) + config nginx + fichiers statiques
- L'agent OpenVox construit l'image localement : `podman build -t sitename:version .`
- L'image construite ne quitte jamais le système Capsule (pas de registry/push)
- L'agent exécute ensuite les containers directement via Podman et systemd

### Livraison du Package
- Package stocké dans Nexus (dépôt d'artifacts externe)
- L'agent OpenVox (s'exécutant sur Capsule) récupère les packages depuis Nexus via HTTPS
- L'agent construit l'image et déploie directement avec Podman + systemd

### Flux de Déploiement
1. Op-Con (self-service OpenVox) déclenche la requête de déploiement
2. L'agent OpenVox sur Capsule reçoit le déclencheur (SSH, webhook, ou message)
3. L'agent télécharge le package depuis Nexus
4. L'agent valide la structure du package (manifest + fichiers requis)
5. L'agent construit l'image : `podman build -f Dockerfile -t sitename:latest .`
6. L'agent applique les limites de ressources par défaut du plan OpenVox
7. L'agent orchestre Podman pour créer le container avec montages de volumes
8. L'agent génère le fichier d'unité systemd et active le service
9. Container démarré et enregistré dans systemd

## Conséquences

### Conséquences Positives
- **Immuabilité** : Le package est auto-contenu et reproductible ; même package + dépendances produisent un déploiement identique
- **Flexibilité** : La config Nginx peut être personnalisée par site sans rebuild ; les fichiers statiques peuvent être versionnés séparément
- **Pas de registry d'image** : Les images construites restent locales à Capsule ; pas besoin de dépôt d'images externe
- **Validation** : Structure du package validée avant déploiement ; mauvais packages rejetés tôt
- **Dépendances hôte minimales** : Juste Podman, support Dockerfile, et filesystem
- **Versioning** : Les packages peuvent être versionnés et rollbackés atomiquement
- **Découplage** : Capsule ne dépend pas d'un registry d'images externe ; fetch depuis internet uniquement pour les images de base

### Conséquences Négatives
- **Taille du package** : Plus grande que les simples références d'image (~50-200MB selon le contenu statique)
- **Temps de transfert** : Bande passante réseau requise pour pull les packages depuis Nexus
- **Gestion du stockage** : Capsule doit gérer le cache des packages et le nettoyage des anciennes versions
- **Complexité** : Plus de parties mobiles qu'un déploiement par référence d'image uniquement
- **Temps de build** : L'agent doit exécuter `podman build` pour chaque déploiement (ajoute de la latence, ~30-60 secondes)

### Conséquences Neutres
- Format du package : tarball, zip, ou structure de répertoire (détail d'implémentation)
- Les bonnes pratiques Dockerfile doivent être suivies pour des builds cohérents
- Le schéma manifest.json doit être versionné pour compatibilité future
- La configuration de routage et hostname sont définis a priori (hors du package)
- L'agent est responsable de la sécurité (valider l'intégrité du package, vérification checksum)
- Les métadonnées du package peuvent être sourcées depuis les métadonnées du dépôt Nexus

## Notes

### Décisions Liées
- ADR-0001: Podman plutôt que Docker (le package inclut un Dockerfile pour les images OCI)
- ADR-0004: Intégration basée sur agent OpenVox (l'agent construit depuis le package et déploie)
- ADR-0007: Images de container minimales (image de base gardée petite ; Dockerfile utilise FROM nginxinc/nginx-unprivileged)
- ADR-0008: Reverse proxy Capsule avec routage hostname a priori

### Packages Liés
- `projects/capsule/app-package-template/` (containers de sites web)
- `projects/capsule/app-package-reverse-proxy/` (reverse proxy Capsule)

### Exemples

Voir le répertoire `app-package-template/` dans le projet Capsule pour un template complet, prêt pour la production.

**manifest.json:**
```json
{
  "version": "1.0.0",
  "siteName": "example-site"
}
```

**Dockerfile:**
```dockerfile
FROM nginxinc/nginx-unprivileged:alpine-slim

USER root
RUN rm -rf /usr/share/nginx/html/*

# Copy Nginx configuration and static content
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Agent deployment logic:**
```bash
# Pull package from Nexus
curl -o /tmp/example-site.tar.gz https://nexus.internal/packages/example-site-v1.0.0.tar.gz

# Extract and validate
tar -xzf /tmp/example-site.tar.gz -C /tmp/example-site
jq . /tmp/example-site/manifest.json > /dev/null  # Validate JSON

# Build image locally
cd /tmp/example-site
podman build -t example-site:1.0.0 .

# Deploy container with systemd (resource defaults from OpenVox plan)
podman run -d --name example-site \
  -p 8080:8080 \
  --memory=128m --cpus=0.25 --pids-limit=100 \
  example-site:1.0.0

# Generate systemd unit and enable autostart
podman generate systemd --new --name example-site > /etc/systemd/system/example-site.service
systemctl enable example-site.service
```

### Références
- Spec OCI image : https://github.com/opencontainers/image-spec
- Bonnes pratiques Dockerfile : https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- Bonnes pratiques dépôt d'artifacts : https://www.sonatype.com/blog/nexus-best-practices
