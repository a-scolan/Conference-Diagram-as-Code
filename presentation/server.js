const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Détermination du répertoire statique ──────────────────────
const PUBLIC_DIR = path.join(__dirname, 'public');
const PARENT_DIR = path.resolve(__dirname, '..');

let STATIC_ROOT;
const publicIndex = path.join(PUBLIC_DIR, 'presentation-diagram-as-code.html');

if (fs.existsSync(publicIndex)) {
  STATIC_ROOT = PUBLIC_DIR;
} else {
  try {
    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    const srcHtml = path.join(PARENT_DIR, 'presentation-diagram-as-code.html');
    if (fs.existsSync(srcHtml)) fs.copyFileSync(srcHtml, publicIndex);
    const srcLike = path.join(PARENT_DIR, 'exemple likeC4');
    const dstLike = path.join(PUBLIC_DIR, 'exemple likeC4');
    if (fs.existsSync(srcLike)) {
      fs.cpSync(srcLike, dstLike, { recursive: true, force: true });
    }
    STATIC_ROOT = PUBLIC_DIR;
    console.log('  ✓  Fichiers copiés dans server/public/');
  } catch (err) {
    console.warn('  ⚠  Copie auto échouée, sert depuis le dossier parent');
    console.warn('    ', err.message);
    STATIC_ROOT = PARENT_DIR;
  }
}

// ── Fichiers statiques (présentation, LikeC4, etc.) ──────────
app.use(express.static(STATIC_ROOT, {
  extensions: ['html', 'htm'],
  index: 'presentation-diagram-as-code.html',
}));

// ══════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ══════════════════════════════════════════════════════════════

const server = app.listen(PORT, () => {
  console.log(`\n  ✦  Serveur de présentation démarré`);
  console.log(`  ➜  http://localhost:${PORT}/`);
  console.log(`\n  Fichiers servis depuis : ${STATIC_ROOT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ✗  Le port ${PORT} est déjà utilisé.`);
    console.error(`     Essayez : PORT=4242 node server.js\n`);
  } else {
    console.error('  ✗  Erreur serveur :', err.message);
  }
  process.exit(1);
});
