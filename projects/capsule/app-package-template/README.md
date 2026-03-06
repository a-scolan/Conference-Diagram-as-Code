# Template de Package d'App Capsule

Ce template fournit la structure pour construire des containers de sites web statiques sur la plateforme Capsule.

## 📁 Structure du Package

```
app-package-template/
├── manifest.json          # Package metadata and deployment configuration
├── Dockerfile             # Container build instructions
├── nginx.conf             # Nginx server configuration
└── public/                # Static website content
    └── index.html         # Entry point
```

## 🔧 Explication des Fichiers

### `manifest.json`
Métadonnées minimales du package utilisées pour l'identification et le versioning.

**Champs Clés :**
- `version` - Version du package (semver)
- `siteName` - Identifiant unique pour le site web

Les métadonnées du package et détails de routage sont gérés hors du package (par ex., dans Nexus et configuration de plateforme).

### `Dockerfile`
Container Nginx minimal basé sur Alpine pour hébergement statique HTTP uniquement.

**Étapes de Build :**
1. Utilise `nginxinc/nginx-unprivileged:alpine-slim` comme base
2. Supprime les fichiers statiques par défaut
3. Copie le contenu statique depuis `./public`
4. Copie la configuration Nginx
5. S'exécute comme utilisateur non-root `nginx`

**Fonctionnalités de Sécurité :**
- Exécution rootless (utilisateur nginx non-privilégié)
- Taille d'image minimale (~10-15MB)
- Pas de shell ou outils non nécessaires

### `nginx.conf`
Configuration serveur Nginx optimisée pour le contenu statique.

**Configuration :**
- Écoute sur le port 8080 (HTTP uniquement)
- Logs d'accès désactivés pour performance
- Tokens serveur cachés
- Service de fichiers statiques simple avec fallback 404

### `public/`
Répertoire contenant les fichiers de site web statique (HTML, CSS, JS, images, etc.)

## 🚀 Utilisation

### 1. Personnaliser le Contenu
```bash
# Replace example content with your website
rm -rf public/*
cp -r /path/to/your/site/* public/
```

### 2. Mettre à Jour la Configuration
Éditer `manifest.json` :
```json
{
  "version": "1.0.0",
  "siteName": "my-internal-docs"
}
```

Éditer `nginx.conf` si routage custom nécessaire (optionnel).

### 3. Tester le Build Localement
```bash
# Build the container image
podman build -t my-site:1.0.0 .

# Run locally for testing
podman run -d --name test-site -p 8080:8080 my-site:1.0.0

# Test with curl
curl http://localhost:8080

# Cleanup
podman stop test-site && podman rm test-site
```

### 4. Packager pour Déploiement
```bash
# Create tarball for Nexus upload
tar -czf my-site-v1.0.0.tar.gz manifest.json Dockerfile nginx.conf public/

# Upload to Nexus (example)
curl -u username:password \
  --upload-file my-site-v1.0.0.tar.gz \
  https://nexus.internal/repository/capsule-packages/my-site-v1.0.0.tar.gz
```

### 5. Déployer via Op-Con
1. Se connecter au portail self-service Op-Con
2. Soumettre une requête de déploiement avec URL du package
3. L'agent OpenVox récupère le package depuis Nexus
4. L'agent construit l'image et déploie sur Capsule
5. Service systemd créé et démarré

## 📦 Flux de Déploiement

```
Personnel téléverse le package vers Nexus
  ↓
Personnel demande le déploiement via Op-Con
  ↓
OpenVox déclenche l'agent sur Capsule (SSH)
  ↓
L'agent récupère le package depuis Nexus
  ↓
L'agent valide la structure manifest.json
  ↓
L'agent construit l'image : podman build -t sitename:version .
  ↓
L'agent applique les limites de ressources par défaut du plan OpenVox
  ↓
L'agent génère le fichier d'unité systemd
  ↓
Container s'exécute sur le port 8080 (HTTP)
  ↓
Le reverse proxy Capsule route les hostnames vers les containers (port 80 → 8080)
  ↓
Chemin d'accès externe : LemonLDAP fournit HTTPS + SSO et transfère vers le reverse proxy Capsule
```

## 🔒 Considérations de Sécurité

### TLS/SSL
- Pas de SSL dans les containers (HTTP uniquement)
- LemonLDAP fournit HTTPS + SSO externe

### Réseau
- Le container écoute sur le port interne 8080
- Le reverse proxy Capsule écoute sur le port 80 et route par hostname
- LemonLDAP transfère vers le reverse proxy Capsule sur le réseau interne

### Isolation Container
- S'exécute comme utilisateur non-root (nginx)
- Isolation user namespace via Podman
- Limites de ressources appliquées centralement par le plan de l'agent OpenVox
- Système de fichiers root en lecture seule (amélioration optionnelle)

## 🛠 Maintenance

### Mises à Jour de Contenu
Pour des changements de contenu uniquement sans mises à jour de configuration :
1. Mettre à jour les fichiers dans le répertoire `public/`
2. Rebuilder et repackager
3. Déployer la nouvelle version

### Changements de Configuration
Pour des changements de nginx.conf ou Dockerfile :
1. Tester les changements localement avec `podman build` et `podman run`
2. Mettre à jour la version dans `manifest.json`
3. Créer une nouvelle tarball de package
4. Téléverser vers Nexus et déployer

### Rollback
Les versions précédentes du package stockées dans Nexus peuvent être redéployées via Op-Con.

## 📚 Documentation Liée

- **ADR-0001:** Podman plutôt que Docker
- **ADR-0002:** Isolation par container par site web
- **ADR-0003:** Modèle de déploiement basé sur packages
- **ADR-0004:** Intégration basée sur agent OpenVox
- **ADR-0005:** Intégration reverse proxy LemonLDAP
- **ADR-0007:** Images de container minimales

## 🔍 Dépannage

### Le Build Échoue
```bash
# Check Dockerfile syntax
podman build --no-cache -t test .

# Validate manifest.json
jq . manifest.json
```

### Le Container Ne Démarre Pas
```bash
# Check container logs
podman logs <container-name>

# Inspect systemd service
systemctl status <sitename>.service
journalctl -u <sitename>.service
```

## 💡 Astuces

1. **Gardez les images petites** : N'ajoutez pas de packages non nécessaires dans le Dockerfile
2. **Versionnez tout** : Utilisez le versioning sémantique dans manifest.json
3. **Testez localement d'abord** : Toujours tester avec podman avant de téléverser vers Nexus
4. **Documentez les personnalisations** : Notez tout changement nginx.conf dans les commits git
5. **Coordonnez le routage tôt** : Hostname + DNS + routage reverse-proxy sont définis a priori

## 🎯 Exemples de Cas d'Usage

### Site de Documentation
- Docs HTML statiques générés par Sphinx, Docusaurus, ou MkDocs
- Placer les fichiers générés dans `public/`
- Pas de changements nginx.conf nécessaires

### Single Page Application (SPA)
- Builds React, Vue, Angular
- Copier la sortie `dist/` ou `build/` vers `public/`
- Peut nécessiter des mises à jour nginx.conf pour le routage côté client

### Page d'Accueil Interne
- Site HTML/CSS/JS simple
- Parfait pour portails d'équipe, tableaux de bord de statut
- Configuration minimale requise
