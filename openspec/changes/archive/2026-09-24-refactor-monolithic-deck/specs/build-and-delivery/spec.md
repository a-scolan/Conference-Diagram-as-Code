## ADDED Requirements

### Requirement: Pipeline d'assemblage modulaire du diaporama
Le système de build du projet DOIT (SHALL) fournir un mécanisme d'assemblage automatisé transformant les fichiers sources modulaires (templates de diapositives, modules JavaScript, styles CSS) en une page HTML finale distribuable dans `presentation/public/presentation-diagram-as-code.html`.

#### Scenario: Compilation du diaporama complet
- **WHEN** La commande `npm run build:deck` est exécutée
- **THEN** Le pipeline compile les modules JavaScript, injecte les fragments de diapositives ordonnés, fusionne les feuilles de style CSS et génère le fichier HTML autonome dans le répertoire de publication sans erreur.

#### Scenario: Mode développement avec rechargement à chaud
- **WHEN** Le développeur lance `npm run dev:deck`
- **THEN** Un serveur de développement local surveille les modifications apportées aux diapositives et aux styles pour rafraîchir instantanément la présentation dans le navigateur sans rechargement complet manuel.

---

### Requirement: Externalisation et optimisation des assets graphiques
Les images binaires et les ressources graphiques volumineuses NE DOIVENT PAS (SHALL NOT) être encodées en chaînes base64 à l'intérieur des fichiers de code ou de balisage, mais doivent être référencées comme des fichiers distincts optimisés dans le répertoire des assets.

#### Scenario: Référencement des images statiques
- **WHEN** Une diapositive requiert l'affichage d'un schéma ou d'une illustration
- **THEN** La ressource est servie depuis `assets/` sous un format optimisé (WebP, SVG ou PNG compressé) avec des dimensions explicites pour prévenir les décalages de mise en page.
