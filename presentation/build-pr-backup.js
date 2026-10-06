const fs = require('fs');
const path = require('path');

console.log('Processing pr-page1.html and pr-page2.html...');

const p1Src = fs.existsSync('c:/Users/ascolan/Downloads/Pull Request_page1.html')
  ? 'c:/Users/ascolan/Downloads/Pull Request_page1.html'
  : path.join(__dirname, 'public', 'pr-page1.html');

const p2Src = fs.existsSync('c:/Users/ascolan/Downloads/Pull Request_page2.html')
  ? 'c:/Users/ascolan/Downloads/Pull Request_page2.html'
  : path.join(__dirname, 'public', 'pr-page2.html');

const p1 = fs.readFileSync(p1Src, 'utf8');
const p2 = fs.readFileSync(p2Src, 'utf8');

const targetVisualDiffHash = '#diff-94c54a1f3101c4266eb3ddad9e0c922c14015c322845a26e93952f348c76d6c0';

// 1. In p1: update links to page 2 (Files changed) and ensure responsive viewport meta
let modP1 = p1.replace(/href=["']?https:\/\/github\.com\/a-scolan\/atlantique-day-likec4\/pull\/1\/(changes|files)["']?/g, `href="./pr-page2.html${targetVisualDiffHash}"`);
modP1 = modP1.replace(/href=["']?\/a-scolan\/atlantique-day-likec4\/pull\/1\/(changes|files)["']?/g, `href="./pr-page2.html${targetVisualDiffHash}"`);
if (!modP1.includes('name="viewport"')) {
  modP1 = modP1.replace('<meta charset=utf-8>', '<meta charset=utf-8><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">');
}

fs.writeFileSync(path.join(__dirname, 'public', 'pr-page1.html'), modP1);
console.log('Saved presentation/public/pr-page1.html');

// 2. In p2: update links back to page 1 (Conversation) and ensure responsive viewport meta
let modP2 = p2.replace(/href=["']?https:\/\/github\.com\/a-scolan\/atlantique-day-likec4\/pull\/1["']?/g, 'href="./pr-page1.html"');
modP2 = modP2.replace(/href=["']?\/a-scolan\/atlantique-day-likec4\/pull\/1["']?/g, 'href="./pr-page1.html"');
if (!modP2.includes('name="viewport"')) {
  modP2 = modP2.replace('<meta charset=utf-8>', '<meta charset=utf-8><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">');
}

// 3. In p2: remove iframes sandbox entirely to avoid nested-iframe origin issues on file:// and local server
modP2 = modP2.replace(/\s*sandbox="[^"]*"/g, '');

// Common interactive styles and scripts to inject into diff iframes
const interactiveScript = `
<style>
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
    width: 100% !important;
  }
  .render-shell {
    padding: 10px 4px !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 100vw !important;
  }
  .swipe.view,
  .onion-skin.view,
  .two-up.view {
    max-width: 100% !important;
    transform-origin: top center !important;
  }
  .swipe .swipe-frame .swipe-bar {
    width: 6px !important;
    margin-left: -3px !important;
    background: #0969da !important;
    box-shadow: 0 0 8px rgba(9, 105, 218, 0.6) !important;
    cursor: ew-resize !important;
    z-index: 1000 !important;
    touch-action: none !important;
  }
  .swipe .swipe-frame .swipe-bar .top-handle,
  .swipe .swipe-frame .swipe-bar .bottom-handle {
    background: #0969da !important;
    border: 2px solid #fff !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4) !important;
  }
  .swipe .swipe-frame,
  .onion-skin .controls,
  .onion-skin .controls .js-slider-track,
  .onion-skin .controls .js-dragger {
    touch-action: none !important;
  }
  .onion-skin .controls .js-slider-track {
    cursor: pointer !important;
  }
  .onion-skin .controls .js-dragger {
    cursor: grab !important;
    touch-action: none !important;
  }
  .js-view-mode-item {
    cursor: pointer !important;
  }
</style>
<script>
(function() {
  var currentSwipeRatio = 0.5;
  var currentOnionRatio = 0.5;
  var lastContainerW = 0;
  var lastParentH = 0;

  function scaleViewsToFit() {
    var shell = document.querySelector('.render-shell');
    if (!shell) return;
    var containerWidth = shell.clientWidth || document.documentElement.clientWidth || window.innerWidth;
    var maxW = Math.max(200, containerWidth - 12);

    // Hauteur d'écran ou du parent (ex: iframe dans le diaporama ou onglet dédié)
    var parentH = window.innerHeight;
    try {
      if (window.parent && window.parent !== window && window.parent.innerHeight) {
        parentH = window.parent.innerHeight;
      }
    } catch (_) {}

    // Éviter tout recalcul redondant si les dimensions extérieures sont stables
    if (Math.abs(containerWidth - lastContainerW) < 2 && Math.abs(parentH - lastParentH) < 2) {
      return;
    }
    lastContainerW = containerWidth;
    lastParentH = parentH;

    // Déterminer la hauteur proportionnelle à l'espace vertical disponible
    // afin que l'image ne dépasse jamais de l'écran et reste intégralement visible
    var maxH;
    if (parentH <= 560) {
      // Mobile paysage (écran bas : 320px - 560px) : ~50% de la hauteur verticale
      maxH = Math.max(140, Math.round(parentH * 0.50));
    } else if (containerWidth < 640) {
      // Mobile portrait : ~40% de la hauteur verticale
      maxH = Math.max(160, Math.round(parentH * 0.40));
    } else {
      // Desktop / tablette : ~50% de la hauteur, plafonné pour une vue ergonomique
      maxH = Math.max(240, Math.min(500, Math.round(parentH * 0.50)));
    }

    var views = document.querySelectorAll('.view');
    var activeScaledH = 0;

    views.forEach(function(v) {
      var naturalW = parseFloat(v.getAttribute('data-natural-w'));
      var naturalH = parseFloat(v.getAttribute('data-natural-h'));
      if (!naturalW || !naturalH) {
        naturalW = parseFloat(v.style.width) || v.offsetWidth || 848;
        naturalH = parseFloat(v.style.height) || v.offsetHeight || 634;
        v.setAttribute('data-natural-w', naturalW);
        v.setAttribute('data-natural-h', naturalH);
      }

      var scaleW = maxW / naturalW;
      var scaleH = maxH / naturalH;
      var scale = Math.min(1, scaleW, scaleH);

      v.style.transformOrigin = 'top center';
      v.style.transform = scale < 0.999 ? 'scale(' + scale + ')' : '';

      var scaledH = Math.round(naturalH * scale);
      if (scale < 0.999) {
        var diffH = naturalH - scaledH;
        v.style.marginBottom = '-' + Math.round(diffH) + 'px';
      } else {
        v.style.marginBottom = '0px';
      }

      var isVisible = (v.style.display !== 'none' && window.getComputedStyle(v).display !== 'none');
      if (isVisible || !activeScaledH) {
        activeScaledH = scaledH;
      }
    });

    var renderBar = document.querySelector('.js-render-bar');
    var barH = (renderBar && renderBar.offsetHeight) ? renderBar.offsetHeight : 38;
    var finalHeight = Math.round(activeScaledH + barH + 18);

    // Ajustement synchrone direct sur le conteneur parent via frameElement (same-origin srcdoc)
    try {
      if (window.frameElement) {
        var vp = window.frameElement.closest('.RichDiff-module__fileRendererViewport__wcmGL');
        if (vp && Math.abs(vp.clientHeight - finalHeight) > 3) {
          vp.style.height = finalHeight + 'px';
        }
      }
    } catch (_) {}

    // Notification cross-frame de secours
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'diff-iframe-resized',
          frameName: window.name || (window.frameElement ? window.frameElement.name : ''),
          height: finalHeight
        }, '*');
      }
    } catch (_) {}
  }
  window.scaleViewsToFit = scaleViewsToFit;

  function initSwipe() {
    var swipe = document.querySelector('.swipe.view');
    if (!swipe) return;
    var frame = swipe.querySelector('.swipe-frame');
    var shell = swipe.querySelector('.swipe-shell');
    var bar = swipe.querySelector('.swipe-bar');
    if (!frame || !shell || !bar) return;

    bar.style.cursor = 'ew-resize';
    bar.style.touchAction = 'none';
    frame.style.touchAction = 'none';
    var isDragging = false;

    function setSwipe(ratio) {
      if (typeof ratio === 'number') currentSwipeRatio = ratio;
      currentSwipeRatio = Math.max(0, Math.min(1, currentSwipeRatio));
      var naturalW = parseFloat(swipe.getAttribute('data-natural-w')) || parseFloat(frame.style.width) || 848;
      var x = currentSwipeRatio * naturalW;
      bar.style.left = x + 'px';
      shell.style.width = Math.max(0, (naturalW - x)) + 'px';
    }
    window.updateSwipe = setSwipe;

    function onPointerMove(e) {
      if (!isDragging) return;
      var rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return;
      var x = e.clientX - rect.left;
      setSwipe(x / rect.width);
    }

    function onPointerUp(e) {
      if (isDragging) {
        isDragging = false;
        try { if (e && e.pointerId) bar.releasePointerCapture(e.pointerId); } catch (_) {}
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
      }
    }

    bar.addEventListener('pointerdown', function(e) {
      isDragging = true;
      try { bar.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    });

    frame.addEventListener('pointerdown', function(e) {
      isDragging = true;
      var rect = frame.getBoundingClientRect();
      if (rect.width > 0) {
        setSwipe((e.clientX - rect.left) / rect.width);
      }
      e.preventDefault();
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    });

    setSwipe(0.5);
    scaleViewsToFit();

    if (window.ResizeObserver) {
      new ResizeObserver(function() {
        scaleViewsToFit();
        setSwipe();
      }).observe(frame);
    }
    window.addEventListener('resize', function() { scaleViewsToFit(); setSwipe(); });
  }

  function initOnion() {
    var onion = document.querySelector('.onion-skin.view');
    if (!onion) return;
    var added = onion.querySelector('.added-frame');
    var track = onion.querySelector('.js-slider-track');
    var dragger = onion.querySelector('.js-dragger');
    var controls = onion.querySelector('.controls');
    if (!added || !track || !dragger) return;

    dragger.style.cursor = 'grab';
    dragger.style.touchAction = 'none';
    var isDragging = false;

    function setOpacity(ratio) {
      if (typeof ratio === 'number') currentOnionRatio = ratio;
      currentOnionRatio = Math.max(0, Math.min(1, currentOnionRatio));
      added.style.opacity = currentOnionRatio;
      var trackWidth = track.clientWidth || 300;
      var draggerWidth = dragger.offsetWidth || 12;
      var maxLeft = Math.max(0, trackWidth - draggerWidth);
      dragger.style.left = (currentOnionRatio * maxLeft) + 'px';
    }
    window.updateOnion = setOpacity;

    function onPointerMove(e) {
      if (!isDragging) return;
      var rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      var x = e.clientX - rect.left;
      setOpacity(x / rect.width);
    }

    function onPointerUp(e) {
      if (isDragging) {
        isDragging = false;
        dragger.style.cursor = 'grab';
        try { if (e && e.pointerId) dragger.releasePointerCapture(e.pointerId); } catch (_) {}
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
      }
    }

    dragger.addEventListener('pointerdown', function(e) {
      isDragging = true;
      dragger.style.cursor = 'grabbing';
      try { dragger.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerUp);
    });

    track.addEventListener('pointerdown', function(e) {
      if (e.target === dragger) return;
      var rect = track.getBoundingClientRect();
      if (rect.width > 0) {
        setOpacity((e.clientX - rect.left) / rect.width);
      }
    });

    if (controls) {
      var transp = controls.querySelector('.transparent');
      var opaque = controls.querySelector('.opaque');
      if (transp) {
        transp.style.cursor = 'pointer';
        transp.addEventListener('click', function() { setOpacity(0); });
      }
      if (opaque) {
        opaque.style.cursor = 'pointer';
        opaque.addEventListener('click', function() { setOpacity(1); });
      }
    }

    setOpacity(0.5);
    scaleViewsToFit();

    if (window.ResizeObserver) {
      new ResizeObserver(function() {
        scaleViewsToFit();
        setOpacity();
      }).observe(track);
    }
    window.addEventListener('resize', function() { scaleViewsToFit(); setOpacity(); });
  }

  function initModes() {
    var radios = document.querySelectorAll('input[name=view-mode]');
    radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        var shell = this.closest('.render-shell');
        if (!shell) return;
        var val = this.value;
        shell.querySelectorAll('.view').forEach(function(v) {
          v.style.display = 'none';
        });
        var active = shell.querySelector('.' + val + '.view');
        if (active) {
          active.style.display = 'block';
          scaleViewsToFit();
          if (val === 'swipe') {
            initSwipe();
            if (typeof window.updateSwipe === 'function') window.updateSwipe();
          } else if (val === 'onion-skin') {
            initOnion();
            if (typeof window.updateOnion === 'function') window.updateOnion();
          }
        }
        shell.querySelectorAll('.js-view-mode-item').forEach(function(lbl) {
          lbl.classList.toggle('selected', lbl.contains(radio));
        });
      });
    });
  }

  function initAll() {
    scaleViewsToFit();
    initSwipe();
    initOnion();
    initModes();
    window.setTimeout(scaleViewsToFit, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  window.addEventListener('load', initAll);
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.type === 'modal-opened') {
      setTimeout(initAll, 60);
    }
  });
})();
</script>
`;

// In modP2, find the iframe that FOLLOWS the heading with targetHeader
function injectScriptIntoIframeAfter(srcText, targetHeader, script) {
  const headerIdx = srcText.indexOf(targetHeader);
  if (headerIdx === -1) {
    console.error('Target header not found:', targetHeader);
    return srcText;
  }
  const iframeStart = srcText.indexOf('<iframe', headerIdx);
  if (iframeStart === -1) {
    console.error('No iframe found after header:', targetHeader);
    return srcText;
  }
  const iframeEnd = srcText.indexOf('</iframe>', iframeStart);
  
  // Find </head> inside this iframe
  const headEndIdx = srcText.indexOf('</head>', iframeStart);
  if (headEndIdx === -1 || headEndIdx > iframeEnd) {
    console.error('</head> not found in iframe for', targetHeader);
    return srcText;
  }

  console.log(`Injecting script for ${targetHeader} before </head> at ${headEndIdx}`);
  return srcText.slice(0, headEndIdx) + script + srcText.slice(headEndIdx);
}

modP2 = injectScriptIntoIframeAfter(modP2, '<code>‎presentation/likec4/projects/coffee-v1/png/c1_context.png‎</code>', interactiveScript);
modP2 = injectScriptIntoIframeAfter(modP2, '<code>‎presentation/likec4/projects/coffee-v1/png/c2_containers.png‎</code>', interactiveScript);
modP2 = injectScriptIntoIframeAfter(modP2, '<code>‎presentation/likec4/projects/coffee-v1/png/index.png‎</code>', interactiveScript);

// 4. In p2: inject optimized presentation styles and target scroll script
const page2Optimizations = `
<style>
  /* Optimisations de rendu pour diaporama, mobile et iframes */
  .PullRequestDiffsList-module__diffEntry__djnVa {
    content-visibility: visible !important;
  }
  .use-sticky-header-module__stickyHeader__sf0hv {
    position: static !important;
  }
  /* Colorations de code et diff étendues sur tout l'ascenseur horizontal */
  .diff-table,
  .DiffLines-module__tableLayoutFixed__Ui4OU {
    min-width: 100% !important;
    width: max-content !important;
  }
  .diff-text.syntax-highlighted-line {
    min-width: 100% !important;
    width: max-content !important;
    display: inline-block !important;
  }
  .diff-text-cell {
    background-clip: padding-box !important;
  }
  .FileRendererBlob-module__fileContentFrame__NyvSj,
  .RichDiff-module__fileRendererViewport__wcmGL {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    transition: height 0.15s ease-out;
  }

  /* Épurer l'interface GitHub sur mobile et dans le diaporama pour une lisibilité maximale */
  html.is-embedded .AppHeader,
  html.is-embedded .GlobalNav,
  html.is-embedded #repository-container-header {
    display: none !important;
  }
  @media (max-width: 900px), (max-height: 560px) {
    .AppHeader,
    .GlobalNav,
    #repository-container-header {
      display: none !important;
    }
    .container-xl,
    .Layout,
    .Layout-main {
      padding-left: 4px !important;
      padding-right: 4px !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    .gh-header {
      padding: 6px 8px !important;
    }
    .gh-header-title {
      font-size: 14px !important;
      line-height: 1.25 !important;
    }
    .DiffFileHeader-module__diff-file-header__UuNN4 {
      padding: 4px 6px !important;
      min-height: 32px !important;
    }
    .DiffFileHeader-module__file-name__VVXpg {
      font-size: 11px !important;
    }
  }
</style>
<script>
(function() {
  if (window.self !== window.top) {
    document.documentElement.classList.add('is-embedded');
  }

  function scrollToTarget() {
    var rawHash = window.location.hash ? window.location.hash.substring(1) : '';
    if (rawHash === 'bottom') {
      window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
      return;
    }
    var target = rawHash ? document.getElementById(rawHash) : null;
    // Par défaut : cibler le diff visuel C1/C2 (index.png avec le slider)
    if (!target) {
      target = document.getElementById('diff-94c54a1f3101c4266eb3ddad9e0c922c14015c322845a26e93952f348c76d6c0');
    }
    if (!target) {
      target = document.getElementById('diff-9031cdbb9779e2eb895e031359654e67f1bdfcda75eb412800c6ea3b5529fe1e');
    }
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollToTarget);
  } else {
    scrollToTarget();
  }
  window.addEventListener('load', scrollToTarget);
  [50, 150, 300, 600, 1000].forEach(function(delay) {
    setTimeout(scrollToTarget, delay);
  });

  window.addEventListener('hashchange', scrollToTarget);
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.type === 'scroll-to-target') {
      var t = document.getElementById(ev.data.targetId);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (ev.data && ev.data.type === 'modal-opened') {
      scrollToTarget();
    }
    if (ev.data && ev.data.type === 'diff-iframe-resized' && ev.data.height && ev.data.frameName) {
      var ifr = document.querySelector('iframe[name="' + ev.data.frameName + '"]');
      if (ifr) {
        var vp = ifr.closest('.RichDiff-module__fileRendererViewport__wcmGL');
        if (vp) {
          var targetH = Math.round(ev.data.height);
          if (Math.abs(vp.clientHeight - targetH) > 4) {
            vp.style.height = targetH + 'px';
          }
        }
      }
    }
  });
})();
</script>
`;

modP2 += page2Optimizations;

fs.writeFileSync(path.join(__dirname, 'public', 'pr-page2.html'), modP2);
console.log('Saved presentation/public/pr-page2.html successfully!');
