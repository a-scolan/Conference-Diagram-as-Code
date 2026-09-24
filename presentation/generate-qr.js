const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const presentationDir = __dirname;
const configPath = path.join(presentationDir, 'event.config.json');
const defaultQrPath = path.join(presentationDir, 'public', 'assets', 'feedback-qr.png');

async function generateQrCode() {
  if (!fs.existsSync(configPath)) {
    console.log('Fichier event.config.json introuvable, génération QR ignorée.');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const feedbackUrl = config.feedback && config.feedback.url;

  if (!feedbackUrl) {
    console.log('Aucune URL de feedback spécifiée dans event.config.json.');
    return;
  }

  const targetPath = (config.feedback && config.feedback.qrImage)
    ? path.resolve(presentationDir, config.feedback.qrImage)
    : defaultQrPath;

  console.log(`\n▶ Génération du QR code vers : ${targetPath}`);
  console.log(`  URL cible : ${feedbackUrl}`);

  await QRCode.toFile(targetPath, feedbackUrl, {
    color: {
      dark: '#1a73e8', // Bleu d'ingénierie Google
      light: '#ffffff'
    },
    width: 512,
    margin: 2
  });

  console.log('  ✓ QR code généré avec succès !');
}

if (require.main === module) {
  generateQrCode().catch(err => {
    console.error('Erreur génération QR code :', err.message);
  });
}

module.exports = { generateQrCode };
