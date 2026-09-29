## Context

See proposal.md - Why.
The slide engine already supports CSS variables `--font-bump` (defined in `tokens.css` / `base.css`) and data attributes on `<html>` (`data-theme`).

## Goals / Non-Goals

**Goals:**
- Instantaneous one-key toggle (`B`) without reloading or breaking slide layouts.
- Deep, WCAG AAA compliant syntax contrast (> 7:1) on white/light background.
- Preserves responsive slide bounds and overflow limits.

**Non-Goals:**
- Completely redesigning light and dark themes (this is a focused readability overlay).

## Decisions

- **Decision 1: Apply `data-readability="high-contrast"` on `<html>`**  
  *Rationale:* Allows overriding code tokens, borders, and text colors selectively in `tokens.css` without altering base theme mechanics.
- **Decision 2: Modulate `--font-bump` dynamically**  
  *Rationale:* All clamp calculations in `slides.css` and `components.css` already sum `var(--font-bump)`. Setting `--font-bump: 2.5px;` automatically scales all titles, text, and code without touching individual rules.

## Risks / Trade-offs

- **[Risk] Code overflow inside `.code-preview__frame` with larger fonts** → Mitigation: Frame code pre-blocks already have `overflow: auto`, ensuring graceful scrolling if line width exceeds the container.
