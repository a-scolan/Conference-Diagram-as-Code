## Why

On code-heavy slides (Slide 11 C1, Slide 13 C2, and Slide 18 dynamic sequence), projecting the entire code snippet at once creates cognitive overload: the audience starts reading ahead while the speaker is explaining the first lines. 
Following the successful implementation of step-by-step highlighting on Slide 16 (live coding), generalizing progressive highlighting to Slides 11, 13, and 18 will allow the speaker to guide audience focus line-by-line while keeping the option to show all code when preferred.

## What Changes

- Add progressive step bars and step data attributes on:
  - Slide 11 (`12-c1-genere.html`): Step 1 (Acteurs `festivalier`/`barista`), Step 2 (Système `alefestCoffee`), Step 3 (Relations `uses`).
  - Slide 13 (`14-c1-genere.html` / C2): Step 1 (`extend` & conteneurs front/back), Step 2 (Bus RabbitMQ & asynchronisme), Step 3 (Persistance base de données).
  - Slide 18 (`19-sequence-mobile.html`): Step 1 (Commande mobile), Step 2 (Préparation barista), Step 3 (Notification push & retrait).
- Standardize step navigation script and CSS so that inactive lines are softened/dimmed while the active step receives clear visual emphasis.
- Provide a "Tout" (All) button on each slide to preserve instantaneous full display on demand.

## Capabilities

### Modified Capabilities
- `interactive-views`: Add progressive step-by-step code highlighting to C1, C2, and Dynamic Sequence code preview slides.

## Impact

- Affected files:
  - `presentation/src/slides/12-c1-genere.html`
  - `presentation/src/slides/14-c1-genere.html`
  - `presentation/src/slides/19-sequence-mobile.html`
  - `presentation/src/styles/components.css`
  - `presentation/src/scripts/likec4-embeds.js` (or a dedicated code stepper script)
- Backward compatibility: Preserves existing split view toggles and default full code rendering.
