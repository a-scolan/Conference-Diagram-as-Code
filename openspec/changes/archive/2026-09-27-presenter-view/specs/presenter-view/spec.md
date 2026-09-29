## Purpose

Cette spécification définit l'architecture et le comportement de la console présentateur (Presenter View), permettant de piloter la conférence sur deux écrans synchronisés avec affichage de la diapositive courante, de la diapositive suivante, des notes d'orateur, du chronomètre et des contrôles de navigation.

## ADDED Requirements

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

---

### Requirement: Occultation d'écran et commandes de secours
La console présentateur DOIT (SHALL) offrir des commandes rapides pour masquer l'écran public (mode écran noir) et déclencher des actions de démonstration sans quitter le mode plein écran.

#### Scenario: Déclenchement d'un écran noir (Blackout)
- **WHEN** L'orateur appuie sur la touche `.` (point) ou clique sur le bouton "Écran noir" de la console
- **THEN** L'écran public affiche un volet noir occultant pour concentrer l'attention sur l'orateur, tandis que la console présentateur reste pleinement lisible avec une mention "Écran public masqué".
