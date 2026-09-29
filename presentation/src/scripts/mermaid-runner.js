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
      padding: 20,
      htmlLabels: true,
      useMaxWidth: false,
      wrappingWidth: 220,
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
  adjustPrReviewTag();
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
    adjustPrReviewTag();
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

  function adjustPrReviewTag() {
    var slide = document.querySelector('.slide--pr-review');
    if (!slide) return;
    var svg = slide.querySelector('.mermaid svg');
    if (!svg) return;
    var bkg = svg.querySelector('.tag-label-bkg');
    var hole = svg.querySelector('.tag-hole');
    var txt = svg.querySelector('.tag-label');
    if (!bkg || !hole || !txt) return;

    var g = svg.querySelector('.pr-tag-group');
    if (!g) {
      g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pr-tag-group');
      bkg.parentNode.insertBefore(g, bkg);
      g.appendChild(bkg);
      g.appendChild(hole);
      g.appendChild(txt);
    }

    var pointsAttr = bkg.getAttribute('points');
    if (!pointsAttr) return;
    var points = pointsAttr.trim().split(/[\s\n,]+/).map(Number);
    var minX = Infinity;
    for (var i = 0; i < points.length; i += 2) {
      if (points[i] < minX) minX = points[i];
    }
    var tipCenterY = parseFloat(hole.getAttribute('cy'));
    if (isNaN(tipCenterY)) tipCenterY = 68.8;

    // 1. Masquer la ligne droite en pointillés de la branche 1 qui commence à x=0 (trop tôt)
    var b1 = svg.querySelector('line.branch1');
    if (b1) b1.style.display = 'none';

    var commitLabels = svg.querySelector('.commit-labels');

    // 2. Déterminer la géométrie à partir des commits réels
    // Commits sur main (cy ≈ -2)
    var mainCircles = Array.from(svg.querySelectorAll('circle.commit0')).filter(function(c){
      return Math.abs(parseFloat(c.getAttribute('cy')) - (-2)) < 5;
    });
    var lastMain = mainCircles[mainCircles.length - 1];
    var lastMainCx = lastMain ? parseFloat(lastMain.getAttribute('cx')) : 160;

    // Commits sur branch1 (alefest_coffee_v2)
    var branch1Circles = Array.from(svg.querySelectorAll('circle.commit1'));
    var lastBranch1 = branch1Circles[branch1Circles.length - 1];
    var branch1Cx = lastBranch1 ? parseFloat(lastBranch1.getAttribute('cx')) : 60;
    var branch1Cy = lastBranch1 ? parseFloat(lastBranch1.getAttribute('cy')) : 88;

    // Point de rabattement sur main (1 pas régulier de 50px après le dernier commit de main)
    var ghostCx = lastMainCx + 50;
    var ghostCy = -2;
    var ghostR = 10;

    // 3. Créer le point en pointillés (ghost commit) marquant le lieu de merge de la Pull Request
    var ghost = svg.querySelector('.pr-ghost-commit');
    if (!ghost) {
      ghost = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ghost.setAttribute('class', 'pr-ghost-commit');
      if (commitLabels) {
        commitLabels.parentNode.insertBefore(ghost, commitLabels);
      } else {
        svg.appendChild(ghost);
      }
    }
    ghost.setAttribute('cx', String(ghostCx));
    ghost.setAttribute('cy', String(ghostCy));
    ghost.setAttribute('r', String(ghostR));

    var ghostInner = svg.querySelector('.pr-ghost-commit-inner');
    if (!ghostInner) {
      ghostInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ghostInner.setAttribute('class', 'pr-ghost-commit-inner');
      if (commitLabels) {
        commitLabels.parentNode.insertBefore(ghostInner, commitLabels);
      } else {
        svg.appendChild(ghostInner);
      }
    }
    ghostInner.setAttribute('cx', String(ghostCx));
    ghostInner.setAttribute('cy', String(ghostCy));
    ghostInner.setAttribute('r', '5');

    // 4. Arrimage élégant de la pointe de l'étiquette de Pull Request sur ce point en pointillés
    var targetX = ghostCx + ghostR - 1;
    var targetY = ghostCy;
    var dx = targetX - minX;
    var dy = targetY - tipCenterY;

    g.setAttribute('transform', 'translate(' + dx.toFixed(2) + ', ' + dy.toFixed(2) + ')');

    // 5. Relier le dernier commit de main au flanc gauche du point en pointillés
    var mainExt = svg.querySelector('.main-ext-arrow');
    if (!mainExt) {
      mainExt = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mainExt.setAttribute('class', 'main-ext-arrow');
      if (commitLabels) {
        commitLabels.parentNode.insertBefore(mainExt, commitLabels);
      } else {
        svg.appendChild(mainExt);
      }
    }
    mainExt.setAttribute('d', 'M ' + lastMainCx + ' -2 L ' + (ghostCx - ghostR) + ' -2');

    // 6. Prolonger la ligne de main après le point en pointillés
    var mainCont = svg.querySelector('.main-cont-arrow');
    if (!mainCont) {
      mainCont = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mainCont.setAttribute('class', 'main-cont-arrow');
      if (commitLabels) {
        commitLabels.parentNode.insertBefore(mainCont, commitLabels);
      } else {
        svg.appendChild(mainCont);
      }
    }
    mainCont.setAttribute('d', 'M ' + (ghostCx + ghostR) + ' -2 L ' + (ghostCx + ghostR + 35) + ' -2');

    // 7. Trajectoire en pointillés de la PR qui se rabat depuis branch1Cx sous les fix jusqu'au flanc bas du ghost commit
    var prFoldPath = svg.querySelector('.pr-fold-path');
    if (!prFoldPath) {
      prFoldPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      prFoldPath.setAttribute('class', 'pr-fold-path');
      if (commitLabels) {
        commitLabels.parentNode.insertBefore(prFoldPath, commitLabels);
      } else {
        svg.appendChild(prFoldPath);
      }
    }
    // Départ du commit v2 (branch1Cx, branch1Cy), passe sous les fix jusqu'à ghostCx - 20, puis courbe vers ghostCy + ghostR
    prFoldPath.setAttribute('d', 'M ' + branch1Cx + ' ' + branch1Cy + ' L ' + (ghostCx - 20) + ' ' + branch1Cy + ' A 20 20 0 0 0 ' + ghostCx + ' ' + (branch1Cy - 20) + ' L ' + ghostCx + ' ' + (ghostCy + ghostR));

    // 8. Prolonger l'axe de main (branch0)
    var b0 = svg.querySelector('line.branch0');
    if (b0) {
      b0.setAttribute('x2', String(ghostCx + ghostR + 40));
    }

    // 9. Ajuster le viewBox pour intégrer proprement l'étiquette et l'extrémité droite
    var rawVp = svg.getAttribute('viewBox');
    if (rawVp) {
      var vp = rawVp.split(/[\s,]+/).map(Number);
      if (vp.length === 4 && (vp[0] + vp[2]) < (targetX + 85)) {
        vp[2] = (targetX + 85) - vp[0];
        svg.setAttribute('viewBox', vp.join(' '));
      }
    }
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
    // Les couleurs des diagrammes Mermaid (rectangles, textes, contours, flèches, sous-graphes)
    // sont directement pilotées par les variables CSS (var(--text), var(--surface), var(--diagram-*), etc.).
    // Ré-exécuter window.mermaid.render() recalculait le layout de manière isolée hors CSS de diapositive,
    // ce qui brisait le dimensionnement des boîtes et décalait le texte.
    // L'adaptation de thème se fait donc instantanément et sans perte de géométrie via les variables CSS.
    autoFit();
    enforcePart0GrayMarkers();
    adjustPrReviewTag();
    document.querySelectorAll('.mermaid-wrap').forEach(function(w){
      updateZoomState(w);
      updateZoomLayout(w);
    });
  });