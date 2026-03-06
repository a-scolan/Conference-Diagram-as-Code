# ADR-0001: Utiliser Podman plutôt que Docker comme Runtime de Container

## Statut

Accepté

## Contexte

Capsule nécessite un runtime de container pour isoler et exécuter plusieurs instances de sites web statiques sur une VM partagée avec des ressources limitées. La plateforme doit supporter :
- Hébergement multi-tenant avec des frontières d'isolation fortes
- Overhead minimum de ressources par container
- Approche security-first (exécution non-privilégiée)
- Déploiement simple sans gestion de daemon complexe
- Compatibilité avec les pipelines de build basés sur Docker existants

Docker traditionnel nécessite un daemon privilégié et a des implications de sécurité dans des scénarios multi-tenants. La VM d'hébergement fonctionnera sur Debian 11 avec des contraintes de ressources, rendant l'overhead du daemon préoccupant.

## Décision

Nous utiliserons **Podman** comme runtime de container pour Capsule au lieu de Docker.

Caractéristiques clés :
- **Architecture sans daemon** : Aucun daemon privilégié en arrière-plan requis
- **Containers rootless** : Exécute les containers comme utilisateurs non-privilégiés utilisant les user namespaces
- **Compatibilité OCI** : Supporte les images Docker/OCI sans modification
- **Efficacité des ressources** : Overhead plus faible comparé au daemon Docker
- **Intégration systemd** : Support natif pour l'activation socket systemd et la gestion de services sur Debian

Podman sera installé sur la VM Debian 11 en mode rootless, avec chaque container de site web exécuté sous un compte utilisateur système dédié.

## Conséquences

### Conséquences Positives
- **Sécurité** : L'exécution rootless réduit drastiquement la surface d'attaque ; l'échappement du container impacte uniquement l'utilisateur du container, pas le système hôte
- **Efficacité des ressources** : Pas d'overhead de daemon économise de la mémoire (~50-100MB) et réduit l'usage CPU au repos
- **Isolation** : La séparation user namespace fournit une isolation multi-tenant plus forte que la configuration par défaut de Docker
- **Simplicité opérationnelle** : Pas de défaillances de daemon affectant tous les containers ; cycle de vie du container lié aux unités systemd
- **Compatibilité** : Compatibilité CLI Docker drop-in (`alias docker=podman`) permet aux outils existants de fonctionner sans changement

### Conséquences Négatives
- **Courbe d'apprentissage** : L'équipe peut avoir besoin d'apprendre les fonctionnalités spécifiques à Podman et les approches de dépannage
- **Maturité de l'écosystème** : Certaines fonctionnalités Docker Compose ou outils tiers peuvent avoir un support Podman limité
- **Limitations user namespace** : Certaines fonctionnalités kernel peuvent nécessiter de la configuration (par ex., mappings `/etc/subuid`, `/etc/subgid`)
- **Overhead de performance** : Le mapping user namespace ajoute un overhead CPU mineur (~1-2%) comparé aux containers privilégiés

### Conséquences Neutres
- Doit configurer le kernel Debian 11 pour les user namespaces (`kernel.unprivileged_userns_clone=1`)
- Fichiers de service systemd requis pour la gestion du cycle de vie des containers (serait nécessaire avec Docker aussi)

## Notes

### Décisions Liées
- ADR-0002: Isolation par container par site web (bénéficie du modèle rootless de Podman)

### Exemples
```bash
# Install Podman on Debian 11
apt-get install -y podman

# Run rootless container for website
podman run -d --name site1 \
  --memory=128m --cpus=0.25 \
  -p 8080:80 \
  capsule/static-nginx:alpine

# Integrate with systemd
podman generate systemd --new --name site1 > /etc/systemd/system/site1.service
systemctl enable --now site1
```

### Références
- Documentation Podman : https://docs.podman.io/
- Guide containers rootless : https://rootlesscontaine.rs/
- Sécurité Podman vs Docker : https://www.redhat.com/sysadmin/podman-security-guide
- Package Podman Debian : https://packages.debian.org/bullseye-backports/podman
