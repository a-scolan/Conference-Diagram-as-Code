## 1. Styles and Interaction Engine

- [x] 1.1 Generalize `.code-stepper` CSS rules in `presentation/src/styles/components.css` to support any `.slide--code-preview` container with dimmed inactive lines and accent border on active lines.
- [x] 1.2 Implement `setCodePreviewStep(element, stepId)` in `presentation/src/scripts/likec4-embeds.js` and attach global event handlers.

## 2. Slide Markup Integration

- [x] 2.1 Add step buttons and `data-step` attributes to Slide 11 (`12-c1-genere.html`) covering actors, system definition, and usage relationships.
- [x] 2.2 Add step buttons and `data-step` attributes to Slide 13 (`14-c1-genere.html` / C2) covering frontends/backends, event bus, and database persistence.
- [x] 2.3 Add step buttons and `data-step` attributes to Slide 18 (`19-sequence-mobile.html`) covering the 3 chronological use-case phases.

## 3. Build & Verification

- [x] 3.1 Execute `node presentation/build-deck.js` and verify build succeeds without syntax error.
- [x] 3.2 Verify clicking through steps on Slides 11, 13, and 18 dims inactive lines and highlights target lines properly in the browser.
