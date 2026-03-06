# ADR-0002: Isolation par Container par Site Web

## Statut

Accepté

## Contexte

Capsule doit héberger plusieurs sites web statiques sur une VM unique avec des ressources limitées. Nous devons déterminer le modèle d'isolation :

**Option A: Nginx Partagé** - Instance Nginx unique servant tous les sites web depuis différents répertoires
- Usage minimal de ressources (~50MB RAM pour un processus Nginx)
- Gestion de configuration simple
- Point de défaillance unique affecte tous les sites web
- Pas de limites de ressources par site web
- Sécurité : la compromission d'un site web pourrait affecter les autres

**Option B: Containers par site web** - Chaque site web dans son propre container Podman avec Nginx dédié
- Overhead de ressources plus élevé (~20-30MB RAM par container)
- Frontières d'isolation fortes
- Gestion de cycle de vie indépendante
- Limites de ressources et monitoring par site
- Capacité VM limitée (~10-15 sites web sur hôte 2GB RAM)

**Option C: Hybride** - Nginx partagé pour fichiers statiques, containers pour composants dynamiques
- Non applicable : Capsule héberge uniquement des sites web statiques

La VM a des ressources limitées (probablement 2-4GB RAM, 2-4 vCPUs) et hébergera des sites web internes d'entreprise avec des patterns d'importance et de trafic variables.

## Décision

Nous utiliserons **l'isolation par container par site web** (Option B) avec chaque site web exécuté dans son propre container Podman.

Architecture :
- Chaque site web obtient un container Nginx basé sur Alpine dédié
- Limites de ressources appliquées centralement par les défauts du plan de l'agent OpenVox
- Systemd gère chaque container comme un service indépendant
- LemonLDAP transfère les requêtes au reverse proxy Capsule, qui route par hostname

## Conséquences

### Conséquences Positives
- **Sécurité** : Frontières d'isolation fortes ; un site web compromis ne peut pas accéder aux fichiers ou mémoire des autres
- **Containement du rayon d'impact** : Un crash/compromission d'un site web n'affecte pas les autres
- **Équité des ressources** : Les limites CPU/mémoire par défaut empêchent un site d'affamer les autres
- **Cycle de vie indépendant** : Déployer, redémarrer, ou supprimer des sites web sans affecter les autres
- **Granularité du monitoring** : Métriques par site (CPU, mémoire, comptage de requêtes) pour débogage et planification de capacité
- **Isolation de configuration** : Chaque site a un nginx.conf dédié ; les mauvaises configurations restent locales

### Conséquences Négatives
- **Overhead de ressources** : ~20-30MB RAM par container (base Alpine + Nginx) ; limite la capacité totale de sites web à ~10-20 sites sur VM 2GB
- **Complexité** : Plus d'unités systemd à gérer (une par site web vs un service partagé)
- **Temps de démarrage** : Démarrages de containers multiples plus lents qu'un reload Nginx unique
- **Binaires dupliqués** : Chaque container inclut Nginx, bien que les images partagent les couches de base

### Conséquences Neutres
- Routage basé sur hostname via le reverse proxy Capsule (les containers écoutent sur 8080)
- Besoin d'outillage automatisé pour gérer le cycle de vie des containers (géré par l'agent OpenVox)
- Usage disque : Les images de container partagent les couches (base Alpine, Nginx), donc l'overhead est minimal (~5-10MB par site)

## Notes

### Décisions Liées
- ADR-0001: Podman plutôt que Docker (permet des containers rootless par site avec isolation user namespace)
- ADR-0005: Intégration reverse proxy LemonLDAP (gère le routage vers les containers individuels)
- ADR-0007: Images de container minimales (atténue l'overhead de ressources avec des images basées sur Alpine)

### Exemples
```yaml
# Container resource limits (OpenVox agent plan defaults)
--memory=128m
--memory-swap=128m  # Disable swap
--cpus=0.25
--pids-limit=100
```

```nginx
# Each container has isolated nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  
  location / {
    try_files $uri $uri/ =404;
  }
}
```

### Références
- Contraintes de ressources container : https://docs.podman.io/en/latest/markdown/podman-run.1.html#resource-constraints
- Bonnes pratiques multi-tenancy : https://cloud.google.com/architecture/best-practices-for-building-multi-tenant-saas
