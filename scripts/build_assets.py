"""Builds optimized images, blur placeholders and CSS spring easings.
Springs follow Caddis tokens (tools/caddis/src/lib/tokens.ts): visualDuration + bounce.
Run: python3 scripts/build_assets.py   (writes assets/img/*, scripts/generated.json)"""
import json, math, base64, io
from PIL import Image

SRC = 'assets'
SIZES = [480, 800, 1050]

def spring_css(visual, bounce, n=44):
    root = 2 * math.pi / (visual * 1.2)
    k = root * root
    zeta = max(0.05, min(1, 1 - bounce))
    c = 2 * zeta * root
    dt = 1 / 480
    x, v, t = 0.0, 0.0, 0.0
    xs = []
    settled_at = None
    while t < 3:
        a = -k * (x - 1) - c * v
        v += a * dt
        x += v * dt
        t += dt
        xs.append((t, x))
        if abs(x - 1) < 0.0015 and abs(v) < 0.01:
            settled_at = t
            break
    T = settled_at or t
    pts = []
    for i in range(n + 1):
        ti = T * i / n
        j = min(len(xs) - 1, int(ti / dt))
        pts.append(1.0 if i == n else round(xs[j][1] if i else 0.0, 4))
    return round(T, 3), 'linear(' + ', '.join(str(p) for p in pts) + ')'

springs = {}
for name, (vis, b) in {
    'std': (0.35, 0.12),       # spatial("default","standard")
    'serious': (0.35, 0.0),    # spatial("default","serious")
    'fast': (0.2, 0.0),        # spatial("fast","serious")
    'slow': (0.5, 0.0),        # spatial("slow","serious")
    'playful': (0.35, 0.28),   # spatial("default","playful")
}.items():
    T, css = spring_css(vis, b)
    springs[name] = {'duration': T, 'easing': css}

lqip = {}
import glob, os
for f in glob.glob('assets/img/*.webp'):
    os.remove(f)
for i in range(1, 9):
    im = Image.open(f'{SRC}/piece-{i}.jpg').convert('RGB')
    # every placement on the site is a square crop, so crop once here (centered, same as object-fit: cover)
    side = min(im.size)
    left, top = (im.width - side) // 2, (im.height - side) // 2
    sq = im.crop((left, top, left + side, top + side))
    widths = [w for w in SIZES if w < side] + [min(side, 1050)]
    for w in widths:
        sq.resize((w, w), Image.LANCZOS).save(f'assets/img/piece-{i}-{w}.webp', 'WEBP', quality=74, method=6)
    buf = io.BytesIO()
    sq.resize((24, 24), Image.LANCZOS).save(buf, 'WEBP', quality=45)
    lqip[i] = {'b64': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(),
               'w': widths[-1], 'h': widths[-1], 'widths': widths}
# hero: one portrait crop (4:5) of the first piece
im = Image.open(f'{SRC}/piece-1.jpg').convert('RGB')
cw = im.width; ch = round(cw * 5 / 4); top = (im.height - ch) // 2
hero = im.crop((0, top, cw, top + ch))
hero_w = [640, 1050]
for w in hero_w:
    hero.resize((w, round(w * 5 / 4)), Image.LANCZOS).save(f'assets/img/hero-1-{w}.webp', 'WEBP', quality=74, method=6)
buf = io.BytesIO(); hero.resize((24, 30), Image.LANCZOS).save(buf, 'WEBP', quality=45)
hero_info = {'b64': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(), 'w': 1050, 'h': round(1050 * 5 / 4), 'widths': hero_w}
json.dump({'springs': springs, 'lqip': lqip, 'hero': hero_info}, open('scripts/generated.json', 'w'), indent=1)
print({k: v['duration'] for k, v in springs.items()})
