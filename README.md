# Concept refinement: Chump Change Crochet (Craft Fair, calm direction)

Concept 05 (Craft Fair) from `../chump-change-concepts/`, rebuilt as a calmer, editorial shop. The original concept folder is untouched.

## Publishing (GitHub Pages and the domain)
The site is published from this repo by `.github/workflows/pages.yml` on every push to `main`. It publishes only the production files (`index.html`, `story.html`, `assets/img/`, `CNAME`); everything else here (source, scripts, the ten design concepts, notes) stays in the repo but isn't published. The custom domain is **chumpchangecrochet.com** (set in `CNAME` and in the repo's Pages settings). To change the site: edit `parts/` or `pages/`, run `python3 scripts/build.py`, preview locally, then commit and push.

## Run it
Preview name `concept-refinement` (port 5192), or:

```bash
cd projects/concept-refinement && python3 -m http.server 5192
```

## Files
Two pages, built from shared parts:
- `index.html` (Home) and `story.html` (Our Story): the built pages. Don't edit by hand.
- `pages/home.html`, `pages/story.html`: each page's markup.
- `parts/css.css`, `parts/header.html`, `parts/footer.html`, `parts/sprite.html`, `parts/common.js`: shared by both pages. `parts/home.js` and `parts/story.js` are the page scripts.
- `python3 scripts/build.py` assembles the pages. `python3 scripts/build_assets.py` regenerates the images, blur placeholders and spring curves (re-run if the photos in `assets/*.jpg` change).
- Older versions for comparison: `v1-playful.html` (the busy first pass, with its source in `scripts/v1-src.html`), `scripts/v2-before-depop.html` (basket version), `scripts/v3-single-page.html` (Our Story as a section at the bottom of Home).

## Direction
Reference: Awwwards e-commerce nominees (Estudio Niksen, Woodwrights, Banham). What they share: photography leads, one type system, a flat grid, tiny uppercase UI text, almost nothing decorative, nothing tilts.
- Gingham is a signature, not a texture: a thin red rule under the nav and above the footer, and a soft tablecloth mat behind the hero and story photos.
- Fraunces for headlines and product names, system sans for UI, Caveat only for the wordmark and handwritten notes.
- No tilt, tape, pins, stickers, marquee, doilies or parallax.

## Motion rules
One ease for everything that travels (Caddis `emphasizedEnter`), one direction (up, 14px), nothing rotates, nothing overshoots, nothing loops, stagger 70ms capped at three. Opacity is a tween. A spring (Caddis `spatial` default serious, no bounce) is used only for the quick-view sheet and the mobile menu. The intro is a single gesture: the gingham rule draws across, the copy rises in reading order, and the hero photo settles in with a slow zoom-out. Reduced motion becomes short fades.

## Depop links
On the main site, product cards don't link anywhere: hovering a photo shows "View details", which opens the quick view, and the only product link to Depop is "Buy on Depop" inside it (plus "Shop on Depop" in the header, which goes to the whole shop, and "Contact for custom piece" in the hero, which opens an information-only popup). Links come from the `DEPOP` map in `parts/home.js`. Several site photos show the same design, so some pieces share a listing. Pieces with no confirmed listing fall back to the shop page. Update the map when listings change, then run `python3 scripts/build.py`.

## Pages
- **Home**: hero, promise row, Past work grid, footer.
- **Our Story**: its own page with the same hero layout, the three story paragraphs, the values list.
- The first visit plays the full intro. Moving between pages afterwards only does a quick fade (tracked per tab with `sessionStorage`), and browsers that support cross-page view transitions keep the header and footer steady while the content cross-fades.
- The "Contact for custom piece" popup (`#cm` in `pages/home.html`) is four short steps, one open at a time: message on Instagram, what to include, the reply (about 2 business days, shown on the step even when closed), and how it is made. The only controls are the step headers and Close; nothing links out. The wording, the 2-business-day estimate and the steps are draft copy to confirm.
- Every page opens at the top, and in-page links don't write `#section` into the address.

## Ten directions
`concepts/index.html` (http://localhost:5192/concepts/) shows all ten side by side with live previews. 01 is this site (the Gingham Editorial direction); 02 to 10 live in `concepts/NN-name/index.html`. They share the same eight pieces, the same copy and the same Depop links through `concepts/_shared/` (`shop.js` holds the product list and the Depop map, `base.css` the reset and photo placeholders, `data.js` the generated blur placeholders). Where each direction comes from, and what was and wasn't viewed, is in `REFERENCES.md`.

## Notes
- The basket and checkout were removed because the sale happens on Depop.
- Performance: images are square WebP with blur-up previews and fixed sizes (layout shift 0.0000), no third-party scripts, fonts from Google Fonts only.
