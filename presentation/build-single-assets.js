const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const presentationDir = __dirname;
const publicAssetsDir = path.join(presentationDir, 'public', 'assets');
const likec4Bin = path.join(
  presentationDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'likec4.cmd' : 'likec4'
);

const projects = [
  {
    projectName: 'coffee-v1',
    assetFolder: 'coffee-v1-single',
  },
  {
    projectName: 'coffee-v2',
    assetFolder: 'coffee-v2-single',
  },
];

function quoteForWindowsCmd(value) {
  const stringValue = String(value);

  if (!/[\s"&()^<>|]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

function spawnCommand(command, args, cwd) {
  if (process.platform === 'win32') {
    const commandLine = [command, ...args].map(quoteForWindowsCmd).join(' ');
    return spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', commandLine], {
      cwd,
      stdio: 'inherit',
    });
  }

  return spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureLikeC4Installed() {
  if (!fs.existsSync(likec4Bin)) {
    throw new Error(
      `Binaire LikeC4 introuvable: ${likec4Bin}. Exécute d'abord "npm install" dans presentation/.`
    );
  }
}

function mirrorIndexAs404(outputDir) {
  const indexPath = path.join(outputDir, 'index.html');
  const notFoundPath = path.join(outputDir, '404.html');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`Build incomplet: fichier manquant ${indexPath}`);
  }

  fs.copyFileSync(indexPath, notFoundPath);
}

function runLikeC4Build({ projectName, assetFolder }) {
  const projectDir = path.join(presentationDir, 'likec4', 'projects', projectName);
  const outputDir = path.join(publicAssetsDir, assetFolder);
  const baseUrl = `/assets/${assetFolder}/`;

  console.log(`\n▶ Build LikeC4 single-file: ${projectName}`);
  console.log(`  Source : ${projectDir}`);
  console.log(`  Cible  : ${outputDir}`);

  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  const result = spawnCommand(
    likec4Bin,
    [
      'build',
      '.',
      '--output',
      outputDir,
      '--base',
      baseUrl,
      '--use-hash-history',
      '--output-single-file',
    ],
    projectDir
  );

  if (result.error) {
    throw new Error(`Impossible de lancer LikeC4 pour ${projectName}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Le build LikeC4 a échoué pour ${projectName}`);
  }

  mirrorIndexAs404(outputDir);

  console.log(`  ✓ Assets mis à jour dans public/assets/${assetFolder}`);
}

function main() {
  ensureDir(publicAssetsDir);
  ensureLikeC4Installed();

  for (const project of projects) {
    runLikeC4Build(project);
  }

  console.log('\n✓ Tous les builds single-file ont été mis à jour.');
}

try {
  main();
} catch (error) {
  console.error(`\n✗ ${error.message}`);
  process.exit(1);
}
