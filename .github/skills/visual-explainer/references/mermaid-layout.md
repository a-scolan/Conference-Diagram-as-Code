# Mermaid Layout Patterns

Canonical, slide-safe Mermaid settings for HTML pages and slide decks.

## Use this when

- labels overflow outside Mermaid boxes
- sequence messages or notes become unreadable after CSS tweaks
- you need a reusable Mermaid baseline for slides/templates
- you are fixing Mermaid layout and want the change to propagate to future outputs

## Core rule

Mermaid computes label and box sizes **before** post-render CSS runs.
If you increase `.nodeLabel`, `.labelText`, `.messageText`, or `.noteText` only in CSS, text may outgrow its computed box.

**Size labels before render, not after.**

## Canonical Mermaid init

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  look: 'classic',
  flowchart: {
    htmlLabels: true,
    useMaxWidth: false,
    nodeSpacing: 40,
    rankSpacing: 60,
    padding: 25,
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
  themeVariables: {
    fontSize: '16px'
  }
});
```

## Canonical CSS guardrails

```css
.mermaid .nodeLabel,
.mermaid .edgeLabel {
  overflow: visible !important;
}

.mermaid .edgeLabel .label,
.mermaid .labelBox {
  line-height: 1.25 !important;
}

.mermaid .edgeLabel foreignObject,
.mermaid .node foreignObject,
.mermaid .node foreignObject > div {
  overflow: visible !important;
}

.mermaid .nodeLabel p,
.mermaid .edgeLabel p,
.mermaid .labelText p {
  margin: 0 !important;
}

.mermaid-wrap {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.mermaid-scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.mermaid-wrap.can-pan .mermaid-scroll {
  touch-action: none;
}

.mermaid-wrap .mermaid {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Full-bleed fit in slides (wide/complex diagrams)

For slides where Mermaid looks too small inside a large panel, support two fit modes:

- `contain` (default): preserve full diagram visibility, may leave empty space
- `cover`: fill panel width/height and rely on pan/zoom for hidden edges

```javascript
function getFitMode(wrap) {
  var mode = String(wrap && wrap.dataset.fitMode ? wrap.dataset.fitMode : 'contain').toLowerCase();
  return mode === 'cover' ? 'cover' : 'contain';
}

var ratioW = cw / vw;
var ratioH = ch / vh;
var fitMode = getFitMode(wrap);
var scale = fitMode === 'cover'
  ? Math.max(ratioW, ratioH)
  : Math.min(ratioW, ratioH);
scale = Math.min(scale, getFitScaleMax(wrap));
```

Recommended per-slide attributes for fullscreen-like behavior:

```html
<div class="mermaid-wrap"
     data-fit-mode="cover"
     data-fit-scale-max="3"
     data-initial-zoom="1.05"
     data-center-viewport-on-reveal="always"
     data-wheel-zoom="true">
```

This keeps diagrams centered on reveal/reset while preserving mouse-wheel zoom and drag pan.

## Robust viewport centering in scrollable Mermaid slides

When centering a zoomed Mermaid diagram inside `.mermaid-scroll`, center on the **actual rendered graph bounds**, not just the SVG box.

Two important details:

1. `svg.getBBox()` is expressed in the SVG user coordinate system, so convert it relative to the current `viewBox` origin.
2. Center using the rendered midpoint:

```javascript
var targetLeft = renderLeft + (renderWidth * 0.5) - (sc.clientWidth * 0.5);
var targetTop = renderTop + (renderHeight * 0.5) - (sc.clientHeight * 0.5);
```

Prefer clamping against `scrollWidth - clientWidth` / `scrollHeight - clientHeight` instead of `Math.max(0, (renderSize - viewportSize) / 2)`, which biases the viewport toward the top-left when the render is smaller than the scroll port but still offset inside a padded SVG.

Also, schedule centering in a few delayed passes (`0ms`, `~90ms`, `~220ms`) on slide reveal / reset / resize. This absorbs late layout shifts from webfont loading and reveal transitions.

## Readability for PR/git graphs

- avoid over-bold labels (`font-weight` 500–650 is usually enough)
- keep branch/edge stroke widths around `2px`–`3px`
- reserve extra-bold (`700+`) for one accent only (e.g., PR tag), not every label

## Anti-patterns

```css
/* BAD: text grows after Mermaid computed box sizes */
.mermaid .messageText,
.mermaid .noteText,
.mermaid .labelText {
  font-size: 16px !important;
}
```

```mermaid
%% BAD: hard-coded text color breaks cross-theme rendering
classDef api fill:#0f9ed544,stroke:#0f9ed5,color:#ffffff
```

## Good defaults

- keep `theme: 'base'`
- prefer `themeVariables.fontSize` over post-render text inflation
- use `sequence.wrap: true` for any non-trivial sequence diagram
- keep label HTML margins neutral (`p { margin: 0 }`)
- keep `foreignObject` overflow visible when Mermaid uses HTML labels

## Maintenance rule

When fixing Mermaid layout issues in slides or visual pages:

1. update this reference first if the fix is reusable
2. then align templates
3. only then patch slide-local CSS if the issue is truly unique
