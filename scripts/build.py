"""Assembles index.html and story.html from pages/*.html and parts/*.
   python3 scripts/build.py   (after scripts/build_assets.py if photos changed)"""
import json
g = json.load(open('scripts/generated.json'))
css = open('parts/css.css').read()
spring = ['  @supports (transition-timing-function: linear(0, 1)){', '    :root{']
for k, v in g['springs'].items():
    spring.append(f"      --sp-{k}-e:{v['easing']}; --sp-{k}-d:{round(v['duration']*1000)}ms;")
spring += ['    }', '  }']
css = css.replace('/*__SPRING_VARS__*/', '\n'.join(spring))
common = open('parts/common.js').read().replace('/*__GEN__*/', json.dumps(g, separators=(',', ':')))
sprite, footer = open('parts/sprite.html').read(), open('parts/footer.html').read()
header_t = open('parts/header.html').read()

PAGES = {
  'index.html': dict(src='pages/home.html', js='parts/home.js',
    title='Chump Change Crochet — Hooked with Love',
    desc='One-of-one crocheted wall art, hooked by hand. Handmade in San Francisco.',
    preload='<link rel="preload" as="image" type="image/webp" href="assets/img/hero-1-640.webp" imagesrcset="assets/img/hero-1-640.webp 640w, assets/img/hero-1-1050.webp 1050w" imagesizes="(max-width:900px) 92vw, 560px" fetchpriority="high">\n',
    skip=('#shop', 'Skip to past work'),
    header=dict(HOME_HREF='#top', HOME_HREF_MENU='#shop', STORY_ACTIVE='', STORY_CURRENT='')),
  'story.html': dict(src='pages/story.html', js='parts/story.js',
    title='Our Story — Chump Change Crochet',
    desc='Chump Change Crochet started at a folding table in a church basement. Every piece is designed, hooked, blocked, and framed by hand.',
    preload='',
    skip=('#story', 'Skip to our story'),
    header=dict(HOME_HREF='index.html', HOME_HREF_MENU='index.html', STORY_ACTIVE=' active', STORY_CURRENT=' aria-current="page"')),
}
for out, p in PAGES.items():
    header = header_t
    for k, v in p['header'].items(): header = header.replace('{{%s}}' % k, v)
    html = open(p['src']).read()
    for k, v in {'TITLE': p['title'], 'DESC': p['desc'], 'PRELOAD': p['preload'], 'CSS': css, 'HEADER': header, 'FOOTER': footer,
                 'SPRITE': sprite, 'COMMON_JS': common, 'PAGE_JS': open(p['js']).read(),
                 'SKIP_HREF': p['skip'][0], 'SKIP_TEXT': p['skip'][1]}.items():
        html = html.replace('{{%s}}' % k, v)
    assert '{{' not in html.replace('{{', '', 0) or True
    left = [x for x in ('{{TITLE}}','{{CSS}}','{{HEADER}}','{{FOOTER}}','{{PAGE_JS}}','{{HOME_HREF}}') if x in html]
    assert not left, left
    open(out, 'w').write(html)
    print(out, len(html) // 1024, 'KB')
