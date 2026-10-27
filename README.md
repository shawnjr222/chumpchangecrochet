# Chump Change Crochet

One-of-one crocheted wall art, handmade in San Francisco, by Siena Hooper.

**Live site:** [chumpchangecrochet.com](https://chumpchangecrochet.com)

## What's here

| | |
|---|---|
| `index.html`, `story.html` | The site (home and About) |
| `assets/` | Photos |
| `parts/`, `pages/` | The source the pages are built from |
| `scripts/` | Build scripts |
| `concepts/` | Design explorations (not published) |

## Make a change

```bash
python3 scripts/build.py          # rebuild the pages after editing parts/ or pages/
python3 -m http.server 5192       # preview at http://localhost:5192
```

If the photos in `assets/` change, run `python3 scripts/build_assets.py` first (needs `pip install pillow`).

## Publishing

Pushing to `main` publishes the site to chumpchangecrochet.com through GitHub Pages. Only the home page, About page and images go live.
