const fs = require('fs');
const path = require('path');

const deroulePath = path.join(__dirname, '..', 'deroule-conference-slides.md');
let content = fs.readFileSync(deroulePath, 'utf8');

const keywordsMap = [
  // 00 Titre
  ["Code = versionné, testé, déployé", "Architecture = dessin artisanal mort dans un wiki", "Objectif : réconcilier l'architecture avec le génie logiciel", "Ne dessinez plus vos architectures : codez-les !"],
  // 01 Speaker
  ["Alexis Scolan · Architecte technique onepoint", "Sujet né des frictions et frustrations du terrain", "Aligner architecture et dev sans redessiner"],
  // 02 Le problème réel
  ["Double filtre : Qui a fait un schéma ? / Qui est à jour à 6 mois ?", "Le code avance, la carte reste figée", "L'image exportée meurt en silence"],
  // 03 Le problème réel — message
  ["Silence sacré 4s", "Faire vivre les connaissances dans le temps", "L'adversaire : l'entropie dans la durée"],
  // 04 Le problème réel — dessin
  ["Le dessin Draw.io est propre et soigné", "Ajouter un service = déplacer 40 boîtes et 35 flèches à la main", "Mise en page vs ingénierie logicielle"],
  // 05 Changer de paradigme
  ["1. Source de vérité unique (modèle déclaratif typé, zéro redondance)", "2. Perspectives multiples (niveaux C4, vues projetées)", "3. Cycle de vie logiciel (Git, PR, validation, CI/CD)"],
  // 06 C4 zoom
  ["Fin des schémas fourre-tout (bouton, service, cluster mélangés)", "C1 Contexte · C2 Conteneurs · C3 Composants · C4 Code", "Focus de la conférence : C1, C2 et flux dynamiques"],
  // 07 C4 zoom — image mentale
  ["Silence sacré 3s", "Métaphore Google Maps : un seul territoire, plusieurs zooms", "On ne redessine pas la France pour voir Nantes"],
  // 08 Partie 1 (Intertitre)
  ["Partie 1 : Du besoin métier au modèle", "Quitter la théorie pour le terrain", "Cas d'étude AleFest Coffee"],
  // 09 Cas d'étude
  ["Festival : entracte de 15 minutes, 300 personnes d'un coup", "100% manuel : tickets papier, cash, 20 min d'attente", "Festivaliers frustrés (ratent le show), baristas sous l'eau", "Objectif : digitaliser le stand pour fluidifier le service"],
  // 10 ADR-001
  ["Pas de page blanche graphique : rédaction d'un ADR", "Décision : borne comptoir, écran barista, RabbitMQ, PostgreSQL", "Accélérateur IA : texte clair → premier squelette de code en secondes"],
  // 11 C1 généré
  ["10 lignes de DSL LikeC4 : 2 acteurs, 1 système, relations uses", "Zéro coordonnées X/Y, zéro layout manuel", "Vue C1 navigable générée par le compilateur"],
  // 12 Briques C2
  ["Zoom intérieur : ouvrir la boîte AleFest Coffee", "Fronts : tablette comptoir + écran barista temps réel", "Services : Order + Preparation, PostgreSQL", "RabbitMQ : découplage asynchrone pour absorber les pics"],
  // 13 C2 généré (coffee-v1)
  ["Mot-clé extend alefestCoffee : héritage sans duplication", "Flux qualifiés : calls HTTP, async RabbitMQ, writes SQL", "Graphe C2 navigable et zoomable au clic"],
  // 14 Partie 2 (Intertitre)
  ["Partie 2 : Évoluer & éprouver", "Le système vivant évolue : nouvelle demande métier", "Passage à la commande mobile V2"],
  // 15 V1 vs V2
  ["V1 : saisie comptoir, mais festivalier toujours captif devant le stand", "V2 : commande mobile depuis la fosse pendant le concert", "Notification push : venir au stand uniquement quand c'est prêt", "Intégration partenaire externe (App Festival)"],
  // 16 Live coding (coffee-v2 diff)
  ["Le diff vert : 15 lignes de code ajoutées", "1. Système partenaire FestivalApp + API", "2. Service Notification branché sur RabbitMQ existant", "3. Flux commande mobile & push Firebase", "Le graphe C2 s'adapte automatiquement"],
  // 17 Cas d'étude — promesse
  ["Silence sacré 4s", "Le diagramme statique montre les tuyaux", "Prouve-t-il au PO que le parcours fonctionne réellement ?"],
  // 18 Séquence mobile
  ["dynamic view : scénario sur les composants réels du modèle", "1. Commande mobile → 2. Préparation barista → 3. Push & retrait", "Le statique et le dynamique partagent la même source"],
  // 19 Impact UX & As-Code
  ["Festivalier : attente subie transformée en expérience libre", "As-Code : validation précoce du rôle du bus et des notifications", "Arbitrage commun entre Product Owner et développeurs"],
  // 20 Portail vivant — bénéfice
  ["Silence sacré 3s", "Un même modèle pour tous", "Lisible pour le métier, vérifiable pour les développeurs"],
  // 21 Partie 3 (Intertitre)
  ["Partie 3 : Collaborer", "Passage à l'échelle : 20 devs, 3 architectes", "Quand le modèle évolue, la review devient visuelle"],
  // 22 Specs & arborescence
  ["Rigueur logicielle : séparation socle / modèles métiers", "shared/ : grammaire d'entreprise (styles, icônes, conteneurs)", "alefest/ : modèle métier pur", "1 modif dans shared/ → tout le SI se recompile"],
  // 23 Questions de review
  ["Fin du 'Binary files differ' des fichiers Visio/Draw.io", "1. Ce qui entre (nouveaux composants/partenaires)", "2. Ce qui bouge (dépendances réseau, protocoles)", "3. Ce qui devient sensible (couplages, boucles asynchrones)"],
  // 24 La pull request
  ["L'architecture vit dans la PR GitHub (feat/alefest_coffee_v2)", "Diff visuel automatique posté en commentaire par le bot CI", "Relecture transverse : dev, archi, sécurité avant merge sur main"],
  // 25 Review — bénéfice
  ["Silence sacré 4s", "En Pull Request, le diff visuel montre l'impact architectural...", "... avant que la moindre ligne ne parte en production"],
  // 26 Partie 4 (Intertitre)
  ["Partie 4 : L'industrialisation", "Une documentation manuelle est une documentation morte", "Automatiser toute la chaîne de production à chaque push"],
  // 27 Pipeline CI/CD
  ["Pipeline : ADR → .c4 → PR → Validation CLI LikeC4", "Contrôles d'intégrité (zéro lien cassé, zéro relation orpheline)", "Visual diff automatique → Merge → Publication portail vivant"],
  // 28 Partie 5 (Intertitre)
  ["Partie 5 : Et alors ?", "Prise de hauteur : que retenir de cette démarche ?", "Comment démarrer concrètement dès lundi ?"],
  // 29 Portail vivant
  ["Livrable : pas des PNG, une vraie app React autonome et navigable", "Cockpit explorable : zoom C1 → C2, liens vers le code", "Multi-exports natifs : Mermaid, D2, PlantUML, PNG (zéro enfermement)"],
  // 30 Mermaid vs LikeC4
  ["Pourquoi pas juste du Mermaid ?", "Mermaid = croquis visuel ponctuel (aucun modèle sous-jacent)", "LikeC4 = graphe sémantique typé, 1 modif met à jour 20 vues"],
  // 31 Choisir LikeC4
  ["1. 100% Open source (MIT/Apache), souveraineté, modèles dans Git", "2. Écosystème actif (packs cloud, extension VS Code)", "3. Outillage IA moderne : serveurs MCP pour Copilot"],
  // 32 Avant / Après
  ["Source : dessin artisanal éparpillé → Modèle unique .c4 dans Git", "Revue : validation tardive/informelle → Diff visuel en Pull Request", "Cycle : image morte à 6 mois → Portail vivant compilé en CI/CD"],
  // 33 Généraliser la pratique
  ["Pas de grand soir : pattern Strangler Fig sur le legacy", "Déploiement : cartographier zones (DMZ, App, Data) et VM", "Calcul automatique des matrices de flux réseau et pare-feu"],
  // 34 Ressources (Kit de démarrage & Takeaway)
  ["1. S'inspirer : article Dev.to (Le repas de famille des outils)", "2. Manipuler : repo c4-hands-on-demo prêt à forker", "3. Approfondir : documentation officielle likec4.dev"],
  // 35 Merci
  ["Punchline finale : Ne dessinez plus vos architectures : codez-les !", "Support complet via QR Code", "Place aux questions / réponses"]
];

// Add Mots-clés to each slide block in deroule-conference-slides.md
for (let i = 0; i < 36; i++) {
  const pad = String(i).padStart(2, '0');
  const slideRegex = new RegExp(`(### Slide ${pad} [^\\r\\n]+[\\s\\S]*?)(- \\*\\*Action scénique :\\*\\* [^\\r\\n]+(?:\\r?\\n[^\\r\\n*-]+)*)(\\r?\\n)`, 'g');
  
  const kwList = keywordsMap[i].map(k => `    - ${k}`).join('\n');
  const kwBlock = `\n- **Mots-clés :**\n${kwList}`;

  content = content.replace(slideRegex, (full, header, action, nl) => {
    // Avoid double insertion if already exists
    if (full.includes('- **Mots-clés :**')) return full;
    return `${header}${action}${nl}${kwBlock}\n`;
  });
}

// Clean duplicate summary at the end if present
content = content.replace(/(## Résumé en une phrase[\s\S]*?)(## Résumé en une phrase[\s\S]*?$)/, '$1');

fs.writeFileSync(deroulePath, content, 'utf8');
console.log('deroule-conference-slides.md updated with Mots-clés for all 36 slides.');
