/* ==========================================================================
   THEME CONTROLLER & BLUEPRINT ENVIRONMENT
   Gestion dynamique des thèmes (Google Blueprint Light / Slate Architect)
   ========================================================================== */

(function initThemeController() {
  var STORAGE_KEY = 'deck-theme';
  var DEFAULT_THEME = 'google-blueprint-light';
  var THEMES = ['google-blueprint-light', 'slate-architect'];

  function getTargetTheme() {
    // 1. Priorité au paramètre URL (?theme=light ou ?theme=dark)
    var urlParams = new URLSearchParams(window.location.search);
    var urlTheme = urlParams.get('theme');
    if (urlTheme) {
      if (urlTheme === 'light') return 'google-blueprint-light';
      if (urlTheme === 'dark') return 'slate-architect';
      return urlTheme;
    }
    // 2. Préférence mémorisée
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {}

    return DEFAULT_THEME;
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem(STORAGE_KEY, themeName);
    } catch (e) {}

    // Émettre un événement pour les diagrammes (Mermaid, LikeC4, etc.)
    window.dispatchEvent(new CustomEvent('deck-theme-change', { detail: { theme: themeName } }));

    // Propager aux iframes intégrées (ex: replay Copilot, embeds LikeC4)
    document.querySelectorAll('iframe').forEach(function(iframe) {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'deck-theme-change', theme: themeName }, '*');
        }
      } catch (e) {}
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    var next = (current === 'google-blueprint-light' || current === 'light') ? 'slate-architect' : 'google-blueprint-light';
    applyTheme(next);
  }

  window.setDeckTheme = applyTheme;
  window.toggleDeckTheme = toggleTheme;

  // Initialisation immédiate
  applyTheme(getTargetTheme());

  // Raccourci clavier 'T' pour alterner rapidement sans bouton visible
  document.addEventListener('keydown', function(e) {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('input, textarea, [contenteditable]')) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }
  });
})();
