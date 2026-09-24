## Context

L'analyse des retours d'orateurs et des spectateurs lors de l'Atlantique Day a mis en évidence que si le fond technique (le modèle LikeC4, la transition V1/V2, le diff Git) suscite un vif intérêt, la forme souffre de défauts typiques des premières itérations de présentations denses :
- Les diapositives sont trop chargées en points de puce simultanés, ce qui incite l'auditoire à lire l'écran au lieu d'écouter l'orateur.
- La taille des caractères de code est trop réduite pour les derniers rangs de la salle.
- Le grand tableau récapitulatif final est illisible à distance.
- La manipulation du live-coding en direct doit être plus détendue et mieux intégrée au déroulé.

## Goals / Non-Goals

### Goals
- Rehausser les paliers de dimensionnement CSS (`--font-bump`, variables de `clamp()`) pour assurer un confort de lecture fond de salle.
- Éclater les diapositives surchargées en séquences courtes à impact unitaire.
- Transformer le tableau récapitulatif statique en une série de 3 à 4 cartes de bénéfices clés illustrées.
- Ajouter la capacité de surbrillance de lignes (`line-highlight`) sur les blocs d'exemples de code C4 et Mermaid.
- Améliorer la scénarisation de l'entrée et de la sortie de la phase de Live Coding.

### Non-Goals
- Supprimer des étapes de la démonstration : le périmètre C1 $\to$ C2 $\to$ Dynamique $\to$ PR reste inchangé.
- Modifier l'outillage technique LikeC4 sous-jacent.

## Proposed Solution

1. **Typographie et contraste fond de salle** :
   - Mise à jour des échelles CSS dans le fichier de styles partagé :
     - Titres de diapositive : de `clamp(32px, 5vw, 64px)` à `clamp(44px, 6vw, 76px)` sur grand écran.
     - Puces et textes courants : plancher minimal fixé à `22px` (au lieu de `16px`).
     - Extraits de code : taille de base rehaussée de `11px` à `15px` avec gestion fluide de l'ascenseur.

2. **Architecture responsive Mobile Landscape & Écran de rotation obligatoire** :
   - Écran de blocage portrait : `@media (orientation: portrait) and (max-width: 899px)`
     - Composant plein écran bloquant (`.orientation-lock-overlay`) avec fond opaque assorti au thème.
     - Animation CSS SVG d'un smartphone tournant de 0° à 90°.
     - Message sobre et universel : *« Veuillez faire pivoter votre écran en mode paysage (horizontal). »*.
     - Interaction avec le diaporama en arrière-plan totalement bloquée tant que le téléphone est vertical.
   - Media query paysage cible : `@media (orientation: landscape) and (max-height: 520px)`
     - Dès la rotation effectuée, l'overlay disparaît et laisse place au deck plein écran.
     - Compression des en-têtes et étiquettes de diapositive (hauteur compacte).
     - Activation d'un défilement doux (`-webkit-overflow-scrolling: touch`, `overflow-y: auto`) sur les panneaux de slide (`.slide__inner`, `.slide__panel`) pour que les contenus hauts restent consultables sans débordement.
     - Désactivation automatique du pointeur laser sur écrans tactiles (`pointer: coarse`).

3. **Nouvelle slide de synthèse « Bénéfices Clés »** :
   - Remplacement de la balise `<table>` dense par un ensemble de cartes visuelles à 2 colonnes (`.benefit-card`) :
     - *La Source de Vérité* : Le modèle Git vs les fichiers épars.
     - *La Collaboration* : Le diff visuel en PR vs les réunions de validation sur PDF.
     - *L'Industrialisation* : Le portail dynamique vivant vs les exports PNG obsolètes.

4. **Composant de surbrillance de code (Line Highlighting)** :
   - Ajout d'attributs de données `data-highlight="3-8"` sur les blocs de préformatage `<pre><code>`.
   - Script léger appliquant un filtre d'opacité aux lignes non sélectionnées pour focaliser l'attention lors de l'explication.

5. **Guide scénique pour le Live Coding** :
   - Création d'une checklist visuelle d'amorçage dans les notes de l'orateur : thème VS Code clair agrandi, fenêtre de navigateur dédiée en plein écran, chronomètre synchronisé.

## Risks / Trade-offs

- **Augmentation du nombre total de diapositives** : Éclater les diapositives denses augmente le compteur de slides (de 35 à ~40 slides).
  - *Atténuation* : Le temps global de parole reste identique car chaque slide prend moins de temps à lire et s'enchaîne de manière plus rythmée.
