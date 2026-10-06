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
    wrappingWidth: 220,
    nodeSpacing: 40,
    rankSpacing: 60,
    padding: 20,
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

/* Ensure theme-aware text contrast across light/dark modes */
.mermaid text,
.mermaid tspan,
.mermaid .nodeLabel,
.mermaid .nodeLabel span,
.mermaid .nodeLabel p,
.mermaid .node text,
.mermaid .node tspan,
.mermaid .node .label,
.mermaid .cluster text,
.mermaid .cluster-label text,
.mermaid .cluster span,
.mermaid .cluster p,
.mermaid .cluster .nodeLabel,
.mermaid .commit-label,
.mermaid [class*="branch-label"],
.mermaid [class*="commit-label"],
.mermaid .edgeLabel,
.mermaid .edgeLabel span,
.mermaid .edgeLabel p,
.mermaid .edgeLabel text,
.mermaid .edgeLabel tspan {
  color: var(--text) !important;
  fill: var(--text) !important;
}

.mermaid .edgeLabel .label,
.mermaid .labelBox {
  line-height: 1.25 !important;
}

/* Never set display: flex on .node foreignObject > div — breaks Mermaid Dagre text measurement */
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

## Cross-Theme Mermaid Node Theming (Light & Dark Mode)

Mermaid `classDef` declarations with hard-coded colors (e.g. `classDef gold fill:#fef3c7,stroke:#b45309`) inject inline styles with `!important` directly on generated SVG elements (`<rect style="fill:#fef3c7 !important; ...">`). This prevents CSS stylesheets from adapting node colors when switching between light and dark modes, causing white text to render on light pastel backgrounds (or dark text on dark surfaces).

### The Canonical Multi-Theme Pattern

1. **Keep `classDef` clean in Mermaid source** — define only geometric attributes such as stroke width:
```mermaid
flowchart LR
  classDef gold stroke-width:2.5px;
  classDef blue stroke-width:2.5px;
  classDef green stroke-width:2.5px;
  classDef purple stroke-width:2.5px;

  class Archi blue;
  class Code gold;
  class PR purple;
  class Prod green;
```

2. **Define semantic diagram tokens in theme stylesheets**:
```css
/* Light Mode */
:root, [data-theme="light"], [data-theme="google-blueprint-light"] {
  --diagram-gold: #b45309;
  --diagram-gold-dim: #fef3c7;
  --diagram-blue: #0284c7;
  --diagram-blue-dim: #e0f2fe;
  --diagram-green: #15803d;
  --diagram-green-dim: #dcfce7;
  --diagram-purple: #7c3aed;
  --diagram-purple-dim: #f3e8ff;
}

/* Dark Mode */
[data-theme="dark"], [data-theme="slate-architect"] {
  --diagram-gold: #fde047;
  --diagram-gold-dim: rgba(253, 224, 71, 0.18);
  --diagram-blue: #38bdf8;
  --diagram-blue-dim: rgba(56, 189, 248, 0.18);
  --diagram-green: #34d399;
  --diagram-green-dim: rgba(52, 211, 153, 0.18);
  --diagram-purple: #c084fc;
  --diagram-purple-dim: rgba(192, 132, 252, 0.18);
}
```

3. **Style Mermaid nodes with CSS custom properties**:
```css
.mermaid-wrap .mermaid .node.gold :is(rect, circle, polygon, path) {
  fill: var(--diagram-gold-dim) !important;
  stroke: var(--diagram-gold) !important;
}
.mermaid-wrap .mermaid .node.blue :is(rect, circle, polygon, path) {
  fill: var(--diagram-blue-dim) !important;
  stroke: var(--diagram-blue) !important;
}
.mermaid-wrap .mermaid .node.green :is(rect, circle, polygon, path) {
  fill: var(--diagram-green-dim) !important;
  stroke: var(--diagram-green) !important;
}
.mermaid-wrap .mermaid .node.purple :is(rect, circle, polygon, path) {
  fill: var(--diagram-purple-dim) !important;
  stroke: var(--diagram-purple) !important;
}
```

### Mobile Landscape Diagram Ergonomics (`max-height: 560px`)

On compact mobile screens in landscape orientation (smartphones 375px–430px height):
- Slide headings, labels, and introductory text must be compact (`margin-bottom: 4px`, font size clamped to 11–13px) so they don't consume more than 20% of vertical height.
- `.mermaid-wrap` must use `flex: 1 1 auto; max-height: none; min-height: 0;` to give the diagram maximum room.
- Footers and proof banners must use tight padding and smaller type (10–11px) to prevent vertical overflow.

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
%% BAD: hard-coded fill/stroke in classDef breaks cross-theme rendering
classDef gold fill:#fef3c7,stroke:#b45309,stroke-width:2.5px;
classDef purple fill:#f3e8ff,stroke:#9333ea,stroke-width:2.5px;
```

## Good defaults

- keep `theme: 'base'`
- prefer `themeVariables.fontSize` over post-render text inflation
- use `sequence.wrap: true` for any non-trivial sequence diagram
- keep label HTML margins neutral (`p { margin: 0 }`)
- keep `foreignObject` overflow visible when Mermaid uses HTML labels
- drive node fill and stroke colors via CSS variables `--diagram-*` and bare `classDef` declarations
- use `sequence.wrap: true` for any non-trivial sequence diagram
- keep label HTML margins neutral (`p { margin: 0 }`)
- keep `foreignObject` overflow visible when Mermaid uses HTML labels

## Maintenance rule

When fixing Mermaid layout issues in slides or visual pages:

1. update this reference first if the fix is reusable
2. then align templates
3. only then patch slide-local CSS if the issue is truly unique
