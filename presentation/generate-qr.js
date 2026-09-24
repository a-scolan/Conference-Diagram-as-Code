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

  // 1. QR Code du support de présentation
  if (config.support && config.support.url) {
    const supportQrRelPath = config.support.qrImage || './assets/presentation-qr.png';
    const supportQrPath = path.resolve(presentationDir, 'public', supportQrRelPath.replace(/^\.\//, ''));
    console.log(`\n▶ Génération du QR code support vers : ${supportQrPath}`);
    console.log(`  URL cible : ${config.support.url}`);

    fs.mkdirSync(path.dirname(supportQrPath), { recursive: true });
    await QRCode.toFile(supportQrPath, config.support.url, {
      color: {
        dark: '#1a73e8', // Bleu d'ingénierie Google
        light: '#ffffff'
      },
      width: 512,
      margin: 2
    });
    console.log('  ✓ QR code support généré avec succès !');
  }

  // 2. QR Code de feedback (optionnel)
  const feedbackUrl = config.feedback && config.feedback.url;
  if (feedbackUrl) {
    const feedbackQrRelPath = config.feedback.qrImage || './assets/feedback-qr.png';
    const feedbackQrPath = path.resolve(presentationDir, 'public', feedbackQrRelPath.replace(/^\.\//, ''));
    console.log(`\n▶ Génération du QR code feedback vers : ${feedbackQrPath}`);
    console.log(`  URL cible : ${feedbackUrl}`);

    fs.mkdirSync(path.dirname(feedbackQrPath), { recursive: true });
    await QRCode.toFile(feedbackQrPath, feedbackUrl, {
      color: {
        dark: '#1a73e8',
        light: '#ffffff'
      },
      width: 512,
      margin: 2
    });
    console.log('  ✓ QR code feedback généré avec succès !');
  }
}

if (require.main === module) {
  generateQrCode().catch(err => {
    console.error('Erreur génération QR code :', err.message);
  });
}

module.exports = { generateQrCode };
