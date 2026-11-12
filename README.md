# Manatee Energy

Standalone Next.js recreation of [Pinterest pin 395261304818687782](https://fr.pinterest.com/pin/395261304818687782/).

## Run

```bash
npm ci
npm run dev
```

Open http://localhost:3108. Production: `npm run build`, then `npm start`. This app has its own dependencies and lockfile. Runtime assets are local to its `public/` directory.

## Reference and implementation

The original video shows an earlier Manatee design. The live site at https://www.manatee.energy/ supplied clean building/room illustrations, source styles, and its Webflow runtime. Archived public 2024 source supplied original process and living-room photographs. The pin’s vertical unit selector, vertical installation steps, testimonial strip, and community section were reconstructed to replace the live site’s newer horizontal layouts.

Original source Figtree and Kalam families are hosted locally. Illustrations and process/living-room photographs are original source assets. The partner area uses six original SVG brand concepts in a continuous marquee. These are illustrative marks, not claims of real partnerships.

The video’s older layout and visible labels are followed, while FAQ content comes from recovered source material. Some testimonial text and community copy are reconstructed/paraphrased. Device mockup and blue promotional background are excluded. Source/archived snapshots remain in source/ and ../pinterest-clones/references/.

## Interactions

Unit/image selector, process tabs with image transitions, FAQ, mobile navigation, local quote dialogs, local newsletter handling, reduced motion.

Forms and simulated actions remain in this browser. They do not create real accounts, appointments, payments, messages, or calls.

## Verification

The production build passed. Playwright uses its bundled Chromium. Independent 1440 × 1000 desktop and 390 × 844 mobile screenshots and rendering results are in `../pinterest-clones/qa/`. The repeatable checks are `../pinterest-clones/verify.mjs` and `../pinterest-clones/interactions.mjs`; both start and stop temporary local production servers. App-specific differences and inference limits are stated above.

## Recording animation update

The supplied `screenrecording-2026-11-12_11-01-05.mp4` informed the unit selector, process slideshow, testimonial carousel, and community panel update. `app/motion.js` owns these interactions; the former instant-switch inline bindings were removed. Unit descriptions remain visible, while process descriptions expand for the selected step. Process images slide upward, a five second progress line advances each step while the section is visible, and users can select a step or pause playback. Playback stops while keyboard focus is in the section, when the page is hidden, and for reduced motion. Arrow keys, Home, and End navigate the selectors. The testimonial strip supports arrow buttons and native touch scrolling.

The original archived community background and decorative bushes are stored locally. Section entrances and the community heading respect reduced motion. Existing quote dialogs, FAQ content, and newsletter handling are retained.

For this update, the production build and static asset/initial-state checks passed. Browser visual QA could not be performed because the browser access host was unavailable.

## Page feedback update

The benefits panel now scrolls over a sticky hero, with a subtle receding transform as the panel covers it. The logo marquee repeats two identical vector logo sets and offers a pause control. Unit tabs now cycle every five seconds while their images are visible, using upward transitions for both outgoing and incoming illustrations. Manual selection restarts the timer; keyboard focus, pause controls, a hidden page, and reduced motion suspend playback. Reduced motion also disables hero pinning and displays a static logo set.

Validation: production build, source structure/asset checks, and a mocked DOM/timer check covering cycling, wraparound, manual selection, animations, suspension, and cleanup passed. Browser visual QA remains unavailable because the browser access host could not be reached.

## Synchronized progress and process overlap

Both selectors now use the progress animation itself as their five second clock. The fill advances at a constant speed and its completion selects the next tab; no separate timeout can drift from the visible line. Pause, keyboard focus, offscreen state, and page visibility suspend and resume the same animation. Manual selection starts a fresh cycle.

The process is a full width foreground section with its own background and rounded top. It scrolls over the sticky units within a shared, bounded installation wrapper. The sticky offset adapts to the viewport and unit section height so taller layouts can still be read. Reduced motion restores normal section flow.

The production build, section structure checks, and animation-clock checks for both selectors passed. The animation checks cover completion at 5000ms, independent timing, pause/resume, manual selection, wraparound, reduced motion, and cleanup. Browser visual verification was unavailable in this session.
