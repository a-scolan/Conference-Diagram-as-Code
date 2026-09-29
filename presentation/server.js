const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Détermination du répertoire statique et build préalable ──
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Assure l'assemblage du diaporama modulaire vers public
try {
  const { assembleDeck } = require('./build-deck.js');
  assembleDeck();
} catch (err) {
  console.warn('  ⚠  Assemblage automatique du diaporama échoué :', err.message);
}

const STATIC_ROOT = PUBLIC_DIR;

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
