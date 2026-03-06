/**
 * Update the skill template's CSS & JS to match backup visual design.
 * The template doesn't need presentation-specific data URIs (elephant-bg, quote-bg),
 * so it uses CSS fallback for quote marks.
 */
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup', 'presentation-diagram-as-code.html');
const templatePath = path.join(__dirname, '..', '.github', 'skills', 'visual-explainer', 'templates', 'slide-deck.html');

const backup = fs.readFileSync(backupPath, 'utf-8');
const template = fs.readFileSync(templatePath, 'utf-8');

// ─── Extract backup CSS ───
const backupStyleMatch = backup.match(/<style>([\s\S]*?)<\/style>/);
if (!backupStyleMatch) { console.error('No <style> in backup'); process.exit(1); }
let backupCSS = backupStyleMatch[1];

// Remove the data URI lines (presentation-specific), keep just the variable names as comments
backupCSS = backupCSS.replace(/    --elephant-bg: url\(data:image\/png;base64,[^)]+\);/,
  '    /* --elephant-bg: url(...); — set per-presentation PNG data URI */');
backupCSS = backupCSS.replace(/    --quote-bg: url\(data:image\/png;base64,[^)]+\);/,
  '    /* --quote-bg: url(...); — set per-presentation PNG data URI for  opening "  mark */');

// For the quote mark, since template doesn't have data URIs, provide a CSS text fallback
// Replace the image-based quote CSS with a dual approach
backupCSS = backupCSS.replace(
  `  .slide__quote-mark::before {
    content: '';
    display: inline-block;
    height: 100%;
    aspect-ratio: 72 / 62;
    background-image: var(--quote-bg);
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.85;
    transform: rotate(180deg); /* flip closing-quote image into opening " */
  }`,
  `  .slide__quote-mark::before {
    content: '\\201C'; /* fallback: Unicode left double quotation mark */
    display: inline-block;
    font-size: clamp(80px, 12vw, 160px);
    line-height: 0.8;
    font-family: var(--font-body);
    font-weight: 900;
    color: var(--quote-mark);
    opacity: 0.55;
    /* If --quote-bg is set, use it as image instead of text: */
    /* background-image: var(--quote-bg); background-size: contain; background-repeat: no-repeat; */
    /* In that case, set content: '' and height: 100%; aspect-ratio: 72 / 62; transform: rotate(180deg); */
  }`
);
backupCSS = backupCSS.replace(
  `  .slide__quote-mark--close::before {
    transform: none; /* closing mark uses image as-is */
  }`,
  `  .slide__quote-mark--close::before {
    content: '\\201D'; /* Unicode right double quotation mark */
  }`
);

// Add pipeline CSS (template feature)
const pipelineCSS = `
  /* ============ PIPELINE ============ */
  .pipeline {
    display: flex; align-items: stretch; gap: 0;
    flex: 1; min-height: 0; margin-top: clamp(12px, 2vh, 24px);
  }
  .pipeline__step {
    flex: 1; background: var(--surface); border: 1px solid var(--border);
    border-top: 3px solid var(--accent); border-radius: 10px;
    padding: clamp(14px, 2.5vh, 28px) clamp(12px, 1.5vw, 22px);
    display: flex; flex-direction: column; min-width: 0; overflow-wrap: break-word;
  }
  .pipeline__num {
    font-size: clamp(10px, 1.2vw, 13px); font-weight: 600;
    color: var(--accent); letter-spacing: 1px;
  }
  .pipeline__name {
    font-size: clamp(16px, 2vw, 24px); font-weight: 700;
    margin: clamp(4px, 0.8vh, 8px) 0;
  }
  .pipeline__desc {
    font-size: clamp(12px, 1.3vw, 16px); color: var(--text-dim);
    line-height: 1.5; flex: 1;
  }
  .pipeline__file {
    font-size: clamp(10px, 1.1vw, 12px); color: var(--accent);
    background: var(--accent-dim); padding: 3px 8px; border-radius: 4px;
    margin-top: clamp(8px, 1.5vh, 16px); align-self: flex-start;
    font-family: var(--font-mono);
  }
  .pipeline__arrow {
    display: flex; align-items: center;
    padding: 0 clamp(3px, 0.4vw, 6px); color: var(--accent);
    flex-shrink: 0; opacity: 0.4;
  }`;

const extraCSS = `
  /* ============ ACCESSIBILITY EXTRAS ============ */
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0;
    margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  .speaker-notes { display: none; }`;

// Insert pipeline before responsive
const responsiveMarker = '  /* ============ RESPONSIVE ============ */';
backupCSS = backupCSS.replace(
  responsiveMarker,
  pipelineCSS + '\n\n' + responsiveMarker
);

// Add pipeline responsive
backupCSS = backupCSS.replace(
  '    .deck-dots { display: none; }\n  }',
  '    .deck-dots { display: none; }\n    .pipeline { flex-direction: column; }\n    .pipeline__arrow { justify-content: center; padding: 4px 0; transform: rotate(90deg); }\n  }'
);

// Add extras at the end
const reducedMotionEnd = "  @media (prefers-reduced-motion: reduce) {\n    * { scroll-behavior: auto !important; }\n  }";
backupCSS = backupCSS.replace(
  reducedMotionEnd,
  reducedMotionEnd + '\n' + extraCSS
);

// ─── Replace template <style> ───
let result = template.replace(/<style>[\s\S]*?<\/style>/, '<style>' + backupCSS + '\n</style>');

// ─── Fix the template JS ───
// Fix isDark check if needed
result = result.replace(
  "const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;",
  "const isDark = !window.matchMedia('(prefers-color-scheme: light)').matches;"
);

// Fix mermaid themeVariables — search for each old value and replace
const colorFixes = [
  ["'#0f9ed522'", "'#38b4e822'"],
  ["'#0f9ed5'", "'#38b4e8'"],
  ["'#4ea72e22'", "'#5cc03822'"],
  ["'#4ea72e'", "'#5cc038'"],
  ["'#7a9ab8'", "'#a0b8d0'"],
  ["'#0e284110'", "'#080d2a10'"],
  ["'#0e2841'", "'#080d2a'"],
  ["'#152f4f'", "'#0c1238'"],
  ["fontSize: '18px'", "fontSize: '16px'"],
  // Also fix hex colors without quotes
  ["#e97132", "#f08848"],
  ["#0f9ed5", "#38b4e8"],
  ["#4ea72e", "#5cc038"],
];

colorFixes.forEach(([old, rep]) => {
  // Only replace in JS context (after </style>)
  const styleEnd = result.indexOf('</style>');
  const before = result.substring(0, styleEnd);
  let after = result.substring(styleEnd);
  after = after.split(old).join(rep);
  result = before + after;
});

// Fix scrollbar in JS if any
result = result.replace(/scrollbar-color: #fbfe7a/g, 'scrollbar-color: #f5c518');
result = result.replace(/scrollbar-thumb { background: #fbfe7a/g, 'scrollbar-thumb { background: #f5c518');

// Write result
fs.writeFileSync(templatePath, result, 'utf-8');

console.log('✓ Template CSS replaced with backup visual design (no data URIs)');
console.log('✓ Quote marks use CSS text fallback (with notes for image override)');
console.log('✓ Pipeline CSS included');
console.log('✓ JS color fixes applied');
console.log('✓ Written to:', templatePath);
