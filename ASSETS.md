# Tidewell Home asset provenance

## Brand and interface

The Tidewell Home studio identity, roof-and-tide SVG monogram, favicon, copy, and stylesheet were authored for this fictional concept. The name is a concept name, not a statement of business registration or trademark clearance.

The monogram is defined in `scripts/build-home-content.mjs`; the matching favicon is `public/icon.svg`. Interface icons are simple, locally authored SVG paths. No previous site's brand artwork or partner marks are used.

The current lime, charcoal, and white theme and sculpted hero layout were implemented from the user's supplied visual reference. The hero uses independently authored SVG clipping paths and labels, the Tidewell identity, and the existing generated living room image. The reference's branding, land imagery, realtor portraits, ratings, and statistics are not used.

## Architectural imagery

The four architectural photographs, garden lifestyle photograph, and footer illustration were generated using the built-in OpenAI image generation tool, without reference images. The photo PNGs were converted to WebP at quality 86; the footer illustration uses quality 90 with its transparency preserved. The site explicitly identifies the rooms as AI generated design concepts, not completed client commissions. The complete prompts and final saved paths are recorded in [source/image-prompts.json](source/image-prompts.json).

| File | Generation direction |
| --- | --- |
| `public/images/tidewell-living.webp` | A photorealistic editorial coastal living room with warm ivory limewash, pale oak built-ins, oatmeal linen seating, travertine, natural fibre rug, and garden doors. Soft morning side sunlight, warm tactile materials, landscape architectural composition. |
| `public/images/tidewell-kitchen.webp` | A photorealistic coastal kitchen with pale oak cabinetry, muted sage island, creamy plaster, brass tap, ivory stone, and lemons. Dappled natural daylight, landscape architecture magazine photograph. |
| `public/images/tidewell-bathroom.webp` | A photorealistic coastal bathroom with sandy limewash, oak vanity, handmade green shower tiles, brass fittings, terrazzo basin, and linen. A calm, tactile room with warm window sunlight. |
| `public/images/tidewell-materials.webp` | An overhead editorial still life of ivory stone, sage ceramic tiles, oak joinery, cream linen, a pencil floor plan without written words, a carpenter pencil, and an olive twig on pale oak. |
| `public/images/tidewell-garden.webp` | An original lifestyle scene of a fictional adult couple seated on a stone terrace in a sunny home garden, with natural oak doors, cream and olive clothing, trees, and an open blue sky. |
| `public/images/tidewell-footer.webp` | An original panoramic painted illustration of a fictional family, a sandy garden path, and a welcoming house among trees. The transparent sky allows the artwork to blend into the footer's warm background. |

The photo prompts required full bleed landscape 3:2 photography, no logos, no watermarks, no borders, no collage, and no readable text. The architectural prompts excluded people; the lifestyle prompt depicts fictional adults. The footer prompt requested a separate panoramic gouache illustration with transparent sky, fictional people, and no lettering or branding. The images illustrate a fictional sustainable home renovation studio.

## Typography

Manrope is hosted locally at `public/fonts/manrope.ttf`. It is distributed under the SIL Open Font License; the license is included at `public/fonts/OFL-Manrope.txt`.

Source: [Google Fonts Manrope repository](https://github.com/google/fonts/tree/main/ofl/manrope).

## Removed material

The former site's downloaded photographs, illustrations, fish logo, partner images, stylesheets, scripts, and archived HTML/data are not included in the active project. General layout ideas and interaction patterns are implemented with independently authored content and styling.

This provenance record describes what was created and where it came from; it is not a legal clearance or exclusivity guarantee.
