# Manatee Energy

A Next.js recreation of the Manatee Energy design in [Pinterest pin 395261304818687782](https://fr.pinterest.com/pin/395261304818687782/), including scroll-over sections, timed unit/process selectors, and a testimonial carousel.

## Development

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Agentation is available in development only.

```bash
npm test       # DOM interaction and animation-clock regression tests
npm run build # Production compilation and static rendering
npm start     # Serve the production build on port 3000
```

## Code structure

- `app/page.js` renders the trusted, repository-owned page snapshot on the server. Page HTML and archived source metadata are not imported by client components.
- `app/site-interactions.js` manages React dialog state. `app/site-controls.js` binds the native FAQ, mobile navigation, quote links, and newsletter controls to the static page root. Dialog forms live outside that root.
- `app/ui.js` provides the modal, native focus trapping, Escape handling, and focus restoration.
- `app/motion.js` owns the animation controllers and their cleanup. Both selectors use a five-second progress animation as the clock for tab changes. Pausing preserves elapsed time; selecting a tab starts a fresh cycle. Hidden/offscreen pages, keyboard focus, and reduced motion suspend playback.
- `app/globals.css` extends the recovered design stylesheet in `public/assets/site.css`. Source styling is retained to preserve the reference layout.
- `source/site.json` contains the current static markup and embedded reference styles. `source/original.html`, `source/live-2026.json`, and `source/assets.json` retain reference provenance. Archived Webflow scripts are not loaded by the page.

The illustrations, process photographs, room photographs, and fonts are hosted locally. The marquee uses original illustrative brand concepts, not claims of real partnerships. Some testimonial and community copy is reconstructed from the reference.

## Verification and limits

`npm test` exercises quote/newsletter event scoping, validation, FAQ state, mobile menu focus/scroll handling, accessible labels, IDs, internal links, and slideshow timing/cleanup using jsdom and a controlled animation clock. These tests do not measure browser layout or animation smoothness. Browser visual QA is still required after visual changes; the browser access host was unavailable during the latest review.

This remains a presentation prototype: quote, account, and newsletter actions are local previews. They do not submit data, send messages, create accounts, or schedule installations. Search indexing is disabled. The static snapshot must remain trusted repository content; do not populate its HTML with unsanitized user input.
