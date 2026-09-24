## Context

La présentation a été conçue initialement pour une édition spécifique d'un événement (« Atlantique Day 2026 »), sponsorisé par « onepoint ». À ce titre, le style visuel, les textes de scène, les polygones décoratifs et les QR codes de recueil de feedback ont été directement soudés dans le code HTML/CSS/JS.
Cette adhérence empêche d'utiliser la présentation dans d'autres cadres techniques sans un travail fastidieux d'édition chirurgicale.

## Goals / Non-Goals

### Goals
- Extraire un fichier de configuration déclaratif `event.config.json` pour piloter toutes les mentions d'événement.
- Permettre le rethémage visuel complet via des fichiers CSS de thèmes indépendants.
- Rendre le module des cristaux décoratifs paramétrable ou désactivable.
- Permettre la génération dynamique d'un QR code de feedback à partir d'une simple URL spécifiée dans la configuration.

### Non-Goals
- Supprimer le thème actuel Electric Navy : il reste conservé comme le thème de référence par défaut.
- Revoir la sémantique métier d'AleFest Coffee (couvert par un autre chantier).

## Proposed Solution

1. **Structure de `presentation/event.config.json`** :
   ```json
   {
     "event": {
       "name": "Atlantique Day 2026",
       "edition": "2026",
       "theme": "electric-navy",
       "decorations": "crystals"
     },
     "speaker": {
       "name": "Alexis Scolan",
       "title": "Architecte technique",
       "company": "onepoint"
     },
     "feedback": {
       "platform": "OpenFeedback",
       "url": "https://openfeedback.io/...",
       "qrImage": "./assets/feedback-qr.png"
     }
   }
   ```

2. **Catalogue de thèmes et direction artistique (`presentation/src/styles/themes/`)** :
   - `google-blueprint-light.css` (Thème de référence clair par défaut) :
     - **Inspiration** : Clarté et sobriété à-la Google (Google Cloud Architecture / Material 3 épuré) enrichies de la rigueur d'un blueprint d'architecture.
     - **Surfaces & Fond** : Fond blanc et gris ultra-doux (`#ffffff` / `#f8f9fa`), surfaces de cartes nettes avec bordures fines grises (`#dadce0`), ombres portées douces (`rgba(60,64,67,0.08)`).
     - **Typographie & Encres** : Texte charbon haute lisibilité (`#202124` / `#3c4043`), sans noir agressif, offrant un confort de lecture optimal en salle ou sur écran.
     - **Accents & Blueprint vivant** :
       - Bleu ingénierie Google (`#1a73e8` / `#1557d0`) en ancre primaire.
       - Accents sémantiques équilibrés : vert système `#1e8e3e` (RabbitMQ/asynchrone), ambre `#f9ab00`, rouge corail `#d93025`.
       - Richesse blueprint : trame millimétrée subtile à 4% d'opacité en filigrane, mires en croix `+` discrètes aux coins des blocs de code et aperçus de diagrammes, cartouches monospace pour les métadonnées C4.
   - `slate-architect.css` (Variante sombre de comparaison) :
     - Fond ardoise foncé (`#0f172a`), surfaces graphite (`#1e293b`), accent émeraude et cyan.

3. **Mécanisme de Switch de Thème au Runtime (`theme-switcher.js`)** :
   - Lecture du paramètre URL `?theme=...` ou du `localStorage`.
   - Écouteur sur la touche clavier `T` pour cycler facilement entre le thème clair Google Blueprint et la variante sombre lors des répétitions ou des tests.
   - Petit sélecteur discret accessible dans le panneau de navigation escamotable.
   - Déclenchement automatique de `mermaid.initialize` avec reconfiguration des variables de contraste adaptées.

4. **Suppression de l'ancien décor propriétaire** :
   - Remplacement de l'injection systématique des cristaux SVG Atlantique Day par la trame blueprint déclarative et sobre.

## Risks / Trade-offs

- **Contraste dans Mermaid lors des changements de thèmes** : Mermaid nécessite une réinitialisation de ses variables de thème (`mermaid.initialize`) si le fond d'écran change drastiquement (noir vers blanc).
  - *Atténuation* : Dériver les variables Mermaid directement des custom properties CSS calculées au runtime.
