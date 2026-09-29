# Spécification : Console Présentateur et Mode Double Écran (Presenter View)

## Purpose
Cette spécification définit l'architecture et le comportement de la console présentateur (Presenter View), permettant de piloter la conférence sur deux écrans synchronisés avec affichage de la diapositive courante, de la diapositive suivante, des notes d'orateur, du chronomètre et des contrôles de navigation.

## Requirements

### Requirement: Console de présentation multi-volets (Presenter Console)
Le système DOIT (SHALL) fournir une interface de contrôle dédiée pour le présentateur (`presenter-view.html`) articulée autour de 4 zones principales : prévisualisation de la diapositive active, prévisualisation de la diapositive suivante, panneau des notes et didascalies scéniques, et barre d'état temporelle.

#### Scenario: Affichage initial de la console présentateur
- **WHEN** L'orateur ouvre `presenter-view.html` dans une fenêtre ou sur un moniteur secondaire
- **THEN** La console charge les métadonnées et notes de la présentation, affiche la diapositive courante mise à l'échelle dans le volet principal, la diapositive suivante dans un volet réduit, et les notes orateur associées avec leurs balises d'action scénique.

#### Scenario: Rendu des notes et consignes de scène
- **WHEN** La diapositive courante change
- **THEN** Le volet de notes affiche le verbatim oral exact, la durée cible estimée, le beat narratif et met en évidence visuelle les consignes scéniques critiques (ex: Silences Sacrés de 4s, interactions à main levée, pointage de lignes de code).

#### Scenario: Proportions de texte adaptées au pupitre
- **WHEN** La console présentateur est affichée sur l'écran d'ordinateur portable
- **THEN** Le corps de texte du verbatim et des notes d'orateur adopte une taille confortable par défaut (20px à 24px) avec contraste renforcé pour permettre une lecture sans effort à 60-80 cm de distance, et propose des boutons d'ajustement dynamique de taille de police (A- / A+).

#### Scenario: Gestion du chronomètre et de l'heure courante
- **WHEN** La session est démarrée
- **THEN** L'en-tête de la console affiche l'horloge système en temps réel, le temps total écoulé depuis le début de la conférence, et une jauge de rythme indiquant si l'orateur est en avance ou en retard par rapport aux jalons des 5 Actes.

---

### Requirement: Synchronisation bidirectionnelle en temps réel
Le système DOIT (SHALL) maintenir une synchronisation instantanée et bidirectionnelle sans latence entre la fenêtre de projection publique et la console présentateur via `BroadcastChannel`, avec repli automatique sur `localStorage` ou `window.opener`.

#### Scenario: Navigation déclenchée depuis la console présentateur
- **WHEN** L'orateur clique sur le bouton "Suivant", utilise les flèches du clavier sur la console ou clique sur une miniature
- **THEN** La console change de diapositive et émet un événement de synchronisation qui amène immédiatement la fenêtre de projection publique sur la même diapositive.

#### Scenario: Navigation déclenchée depuis l'écran de projection public
- **WHEN** Une télécommande de présentation ou un raccourci clavier fait avancer la diapositive sur l'écran public
- **THEN** La console présentateur reçoit la notification et met à jour instantanément la diapositive courante, la diapositive suivante et le volet de notes.

#### Scenario: Synchronisation à l'ouverture de la console
- **WHEN** La console présentateur s'ouvre alors que la présentation publique est déjà sur la slide 16
- **THEN** La console interroge la fenêtre active ou lit le dernier état persisté et s'aligne immédiatement sur la slide 16 sans réinitialiser la projection.

#### Scenario: Rechargement à chaud lors du rechargement de la conférence
- **WHEN** La page de présentation de la conférence est rechargée (rafraîchissement de page, compilation ou nouvelle session)
- **THEN** Tous les onglets de console présentateur ouverts reçoivent un événement de rechargement (`DECK_RELOADED`), réactualisent immédiatement leurs notes et métadonnées en arrière-plan sans perte du chronomètre, rafraîchissent les iframes de prévisualisation avec les derniers styles et contenus compilés, et se synchronisent sur la diapositive active.

---

### Requirement: Occultation d'écran et commandes de secours
La console présentateur DOIT (SHALL) offrir des commandes rapides pour masquer l'écran public (mode écran noir) et déclencher des actions de démonstration sans quitter le mode plein écran.

#### Scenario: Déclenchement d'un écran noir (Blackout)
- **WHEN** L'orateur appuie sur la touche `.` (point) ou clique sur le bouton "Écran noir" de la console
- **THEN** L'écran public affiche un volet noir occultant pour concentrer l'attention sur l'orateur, tandis que la console présentateur reste pleinement lisible avec une mention "Écran public masqué".

---

### Requirement: Checklist de préparation avant-scène
La console présentateur DOIT (SHALL) présenter une checklist interactive de préparation avant-scène directement apparente sur la première diapositive (Slide 1 / Titre) et accessible à tout moment via un bouton dédié dans la barre d'en-tête, permettant de ne rien oublier même une fois l'écran public connecté et occupé.

#### Scenario: Affichage automatique sur la première diapositive
- **WHEN** La console présentateur est sur la diapositive d'ouverture (Slide 1 / Titre)
- **THEN** Un panneau "Checklist Avant-Scène" s'affiche automatiquement en tête de la colonne de notes avec les 5 points de contrôle matériels et techniques cruciaux (Navigateur plein écran F11, VS Code zoomé light, onglets de secours PR & LikeC4, pas d'interruptions [Teams/Outlook & veille écran/PC], alimentation secteur / batterie & bouteille d'eau ; le chronomètre étant nativement présent dans la vue speaker, aucun smartphone n'est requis ; le cadrage orateur est concentré dans les concepts clés de la diapositive).

#### Scenario: Interaction et persistance de la checklist
- **WHEN** L'orateur coche ou décoche des éléments de la checklist
- **THEN** L'état est instantanément sauvegardé dans `localStorage`, le compteur d'avancement se met à jour (badge vert `5/5 ✅ Prêt !`), et un bouton de réinitialisation permet de remettre la liste à zéro pour une nouvelle répétition ou session.

#### Scenario: Repli progressif des éléments cochés
- **WHEN** L'orateur coche des points de contrôle au fil de sa préparation
- **THEN** Les éléments cochés se replient automatiquement dans un élément accordéon "Terminé (X)" compact en pied de carte, libérant immédiatement la hauteur verticale pour rendre visibles sans défilement les indications scéniques, mots-clés et verbatims situés juste en dessous. L'orateur peut déplier cet élément à tout moment pour inspecter ou décocher un point validé.

---

### Requirement: Harmonisation et suivi du thème visuel (Light / Dark)
La console présentateur DOIT (SHALL) s'adapter visuellement au thème actif du diaporama (`google-blueprint-light` ou `slate-architect` / `dark`), répercuter instantanément les bascules de thème déclenchées depuis le diaporama public ou la console, et maintenir la synchronisation du thème dans ses prévisualisations intégrées.

#### Scenario: Suivi automatique du thème du diaporama
- **WHEN** Le thème du diaporama est modifié (via la touche `T`, le paramètre URL `?theme=`, ou la sélection locale)
- **THEN** La console présentateur adapte immédiatement son habillage (`data-theme`), ses couleurs d'interface (fonds, cartes, textes, badges) et met à jour ses iframes de prévisualisation via `postMessage`.

#### Scenario: Bascule du thème depuis la console présentateur
- **WHEN** L'orateur clique sur le bouton de thème de l'en-tête de la console ou appuie sur la touche `T`
- **THEN** La console bascule entre le thème clair et le thème sombre, et propage l'événement au diaporama public via `BroadcastChannel` et `localStorage`.
