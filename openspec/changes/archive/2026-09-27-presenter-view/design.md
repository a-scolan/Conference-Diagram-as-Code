## Context

See proposal.md - Why.
The slide deck is currently driven by `slide-engine.js` which manages navigation, hash change, and keyboard shortcuts. Notes and verbatim oral texts are authored in `deroule-conference-slides.md`.
To provide a real two-screen experience without third-party frameworks, we leverage native browser APIs (`BroadcastChannel`, `localStorage`, and `window.open`).

## Goals / Non-Goals

**Goals:**
- Zero server-side dependency: works 100% locally via file URL or local Express server.
- True real-time bidirectional synchronization between public deck and presenter console.
- Display current slide preview, next slide preview, and rich structured notes (verbatim, action, silences, target timing).
- Integrated conference timer (elapsed time, real clock, pacing milestone gauge).
- Single-key launcher (`P`) from the main presentation to spawn the presenter window.

**Non-Goals:**
- Remote mobile internet signaling across different networks (local multi-monitor setup on the same machine/browser profile).

## Decisions

- **Decision 1: Synchronization via `BroadcastChannel('dac-presenter-channel')` with `localStorage` fallback**  
  *Rationale:* `BroadcastChannel` provides zero-latency messaging between windows of the same origin. If the presentation is run locally in separate window contexts, `localStorage` storage events ensure continuous synchronization as a solid fallback.  
  *Alternative considered:* WebSockets (rejected: requires active Node.js server, fails on static file opening).

- **Decision 2: Automated extraction of notes from `deroule-conference-slides.md` at build time**  
  *Rationale:* Avoids maintaining notes in two separate locations. `build-deck.js` extracts slide titles, actions, verbatims, durations, and beats, outputting `presentation/public/assets/presenter-data.json` and embedding it directly into `presenter-view.html` for single-file offline independence.

- **Decision 3: Slide preview via sandboxed iframe mirroring**  
  *Rationale:* Embedding `presentation-diagram-as-code.html#slide-{current}` and `#slide-{next}` in scaled containers (`pointer-events: none; transform: scale(...)`) guarantees pixel-perfect fidelity with the audience screen, including Mermaid diagrams, custom CSS styles, and animations.

- **Decision 4: Presenter UI layout in CSS Grid**  
  *Rationale:* A 3-column / 2-row grid:
  - Top header: Clock, timer, Acts milestones, controls (Prev/Next/Blackout).
  - Left pane: Current slide live preview (large).
  - Center/Right top pane: Next slide preview (medium).
  - Center/Right bottom pane: Notes, stage cues (silences highlighted in yellow/red), verbatim.
  - Bottom drawer: Quick jump thumbnail timeline.

## Risks / Trade-offs

- **[Risk] High CPU/GPU usage with two live iframes** → Mitigation: Freeze animations in the next-slide iframe via CSS or pause Mermaid rendering until active; next slide iframe has low zoom level.
- **[Risk] Window pop-up blocked by browser** → Mitigation: Bound to user action (direct key press `P` or explicit click on toolbar button). Display a clear toast with a direct link if pop-up is intercepted.
