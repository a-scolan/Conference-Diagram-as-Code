## 1. CSS Readability Overrides

- [x] 1.1 Add `[data-readability="high-contrast"]` token overrides in `presentation/src/styles/tokens.css` with darkened syntax colors and increased font bump (`--font-bump: 6.5px`).
- [x] 1.2 Verify that code block diff colors (`.line-add`, `.line-mod`) retain strong contrast against bright ambient lighting.

## 2. Keyboard & State Controller

- [x] 2.1 Implement readability toggle function in `presentation/src/scripts/theme-controller.js` bound to key `C`.
- [x] 2.2 Persist state in `sessionStorage` and restore on page load.
- [x] 2.3 Add toggle icon button in the bottom floating toolbar next to the laser pointer.

## 3. Build & Verification

- [x] 3.1 Execute `node presentation/build-deck.js` and verify bundle build succeeds.
- [x] 3.2 Verify pressing `C` toggles high contrast and enlarged fonts across both code slides and text slides.
