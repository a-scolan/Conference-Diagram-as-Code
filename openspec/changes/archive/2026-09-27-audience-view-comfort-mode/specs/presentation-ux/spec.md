## ADDED Requirements

### Requirement: Mode confort visuel fond de salle (High Contrast & Big Font)
Le diaporama DOIT (SHALL) fournir un mode d'affichage à fort contraste et grossissement textuel actionnable par raccourci clavier (`B`) ou via le contrôleur de thème, garantissant la lisibilité des blocs de code et des diffs depuis le fond d'amphithéâtres mal occultés.

#### Scenario: Activation du mode confort via raccourci clavier
- **WHEN** L'orateur appuie sur la touche `B` du clavier pendant la présentation
- **THEN** L'attribut `data-readability="high-contrast"` est basculé sur l'élément racine `<html>`, la variable CSS `--font-bump` passe immédiatement à `+2.5px`, et les couleurs de syntaxe s'assombrissent pour un contraste maximal ($> 7:1$).

#### Scenario: Rétablissement du calibrage standard
- **WHEN** L'orateur ré-appuie sur la touche `B`
- **THEN** L'attribut `data-readability` est retiré, `--font-bump` revient à sa valeur par défaut ($0\text{px}$), et la palette standard du thème actif est restaurée.

#### Scenario: Persistance de session
- **WHEN** Le mode confort est activé et que l'utilisateur recharge la page ou navigue d'une diapositive à une autre
- **THEN** L'état de lisibilité est conservé en mémoire de session (`sessionStorage`) pour éviter tout saut de contraste en cours de conférence.
