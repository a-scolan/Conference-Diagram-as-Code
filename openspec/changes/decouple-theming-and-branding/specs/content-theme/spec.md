## ADDED Requirements

### Requirement: Configuration centralisée des métadonnées de conférence
Le projet DOIT (SHALL) isoler l'ensemble des données contextuelles liées à l'événement et à l'orateur dans un fichier de configuration standardisé (`event.config.json`).

#### Scenario: Remplacement des informations de conférence
- **WHEN** L'utilisateur modifie le nom de l'événement, la date ou l'URL de feedback dans `event.config.json`
- **THEN** Le diaporama met à jour automatiquement la slide de titre, le bandeau de présentation du speaker et la slide finale de remerciement lors de la compilation sans modification manuelle du balisage.

---

### Requirement: Thèmes visuels interchangeables et sélecteur interactif
Le moteur de présentation DOIT (SHALL) supporter la sélection dynamique ou par configuration d'un thème visuel parmi plusieurs feuilles de style prédéfinies (dont un thème neutre par défaut pour Diagram as Code), et fournir un mécanisme de bascule (*theme switch*) interactif dans le code (raccourci clavier, paramètre d'URL `?theme=` ou sélecteur discret d'interface).

#### Scenario: Sélection d'un thème alternatif en cours de session
- **WHEN** L'utilisateur presse la touche `T` ou sélectionne un thème dans le sélecteur d'interface
- **THEN** Le diaporama met à jour l'attribut `data-theme` sur l'élément racine `<html>`, applique instantanément la feuille de variables correspondante, mémorise le choix dans le `localStorage` et réinitialise les styles Mermaid et LikeC4.

#### Scenario: Chargement avec un paramètre d'URL explicite
- **WHEN** L'URL contient un paramètre de thème (ex: `?theme=slate-architect`)
- **THEN** Le diaporama applique directement ce thème au chargement sans recourir au thème par défaut.

#### Scenario: Suppression de l'habillage décoratif propriétaire
- **WHEN** La présentation charge avec le thème neutre par défaut
- **THEN** L'injection des polygones décoratifs spécifiques à l'ancien événement est absente, laissant un fond sobre et texturé compatible avec tout type de salle.
