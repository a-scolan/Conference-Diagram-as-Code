# Bilan Design & Audit UX Mobile Paysage (Conférence Diagram as Code)

> **Document de référence pour le refactoring et l'optimisation mobile.**  
> **Contexte de test :** Smartphone en orientation **horizontale / paysage** (*landscape*).  
> **Résolutions cibles :** 667×375 px (iPhone SE/8), 844×390 px (iPhone 12/13/14), 932×430 px (iPhone Pro Max), 800×360 px (Android compact).  
> **Hauteur d'affichage utile :** ~320 à 390 px (avec barres de navigation navigateur).

---

## 1. Principes directeurs & Contraintes identifiées

1. **Orientation paysage obligatoire pour les conférences techniques :**
   - Un overlay de blocage force la rotation si le téléphone est en mode portrait (`@media screen and (orientation: portrait)`).
   - En mode paysage, la contrainte majeure n'est pas la largeur ($> 660\text{ px}$ disponible), mais la **hauteur disponible très faible** ($\le 390\text{ px}$).
2. **Éviter le « scrollception » (ascenseurs parasites imbriqués) :**
   - Les slides utilisent `scroll-snap-type: y mandatory`.
   - Dès qu'un conteneur interne possède `overflow-y: auto`, chaque bloc de code `<pre>`, sous-panneau ou iframe risque d'afficher ses propres barres de défilement, ce qui pollue l'écran et bloque les gestes de balayage.
3. **Pinch-to-zoom utilisateur comme filet de sécurité :**
   - Les schémas d'architecture (C2, Mermaid, arborescences denses) ne peuvent pas tous être comprimés à 300 px de hauteur sans perte d'information.
   - Le zoom natif au doigt (`user-scalable=yes`) et le zoom tactile spécifique aux diagrammes doivent fonctionner sans déclencher un changement inopiné de diapositive.

---

## 2. Classification complète des 35 diapositives

### A. Slides « Nativement adaptables » (Lisibles directement sans zoom)
*Peuvent être affichées proprement en ajustant marges, grilles et typographies pour tenir dans 360–390 px de haut.*

| N° | Slide | Type / Contenu | État actuel en paysage | Actions d'épuration requises |
| :---: | :--- | :--- | :--- | :--- |
| **01** | `00-titre.html` | Titre conférence | ✅ Propre, centré | Conserver la typographie fluide (`clamp`). |
| **02** | `01-speaker.html` | Profil speaker & roadmap | ⚠️ Légèrement serré | Réduire les paddings des badges et de la roadmap. |
| **03** | `02-le-probleme-reel.html` | Statistique 80% / Dessin | ✅ Lisible (split 2 col) | Conserver le split côte-à-côte. |
| **04** | `03-le-probleme-reel-message.html` | Citation problème | ✅ Très lisible | Callout bien centré. |
| **05** | `04-le-probleme-reel-dessin.html` | Problème vs Solution | ✅ Lisible | 2 colonnes bien proportionnées. |
| **06** | `05-changer-de-paradigme.html` | 3 principes d'architecture | ⚠️ Cartes comprimées | Conserver les 3 colonnes horizontales avec padding de 6–8 px max. |
| **07** | `06-c4-zoom.html` | C4 Niveaux + SVG immersif | ⚠️ Débordement léger | Brider la hauteur du SVG à `44vh` max pour préserver le texte à gauche. |
| **08** | `07-c4-zoom-image-mentale.html` | Citation zoom mental | ✅ Très lisible | Callout épuré. |
| **09** | `08-partie-1.html` | Intercalaire Partie 1 | ✅ Parfait | Épuré. |
| **10** | `09-fil-rouge.html` | Liste 5 étapes AleFest | ⚠️ Légèrement haut | Réduire l'interligne des puces (`margin-bottom: 4px`). |
| **11** | `10-cas-d-etude.html` | Contexte métier AleFest | ⚠️ Débordement léger | Split compact texte / bullets. |
| **14** | `13-briques-c2.html` | Briques C2 (Fronts / Services) | ⚠️ Ancien débordement | Forcer 2 colonnes au lieu d'empiler verticalement. |
| **16** | `15-partie-2.html` | Intercalaire Partie 2 | ✅ Parfait | Épuré. |
| **17** | `16-v1-vs-v2.html` | Comparatif V1 vs V2 | ✅ Lisible | 2 colonnes comparatives équilibrées. |
| **19** | `18-cas-d-etude-promesse.html` | Citation promesse | ✅ Parfait | Épuré. |
| **21** | `20-impact-ux.html` | Impact UX Festivalier | ✅ Lisible | 2 colonnes claires. |
| **22** | `21-portail-vivant-benefice.html`| Citation portail vivant | ✅ Parfait | Épuré. |
| **23** | `22-partie-3.html` | Intercalaire Partie 3 | ✅ Parfait | Épuré. |
| **25** | `24-questions-de-review.html` | 3 cartes questions PR | ⚠️ Cartes comprimées | Conserver 3 colonnes horizontales, supprimer les scrolls internes. |
| **27** | `26-review-benefice.html` | Citation bénéfice review | ✅ Parfait | Épuré. |
| **28** | `27-partie-4.html` | Intercalaire Partie 4 | ✅ Parfait | Épuré. |
| **30** | `29-partie-5.html` | Intercalaire Partie 5 | ✅ Parfait | Épuré. |
| **35** | `34-merci.html` | Conclusion & contact | ✅ Propre | Centré. |

---

### B. Slides « Denses nécessitant le zoom utilisateur ou une refonte »
*Contiennent du code source, des embeds interactifs ou des diagrammes complexes difficiles à manipuler sur un petit écran horizontal.*

| N° | Slide | Contenu principal | Problèmes constatés en mobile | Recommandation ergonomique |
| :---: | :--- | :--- | :--- | :--- |
| **12** | `11-adr-001.html` | Markdown ADR + Replay Copilot | En split 50/50, chaque moitié fait ~380 px de large. Le texte de l'ADR et l'iframe sont trop étroits. | Privilégier un mode bascule plein écran (onglet ou toggle 1/3-2/3) ou ouvrir en externe `↗`. |
| **13** | `12-c1-genere.html` | DSL LikeC4 + Schéma C1 | Le schéma C1 à 150 px de haut rend les textes illisibles sans zoom. | Activer le bouton fit/zoom LikeC4 et permettre le plein écran du canvas. |
| **15** | `14-c1-genere.html` | DSL + Vue C2 conteneurs LikeC4 | Trop d'éléments (8 conteneurs) dans un viewport exigu. | Agrandir les contrôles de zoom LikeC4 ; cacher le code par défaut ou proposer un bouton de bascule. |
| **18** | `17-live-coding.html` | Code delta + Portail LikeC4 | Fenêtres imbriquées saturées. | Mode focus : afficher soit le code, soit le rendu avec bouton de permutation. |
| **20** | `19-sequence-mobile.html` | Séquence chronologique (5 acteurs) | Séquence longue verticalement et horizontalement. | Autoriser le pan tactile fluide (1 doigt) et pinch-to-zoom sans déclencher le changement de slide. |
| **24** | `23-specs-amp-arborescence.html` | 2 blocs code + 1 arborescence ASCII | **Cas critique (voir détail section 3)** : 3 pavés empilés, ascenseurs cumulés, badges décalés. | Refonte en 2 colonnes ou tabs (Code Spec / Arborescence). |
| **26** | `25-la-pull-request.html` | Git diff + Diagramme Mermaid Git | Le graphe Git et le bouton PR se télescopent avec le bas de l'écran. | Réduire la hauteur du Mermaid (`height: clamp(120px, 30vh, 160px)`). |
| **29** | `28-pipeline-ci-cd.html` | Pipeline Mermaid horizontal (8 étapes) | Schéma trop large pour 800 px de large, écrasé en hauteur. | Activer le glissement horizontal tactile fluide (`overflow-x: auto`) avec poignée visible. |
| **31** | `30-avant-apres.html` | 6 fiches comparatives | Trop de texte (12 sections avant/après) dans un écran paysage compact. | Afficher 3 colonnes compactes ou 2 colonnes scrollables proprement sans ascenseurs doubles. |
| **32** | `31-portail-vivant.html` | Iframe portail complet LikeC4 | Barres d'outils du portail LikeC4 très petites au doigt. | Plein écran pour l'iframe ou bouton externe bien visible. |
| **33** | `32-vue-c2-likec4.html` | Comparatif Code C2 vs Mermaid/LikeC4 | Code à gauche + Mermaid à droite = colonnes trop étroites. | Bouton bascule code / rendu pleine largeur. |
| **34** | `33-ressources-qr.html` | 2 QR Codes + Liens + Perspectives | Les QR codes prennent trop de place par rapport aux liens. | Réduire les QR codes à 90×90 px en paysage et placer les perspectives en ligne. |

---

## 3. Focus spécifique : Diagnostic de la Slide 24 (`23-specs-amp-arborescence.html`)

### Les 3 anomalies majeures
1. **Accumulation d'ascenseurs (jusqu'à 4 barres de défilement visibles) :**
   - En écran $\le 1080\text{ px}$, la règle CSS force une disposition en une seule colonne (`grid-template-columns: 1fr`).
   - Les deux blocs de gauche (`spec-containers.c4` et `system-model.c4`) s'empilent au-dessus de l'arborescence ASCII.
   - Comme chaque bloc possède une hauteur max fixe et que le conteneur parent possède lui-même un overflow, l'utilisateur voit une barre de défilement sur la slide, une barre sur chaque bloc de code, et des barres horizontales.
2. **Décalage et collision des badges titres (`.slide__code-filename`) :**
   - Les pastilles utilisent un positionnement négatif (`top: -10px` ou `var(--code-preview-chip-line)`).
   - En s'empilant, le badge du 2ᵉ bloc de code vient chevaucher le bas du 1ᵉʳ bloc, donnant l'impression d'un texte "flottant" ou mal aligné.
3. **Perte totale de lisibilité (boîtes de 2 lignes) :**
   - En divisant 360 px de hauteur utile par 3 blocs de code avec leurs marges, chaque bloc ne dispose que de ~50 à 60 px de haut, soit 2 à 3 lignes de code visibles.
   - L'arborescence ASCII perd son indentation et oblige à un double scroll vertical et horizontal.

### Plan d'action pour la Slide 24
- **Option A (Recommandée) :** En orientation paysage compacte, forcer la disposition en **2 colonnes côte-à-côte** :
  - Colonne gauche : un seul bloc de code actif avec onglets (`spec-containers.c4` | `system-model.c4`).
  - Colonne droite : l'arborescence projet ASCII.
- **Option B (Épuration immédiate) :**
  - Fusionner les deux snippets de gauche ou afficher uniquement le snippet clé `spec-containers.c4` en masquant le snippet secondaire en paysage mobile.
  - Masquer les ascenseurs visuels superflus (`scrollbar-width: none`) tout en conservant le défilement tactile au doigt.
  - Fixer les badges `.slide__code-filename` en en-tête interne (`position: static` ou bandeau intégré) pour interdire tout chevauchement.

---

## 4. Règles techniques à standardiser dans le code CSS / JS

1. **Suppression globale des barres de défilement inesthétiques sur mobile :**
   ```css
   @media screen and (orientation: landscape) and (max-height: 560px) {
     * {
       scrollbar-width: none !important; /* Firefox */
     }
     *::-webkit-scrollbar {
       display: none !important; /* Chrome / Safari */
     }
   }
   ```
2. **Sanctuaire tactile pour les gestes :**
   - Si 2 doigts sont posés : **autoriser le pinch-to-zoom navigateur**, bloquer l'événement `slideEngine.next() / prev()`.
   - Si le toucher est dans `.mermaid-wrap` ou `.slide__code-block` : autoriser le défilement/pan interne sans déclencher le changement de diapositive.
3. **Dimensionnement des cibles tactiles :**
   - Boutons de zoom, toggles split et icônes externes : minimum $32 \times 32\text{ px}$ (idéalement $36 \times 36\text{ px}$) avec marge d'espacement de $4\text{ px}$.
4. **Badges d'en-tête de code stabilisés :**
   - Remplacer le `top: -10px` absolu par une barre de titre intégrée dans `.code-preview__frame` (`border-bottom: 1px solid var(--border)`).

---

## 5. Résolutions du retour d'audit de compatibilité mobile & desktop (Septembre 2026)

1. **Espacements sur-titre, titre et cartes (Slide 6 - `05-changer-de-paradigme.html`) :**
   - Suppression du `<br>` artificiel dans le titre pour un écoulement fluide et naturel.
   - Harmonisation du rythme vertical (`.slide__label` margin-bottom: 8px, `.slide__heading` margin-bottom: clamp(6px, 1.2vh, 12px), `concept-grid` margin-top: clamp(10px, 1.6vh, 18px)).
2. **Harmonisation bloc « AleFest Coffee » (`09-fil-rouge.html` & `10-cas-d-etude.html`) :**
   - Épuration des balises `<br>` parasites et refonte en flexbox harmonieuse avec espacements cohérents.
   - Suppression du `<br>` dans le titre de `10-cas-d-etude.html`.
3. **Uniformisation des polices :**
   - Définition explicite de `--font-heading` et `--font-sans` calquées sur `Poppins` (`--font-body`), éliminant les polices par défaut du système.
   - Consolidation du système binaire : `Poppins` pour la prose/titres, `JetBrains Mono` pour le code, les labels, métriques et tags.
4. **Filtre grisant de l'image (Slide 11 - `10-cas-d-etude.html`) :**
   - `.slide__aside--meme` contraint en `overflow: hidden !important` et dimensionné strictement aux dimensions de l'image pour empêcher tout débordement du calque `::after`.
5. **Désactivation des boutons d'ajustement de colonnes sur mobile :**
   - `.code-preview__split-toggle` masqué en mode tactile/mobile (`display: none !important`), laissant place au zoom natif au doigt.
6. **Harmonisation du libellé d'action LikeC4 :**
   - « Charger le rendu LikeC4 » remplacé universellement par « Rendu ».
7. **Titre de la slide 14 (`13-briques-c2.html`) :**
   - Suppression du retour à la ligne inutile `<br>` dans l'en-tête.
8. **Centrage de la slide 32 (`31-portail-vivant.html`) :**
   - Réalignement vertical et horizontal au centre (`align-items: center !important`), suppression du décalage descendant du SVG.
9. **Lisibilité des blocs de code et restauration des ascenseurs :**
   - Remplacement de `justify-content: center` par `justify-content: flex-start` sur les conteneurs `pre` pour éliminer le bug de troncature des premières lignes de code au défilement.
   - Rétablissement d'ascenseurs minces, discrets et visibles (`scrollbar-width: thin; scrollbar-color: var(--accent) transparent;`) sur les conteneurs de code.
10. **Bouton LikeC4 (Slide 33 - `32-vue-c2-likec4.html`) :**
    - Intégration du bouton de bascule directement dans `.c2-unified__header` aux côtés du titre de la slide pour garantir une visibilité permanente sans risque de rognage par le scroll.
11. **Débordement et taille de lien sur la slide 35 (`34-merci.html`) :**
    - Remplacement des styles inline rigides par des classes CSS fluides.
    - Échelle compacte dédiée pour écran mobile paysage et bridage de l'URL (`max-width: 100%`, `text-overflow: ellipsis`, taille de police réduite).
