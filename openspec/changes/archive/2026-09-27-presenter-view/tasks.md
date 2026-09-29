## 1. Data Pipeline & Notes Extraction

- [x] 1.1 Add notes extraction logic in `presentation/build-deck.js` parsing `deroule-conference-slides.md` for verbatim text, actions, silences, durations, and beats.
- [x] 1.2 Generate `presentation/public/assets/presenter-data.json` during build and verify all 36 slides have corresponding structured notes.

## 2. Slide Engine Synchronization Hooks

- [x] 2.1 Update `presentation/src/scripts/slide-engine.js` to publish `SLIDE_CHANGED` messages on `BroadcastChannel('dac-presenter-channel')` and mirror to `localStorage`.
- [x] 2.2 Implement listener for incoming `GOTO_SLIDE` and `TOGGLE_BLACKOUT` commands in `presentation/src/scripts/slide-engine.js`.
- [x] 2.3 Add keyboard shortcut `P` and launcher button in slide deck toolbar to open `presenter-view.html`.

## 3. Presenter Console Web Application

- [x] 3.1 Create `presentation/public/presenter-view.html` template featuring current slide preview, next slide preview, notes pane, integrated timer, and top control bar.
- [x] 3.2 Implement presenter controller script handling `BroadcastChannel` communication, timer management (elapsed & clock), and slide jumping.
- [x] 3.3 Apply dark OLED styling, adapted text proportions with font scaling controls (A- / A+) for comfortable lectern reading, and visual emphasis for stage actions (Silences Sacrés, double-filtre, pointage).

## 4. Build, Integration & Verification

- [x] 4.1 Integrate presenter view compilation into `presentation/build-deck.js` and `npm run build`.
- [x] 4.2 Verify dual-screen synchronization: open `presentation-diagram-as-code.html` and `presenter-view.html` in two windows, change slides from both sides, and verify instant mutual synchronization.
