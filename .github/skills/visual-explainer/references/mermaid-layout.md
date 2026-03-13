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
```

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
