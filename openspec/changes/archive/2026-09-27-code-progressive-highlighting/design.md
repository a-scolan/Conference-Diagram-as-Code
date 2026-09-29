## Context

See proposal.md - Why.
Slide 16 introduced `live-coding__steps-bar`, `live-coding__step-btn`, and CSS rules using `[data-step]` attributes on code lines. We can generalize this pattern into a generic component `code-stepper` reusable across all preview frames (`.slide--code-preview`).

## Goals / Non-Goals

**Goals:**
- Provide a standardized, non-intrusive step bar in `.code-preview__frame` headers.
- Tag semantic code groups in Slide 11 (C1), Slide 13 (C2), and Slide 18 (Dynamic sequence) using `data-step="<n>"`.
- Allow both click navigation on step buttons and seamless toggle back to the full snippet ("Tout").

**Non-Goals:**
- Automatic timer-based line stepping (the presenter controls pace manually).
- Interactive editing of code snippets during presentation.

## Decisions

- **Decision 1: CSS opacity-based dimming with `data-active-step` attribute**  
  *Rationale:* Modifying DOM visibility or re-rendering code can alter line wrapping and scroll offsets. Dimming inactive lines to 0.3 opacity and keeping active lines at 1.0 with an accent border preserves structural stability and layout fidelity.  
  *Alternative considered:* Collapsible code accordions (rejected: jumps and breaks slide height).

- **Decision 2: Reusable JavaScript controller `setCodePreviewStep(container, stepId)`**  
  *Rationale:* Expose a clean global helper function in `likec4-embeds.js` (or `code-preview.js`) that queries the container slide/frame and sets the active step attribute.

## Risks / Trade-offs

- **[Risk] Cluttered header on narrow screens** → Mitigation: Keep step labels short (e.g. `1`, `2`, `3` or `1 · Nom`) and flex-wrap with small padding.
