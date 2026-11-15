# Tidewell Home

An independent concept for a sustainable home renovation studio. Original brand, roof-and-tide monogram, copy, lime and charcoal palette, and AI generated architectural imagery. The gallery presents design concepts rather than completed client work. There are no invented clients, endorsements, partner logos, or performance claims.

## Development

```bash
npm ci
npm run dev
npm test
npm run build
```

The local preview is served at http://localhost:3000. Agentation is available in development only.

## Content and styling

- `source/home-content.js` contains services, approach stages, questions, and gallery copy.
- `scripts/build-home-content.mjs` assembles the original semantic HTML into `source/site.json`. Run `npm run content` after changing content or the authored template.
- `app/page.js` renders that trusted, repository-owned HTML on the server. Never populate it with unsanitized user input.
- `app/globals.css` contains the independent responsive design and motion styles. `app/base.css` contains the shared reset and base controls.
- `app/motion.js` handles scroll-over sections, service and approach slideshows, gallery scrolling, and word reveals. It respects reduced motion and cleans up on unmount.
- `app/morphing-faqs.js` enhances the server-rendered questions with the React/GSAP row-to-dialog interaction, native focus trapping, Escape handling, backdrop closing, and focus restoration.
- `app/site-controls.js`, `app/site-interactions.js`, and `app/ui.js` manage mobile navigation, project briefs, newsletter information, and legal information.

## Assets and provenance

See [ASSETS.md](ASSETS.md) for the image prompts, file locations, and font source. The former site's archived markup, images, illustrations, stylesheets, scripts, and logo have been removed. The new page does not load assets from that site or link to its services.

## Functional limits

This is a fictional studio concept. Enquiry forms create a downloadable text brief locally; they do not submit information to a business. The newsletter does not register subscribers and states this on interaction. No booking, payment, or client account functionality is implied. Search indexing remains disabled until real business details are supplied.

## Verification

`npm test` exercises control scoping, validation, mobile navigation, FAQ content and focus, Strict Mode, animation cleanup, slideshow timing, transform geometry, and asset integrity. `npm run build` validates production compilation and static rendering.

Browser visual verification is still required: the browser access host was unavailable during the redesign. DOM tests do not measure layout, responsive rendering, or animation smoothness.
