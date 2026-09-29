## Why

During a live conference, presenting with a single duplicated screen forces the speaker to either memorize all slide details and timings, or look away towards cheat-sheets.
A dual-screen "Presenter View" (Mode Présentateur) allows having two synchronized windows: the main presentation projected on the public screen (projecteur/amphi) and an interactive presenter console on the speaker's laptop displaying the current slide preview, the upcoming next slide, speaker notes & verbatims, stage cues, elapsed time, and navigation controls.

## What Changes

- Add a dedicated Presenter Console web app (`presentation/public/presenter-view.html`) with a professional multi-pane layout:
  - **Current Slide View**: Scaled live preview of what the audience currently sees.
  - **Next Slide View**: Preview of the upcoming slide to anticipate transitions.
  - **Speaker Notes Pane**: Displays exact verbatims, stage actions (silences, body gestures), and narrative beats parsed from `deroule-conference-slides.md`.
  - **Pacing & Timer Header**: Real-time clock, elapsed time counter, and pacing indicator against the 45-minute milestone schedule (Acts 0 to 5).
  - **Slide Grid / Timeline**: Quick navigation strip to jump to any slide on the fly.
  - **Control Bar**: Next/Previous buttons, black screen toggle (key `.` or `B`), and reset timer.
- Add bidirectional synchronization between the main presentation deck (`presentation-diagram-as-code.html`) and the presenter console via `BroadcastChannel('dac-presenter-channel')` (with `localStorage` fallback):
  - Changing slide on either the presenter console or the main presentation immediately synchronizes the other.
- Add a keyboard shortcut (`P`) and a button in the slide toolbar to spawn the Presenter View in a separate window or tab on the secondary monitor.
- Automatically compile slide notes and verbatims into a JSON payload during `build-deck.js` or dedicated generator.

## Capabilities

### New Capabilities
- `presenter-view`: Dual-screen presenter console featuring synchronized current/next slide previews, live timer, speaker notes, and bidirectional deck navigation.

### Modified Capabilities
- `slide-engine`: Add presentation state broadcast and remote navigation listener for dual-screen presenter view synchronization.

## Impact

- Affected files:
  - `presentation/src/scripts/slide-engine.js` (sync transmitter & receiver, shortcut `P`)
  - `presentation/public/presenter-view.html` (new presenter console application)
  - `presentation/src/presenter/` (presenter styles, templates, scripts)
  - `presentation/build-deck.js` (extract notes from `deroule-conference-slides.md` and generate `slides-notes.json`)
  - `presentation/event.config.json` / `package.json`
- Zero audience-facing visual degradation on the main deck.
