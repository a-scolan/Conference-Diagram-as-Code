/* ============ Embed iframe controls ============ */
  function isLikeC4Embed(wrap) {
    return !!(wrap && wrap.dataset.embedKind === 'likec4');
  }
  function isManualEmbed(wrap) {
    return !!(wrap && wrap.dataset.loadMode === 'manual');
  }
  function getEmbedTimeout(wrap) {
    var timeout = parseInt(wrap && wrap.dataset.embedTimeout ? wrap.dataset.embedTimeout : '', 10);
    if (!isNaN(timeout) && timeout > 0) return timeout;
    return isManualEmbed(wrap) ? 10000 : 6000;
  }
  function clearEmbedFallbackTimer(wrap) {
    if (wrap && wrap._embedFallbackTimer) {
      window.clearTimeout(wrap._embedFallbackTimer);
      wrap._embedFallbackTimer = 0;
    }
  }
  function updateLikeC4ActionState(wrap) {
    var button = wrap ? wrap.querySelector('.embed-likec4-cta') : null;
    var label = button ? button.querySelector('.embed-likec4-cta__label') : null;
    if (!button || !label) return;

    var isLoading = wrap.classList.contains('is-loading');
    var isLoaded = wrap.classList.contains('is-loaded');
    var isFallback = wrap.classList.contains('is-fallback');

    button.disabled = !!isLoading;
    button.classList.toggle('is-busy', isLoading);
    button.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    label.textContent = isLoading ? 'Chargement LikeC4…' : 'Rendu LikeC4';

    if (isLoading) {
      button.setAttribute('title', 'Chargement du rendu LikeC4');
      button.setAttribute('aria-label', 'Chargement du rendu LikeC4');
    } else if (isLoaded) {
      button.setAttribute('title', 'Recharger le rendu LikeC4');
      button.setAttribute('aria-label', 'Recharger le rendu LikeC4');
    } else if (isFallback) {
      button.setAttribute('title', 'Réessayer le rendu LikeC4');
      button.setAttribute('aria-label', 'Réessayer le rendu LikeC4');
    } else {
      button.setAttribute('title', 'Rendu');
      button.setAttribute('aria-label', 'Rendu');
    }
  }
  function updateEmbedLoaderState(wrap, isLoading) {
    var loader = wrap ? wrap.querySelector('.embed-loader') : null;
    if (!loader) return;
    var button = loader.querySelector('.embed-loader__button');
    var hint = loader.querySelector('.embed-loader__hint');
    if (button) {
      button.disabled = !!isLoading;
      button.textContent = isLoading ? 'Chargement LikeC4…' : 'Rendu';
    }
    if (hint) {
      hint.textContent = isLoading
        ? 'Le rendu démarre… je lui laisse un peu plus de temps avant le fallback.'
        : 'Déclenche le chargement quand tu veux.';
    }
  }
  function ensureLikeC4PrimaryAction(wrap) {
    if (!isLikeC4Embed(wrap) || isManualEmbed(wrap) || wrap.querySelector('.embed-likec4-cta')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'embed-likec4-cta';
    button.innerHTML = [
      '<span class="embed-likec4-cta__status" aria-hidden="true"></span>',
      '<span class="embed-likec4-cta__label">Rendu</span>'
    ].join('');
    button.addEventListener('click', function() {
      startEmbedLoad(wrap, { forceReload: wrap.classList.contains('is-loaded') || wrap.classList.contains('is-fallback') });
    });
    wrap.appendChild(button);
  }
  function ensureManualEmbedLoader(wrap) {
    if (!isManualEmbed(wrap) || wrap.querySelector('.embed-loader')) return;
    var fallback = wrap.querySelector('.embed-fallback');
    var loader = document.createElement('div');
    loader.className = 'embed-loader';
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = [
      '<button type="button" class="embed-loader__button">Rendu</button>'
    ].join('');
    loader.querySelector('.embed-loader__button').addEventListener('click', function() {
      startEmbedLoad(wrap);
    });
    if (fallback) {
      wrap.insertBefore(loader, fallback);
    } else {
      wrap.appendChild(loader);
    }
  }
  function markEmbedLoaded(wrap) {
    clearEmbedFallbackTimer(wrap);
    wrap.classList.remove('is-loading', 'is-fallback');
    wrap.classList.add('is-loaded');
    var fallback = wrap.querySelector('.embed-fallback');
    if (fallback) fallback.classList.remove('visible');
    updateEmbedLoaderState(wrap, false);
    updateLikeC4ActionState(wrap);
  }
  function showEmbedFallback(wrap) {
    clearEmbedFallbackTimer(wrap);
    wrap.classList.remove('is-loading', 'is-loaded');
    wrap.classList.add('is-fallback');
    var fallback = wrap.querySelector('.embed-fallback');
    if (fallback) fallback.classList.add('visible');
    updateEmbedLoaderState(wrap, false);
    updateLikeC4ActionState(wrap);
  }
  function armEmbedFallbackTimer(wrap, iframe) {
    clearEmbedFallbackTimer(wrap);
    wrap._embedFallbackTimer = window.setTimeout(function() {
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body && doc.body.children.length > 0) {
          markEmbedLoaded(wrap);
          return;
        }
      } catch (e) {
        /* Cross-origin or blocked — fall through to the fallback overlay. */
      }
      showEmbedFallback(wrap);
    }, getEmbedTimeout(wrap));
  }
  function getThemeAdjustedUrl(rawUrl) {
    if (!rawUrl) return '';
    var isDark = document.documentElement.getAttribute('data-theme') === 'slate-architect' || document.documentElement.getAttribute('data-theme') === 'dark';
    var targetTheme = isDark ? 'dark' : 'light';
    if (rawUrl.indexOf('theme=') !== -1) {
      return rawUrl.replace(/theme=(dark|light)/g, 'theme=' + targetTheme);
    }
    if (rawUrl.indexOf('#') !== -1) {
      var parts = rawUrl.split('#');
      var path = parts[0];
      var hash = parts[1];
      var joiner = hash.indexOf('?') !== -1 ? '&' : '?';
      return path + '#' + hash + joiner + 'theme=' + targetTheme;
    }
    return rawUrl + (rawUrl.indexOf('?') !== -1 ? '&' : '?') + 'theme=' + targetTheme;
  }

  function startEmbedLoad(wrap, options) {
    if (!wrap) return;
    var iframe = wrap.querySelector('iframe');
    var fallback = wrap.querySelector('.embed-fallback');
    var forceReload = !!(options && options.forceReload);
    if (!iframe || !iframe.dataset.src) return;
    if (wrap.classList.contains('is-loading') && !forceReload) return;
    wrap._embedRequested = true;
    delete wrap.dataset.likec4ViewportTunedFor;
    if (fallback) fallback.classList.remove('visible');
    wrap.classList.remove('is-fallback', 'is-loaded');
    wrap.classList.add('is-loading');
    updateEmbedLoaderState(wrap, true);
    updateLikeC4ActionState(wrap);

    var targetUrl = getThemeAdjustedUrl(iframe.dataset.src);
    if (forceReload && iframe.src) {
      iframe.src = targetUrl;
    } else if (!iframe.src || forceReload) {
      iframe.src = targetUrl;
    }

    armEmbedFallbackTimer(wrap, iframe);
  }
  function reloadEmbed(btn) {
    var wrap = btn.closest('.embed-wrap');
    startEmbedLoad(wrap, { forceReload: true });
  }
  function openEmbedExternal(btn) {
    var wrap = btn.closest('.embed-wrap');
    var iframe = wrap.querySelector('iframe');
    var url = iframe.src || iframe.dataset.src;
    if (url) window.open(url, '_blank');
  }
  function shouldTuneLikeC4Viewport(wrap) {
    return isLikeC4Embed(wrap);
  }
  function getLikeC4ZoomOutSteps(wrap) {
    var steps = parseInt(wrap && wrap.dataset.likec4ZoomoutSteps ? wrap.dataset.likec4ZoomoutSteps : '', 10);
    return !isNaN(steps) && steps > 0 ? steps : 0;
  }
  function triggerLikeC4Control(doc, selector, count) {
    var remaining = Math.max(0, count || 0);
    var clicks = 0;
    while (remaining > 0) {
      var btn = doc.querySelector(selector);
      if (!btn || btn.disabled) break;
      btn.click();
      clicks += 1;
      remaining -= 1;
    }
    return clicks;
  }
  function applyLikeC4ViewportTuning(wrap) {
    if (!shouldTuneLikeC4Viewport(wrap)) return false;
    var iframe = wrap.querySelector('iframe');
    if (!iframe || !iframe.contentWindow) return false;
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body) return false;
      // Par défaut toujours fitview pour bien centrer le contenu au chargement
      var fitClicks = String(wrap.dataset.likec4FitOnLoad || 'true').toLowerCase() === 'false' ? 0 : 1;
      var fitDone = triggerLikeC4Control(doc, '.react-flow__controls-fitview', fitClicks);
      var zoomOutDone = triggerLikeC4Control(doc, '.react-flow__controls-zoomout', getLikeC4ZoomOutSteps(wrap));
      return !!(fitDone || zoomOutDone);
    } catch (e) {
      return false;
    }
  }
  function scheduleLikeC4ViewportTuning(wrap, force) {
    if (!wrap || !shouldTuneLikeC4Viewport(wrap)) return;
    var iframe = wrap.querySelector('iframe');
    var stamp = iframe ? (iframe.src || iframe.dataset.src || wrap.id || '') : (wrap.id || '');
    if (force) delete wrap.dataset.likec4ViewportTunedFor;
    if (!force && wrap.dataset.likec4ViewportTunedFor === stamp) return;
    if (Array.isArray(wrap._likec4ViewportTimers)) {
      wrap._likec4ViewportTimers.forEach(function(id) { window.clearTimeout(id); });
    }
    wrap._likec4ViewportTimers = [80, 220, 480].map(function(delay) {
      return window.setTimeout(function() {
        if (wrap.dataset.likec4ViewportTunedFor === stamp) return;
        if (applyLikeC4ViewportTuning(wrap)) {
          wrap.dataset.likec4ViewportTunedFor = stamp;
        }
      }, delay);
    });
  }
  function setC2UnifiedView(slide, view) {
    if (!slide) return;
    var targetView = (view === 'likec4' || view === '2') ? 'likec4' : 'mermaid';
    var isLikeC4 = targetView === 'likec4';
    slide.setAttribute('data-view', targetView);
    slide.setAttribute('data-active-step', isLikeC4 ? '2' : '1');
    slide.querySelectorAll('.c2-unified__toggle').forEach(function(b) {
      b.setAttribute('aria-pressed', String(isLikeC4));
      b.textContent = isLikeC4 ? 'Vue Mermaid ↗' : 'Vue LikeC4 ↗';
      b.setAttribute('aria-label', isLikeC4 ? 'Afficher le diagramme Mermaid' : 'Afficher l\'aperçu LikeC4');
    });

    window.requestAnimationFrame(function() {
      autoFit();
      var likec4Wrap = slide.querySelector('.c2-unified__view--likec4 .embed-wrap');
      if (isLikeC4 && likec4Wrap) {
        if (!likec4Wrap.classList.contains('is-loaded')) {
          startEmbedLoad(likec4Wrap);
        } else {
          scheduleLikeC4ViewportTuning(likec4Wrap, true);
        }
      }
      var mermaidWrap = slide.querySelector('.c2-unified__view--mermaid .mermaid-wrap');
      if (mermaidWrap) {
        var mt = mermaidWrap.querySelector('.mermaid');
        if (mt && (!mt.dataset.baseW || parseFloat(mt.dataset.baseW) < 40)) {
          var ok = autoFitMermaid(mt);
          if (!ok) {
            window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){
              autoFitMermaid(mt);
              var mz2 = getInitialZoom(mermaidWrap);
              mt.dataset.zoom = String(mz2);
              updateZoomState(mermaidWrap);
              updateZoomLayout(mermaidWrap);
              scheduleCenterMermaidViewport(mermaidWrap, true);
            });});
            return;
          }
          var mz = getInitialZoom(mermaidWrap);
          mt.dataset.zoom = String(mz);
          updateZoomState(mermaidWrap);
        }
        updateZoomLayout(mermaidWrap);
        scheduleCenterMermaidViewport(mermaidWrap, true);
      }
    });
  }
  window.setC2UnifiedView = setC2UnifiedView;

  function toggleC2UnifiedView(btn) {
    var slide = btn.closest('.slide--c2-unified');
    if (!slide) return;
    var current = slide.getAttribute('data-view') === 'likec4' ? 'likec4' : 'mermaid';
    var next = current === 'mermaid' ? 'likec4' : 'mermaid';
    if (window.deckEngine && !window.deckEngine.isInIframe) {
      window.deckEngine.setSlideStep(slide, next === 'likec4' ? '2' : '1');
    } else {
      setC2UnifiedView(slide, next);
    }
  }
  window.toggleC2UnifiedView = toggleC2UnifiedView;
  function toggleLiveCodingView(btn, initialStep) {
    var slide = btn.closest('.slide--live-coding');
    if (!slide) return;
    var current = slide.getAttribute('data-view') === 'detail' ? 'detail' : 'launcher';
    var next = current === 'launcher' ? 'detail' : 'launcher';
    slide.setAttribute('data-view', next);

    var launcherButtons = slide.querySelectorAll('.live-coding__launcher-btn');
    launcherButtons.forEach(function(b) {
      b.setAttribute('aria-expanded', String(next === 'detail'));
    });

    if (next === 'detail') {
      var wrap = slide.querySelector('.live-coding__embed-wrap');
      if (wrap) startEmbedLoad(wrap);
      if (initialStep) {
        setLiveCodingStep(slide, initialStep);
      }
    }
  }
  window.toggleLiveCodingView = toggleLiveCodingView;

  function setLiveCodingStep(target, step) {
    var slide = target.closest ? target.closest('.slide--live-coding') : target;
    if (!slide) return;
    slide.querySelectorAll('.live-coding__step-btn').forEach(function(b) {
      var match = (b.getAttribute('data-step-target') === step);
      b.classList.toggle('is-active', match);
      b.setAttribute('aria-selected', match ? 'true' : 'false');
    });
    var codeBlock = slide.querySelector('.live-coding__code-block');
    if (codeBlock) {
      codeBlock.setAttribute('data-active-step', step);
    }
  }
  window.setLiveCodingStep = setLiveCodingStep;

  function setCodePreviewStep(btn, step) {
    var frame = btn.closest ? (btn.closest('.code-preview__frame') || btn.closest('.slide--code-preview')) : null;
    if (!frame) return;
    frame.querySelectorAll('.code-stepper__btn').forEach(function(b) {
      var match = (b.getAttribute('data-step-target') === step);
      b.classList.toggle('is-active', match);
      b.setAttribute('aria-selected', match ? 'true' : 'false');
    });
    var codeBlock = frame.querySelector('.slide__code-block');
    if (codeBlock) {
      codeBlock.setAttribute('data-active-step', step);
    }
  }
  window.setCodePreviewStep = setCodePreviewStep;

  function openPrModalOrTab(btn) {
    var minW = 960;
    var minH = 680;
    var codeTarget = 'diff-9031cdbb9779e2eb895e031359654e67f1bdfcda75eb412800c6ea3b5529fe1e';
    // Si la fenêtre n'a pas assez d'espace, basculer directement sur un onglet dédié
    if (window.innerWidth < minW || window.innerHeight < minH) {
      window.open('./pr-page2.html#' + codeTarget, '_blank', 'noopener,noreferrer');
      return;
    }
    var slide = (btn && btn.closest && btn.closest('.slide--pr-review')) || document.querySelector('.slide--pr-review');
    if (slide && window.deckEngine) {
      window.deckEngine.setSlideStep(slide, '2');
      return;
    }
    togglePrBackupModal(btn);
  }
  window.openPrModalOrTab = openPrModalOrTab;

  function togglePrBackupModal(btn) {
    var slide = (btn && btn.closest && btn.closest('.slide--pr-review')) || document.querySelector('.slide--pr-review');
    if (!slide) return;
    if (window.deckEngine && slide.getAttribute('data-active-step') && slide.getAttribute('data-active-step') !== '1') {
      window.deckEngine.setSlideStep(slide, '1');
      return;
    }
    var modal = slide.querySelector('.pr-backup-modal');
    if (!modal) return;
    var isOpen = modal.classList.contains('is-open');
    modal.classList.toggle('is-open', !isOpen);
    modal.style.display = isOpen ? 'none' : 'flex';
    modal.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    if (!isOpen) {
      var iframe = modal.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage({ type: 'modal-opened' }, '*');
        } catch (_) {}
      }
    }
  }
  window.togglePrBackupModal = togglePrBackupModal;

  function jumpPrDiff(targetId, btn) {
    var modal = (btn && btn.closest && btn.closest('.pr-backup-modal')) || document.querySelector('.pr-backup-modal');
    if (modal) {
      var nav = modal.querySelector('.pr-backup-modal__nav');
      if (nav) {
        nav.querySelectorAll('.pr-backup-modal__nav-btn').forEach(function(b) {
          var isActive = btn ? (b === btn) : (b.getAttribute('onclick') && b.getAttribute('onclick').indexOf(targetId) > -1);
          b.classList.toggle('is-active', isActive);
        });
      }
    }
    if (!modal) return;
    var iframe = modal.querySelector('iframe');
    if (!iframe) return;

    var tabLink = modal.querySelector('.pr-backup-modal__tab-btn');
    if (tabLink) tabLink.href = './pr-page2.html#' + targetId;

    var slide = modal.closest('.slide--pr-review') || document.querySelector('.slide--pr-review');
    if (slide && window.deckEngine) {
      var s = (targetId.indexOf('9031cdbb') > -1) ? '2' : (targetId.indexOf('94c54a1f') > -1 ? '3' : null);
      if (s && slide.getAttribute('data-active-step') !== s) {
        slide.setAttribute('data-active-step', s);
        if (!window.deckEngine.isInIframe) {
          window.deckEngine.broadcastSlideChange();
        }
      }
    }

    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'scroll-to-target', targetId: targetId }, '*');
        if (iframe.contentWindow.location) {
          iframe.contentWindow.location.hash = targetId;
        }
        if (iframe.contentWindow.document) {
          var el = iframe.contentWindow.document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
      }
    } catch (_) {}
    iframe.src = './pr-page2.html#' + targetId;
  }
  window.jumpPrDiff = jumpPrDiff;

  function switchWorkspaceTreeTab(btn, tabId) {
    var slide = btn.closest('.slide--workspace-tree');
    if (!slide) {
      var frame = btn.closest('.workspace-tree__tab-frame') || btn.closest('.workspace-tree__ascii-frame');
      if (frame) slide = frame.closest('.slide--workspace-tree');
    }
    if (!slide) return;
    slide.querySelectorAll('.workspace-tree__tab-btn').forEach(function(b) {
      var isActive = (b.getAttribute('data-tab-target') === tabId);
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    slide.querySelectorAll('.workspace-tree__tab-content').forEach(function(content) {
      var isMatch = (content.getAttribute('data-tab-id') === tabId);
      content.classList.toggle('is-active', isMatch);
      content.style.setProperty('display', isMatch ? 'flex' : 'none', 'important');
    });
    slide.querySelectorAll('.workspace-tree__file-highlight').forEach(function(item) {
      var isActive = (item.getAttribute('data-tab-target') === tabId);
      item.classList.toggle('is-active', isActive);
      var badge = item.querySelector('.file-status-badge');
      if (badge) {
        badge.textContent = isActive ? 'actif' : 'ouvert';
      }
    });

    var targetStep = (tabId === 'spec') ? '2' : '1';
    slide.setAttribute('data-active-step', targetStep);
    slide.querySelectorAll('.slide__code-block').forEach(function(cb) {
      cb.setAttribute('data-active-step', targetStep);
    });
  }
  window.switchWorkspaceTreeTab = switchWorkspaceTreeTab;

  function activateSlideCodeTab(container, tabId) {
    var root = container.closest ? (container.closest('.code-preview__frame') || container.closest('.code-preview__pane') || container.closest('.slide')) : container;
    if (!root) return;
    root.querySelectorAll('.code-preview__tab-btn').forEach(function(b) {
      var isActive = (b.getAttribute('data-tab-target') === tabId);
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    root.querySelectorAll('.code-preview__tab-content').forEach(function(content) {
      var isMatch = (content.getAttribute('data-tab-id') === tabId);
      content.classList.toggle('is-active', isMatch);
      content.style.setProperty('display', isMatch ? 'flex' : 'none', 'important');
    });
  }
  window.activateSlideCodeTab = activateSlideCodeTab;

  function switchSlideCodeTab(btn, tabId) {
    activateSlideCodeTab(btn, tabId);
    var slide = btn.closest('.slide');
    if (slide && window.deckEngine) {
      var tabContent = slide.querySelector('.code-preview__tab-content[data-tab-id="' + tabId + '"]');
      if (tabContent) {
        var stepsInTab = tabContent.querySelectorAll('[data-step]');
        if (stepsInTab.length > 0) {
          var curStep = window.deckEngine.getSlideCurrentStep(slide);
          var hasCurStep = false;
          stepsInTab.forEach(function(el) {
            if (el.getAttribute('data-step') === curStep) hasCurStep = true;
          });
          if (!hasCurStep) {
            var firstStep = stepsInTab[0].getAttribute('data-step');
            window.deckEngine.setSlideStep(slide, firstStep);
          }
        }
      }
    }
  }
  window.switchSlideCodeTab = switchSlideCodeTab;

  function toggleCodePreviewSplit(btn) {
    var slide = btn.closest('.slide--code-preview');
    if (!slide) return;
    var mode = slide.getAttribute('data-split-mode') || 'half'; // 'half' ou 'two-thirds'
    var current = slide.getAttribute('data-split') || (mode === 'two-thirds' ? 'two-thirds' : 'half');
    var next;
    if (mode === 'two-thirds') {
      next = current === 'two-thirds' ? 'third' : 'two-thirds';
    } else {
      next = current === 'half' ? 'third' : 'half';
    }
    slide.setAttribute('data-split', next);

    var nextTitle = (mode === 'two-thirds')
      ? (next === 'two-thirds' ? 'Basculer vers 1/3 - 2/3' : 'Basculer vers 2/3 - 1/3')
      : (next === 'half' ? 'Basculer vers 1/3 - 2/3' : 'Basculer vers 1/2 - 1/2');
    var nextAria = (mode === 'two-thirds')
      ? (next === 'two-thirds' ? 'Basculer vers une vue 1/3 code, 2/3 schéma' : 'Basculer vers une vue 2/3 code, 1/3 schéma')
      : (next === 'half' ? 'Basculer vers une vue 1/3 code, 2/3 schéma' : 'Basculer vers une vue 50/50');

    slide.querySelectorAll('.code-preview__split-toggle').forEach(function(b) {
      b.setAttribute('title', nextTitle);
      b.setAttribute('aria-label', nextAria);
    });

    // Réajuster les diagrammes ou iframes au redimensionnement
    window.requestAnimationFrame(function() {
      if (typeof window.autoFit === 'function') window.autoFit();
      slide.querySelectorAll('.embed-wrap').forEach(function(likec4Wrap) {
        if (likec4Wrap && likec4Wrap.classList.contains('is-loaded')) {
          scheduleLikeC4ViewportTuning(likec4Wrap, true);
        }
      });
    });
  }
  window.toggleCodePreviewSplit = toggleCodePreviewSplit;

  function ensureCodePreviewSplitToggles() {
    document.querySelectorAll('.slide--code-preview:not(.slide--live-coding):not(.slide--workspace-tree)').forEach(function(slide) {
      slide.querySelectorAll('.slide__inner').forEach(function(inner) {
        if (inner.querySelector('.code-preview__split-toggle')) return;
        var mode = slide.getAttribute('data-split-mode') || 'half';
        var current = slide.getAttribute('data-split') || (mode === 'two-thirds' ? 'two-thirds' : 'half');
        if (!slide.getAttribute('data-split')) {
          slide.setAttribute('data-split', current);
        }
        var initialTitle;
        var initialAria;
        if (mode === 'two-thirds') {
          initialTitle = current === 'two-thirds' ? 'Basculer vers 1/3 - 2/3' : 'Basculer vers 2/3 - 1/3';
          initialAria = current === 'two-thirds' ? 'Basculer vers une vue 1/3 code, 2/3 schéma' : 'Basculer vers une vue 2/3 code, 1/3 schéma';
        } else {
          initialTitle = current === 'half' ? 'Basculer vers 1/3 - 2/3' : 'Basculer vers 1/2 - 1/2';
          initialAria = current === 'half' ? 'Basculer vers une vue 1/3 code, 2/3 schéma' : 'Basculer vers une vue 50/50';
        }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-preview__split-toggle';
        btn.innerHTML = '&lt;&gt;';
        btn.setAttribute('title', initialTitle);
        btn.setAttribute('aria-label', initialAria);
        btn.addEventListener('click', function() {
          toggleCodePreviewSplit(btn);
        });
        inner.appendChild(btn);
      });
    });
  }

  /* Lazy-load embeds when their slide becomes visible + detect load errors */
  (function initEmbeds() {
    ensureCodePreviewSplitToggles();
    document.querySelectorAll('.embed-wrap iframe[data-src]').forEach(function(iframe) {
      var wrap = iframe.closest('.embed-wrap');
      var manual = isManualEmbed(wrap);

      ensureLikeC4PrimaryAction(wrap);
      ensureManualEmbedLoader(wrap);
      updateEmbedLoaderState(wrap, false);
      updateLikeC4ActionState(wrap);

      iframe.addEventListener('load', function() {
        if (manual && !wrap._embedRequested) return;
        markEmbedLoaded(wrap);
        scheduleLikeC4ViewportTuning(wrap, true);
        try {
          var currentTheme = document.documentElement.getAttribute('data-theme') || 'google-blueprint-light';
          iframe.contentWindow.postMessage({ type: 'deck-theme-change', theme: currentTheme }, '*');
        } catch (e) {}
      });

      iframe.addEventListener('error', function() {
        if (manual && !wrap._embedRequested) return;
        showEmbedFallback(wrap);
      });

      function tryLoad() {
        if (manual) return;
        startEmbedLoad(wrap);
      }

      /* Use IntersectionObserver to lazy-load when slide scrolls into view */
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

  // Synchroniser le thème des iframes LikeC4 au changement de thème du diaporama
  window.addEventListener('deck-theme-change', function() {
    document.querySelectorAll('.embed-wrap iframe').forEach(function(iframe) {
      if (iframe.src) {
        iframe.src = getThemeAdjustedUrl(iframe.src);
      }
    });
  });