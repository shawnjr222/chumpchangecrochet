# References behind the ten directions

Reference pass run 2026-10-26 with the `design-references` skill. "Viewed" means the page was opened and looked at in the built-in browser. "Listing only" means the entry was seen in a gallery listing but not opened. Motion could not be judged from stills, so nothing below is a claim about easing or timing.

## What was looked at

| Source | Entry | How | What it showed |
|---|---|---|---|
| Awwwards (nominee) | Estudio Niksen, estudioniksen.com | Viewed (home, scrolled) | Full-bleed photo hero, tiny uppercase navigation, a flat and evenly spaced product grid, almost no decoration. |
| Awwwards (nominee) | Woodwrights, woodwrights.co.nz | Viewed (hero, one section) | One large room photograph, quiet serif copy, thin underlined links, a numbered "browse by space" list, lots of white space. |
| Awwwards (nominee) | Banham, banham.co.uk | Viewed (hero) | Serif headline over a dark photo, one button, the image carries the page. |
| Awwwards (nominee) | Almada Label, almadalabel.com | Viewed (hero only) | Full-bleed photographic hero under a very small header. |
| Landbook | `/design/ecommerce` | Viewed (listing) | Confirms routes: `/design/ecommerce`, `/design/product-page`, `/design/product-listing-page`. Entries seen: EADEM, Heist, Flynny's, Nossara, MATE the Label, GANNI, Dilling. |
| Landbook | Nossara, Imabari Towels | Viewed (Landbook entry preview) | The handmade product shown in its setting (a towel hanging in a forest), interface almost invisible. Closest to this shop's situation. |
| Awwwards | Lajoya, Theobroma, Blunt Umbrellas | Listing only (Theobroma opened on a long loading screen) | Not used as evidence. |
| Navbar Gallery | `/type/*` | Listing only | Header types: static, dropdowns, mega menu, side bar, search bar, announcement, full screen, breadcrumbs. |
| Supahero | `/hero/<slug>` | Listing only | About 570 hero entries. Not opened. |
| OGimage.gallery | `/category/*` | Listing only | Share-image categories. Not opened. |

Not reachable by plain fetch: Landbook (403), Deck.gallery (403), Adfolio (429). All three need the browser.

## Patterns that held across what was viewed

1. **The photograph leads and the interface stays out of the way.** (Niksen, Woodwrights, Nossara, Banham)
2. **One typeface voice at two volumes:** a confident display size and tiny uppercase labels. (Niksen, Woodwrights, Banham)
3. **Flat, evenly spaced grids with generous gaps.** Nothing tilts or rotates. One action appears on hover. (Niksen)
4. **Show the product where it lives, not on a white cutout.** (Nossara, Woodwrights)
5. **Restraint carries luxury:** one focal image, one headline, one button. (Banham)
6. **Personality lives in voice and small details**, not in decoration: names, notes, labels, the way a price is written.

## How each direction uses them

| # | Direction | Leans on | Personality comes from |
|---|---|---|---|
| 01 | Gingham Editorial (current) | 1, 2, 3, 6 | Soft gingham mat, red as one accent, "Just in" |
| 02 | Salon Wall | 1, 4, 6 | Pieces at real relative sizes on a wall, plaque labels |
| 03 | Index | 2, 3 | Oversized headline, the shop as a ruled list |
| 04 | Studio Journal | 4, 6 | Pencil dimension marks, handwritten notes |
| 05 | Color Study | 1, 5 | One color block per piece, drawn from its photo |
| 06 | Plaid Pop | 2, 6 | Saturated gingham, flat offset shadows, thick outlines |
| 07 | After Hours | 1, 5 | One lit piece, dim grid, slow fades (Banham) |
| 08 | Lookbook Rail | 1, 3 | A horizontal glide through large frames |
| 09 | Split Story | 1, 4 | A pinned panel that follows the piece on screen |
| 10 | Specimen Cabinet | 2, 6 | Catalogue numbers, measurements, edition lines |

## What the pages share

Same eight pieces, same copy (nothing new written), same Depop links per piece, same behavior: every page opens at the top, in-page links never write `#section` into the address, nothing rotates or loops, opacity never overshoots. Shared code is in `concepts/_shared/`.
