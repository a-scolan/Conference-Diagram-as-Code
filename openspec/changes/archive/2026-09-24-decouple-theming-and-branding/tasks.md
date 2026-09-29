## Tasks

- [x] 1. Définition et mise en place du fichier de configuration de l'événement
  - [x] 1.1 Créer le schéma et le fichier de configuration `presentation/event.config.json` avec les valeurs actuelles
  - [x] 1.2 Ajouter un script utilitaire de génération de QR code utilisant la dépendance `qrcode`
- [x] 2. Conception des thèmes et contrôleur de bascule
  - [x] 2.1 Concevoir le thème clair de référence `themes/google-blueprint-light.css` (clarté Google + rappels blueprint vivant)
  - [x] 2.2 Concevoir la variante sombre `themes/slate-architect.css`
  - [x] 2.3 Développer le contrôleur de bascule de thème au runtime (touche `T`, URL `?theme=`, sélecteur de navigation)
  - [x] 2.4 Assurer la synchronisation dynamique des couleurs de diagrammes Mermaid lors du switch
- [x] 3. Nettoyage de l'ancien décor propriétaire
  - [x] 3.1 Remplacer l'injection des cristaux Atlantique Day par la trame blueprint sobre
  - [x] 3.2 Valider la sobriété et l'élégance du rendu par défaut sans artefacts graphiques parasites
- [x] 4. Remplacement des valeurs textuelles statiques
  - [x] 4.1 Remplacer les chaînes en dur de la slide Titre et Speaker par les variables de configuration
  - [x] 4.2 Lier la slide de fin de présentation au QR code et à l'URL de feedback générés
