# Spécification : Vues et Bascules Interactives (Interactive Views)

## Purpose
Cette spécification définit le comportement des composants d'affichage dynamique avancés, notamment les bascules de vue comparatives (Vue C2 unifiée Mermaid / LikeC4), le lanceur de Live-Coding vers Codespace, et les cadres d'aperçu de code enrichis.

## Requirements

### Requirement: Bascule comparative C2 unifiée (Mermaid vs LikeC4)
La présentation doit permettre de confronter sur une même diapositive l'approche textuelle et le rendu de deux technologies Diagram-as-Code (Mermaid et LikeC4) au travers d'un bouton de bascule (`.c2-unified__toggle`).

#### Scenario: État initial de la vue C2
- **WHEN** La diapositive `.slide--c2-unified` s'affiche pour la première fois
- **THEN** La vue est positionnée sur `data-view="mermaid"`, affichant côte à côte le code source `.mmd` et son diagramme Mermaid interactif avec les commandes de zoom.

#### Scenario: Bascule vers le mode LikeC4
- **WHEN** L'orateur clique sur le bouton `.c2-unified__toggle`
- **THEN** L'attribut `data-view` passe à `"likec4"`, le texte du bouton devient `"Mermaid"`, le volet Mermaid se masque et le volet LikeC4 affiche le modèle `.c4` textuel ainsi que l'iframe interactive LikeC4 correspondante.

#### Scenario: Retour vers le mode Mermaid
- **WHEN** L'orateur clique une nouvelle fois sur le bouton
- **THEN** L'attribut `data-view` redevient `"mermaid"`, le libellé du bouton repasse à `"LikeC4"`, et le diagramme Mermaid est réaligné (`autoFitMermaid`) pour assurer un affichage net sans artefacts graphiques.

---

### Requirement: Lanceur de démonstration Live Coding
Une diapositive dédiée doit permettre de passer d'un écran d'introduction à la démonstration en direct (vue lanceur) à une intégration embarquée ou à un lancement externe dans une fenêtre séparée.

#### Scenario: Bascule entre mode lanceur et mode détail
- **WHEN** L'orateur clique sur le bouton de bascule de la diapositive `.slide--live-coding`
- **THEN** L'attribut `data-view` alterne entre `"launcher"` et `"detail"`, et l'attribut d'accessibilité `aria-expanded` du bouton est mis à jour en conséquence.

#### Scenario: Déclenchement du chargement en mode détail
- **WHEN** La vue bascule en mode `"detail"`
- **THEN** Le composant embarqué `.live-coding__embed-wrap` déclenche automatiquement le chargement de son iframe cible.

---

### Requirement: Lancement de GitHub Codespace en fenêtre pop-up dédiée
Pour garantir la fluidité de la démonstration sans risquer d'être piégé par les contraintes de focus ou les raccourcis clavier de l'iframe VS Code, l'ouverture dans une fenêtre navigateur calibrée doit être proposée.

#### Scenario: Clic sur le bouton de lancement Codespace
- **WHEN** L'orateur active la fonction `openCodespacePopup()`
- **THEN** Une nouvelle fenêtre indépendante est ouverte aux dimensions maximales disponibles de l'écran (`screen.availWidth` $\times$ `screen.availHeight`), avec les barres d'outils masquées (`menubar=no, toolbar=no`) et le focus immédiatement orienté vers l'éditeur de code distant.

#### Scenario: Réouverture si la fenêtre est déjà existante
- **WHEN** La fenêtre pop-up a déjà été ouverte et n'a pas été fermée
- **THEN** L'appel donne le focus à l'instance existante (`codespacePopup.focus()`) sans instancier un doublon de session.

---

### Requirement: Cadres d'aperçu de code et diffs syntaxiques
Les extraits de code doivent être présentés dans des cadres structurés imitant un éditeur moderne, comportant le chemin du fichier, la coloration syntaxique et les surbrillances sémantiques.

#### Scenario: Affichage d'un bloc de code avec en-tête de fichier
- **WHEN** Un bloc `.code-preview__frame` est rendu
- **THEN** Il affiche une bannière supérieure avec le nom du fichier (`.slide__code-filename`), un conteneur défilant à police à espacement fixe (`JetBrains Mono`), et des classes de mise en valeur pour les mots-clés (`.kw`), types (`.hl`), chaînes (`.str`) et commentaires (`.cm`).
