## Why

Le retour d'expérience capitalisé lors de la présentation passée (consigné dans `Retours de conf.md`) met en lumière plusieurs difficultés réelles d'animation et de perception par l'auditoire :
1. **Lisibilité et taille de texte** : Des polices parfois trop petites pour le fond de salle de conférence, notamment sur les blocs de code et les diagrammes d'architecture, contraignant l'orateur à des manipulations de zoom répétées.
2. **Surcharge cognitive des diapositives** : Certaines slides contiennent trop de points d'énumération simultanés, ce qui disperse l'attention du public au lieu de focaliser sur le message clé.
3. **Format du tableau de synthèse final** : Le grand tableau comparatif « Avant / Après » est trop compact et difficile à absorber d'un coup d'œil en fin de session (« trouver un autre format que le tableau : imager, titrer clairement le bénéfice, séparer en plusieurs slides »).
4. **Fluidité du Live Coding** : La transition entre les slides théoriques et la démonstration de code (Codespace ou VS Code) crée une friction qui perturbe le rythme scénique et l'engagement avec la salle.
5. **Pédagogie de la démarche** : Besoin d'introduire l'outillage LikeC4 plus tôt, de mieux justifier le choix du modèle C4 pour des publics hétérogènes (développeurs, architectes, agilistes), et de bien séparer la modélisation formelle de la conception système.

Ces points de frottement doivent être résolus par une refonte ergonomique ciblée des diapositives, de la typographie et des interactions.

## What Changes

- **Support mobile en mode paysage (Landscape Mobile Experience)** :
  - Adaptation complète de la mise en page pour les écrans compacts tenus à l'horizontale (hauteurs d'écran de 360px à 500px) :
    - Réduction des paddings et marges d'en-tête pour maximiser l'espace utile.
    - Échelle typographique adaptative et sécurisation par défilement interne (`overflow-y: auto`) pour qu'aucune slide ne soit tronquée.
    - Redimensionnement fluide des diagrammes Mermaid et des cadres d'aperçu de code pour préserver la lisibilité.
    - Écran d'invitation au pivotement élégant lorsque le smartphone est tenu en mode portrait (*« Tournez votre écran à l'horizontale pour explorer la présentation »*).
- **Refonte de l'échelle typographique pour grand écran** :
  - Augmentation systématique des tailles de police minimales et adaptation des `clamp()` pour garantir une lisibilité optimale depuis le fond de salle en projection.
  - Agrandissement natif des polices de code et ajout d'un mécanisme de mise en exergue dynamique des lignes (line highlighting).
- **Aération des diapositives et découpage unitaire** :
  - Décomposition des diapositives denses en séquences à message unique (une idée forte par slide).
  - Remplacement du grand tableau comparatif final par une série de fiches visuelles « Avant / Après » illustrées et percutantes.
- **Optimisation de l'expérience Live-Coding** :
  - Simplification du lanceur de live coding avec guidage scénique intégré.
  - Définition d'un protocole clair pour la démo en direct : instructions de zoom éditeur, profil visuel clair (light theme pour vidéoprojecteur).
- **Renforcement de la clarté pédagogique** :
  - Slide explicite positionnant LikeC4 dès l'introduction.
  - Clarification de la séparation entre conception d'architecture et outillage de modélisation vivante.

## Capabilities

### Modified Capabilities
- `presentation-ux`: Évolution des règles de dimensionnement typographique pour fond de salle, amélioration de la lisibilité des blocs de code et refonte visuelle des fiches de synthèse comparative.

## Impact

- Diapositives : Évolution du gabarit de la slide de synthèse et ajustement des ratios de texte sur les slides denses.
- CSS : Révision des échelles de `font-size` et des contraintes d'espacement des grilles de slides.
- Répétition scénique : Amélioration drastique du confort pour l'orateur et de la rétention d'attention du public.
