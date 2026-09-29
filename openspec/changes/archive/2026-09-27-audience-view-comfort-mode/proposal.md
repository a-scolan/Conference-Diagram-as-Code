## Why

Conference room projectors frequently suffer from washed-out contrast (weak lamp, ambient lighting) and deep room depth (audience sitting 15 to 25 meters away). In these conditions, light-gray syntax tokens, subtle diff highlights, and small code lines become illegible from the back rows. 
Providing a quick toggle for High Contrast and Extra Font Bump (hotkey `B` for Big Text / High Contrast) allows the speaker to adapt the deck instantly during room check without editing CSS files.

## What Changes

- Introduce a high-contrast readability mode toggle (`data-readability="high-contrast"`) on `<html>`.
- Boost code font sizes dynamically via `--font-bump` (e.g. from `0px` to `+2.5px`).
- Deepen syntax colors (black/dark-blue text on crisp white background, darkened green for diff additions, darkened amber for modifications).
- Wire a global keyboard toggle (key `B`) and add a small setting toggle button in the bottom drawer alongside laser and theme controls.

## Capabilities

### Modified Capabilities
- `presentation-ux`: Add dynamic high-contrast and enlarged font comfort mode for deep conference halls.

## Impact

- Affected files:
  - `presentation/src/styles/tokens.css` (high contrast overrides)
  - `presentation/src/scripts/theme-controller.js` (or slide-engine key listener)
  - `presentation/src/styles/components.css`
- Preserves existing themes while allowing a high-contrast override on top of them.
