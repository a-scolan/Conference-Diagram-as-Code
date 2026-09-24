function getMermaidConfig() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'google-blueprint-light';
  const isDark = currentTheme === 'slate-architect' || currentTheme === 'dark';

  return {
    startOnLoad: false,
    theme: 'base',
    look: 'classic',
    flowchart: {
      nodeSpacing: 40,
      rankSpacing: 60,
      padding: 25,
      htmlLabels: true,
      useMaxWidth: false,
    },
    sequence: {
      useMaxWidth: false,
      wrap: true,
      width: 220,
      messageAlign: 'center',
      mirrorActors: true,
      boxTextMargin: 8,
      noteMargin: 12,
      messageMargin: 36,
      diagramMarginX: 50,
      diagramMarginY: 12,
    },
    themeVariables: isDark ? {
      // Theme sombre : Slate Architect
      primaryColor:        '#1e293b',
      primaryBorderColor:  '#38bdf8',
      primaryTextColor:    '#f8fafc',
      secondaryColor:      '#0f172a',
      secondaryBorderColor:'#818cf8',
      secondaryTextColor:  '#f8fafc',
      tertiaryColor:       '#064e3b',
      tertiaryBorderColor: '#34d399',
      tertiaryTextColor:   '#f8fafc',
      lineColor:           '#94a3b8',
      fontSize: '17px',
      fontFamily: "'Poppins', system-ui, sans-serif",
      noteBkgColor:        '#1e293b',
      noteTextColor:       '#f8fafc',
      noteBorderColor:     '#94a3b8',
      darkMode:            true,
      background:          'transparent',
      mainBkg:             '#0f172a',
      textColor:           '#f8fafc',
      clusterBkg:          '#1e293b',
      clusterBorder:       'rgba(255, 255, 255, 0.35)',
      actorBkg:            '#1e293b',
      actorBorder:         '#38bdf8',
      actorTextColor:      '#f8fafc',
      actorLineColor:      '#94a3b8',
      signalColor:         '#94a3b8',
      signalTextColor:     '#f8fafc',
      labelBoxBkgColor:    '#1e293b',
      labelBoxBorderColor: 'rgba(255, 255, 255, 0.12)',
      labelTextColor:      '#f8fafc',
      loopTextColor:       '#f8fafc',
      titleColor:          '#f8fafc',
      edgeLabelBackground: '#1e293b',
      git0:                '#38bdf8',
      git1:                '#34d399',
      git2:                '#fb923c',
      git3:                '#818cf8',
      gitBranchLabel0:     '#f8fafc',
      gitBranchLabel1:     '#f8fafc',
      commitLabelColor:    '#f8fafc',
      commitLabelBackground: '#1e293b',
      tagLabelColor:       '#ffffff',
      tagLabelBackground:  '#38bdf8',
    } : {
      // Theme clair : Google Blueprint Light (Haute lisibilité vidéo-projecteur)
      primaryColor:        '#e8f0fe',
      primaryBorderColor:  '#1a73e8',
      primaryTextColor:    '#0f172a',
      secondaryColor:      '#f1f5f9',
      secondaryBorderColor:'#0284c7',
      secondaryTextColor:  '#0f172a',
      tertiaryColor:       '#dcfce7',
      tertiaryBorderColor: '#16a34a',
      tertiaryTextColor:   '#0f172a',
      lineColor:           '#334155',
      fontSize: '17px',
      fontFamily: "'Poppins', system-ui, sans-serif",
      noteBkgColor:        '#fef3c7',
      noteTextColor:       '#0f172a',
      noteBorderColor:     '#f59e0b',
      darkMode:            false,
      background:          'transparent',
      mainBkg:             '#ffffff',
      textColor:           '#0f172a',
      clusterBkg:          '#f8fafc',
      clusterBorder:       '#94a3b8',
      actorBkg:            '#e8f0fe',
      actorBorder:         '#1a73e8',
      actorTextColor:      '#0f172a',
      actorLineColor:      '#334155',
      signalColor:         '#334155',
      signalTextColor:     '#0f172a',
      labelBoxBkgColor:    '#ffffff',
      labelBoxBorderColor: '#94a3b8',
      labelTextColor:      '#0f172a',
      loopTextColor:       '#0f172a',
      titleColor:          '#0f172a',
      edgeLabelBackground: '#ffffff',
      git0:                '#1a73e8',
      git1:                '#16a34a',
      git2:                '#ea580c',
      git3:                '#0284c7',
      gitBranchLabel0:     '#0f172a',
      gitBranchLabel1:     '#0f172a',
      commitLabelColor:    '#0f172a',
      commitLabelBackground: '#f1f5f9',
      tagLabelColor:       '#ffffff',
      tagLabelBackground:  '#1a73e8',
    }
  };
}

async function initMermaid() {
  document.querySelectorAll('.mermaid').forEach(function(el) {
    if (!el.dataset.mermaidSource) {
      el.dataset.mermaidSource = el.textContent;
    }
  });

  var mInstance = window.mermaid || null;
  if (!mInstance) {
    try {
      var mod = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
      mInstance = (mod && mod.default) ? mod.default : mod;
    } catch(e) {
      console.warn('Mermaid non chargé (mode hors-ligne / bloqué):', e.message);
    }
  }

  if (mInstance) {
    window.mermaid = mInstance;
    mInstance.initialize(getMermaidConfig());
    try {
      await mInstance.run();
    } catch (err) {
      console.warn('Erreur exécution Mermaid:', err);
    }
  }

  autoFit();
  enforcePart0GrayMarkers();
  document.querySelectorAll('.mermaid-wrap').forEach(function(w){
    var t = w.querySelector('.mermaid');
    var z = getInitialZoom(w);
    if (t) {
      t.dataset.zoom = String(z);
      t.style.transform = 'none';
    }
    updateZoomState(w);
    updateZoomLayout(w);
  });
}

function updateMerciQrSpotlightPosition() {
    var slide = document.querySelector('.slide[data-nav="Merci"]');
    if (!slide) return;
    var aside = slide.querySelector('.slide__aside--feedback');
    var qr = aside ? aside.querySelector('.qr-spotlight') : null;
    var subtitle = slide.querySelector('.slide__content .slide__subtitle');
    if (!aside || !qr || !subtitle) return;

    var slideRect = slide.getBoundingClientRect();
    var subtitleRect = subtitle.getBoundingClientRect();
    var qrRect = qr.getBoundingClientRect();

    var availableBottom = Math.max(0, subtitleRect.top - slideRect.top);
    var centeredTop = (availableBottom - qrRect.height) / 2;
    var minTop = 12;
    var maxTop = Math.max(minTop, availableBottom - qrRect.height);
    var computedTop = Math.max(minTop, Math.min(centeredTop, maxTop));

    slide.style.setProperty('--merci-qr-top', Math.round(computedTop) + 'px');
  }

  function getFitScaleMax(wrap) {
    var maxScale = parseFloat(wrap && wrap.dataset.fitScaleMax ? wrap.dataset.fitScaleMax : '');
    return !isNaN(maxScale) && maxScale > 0 ? maxScale : 1;
  }
  function getFitMode(wrap) {
    var mode = String(wrap && wrap.dataset.fitMode ? wrap.dataset.fitMode : 'contain').toLowerCase();
    return mode === 'cover' ? 'cover' : 'contain';
  }

  function getStableMermaidViewBox(svg) {
    if (!svg) return null;
    var rawViewBox = svg.dataset.rawViewBox || svg.getAttribute('viewBox');
    if (!rawViewBox) return null;
    if (!svg.dataset.rawViewBox) svg.dataset.rawViewBox = rawViewBox;

    var parts = svg.dataset.rawViewBox.split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some(function(v){ return Number.isNaN(v); })) return null;

    var padX = Math.max(36, Math.min(72, parts[2] * 0.08));
    var padY = Math.max(32, Math.min(72, parts[3] * 0.08));
    return [parts[0] - padX, parts[1] - padY, parts[2] + padX * 2, parts[3] + padY * 2];
  }

  /* Fit a single .mermaid element; returns true if dimensions were valid */
  function autoFitMermaid(mDiv) {
    var svg = mDiv.querySelector('svg');
    if (!svg) return false;
    var vp = getStableMermaidViewBox(svg);
    if (!vp) return false;
    svg.setAttribute('viewBox', vp.join(' '));
    var vw = vp[2], vh = vp[3];
    var wrap = mDiv.closest('.mermaid-wrap');
    var scroll = mDiv.closest('.mermaid-scroll');
    var cw = scroll ? scroll.clientWidth : mDiv.parentElement.clientWidth;
    var ch = scroll ? scroll.clientHeight : mDiv.parentElement.clientHeight;
    /* Skip elements whose container has no real dimensions (off-screen / display:none) */
    if (!cw || cw < 40 || !ch || ch < 40) return false;
    var fitMode = getFitMode(wrap);
    var rawScale = fitMode === 'cover'
      ? Math.max(cw / vw, ch / vh)
      : Math.min(cw / vw, ch / vh);
    var scale = Math.min(rawScale, getFitScaleMax(wrap));
    if (!isFinite(scale) || scale <= 0) scale = 1;
    var fittedWidth = Math.round(vw * scale);
    var fittedHeight = Math.round(vh * scale);
    svg.removeAttribute('height');
    svg.removeAttribute('width');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.maxWidth = 'none';
    svg.style.maxHeight = 'none';
    mDiv.dataset.baseW = fittedWidth;
    mDiv.dataset.baseH = fittedHeight;
    mDiv.style.width = fittedWidth + 'px';
    mDiv.style.height = fittedHeight + 'px';
    if (wrap) delete wrap.dataset.centeredZoom;
    return true;
  }
  window.autoFitMermaid = autoFitMermaid;
  function autoFit() {
    document.querySelectorAll('.mermaid').forEach(function(mDiv) {
      autoFitMermaid(mDiv);
    });
    document.querySelectorAll('.slide__kpi-val').forEach(function(el) {
      if (el.scrollWidth > el.clientWidth) {
        var s = el.clientWidth / el.scrollWidth;
        el.style.transform = 'scale(' + s + ')';
        el.style.transformOrigin = 'left top';
      }
    });
    document.querySelectorAll('.slide--quote blockquote').forEach(function(el) {
      var len = el.textContent.trim().length;
      if (len > 100) {
        var scale = Math.max(0.5, 100 / len);
        var fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = Math.max(16, Math.round(fs * scale)) + 'px';
      }
    });
    updateMerciQrSpotlightPosition();
  }
  window.autoFit = autoFit;


  function enforcePart0GrayMarkers() {
    var existing = document.getElementById('part0-gray-enforcer');
    if (existing) return;
    var style = document.createElement('style');
    style.id = 'part0-gray-enforcer';
    style.textContent = [
      '.slide[data-part="0"] .slide__bullets li::before { background: #9aa0a6 !important; box-shadow: none !important; }',
      '.deck > .slide:nth-of-type(-n+5) .slide__bullets li::before { background: #9aa0a6 !important; box-shadow: none !important; }',
      '.slide[data-part="0"] .key-card__marker { color: #9aa0a6 !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }
  function setupMermaidListeners() {
    window.addEventListener('resize', function() {
      autoFit();
      document.querySelectorAll('.slide.visible .mermaid-wrap').forEach(function(w){ updateZoomLayout(w); scheduleCenterMermaidViewport(w, true); });
    }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        autoFit();
        document.querySelectorAll('.slide.visible .mermaid-wrap').forEach(function(w){ updateZoomLayout(w); scheduleCenterMermaidViewport(w, true); });
      });
    }
  }

  setupMermaidListeners();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaid);
  } else {
    initMermaid();
  }

  window.addEventListener('deck-theme-change', async function() {
    if (window.mermaid) {
      try {
        window.mermaid.initialize(getMermaidConfig());
        var wraps = document.querySelectorAll('.mermaid-wrap');
        for (var i = 0; i < wraps.length; i++) {
          var w = wraps[i];
          var m = w.querySelector('.mermaid');
          if (m && m.dataset.mermaidSource) {
            var uniqueId = 'mermaid-theme-' + i + '-' + Date.now();
            var res = await window.mermaid.render(uniqueId, m.dataset.mermaidSource);
            m.innerHTML = res.svg;
            autoFitMermaid(m);
          }
        }
      } catch(e) {
        console.warn('Erreur re-render Mermaid:', e);
      }
    }
    autoFit();
    enforcePart0GrayMarkers();
    document.querySelectorAll('.mermaid-wrap').forEach(function(w){
      var t = w.querySelector('.mermaid');
      var z = getInitialZoom(w);
      if (t) {
        t.dataset.zoom = String(z);
        t.style.transform = 'none';
      }
      updateZoomState(w);
      updateZoomLayout(w);
    });
  });