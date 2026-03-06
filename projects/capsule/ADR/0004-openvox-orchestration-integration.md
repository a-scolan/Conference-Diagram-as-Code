# ADR-0004: Intégration Orchestration OpenVox (Informationnel)

## Statut

Informationnel (Hors Scope)

## Contexte

L'orchestration OpenVox est un système d'entreprise existant et son comportement est hors scope de ce projet. Cependant, le flux de déploiement est une documentation utile pour les parties prenantes de Capsule et doit s'aligner avec le modèle LikeC4.

Ce document **ne définit pas de nouvelles décisions** concernant OpenVox. Il capture uniquement le flux de déploiement observé comme référence.

## Flux de Déploiement Documenté

```
1. Le personnel demande le déploiement via Op-Con
   ↓
2. OpenVox déclenche l'agent Capsule
   ↓
3. L'agent télécharge le package depuis Nexus
   ↓
4. L'agent valide la structure du package
   ↓
5. L'agent construit l'image avec Podman
   ↓
6. L'agent applique les limites de ressources par défaut (plan OpenVox)
   ↓
7. L'agent exécute le container et enregistre l'unité systemd
```

## Notes

### Frontières de Scope
- La configuration OpenVox et les workflows internes sont gérés par des équipes externes
- Cet ADR ne documente pas la configuration OpenVox ou les APIs internes
- Capsule s'intègre avec OpenVox uniquement via le déclencheur d'agent et le flux de récupération de package

### Décisions Liées
- ADR-0001: Podman plutôt que Docker
- ADR-0003: Modèle de déploiement basé sur packages
- ADR-0008: Reverse proxy Capsule avec routage hostname a priori
