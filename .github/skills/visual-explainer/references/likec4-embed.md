# LikeC4 Embed — Interactive Architecture Diagrams

Embed interactive [LikeC4](https://likec4.dev) architecture diagrams inside slide decks or visual pages. LikeC4 exports self-contained HTML files with pan, zoom, and view navigation — perfect for live demos during presentations. This reference covers two embedding approaches: **local HTML export** (file://) and **live dev server** (http://localhost).

## When to Use

- **Architecture demos** where the audience should see interactive pan/zoom navigation
- **LikeC4 models** already authored alongside the presentation (`.c4` files in the workspace)
- **Live architecture walkthroughs** during talks — navigating between views in real-time
- **Any external HTML tool** that produces self-contained interactive pages (LikeC4, Storybook, Swagger UI, etc.)

**When NOT to use:** For static architecture diagrams, use Mermaid (see `./libraries.md`) or CSS Grid cards (see `./css-patterns.md`). The embed slide type adds complexity (iframe, lazy loading, fallback) that's only justified when interactivity matters.

## Slide Type: `slide--embed`

A new slide type alongside `slide--diagram`, `slide--code`, etc. Full-viewport iframe with controls and error fallback.

### HTML Structure

```html
<section class="slide slide--embed">
  <h2 class="slide__heading reveal">Démo LikeC4 — votre architecture vivante</h2>
  <div class="embed-wrap reveal" data-likec4-fit-on-load="true" data-likec4-zoomout-steps="1">
    <div class="embed-controls">
      <button onclick="reloadEmbed(this)" title="Recharger" aria-label="Recharger l'iframe">↻</button>
      <button onclick="openEmbedExternal(this)" title="Ouvrir dans le navigateur" aria-label="Ouvrir dans un nouvel onglet">↗</button>
    </div>
    <iframe
      data-src="THE_URL_HERE"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="Démo interactive LikeC4"
    ></iframe>
    <div class="embed-fallback">
      <p style="font-size:18px;">L'iframe ne peut pas charger le fichier local.</p>
      <p style="font-size:14px; max-width:500px;">Les navigateurs bloquent parfois les URLs <code>file://</code> dans les iframes. Ouvrez directement dans un nouvel onglet&nbsp;:</p>
      <a href="THE_URL_HERE" target="_blank" rel="noopener">↗ Ouvrir LikeC4</a>
    </div>
  </div>
</section>
```

**Key attributes:**

| Attribute | Purpose |
|-----------|---------|
| `data-src` (not `src`) | Enables lazy loading — the iframe loads only when its slide scrolls into view via IntersectionObserver |
| `sandbox="allow-scripts allow-same-origin allow-popups"` | Security sandbox — permits LikeC4's JS/React runtime while blocking navigation and form submission |
| `title` | Accessibility — screen readers announce the iframe's purpose |
| `loading="lazy"` | Belt-and-suspenders alongside IntersectionObserver for browsers that don't support the observer |
| `data-likec4-fit-on-load="true"` | Optional same-origin presentation tweak — clicks LikeC4's internal **Fit View** control after the iframe finishes rendering |
| `data-likec4-zoomout-steps="1"` | Optional extra breathing room after Fit View — clicks LikeC4's internal **Zoom Out** control $n$ times |

### CSS

Add after the other slide type blocks (e.g., after `.slide--bleed`):

```css
/* ============ SLIDE TYPE: EMBED (local HTML iframe) ============ */
.slide--embed {
  padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 60px);
}

.slide--embed .slide__heading {
  margin-bottom: clamp(8px, 1.5vh, 20px);
}

.embed-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--border-bright);
  border-radius: 12px;
  overflow: hidden;
  background: #fff; /* LikeC4 exports have white backgrounds */
}

.embed-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
}

/* Reload + external-open buttons (top-right overlay) */
.embed-wrap .embed-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  z-index: 10;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px;
}

.embed-wrap .embed-controls button {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.embed-wrap .embed-controls button:hover {
  background: var(--border);
  color: var(--text);
}

/* Fallback overlay — shown when iframe fails to load */
.embed-wrap .embed-fallback {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--surface);
  color: var(--text-dim);
  text-align: center;
  padding: 40px;
}

.embed-wrap .embed-fallback.visible {
  display: flex;
}

.embed-wrap .embed-fallback a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 14px;
  text-decoration: none;
  color: var(--bg);
  background: var(--accent);
  font-weight: 600;
  transition: opacity 0.2s;
}

.embed-wrap .embed-fallback a:hover {
  opacity: 0.85;
}
```

### JavaScript

Add before the Mermaid zoom controls block:

```js
/* ============ Embed iframe controls ============ */
function reloadEmbed(btn) {
  var wrap = btn.closest('.embed-wrap');
  var iframe = wrap.querySelector('iframe');
  if (iframe.src) { iframe.src = iframe.src; }
  else if (iframe.dataset.src) { iframe.src = iframe.dataset.src; }
}

function openEmbedExternal(btn) {
  var wrap = btn.closest('.embed-wrap');
  var iframe = wrap.querySelector('iframe');
  var url = iframe.src || iframe.dataset.src;
  if (url) window.open(url, '_blank');
}

function shouldTuneLikeC4Viewport(wrap) {
  var fitOnLoad = String(wrap && wrap.dataset.likec4FitOnLoad ? wrap.dataset.likec4FitOnLoad : '').toLowerCase() === 'true';
  var zoomOutSteps = parseInt(wrap && wrap.dataset.likec4ZoomoutSteps ? wrap.dataset.likec4ZoomoutSteps : '', 10);
  return fitOnLoad || (!isNaN(zoomOutSteps) && zoomOutSteps > 0);
}

function triggerLikeC4Control(doc, selector, count) {
  var remaining = Math.max(0, count || 0);
  while (remaining > 0) {
    var btn = doc.querySelector(selector);
    if (!btn || btn.disabled) break;
    btn.click();
    remaining -= 1;
  }
}

function scheduleLikeC4ViewportTuning(wrap) {
  if (!shouldTuneLikeC4Viewport(wrap)) return;
  var iframe = wrap.querySelector('iframe');
  if (!iframe) return;
  [80, 220, 480].forEach(function(delay) {
    window.setTimeout(function() {
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || !doc.body) return;
        var fitClicks = String(wrap.dataset.likec4FitOnLoad || '').toLowerCase() === 'true' ? 1 : 0;
        var zoomOutSteps = parseInt(wrap.dataset.likec4ZoomoutSteps || '0', 10) || 0;
        triggerLikeC4Control(doc, '.react-flow__controls-fitview', fitClicks);
        triggerLikeC4Control(doc, '.react-flow__controls-zoomout', zoomOutSteps);
      } catch (e) {
        /* Same-origin only — ignore if the embedded tool is cross-origin. */
      }
    }, delay);
  });
}

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
      iframe.addEventListener('load', function() {
        scheduleLikeC4ViewportTuning(wrap);
      }, { once: true });

      /* Detect load failure after a timeout —
         file:// iframes don't always fire error events */
      setTimeout(function() {
        try {
          var doc = iframe.contentDocument || iframe.contentWindow.document;
          if (!doc || !doc.body || doc.body.children.length === 0) {
            if (fallback) fallback.classList.add('visible');
          }
        } catch (e) {
          /* Cross-origin or blocked — show fallback */
          if (fallback) fallback.classList.add('visible');
        }
      }, 3000);
    }

    /* IntersectionObserver: lazy-load when slide scrolls into view */
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) { tryLoad(); obs.disconnect(); }
        });
      }, { threshold: 0.1 });
      obs.observe(wrap);
    } else {
      tryLoad(); /* Fallback for older browsers */
    }
  });
})();
```

The Fit View / Zoom Out automation only works for **same-origin** embeds (local exports, localhost dev servers, or assets served from the same presentation host). For cross-origin iframes, the browser blocks DOM access — keep the fallback link and manual controls.

**How it works:**

1. `data-src` holds the URL — no `src` means the iframe doesn't load on page open
2. `IntersectionObserver` watches for the slide entering the viewport (threshold 0.1)
3. When visible, `tryLoad()` copies `data-src` → `src`, triggering the actual load
4. After 3 seconds, a check verifies the iframe loaded successfully
5. If `contentDocument` is empty or cross-origin, the `.embed-fallback` overlay appears with a direct link

## Source Approaches

### Approach 1: Local HTML Export (file://)

LikeC4 can export a self-contained HTML file via the CLI:

```bash
# Export from a LikeC4 project
npx likec4 export html -o ./exports/architecture.html

# Or export a specific view
npx likec4 export html --view system-overview -o ./exports/overview.html
```

The exported `.htm` / `.html` file contains the full React app with all views. Use a `file://` URL in `data-src`:

```html
<iframe
  data-src="file:///C:/path/to/project/exports/architecture.html#/project/my-project/view/system-overview/"
  ...
></iframe>
```

**URL structure:** `file:///absolute/path/to/export.html#/project/{project-name}/view/{view-id}/`

**Hash fragment:** LikeC4 exports use client-side routing. Append `#/project/{project}/view/{view-id}/` to open directly on a specific view. Without it, the user lands on the default project list.

#### Browser Configuration for file:// iframes

Browsers block `file://` iframes by default for security. Configuration is required:

**Firefox:**
1. Open `about:config`
2. Search for `security.fileuri.strict_origin_policy`
3. Set to `false`

**Chrome / Edge:**
- Launch with the `--allow-file-access-from-files` flag:
  ```bash
  # Windows
  chrome.exe --allow-file-access-from-files
  # macOS
  open -a "Google Chrome" --args --allow-file-access-from-files
  ```

**Alternative — local HTTP server (recommended for reliability):**

```bash
# Serve the presentation directory locally
npx serve .
# or
python -m http.server 8000
```

Then use a relative path instead of `file://`:

```html
<iframe
  data-src="./exports/architecture.html#/project/my-project/view/system-overview/"
  ...
></iframe>
```

This avoids all browser security restrictions and works identically in every browser.

### Approach 2: Live LikeC4 Dev Server (http://localhost)

LikeC4 has a built-in dev server that serves the interactive viewer with hot-reload:

```bash
# Start the LikeC4 dev server (default port 61152)
npx likec4 serve

# Or on a specific port
npx likec4 serve --port 4444
```

Use the dev server URL in `data-src`:

```html
<iframe
  data-src="http://localhost:61152/view/system-overview"
  ...
></iframe>
```

**Advantages over file:// export:**
- No browser security configuration needed (localhost is trusted)
- Hot-reload — edit `.c4` model files and the embedded view updates live
- Perfect for workshop-style talks where you modify the architecture live

**Disadvantages:**
- Requires a running dev server — if it stops, the iframe goes blank
- Port may conflict with other services
- Not portable — the presentation only works on the machine running the server

**URL structure for dev server:** `http://localhost:{port}/view/{view-id}`

### Choosing Between Approaches

| Criterion | Local Export (file://) | Live Dev Server (localhost) |
|-----------|----------------------|----------------------------|
| Portability | ✅ Self-contained, works offline | ❌ Needs running server |
| Browser config | ❌ Requires security override | ✅ No config needed |
| Hot-reload | ❌ Static snapshot | ✅ Live updates on `.c4` edits |
| Reliability | ✅ Always loads if configured | ⚠️ Server must be running |
| Best for | Conference talks, exported decks | Workshops, live coding demos |

**Recommendation:** Use a **local HTTP server** (`npx serve .`) with the **HTML export** placed alongside the presentation. This gives the best of both worlds — portable, no browser flags, works offline.

## Accessibility

- **iframe `title`**: Always provide a descriptive `title` attribute for screen readers
- **Button labels**: Each `.embed-controls` button needs `aria-label` if the button text is just an icon character
- **Fallback link**: The `.embed-fallback` provides a direct link for users who can't use the iframe (keyboard accessible, visible text)
- **Button sizing**: Controls are 32×32px minimum, meeting WCAG 2.5.8 touch target requirements

## Multiple Embeds

You can have multiple `slide--embed` slides in a deck — each with a different `data-src`. The IntersectionObserver pattern handles them independently:

```html
<!-- Slide A: System overview -->
<section class="slide slide--embed">
  <h2 class="slide__heading reveal">Vue système</h2>
  <div class="embed-wrap reveal">
    <div class="embed-controls">...</div>
    <iframe data-src="./exports/arch.html#/project/myapp/view/system-overview/" ...></iframe>
    <div class="embed-fallback">...</div>
  </div>
</section>

<!-- Slide B: Deployment view -->
<section class="slide slide--embed">
  <h2 class="slide__heading reveal">Déploiement</h2>
  <div class="embed-wrap reveal">
    <div class="embed-controls">...</div>
    <iframe data-src="./exports/arch.html#/project/myapp/view/deployment/" ...></iframe>
    <div class="embed-fallback">...</div>
  </div>
</section>
```

Each iframe loads independently only when its slide enters the viewport.

## Adapting for Non-LikeC4 Sources

The `slide--embed` pattern works for any interactive HTML content:

| Source | `data-src` example |
|--------|--------------------|
| LikeC4 export | `./exports/architecture.html#/project/x/view/y/` |
| LikeC4 dev server | `http://localhost:61152/view/system-overview` |
| Storybook | `http://localhost:6006/?path=/story/button--primary` |
| Swagger UI | `./docs/swagger.html` |
| D3.js visualization | `./charts/network-graph.html` |
| Any self-contained HTML | Relative or absolute URL to the file |

The CSS, JS controls, lazy loading, and fallback work identically regardless of the embedded content.

> **Note:** Some external services (GitHub Codespaces, VS Code for the Web, etc.) block iframe embedding via CSP `frame-ancestors 'none'`. For those, use the **Popup Embed Slide** pattern documented in `./slide-patterns.md` instead.
