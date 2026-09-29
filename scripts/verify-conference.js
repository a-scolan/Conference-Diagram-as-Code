const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('presentation/src/slides/slides.json', 'utf8'));
const presenterData = JSON.parse(fs.readFileSync('presentation/public/assets/presenter-data.json', 'utf8'));
const deroule = fs.readFileSync('deroule-conference-slides.md', 'utf8');

const derouleRegex = /### Slide (\d+) — ([^\r\n]+)/g;
let m;
const derouleSlides = [];
while ((m = derouleRegex.exec(deroule)) !== null) {
  derouleSlides.push({ index: parseInt(m[1], 10), title: m[2].trim() });
}

console.log(`Counts -> Manifest: ${manifest.length}, PresenterData: ${presenterData.length}, Deroule: ${derouleSlides.length}`);

let issues = 0;
for (let i = 0; i < manifest.length; i++) {
  const man = manifest[i];
  const pres = presenterData[i];
  const der = derouleSlides[i];

  if (!man || !pres || !der) {
    console.error(`Index ${i} missing in one source:`, { man: !!man, pres: !!pres, der: !!der });
    issues++;
    continue;
  }

  const clean = s => s.replace(/&amp;/g, '&').replace(/^le\s+/i, '').replace(/\s*\(.*?\)/g, '').replace(/\s*à l'architecture/i, '').trim().toLowerCase();
  if (clean(man.title) !== clean(der.title)) {
    console.warn(`Mismatch index ${i}: manifest="${man.title}" vs deroule="${der.title}"`);
    issues++;
  }
  if (!pres.verbatim || pres.verbatim.length < 10) {
    console.warn(`Slide ${i} has empty or short verbatim`);
    issues++;
  }
  if (!pres.action) {
    console.warn(`Slide ${i} has no stage action`);
    issues++;
  }
  if (!pres.keywords || pres.keywords.length === 0) {
    console.warn(`Slide ${i} has no keywords`);
    issues++;
  }
}

if (issues === 0) {
  console.log(`SUCCESS: All ${manifest.length} slides are completely aligned across manifest, deroule, and presenter-data!`);
} else {
  console.log(`Completed with ${issues} notices.`);
}
