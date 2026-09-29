/* ==========================================================================
   THEME CONTROLLER & BLUEPRINT ENVIRONMENT
   Gestion dynamique des thèmes (Google Blueprint Light / Slate Architect)
   ========================================================================== */

(function initThemeController() {
  var STORAGE_KEY = 'deck-theme';
  var DEFAULT_THEME = 'google-blueprint-light';
  var THEMES = ['google-blueprint-light', 'slate-architect'];

  var isInIframe = false;
  try {
    isInIframe = (window.self !== window.top) || (window.location.search.indexOf('role=preview') > -1);
  } catch(e) {
    isInIframe = true;
  }

  var presenterChannel = null;
  if (!isInIframe && typeof window.BroadcastChannel === 'function') {
    try {
      presenterChannel = new BroadcastChannel('dac-presenter-channel');
    } catch(e) {}
  }

  function normalizeThemeName(themeName) {
    if (!themeName) return DEFAULT_THEME;
    if (themeName === 'light' || themeName === 'google-blueprint-light') return 'google-blueprint-light';
    if (themeName === 'dark' || themeName === 'slate-architect') return 'slate-architect';
    return themeName;
  }

  function getTargetTheme() {
    // 1. Priorité au paramètre URL (?theme=light ou ?theme=dark)
    var urlParams = new URLSearchParams(window.location.search);
    var urlTheme = urlParams.get('theme');
    if (urlTheme) {
      return normalizeThemeName(urlTheme);
    }
    // 2. Préférence mémorisée
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeThemeName(saved);
      var savedDac = localStorage.getItem('dac_deck_theme');
      if (savedDac) {
        var parsed = JSON.parse(savedDac);
        if (parsed && parsed.theme) return normalizeThemeName(parsed.theme);
      }
    } catch (e) {}

    return DEFAULT_THEME;
  }

  function applyTheme(themeName, skipBroadcast) {
    var normalized = normalizeThemeName(themeName);
    var current = document.documentElement.getAttribute('data-theme');
    if (current === normalized) {
      return; // Déjà appliqué, arrêt immédiat pour éviter cascades d'événements et refits
    }
    document.documentElement.setAttribute('data-theme', normalized);

    // Ne persister dans localStorage que si on est dans la fenêtre principale (pas en iframe)
    if (!isInIframe) {
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
        localStorage.setItem('dac_deck_theme', JSON.stringify({ theme: normalized, timestamp: Date.now() }));
      } catch (e) {}
    }

    // Émettre un événement pour les diagrammes (Mermaid, LikeC4, etc.)
    window.dispatchEvent(new CustomEvent('deck-theme-change', { detail: { theme: normalized } }));

    // Propager aux iframes intégrées de contenu (LikeC4, replay ADR) depuis la fenêtre principale uniquement
    if (!isInIframe) {
      document.querySelectorAll('iframe').forEach(function(iframe) {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'deck-theme-change', theme: normalized }, '*');
            iframe.contentWindow.postMessage({ type: 'SET_THEME', theme: normalized }, '*');
          }
        } catch (e) {}
      });

      // Diffuser à la vue présentateur via BroadcastChannel
      if (!skipBroadcast && presenterChannel) {
        try {
          presenterChannel.postMessage({ type: 'THEME_CHANGED', theme: normalized, timestamp: Date.now() });
        } catch (e) {}
      }
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    var next = (current === 'google-blueprint-light' || current === 'light') ? 'slate-architect' : 'google-blueprint-light';
    applyTheme(next);
  }

  window.setDeckTheme = applyTheme;
  window.toggleDeckTheme = toggleTheme;

  // Écouter les messages venant du parent (ex: iframe dans vue présentateur)
  window.addEventListener('message', function(ev) {
    var data = ev.data;
    if (!data) return;
    if ((data.type === 'SET_THEME' || data.type === 'deck-theme-change') && data.theme) {
      applyTheme(data.theme, true);
    }
  });

  // Écouter BroadcastChannel et localStorage pour synchronisation en direct (fenêtre principale uniquement)
  if (!isInIframe) {
    if (presenterChannel) {
      presenterChannel.addEventListener('message', function(ev) {
        var data = ev.data;
        if (!data) return;
        if ((data.type === 'SET_THEME' || data.type === 'THEME_CHANGED') && data.theme) {
          applyTheme(data.theme, true);
        }
      });
    }

    window.addEventListener('storage', function(ev) {
      if (ev.key === 'dac_deck_theme' && ev.newValue) {
        try {
          var parsedTh = JSON.parse(ev.newValue);
          if (parsedTh && parsedTh.theme) {
            applyTheme(parsedTh.theme, true);
          }
        } catch (e) {}
      } else if (ev.key === STORAGE_KEY && ev.newValue) {
        applyTheme(ev.newValue, true);
      }
    });
  }

  // Initialisation immédiate sans re-diffusion
  applyTheme(getTargetTheme(), true);

  /* ============ READABILITY / COMFORT MODE (C) ============ */
  var READABILITY_KEY = 'deck-readability';

  function getTargetReadability() {
    try {
      return sessionStorage.getItem(READABILITY_KEY) || 'standard';
    } catch (e) {
      return 'standard';
    }
  }

  function applyReadability(mode) {
    if (mode === 'high-contrast') {
      document.documentElement.setAttribute('data-readability', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-readability');
    }
    try {
      sessionStorage.setItem(READABILITY_KEY, mode);
    } catch (e) {}
  }

  function toggleReadability() {
    var current = document.documentElement.getAttribute('data-readability');
    var next = (current === 'high-contrast') ? 'standard' : 'high-contrast';
    applyReadability(next);
  }

  window.setReadabilityMode = applyReadability;
  window.toggleReadabilityMode = toggleReadability;

  applyReadability(getTargetReadability());

  // Raccourcis clavier : 'T' pour thème, 'C' pour confort/contraste
  document.addEventListener('keydown', function(e) {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      toggleReadability();
    }
  });
})();
