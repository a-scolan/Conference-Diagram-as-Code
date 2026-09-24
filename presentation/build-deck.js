const fs = require('fs');
const path = require('path');

const presentationDir = __dirname;
const srcDir = path.join(presentationDir, 'src');
const publicDir = path.join(presentationDir, 'public');
const targetHtmlPath = path.join(publicDir, 'presentation-diagram-as-code.html');

function readSrcFile(...segments) {
  return fs.readFileSync(path.join(srcDir, ...segments), 'utf8');
}

function assembleDeck() {
  console.log('\n▶ Assemblage du diaporama modulaire...');

  // 1. Lire la configuration d'événement
  let eventConfig = {
    event: { name: "Conférence Tech", year: "2026", defaultTheme: "google-blueprint-light" }
  };
  const configPath = path.join(presentationDir, 'event.config.json');
  if (fs.existsSync(configPath)) {
    try {
      eventConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch(e) {}
  }

  // 2. Lire les feuilles de style dans l'ordre de cascade
  const styles = [
    'tokens.css',
    path.join('themes', 'google-blueprint-light.css'),
    path.join('themes', 'slate-architect.css'),
    'decorations.css',
    'base.css',
    'deck.css',
    'slides.css',
    'components.css',
  ].map(file => `  /* --- ${file.replace(/\\/g, '/')} --- */\n` + readSrcFile('styles', file)).join('\n\n');

  // 3. Assembler les diapositives selon le manifeste slides.json
  const manifest = JSON.parse(readSrcFile('slides', 'slides.json'));
  const slidesHtml = manifest.map(item => {
    return `  <!-- Slide ${item.index}: ${item.title} -->\n` + readSrcFile('slides', item.filename).trim();
  }).join('\n\n');

  // 4. Lire les scripts
  const mermaidRunner = readSrcFile('scripts', 'mermaid-runner.js');

  const engineScripts = [
    'theme-controller.js',
    'laser.js',
    'likec4-embeds.js',
    'mermaid-controls.js',
    'codespace-popup.js',
    'slide-engine.js',
  ].map(file => `  // --- ${file} ---\n` + readSrcFile('scripts', file)).join('\n\n');

  const defaultTheme = (eventConfig.event && eventConfig.event.defaultTheme) || 'google-blueprint-light';
  const confTitle = (eventConfig.event && eventConfig.event.name) ? `Diagram as Code | ${eventConfig.event.name}` : 'Diagram as Code';

  // 5. Construire le gabarit HTML complet avec verrouillage d'orientation portrait
  const fullHtml = `<!DOCTYPE html>
<html lang="fr" data-theme="${defaultTheme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<title>${confTitle}</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${styles}
</style>
</head>
<body>

<!-- Overlay de verrouillage d'orientation mobile (forcé en paysage) -->
<div class="orientation-lock-overlay" aria-hidden="true">
  <div class="orientation-lock-card">
    <svg class="orientation-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
    <h2 class="orientation-lock-title">Pivotez votre &eacute;cran</h2>
    <p class="orientation-lock-desc">Veuillez faire pivoter votre &eacute;cran en mode paysage (horizontal).</p>
  </div>
</div>

<div class="deck">
${slidesHtml}
</div>

<div class="laser-pointer" aria-hidden="true"></div>

<!-- Moteur de diaporama et contrôles interactifs -->
<script>
${engineScripts}
</script>

<!-- Vendor Mermaid (local prioritaire sans blocage réseau) -->
<script src="./assets/vendor/mermaid/mermaid.min.js"></script>

<!-- Initialisation résiliente des diagrammes Mermaid -->
<script type="module">
${mermaidRunner}
</script>

</body>
</html>
`;

  fs.writeFileSync(targetHtmlPath, fullHtml, 'utf8');
  const stats = fs.statSync(targetHtmlPath);
  console.log(`  ✓ Fichier généré : ${targetHtmlPath}`);
  console.log(`  ✓ Taille totale  : ${stats.size} octets (~${Math.round(stats.size / 1024)} Ko)`);

  const indexHtmlPath = path.join(publicDir, 'index.html');
  const indexHtmlContent = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${confTitle}</title>
  <meta http-equiv="refresh" content="0; url=./presentation-diagram-as-code.html">
  <script>window.location.replace('./presentation-diagram-as-code.html');</script>
</head>
<body>
  <p>Redirection vers la présentation… <a href="./presentation-diagram-as-code.html">Ouvrir</a></p>
</body>
</html>
`;
  fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf8');
  console.log(`  ✓ Fichier généré : ${indexHtmlPath}`);
}

if (require.main === module) {
  assembleDeck();
}

module.exports = { assembleDeck };
