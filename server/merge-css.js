/**
 * Merge backup CSS (visual authority) with current HTML slides.
 * - Takes the backup's <style> as the visual base
 * - Injects pipeline CSS, skip-link, speaker-notes from current
 * - Fixes the JS section (mermaid colors, section map, hash nav, etc.)
 */
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup', 'presentation-diagram-as-code.html');
const currentPath = path.join(__dirname, 'public', 'presentation-diagram-as-code.html');

const backup = fs.readFileSync(backupPath, 'utf-8');
const current = fs.readFileSync(currentPath, 'utf-8');

// ─── Extract <style> from backup ───
const backupStyleMatch = backup.match(/<style>([\s\S]*?)<\/style>/);
if (!backupStyleMatch) { console.error('No <style> in backup'); process.exit(1); }
let backupCSS = backupStyleMatch[1];

// ─── Extract pipeline CSS from current (not in backup) ───
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

// ─── Additions: skip-link, sr-only, speaker-notes ───
const extraCSS = `
  /* ============ ACCESSIBILITY EXTRAS ============ */
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0;
    margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  .speaker-notes { display: none; }`;

// ─── Insert pipeline CSS before responsive block, extras at end ───
// Find the responsive marker
const responsiveMarker = '  /* ============ RESPONSIVE ============ */';
backupCSS = backupCSS.replace(
  responsiveMarker,
  pipelineCSS + '\n\n' + responsiveMarker
);

// Add pipeline responsive rules inside the @media (max-width: 768px) block
backupCSS = backupCSS.replace(
  '    .deck-dots { display: none; }\n  }',
  '    .deck-dots { display: none; }\n    .pipeline { flex-direction: column; }\n    .pipeline__arrow { justify-content: center; padding: 4px 0; transform: rotate(90deg); }\n  }'
);

// Add reduced-motion scroll at the end, before closing
const reducedMotionEnd = "  @media (prefers-reduced-motion: reduce) {\n    * { scroll-behavior: auto !important; }\n  }";
backupCSS = backupCSS.replace(
  reducedMotionEnd,
  reducedMotionEnd + '\n' + extraCSS
);

// ─── Build the merged <style> ───
const mergedStyle = '<style>' + backupCSS + '\n</style>';

// ─── Now replace the <style>…</style> in the current HTML ───
let result = current.replace(/<style>[\s\S]*?<\/style>/, mergedStyle);

// ─── Fix the JS section ───
// 1. Fix isDark check
result = result.replace(
  "const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;",
  "const isDark = !window.matchMedia('(prefers-color-scheme: light)').matches;"
);

// 2. Fix mermaid themeVariables colors
result = result.replace(
  "secondaryColor: isDark ? '#0f9ed522' : '#e3edf8',",
  "secondaryColor: isDark ? '#38b4e822' : '#e3edf8',"
);
result = result.replace(
  "secondaryBorderColor: isDark ? '#0f9ed5' : '#0d6fa0',",
  "secondaryBorderColor: isDark ? '#38b4e8' : '#0d6fa0',"
);
result = result.replace(
  "secondaryTextColor: isDark ? '#e8f0f8' : '#0e2841',",
  "secondaryTextColor: isDark ? '#e8f0f8' : '#080d2a',"
);
result = result.replace(
  "tertiaryColor: isDark ? '#4ea72e22' : '#f0fdf0',",
  "tertiaryColor: isDark ? '#5cc03822' : '#f0fdf0',"
);
result = result.replace(
  "tertiaryBorderColor: isDark ? '#4ea72e' : '#196b24',",
  "tertiaryBorderColor: isDark ? '#5cc038' : '#196b24',"
);
result = result.replace(
  "tertiaryTextColor: isDark ? '#e8f0f8' : '#0e2841',",
  "tertiaryTextColor: isDark ? '#e8f0f8' : '#080d2a',"
);
result = result.replace(
  "lineColor: isDark ? '#7a9ab8' : '#3a5a78',",
  "lineColor: isDark ? '#a0b8d0' : '#3a5a78',"
);
result = result.replace(
  "fontSize: '18px',",
  "fontSize: '16px',"
);
result = result.replace(
  "primaryColor: isDark ? '#fbfe7a22' : '#0e284110',",
  "primaryColor: isDark ? '#fbfe7a22' : '#080d2a10',"
);
result = result.replace(
  "primaryBorderColor: isDark ? '#fbfe7a' : '#0e2841',",
  "primaryBorderColor: isDark ? '#fbfe7a' : '#080d2a',"
);
result = result.replace(
  "primaryTextColor: isDark ? '#e8f0f8' : '#0e2841',",
  "primaryTextColor: isDark ? '#e8f0f8' : '#080d2a',"
);
result = result.replace(
  "noteBkgColor: isDark ? '#152f4f' : '#e3edf8',",
  "noteBkgColor: isDark ? '#0c1238' : '#e3edf8',"
);
result = result.replace(
  "noteBorderColor: isDark ? '#7a9ab8' : '#3a5a78',",
  "noteBorderColor: isDark ? '#a0b8d0' : '#3a5a78',"
);

// 3. Add quote auto-sizing to autoFit
result = result.replace(
  "  mermaid.run().then(function() {",
  `  function autoFitQuotes() {
    document.querySelectorAll('.slide--quote blockquote').forEach(function(el) {
      var len = el.textContent.trim().length;
      if (len > 100) {
        var scale = Math.max(0.5, 100 / len);
        var fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = Math.max(16, Math.round(fs * scale)) + 'px';
      }
    });
  }

  mermaid.run().then(function() {`
);

result = result.replace(
  "    autoFit();\n    document.querySelectorAll('.mermaid-wrap').forEach(function(w){ updateZoomLayout(w); });\n    new SlideEngine();",
  "    autoFit();\n    autoFitQuotes();\n    document.querySelectorAll('.mermaid-wrap').forEach(function(w){ updateZoomLayout(w); });\n    new SlideEngine();"
);

// 4. Fix crystal injection to use div wrapper like backup
result = result.replace(
  `  /* ====== Crystal geometric decorations ====== */
  (function injectCrystals() {
    var svgNS = 'http://www.w3.org/2000/svg';
    var crystalData = [
      { points: '200,0 350,0 100,1080 0,1080', fill: 'rgba(18,28,70,0.50)' },
      { points: '300,0 430,0 210,1080 100,1080', fill: 'rgba(22,36,80,0.38)' },
      { points: '80,0 180,0 0,750', fill: 'rgba(15,22,55,0.30)' },
      { points: '1620,0 1780,0 1920,1080 1800,1080', fill: 'rgba(18,28,70,0.50)' },
      { points: '1720,0 1850,0 1920,650', fill: 'rgba(22,36,80,0.38)' },
      { points: '1520,0 1660,0 1830,1080 1700,1080', fill: 'rgba(15,22,55,0.30)' },
    ];
    document.querySelectorAll('.slide').forEach(function(slide) {
      if (slide.querySelector('.slide-crystals')) return;
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'slide-crystals');
      svg.setAttribute('viewBox', '0 0 1920 1080');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      crystalData.forEach(function(d) {
        var p = document.createElementNS(svgNS, 'polygon');
        p.setAttribute('points', d.points);
        p.setAttribute('fill', d.fill);
        svg.appendChild(p);
      });
      slide.insertBefore(svg, slide.firstChild);
    });
  })();`,
  `  /* ============ Crystal decorations — Atlantique Day signature ============ */
  (function injectCrystals() {
    var crystalData = [
      { points: '200,0 350,0 100,1080 0,1080', fill: 'rgba(18,28,70,0.50)' },
      { points: '300,0 430,0 210,1080 100,1080', fill: 'rgba(22,36,80,0.38)' },
      { points: '80,0 180,0 0,750', fill: 'rgba(15,22,55,0.30)' },
      { points: '1620,0 1780,0 1920,1080 1800,1080', fill: 'rgba(18,28,70,0.50)' },
      { points: '1720,0 1850,0 1920,650', fill: 'rgba(22,36,80,0.38)' },
      { points: '1520,0 1660,0 1830,1080 1700,1080', fill: 'rgba(15,22,55,0.30)' }
    ];
    document.querySelectorAll('.slide').forEach(function(slide) {
      if (slide.querySelector('.slide-crystals')) return;
      var wrap = document.createElement('div');
      wrap.className = 'slide-crystals';
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 1920 1080');
      svg.setAttribute('preserveAspectRatio', 'none');
      crystalData.forEach(function(c) {
        var poly = document.createElementNS(svgNS, 'polygon');
        poly.setAttribute('points', c.points);
        poly.setAttribute('fill', c.fill);
        svg.appendChild(poly);
      });
      wrap.appendChild(svg);
      slide.insertBefore(wrap, slide.firstChild);
    });
  })();`
);

// 5. Add initEmbeds function after embed controls
const embedControlsEnd = `  function openEmbedExternal(btn) {
    var wrap = btn.closest('.embed-wrap');
    var iframe = wrap.querySelector('iframe');
    var url = iframe.src || iframe.dataset.src;
    if (url) window.open(url, '_blank');
  }`;

const initEmbedsCode = `
  /* Lazy-load embeds when their slide becomes visible + detect load errors */
  (function initEmbeds() {
    document.querySelectorAll('.embed-wrap iframe[data-src]').forEach(function(iframe) {
      var wrap = iframe.closest('.embed-wrap');
      var fallback = wrap.querySelector('.embed-fallback');
      var loaded = false;
      function tryLoad() {
        if (loaded) return;
        loaded = true;
        iframe.src = iframe.dataset.src;
        setTimeout(function() {
          try {
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc || !doc.body || doc.body.children.length === 0) {
              if (fallback) fallback.classList.add('visible');
            }
          } catch (e) {
            if (fallback) fallback.classList.add('visible');
          }
        }, 3000);
      }
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) { tryLoad(); obs.disconnect(); }
          });
        }, { threshold: 0.1 });
        obs.observe(wrap);
      } else {
        tryLoad();
      }
    });
  })();

  /* ============ Codespace popup ============ */
  var codespacePopup = null;
  function openCodespacePopup() {
    var url = 'https://bookish-space-meme-7xqwrwjvp6wcxjr9.github.dev/';
    var w = screen.availWidth;
    var h = screen.availHeight;
    var left = window.screenX;
    var top = window.screenY;
    var features = 'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes';
    if (codespacePopup && !codespacePopup.closed) {
      codespacePopup.focus();
    } else {
      codespacePopup = window.open(url, 'codespace-ide', features);
    }
  }`;

result = result.replace(embedControlsEnd, embedControlsEnd + '\n' + initEmbedsCode);

// 6. Replace SlideEngine with backup version (with section map + hash nav + better ARIA from current)
const oldSlideEngine = `  /* ====== SlideEngine ====== */
  function SlideEngine(){
    this.deck=document.querySelector('.deck');
    this.slides=[].slice.call(document.querySelectorAll('.slide'));
    this.current=0;
    this.total=this.slides.length;
    this.buildChrome();
    this.bindEvents();
    this.observe();
    this.update();
  }
  SlideEngine.prototype.buildChrome=function(){
    var bar=document.createElement('div');bar.className='deck-progress';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Progression des slides');document.body.appendChild(bar);this.bar=bar;
    var dots=document.createElement('nav');dots.className='deck-dots';dots.setAttribute('aria-label','Navigation des slides');var self=this;
    this.slides.forEach(function(_,i){var d=document.createElement('button');d.className='deck-dot';d.setAttribute('aria-label','Aller au slide '+(i+1));d.onclick=function(){self.goTo(i);};dots.appendChild(d);});
    document.body.appendChild(dots);this.dots=[].slice.call(dots.children);
    var ctr=document.createElement('div');ctr.className='deck-counter';ctr.setAttribute('aria-hidden','true');document.body.appendChild(ctr);this.counter=ctr;
    var hints=document.createElement('div');hints.className='deck-hints';hints.setAttribute('aria-hidden','true');hints.textContent='\\u2190 \\u2192 ou scroll pour naviguer';document.body.appendChild(hints);this.hints=hints;
    var liveRegion=document.createElement('div');liveRegion.className='sr-only';liveRegion.setAttribute('role','status');liveRegion.setAttribute('aria-live','polite');liveRegion.setAttribute('aria-atomic','true');document.body.appendChild(liveRegion);this.liveRegion=liveRegion;
    this.hintTimer=setTimeout(function(){hints.classList.add('faded');},4000);
  };
  SlideEngine.prototype.bindEvents=function(){
    var self=this;
    document.addEventListener('keydown',function(e){
      if(e.target.closest('.mermaid-wrap,.table-scroll,.code-scroll,input,textarea,[contenteditable]'))return;
      if(['ArrowDown','ArrowRight',' ','PageDown'].indexOf(e.key)>-1){e.preventDefault();self.next();}
      else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key)>-1){e.preventDefault();self.prev();}
      else if(e.key==='Home'){e.preventDefault();self.goTo(0);}
      else if(e.key==='End'){e.preventDefault();self.goTo(self.total-1);}
      self.fadeHints();
    });
    var tY;
    this.deck.addEventListener('touchstart',function(e){tY=e.touches[0].clientY;},{passive:true});
    this.deck.addEventListener('touchend',function(e){var dy=tY-e.changedTouches[0].clientY;if(Math.abs(dy)>50){dy>0?self.next():self.prev();}});
  };
  SlideEngine.prototype.observe=function(){
    var self=this;
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');self.current=self.slides.indexOf(entry.target);self.update();}});},{threshold:0.5});
    this.slides.forEach(function(s){obs.observe(s);});
  };
  SlideEngine.prototype.goTo=function(i){this.slides[Math.max(0,Math.min(i,this.total-1))].scrollIntoView({behavior:'smooth'});};
  SlideEngine.prototype.next=function(){if(this.current<this.total-1)this.goTo(this.current+1);};
  SlideEngine.prototype.prev=function(){if(this.current>0)this.goTo(this.current-1);};
  SlideEngine.prototype.update=function(){
    this.bar.style.width=((this.current+1)/this.total*100)+'%';
    this.bar.setAttribute('aria-valuenow',this.current+1);
    this.bar.setAttribute('aria-valuemin','1');
    this.bar.setAttribute('aria-valuemax',this.total);
    var c=this.current;this.dots.forEach(function(d,i){d.classList.toggle('active',i===c);d.setAttribute('aria-current',i===c?'step':'false');});
    this.counter.textContent=(this.current+1)+' / '+this.total;
    if(this.liveRegion)this.liveRegion.textContent='Slide '+(this.current+1)+' sur '+this.total;
  };
  SlideEngine.prototype.fadeHints=function(){clearTimeout(this.hintTimer);this.hints.classList.add('faded');};`;

const newSlideEngine = `  /* ============ SlideEngine ============ */
  function SlideEngine(){
    this.deck=document.querySelector('.deck');
    this.slides=[].slice.call(document.querySelectorAll('.slide'));
    this.current=0;this.total=this.slides.length;
    this.buildChrome();this.buildSectionMap();this.bindEvents();this.observe();this.update();
  }
  SlideEngine.prototype.buildChrome=function(){
    var bar=document.createElement('div');bar.className='deck-progress';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Progression des slides');document.body.appendChild(bar);this.bar=bar;
    var dots=document.createElement('div');dots.className='deck-dots';dots.setAttribute('role','navigation');dots.setAttribute('aria-label','Navigation des slides');var self=this;
    this.slides.forEach(function(_,i){var d=document.createElement('button');d.className='deck-dot';d.title='Slide '+(i+1);d.setAttribute('aria-label','Aller à la slide '+(i+1));d.onclick=function(){self.goTo(i);};dots.appendChild(d);});
    document.body.appendChild(dots);this.dots=[].slice.call(dots.children);
    var ctr=document.createElement('div');ctr.className='deck-counter';ctr.setAttribute('aria-live','polite');ctr.setAttribute('aria-atomic','true');document.body.appendChild(ctr);this.counter=ctr;
    var hints=document.createElement('div');hints.className='deck-hints';hints.textContent='\\u2190 \\u2192 \\u2193 \\u2191 \\u00b7 scroll \\u00b7 touch';document.body.appendChild(hints);this.hints=hints;
    var liveRegion=document.createElement('div');liveRegion.className='sr-only';liveRegion.setAttribute('role','status');liveRegion.setAttribute('aria-live','polite');liveRegion.setAttribute('aria-atomic','true');document.body.appendChild(liveRegion);this.liveRegion=liveRegion;
    this.hintTimer=setTimeout(function(){hints.classList.add('faded');},4000);
  };
  SlideEngine.prototype.bindEvents=function(){
    var self=this;
    document.addEventListener('keydown',function(e){
      if(e.target.closest('.mermaid-wrap,.table-scroll,.code-scroll,input,textarea,[contenteditable]'))return;
      if(['ArrowDown','ArrowRight',' ','PageDown'].indexOf(e.key)>-1){e.preventDefault();self.next();}
      else if(['ArrowUp','ArrowLeft','PageUp'].indexOf(e.key)>-1){e.preventDefault();self.prev();}
      else if(e.key==='Home'){e.preventDefault();self.goTo(0);}
      else if(e.key==='End'){e.preventDefault();self.goTo(self.total-1);}
      self.fadeHints();
    });
    var tY;
    this.deck.addEventListener('touchstart',function(e){tY=e.touches[0].clientY;},{passive:true});
    this.deck.addEventListener('touchend',function(e){var dy=tY-e.changedTouches[0].clientY;if(Math.abs(dy)>50){dy>0?self.next():self.prev();}});
  };
  SlideEngine.prototype.observe=function(){
    var self=this;
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');self.current=self.slides.indexOf(entry.target);self.update();}});},{threshold:0.5});
    this.slides.forEach(function(s){obs.observe(s);});
    /* Restore slide from URL hash on load */
    var hash=window.location.hash;
    if(hash&&hash.match(/^#slide-\\d+$/)){
      var idx=parseInt(hash.replace('#slide-',''),10)-1;
      if(idx>=0&&idx<self.total){
        setTimeout(function(){
          self.slides[idx].scrollIntoView({behavior:'instant'});
          self.current=idx;
          self.update();
        },100);
      }
    }
    window.addEventListener('popstate',function(){
      var h=window.location.hash;
      if(h&&h.match(/^#slide-\\d+$/)){
        var i=parseInt(h.replace('#slide-',''),10)-1;
        if(i>=0&&i<self.total) self.goTo(i);
      }
    });
  };
  SlideEngine.prototype.goTo=function(i){this.slides[Math.max(0,Math.min(i,this.total-1))].scrollIntoView({behavior:'smooth'});};
  SlideEngine.prototype.next=function(){if(this.current<this.total-1)this.goTo(this.current+1);};
  SlideEngine.prototype.prev=function(){if(this.current>0)this.goTo(this.current-1);};
  SlideEngine.prototype.buildSectionMap=function(){
    var sectionColors={
      '0':  'var(--accent)',
      '01': 'var(--accent)',
      '02': 'var(--accent3)',
      '03': 'var(--accent2)',
      '04': 'var(--green)'
    };
    var current='0';
    this.sectionMap=[];
    for(var i=0;i<this.slides.length;i++){
      var num=this.slides[i].querySelector('.slide__number');
      if(num) current=num.textContent.trim();
      this.sectionMap[i]=sectionColors[current]||'var(--accent)';
    }
  };
  SlideEngine.prototype.update=function(){
    this.bar.style.width=((this.current+1)/this.total*100)+'%';
    this.bar.setAttribute('aria-valuenow',this.current+1);
    this.bar.setAttribute('aria-valuemin','1');
    this.bar.setAttribute('aria-valuemax',this.total);
    var c=this.current; var map=this.sectionMap;
    this.dots.forEach(function(d,i){
      var isActive=i===c;
      d.classList.toggle('active',isActive);
      d.setAttribute('aria-current',isActive?'step':'false');
      if(isActive){
        d.style.background='';
      } else {
        d.style.setProperty('background',map[i],'');
        d.style.backgroundClip='content-box';
      }
    });
    this.counter.textContent=(this.current+1)+' / '+this.total;
    if(this.liveRegion)this.liveRegion.textContent='Slide '+(this.current+1)+' sur '+this.total;
    if(history.replaceState) history.replaceState(null,'','#slide-'+(this.current+1));
  };
  SlideEngine.prototype.fadeHints=function(){clearTimeout(this.hintTimer);this.hints.classList.add('faded');};`;

result = result.replace(oldSlideEngine, newSlideEngine);

// Write result
fs.writeFileSync(currentPath, result, 'utf-8');

console.log('✓ CSS merged (backup base + pipeline + accessibility extras)');
console.log('✓ JS fixed (mermaid colors, section map, hash nav, crystals, embeds, quotes)');
console.log('✓ Written to:', currentPath);
