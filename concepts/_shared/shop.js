/* Shared by every concept. Product list, Depop links, photo loader, reveal, scroll-to-top.
   Motion tokens follow Caddis: one ease for travel (emphasizedEnter), opacity is a tween, nothing overshoots. */
(function () {
  const ROOT = document.currentScript.dataset.root || '../../';       // path to the concept-refinement folder
  const C = (window.CCC = {});
  const reducedQ = matchMedia('(prefers-reduced-motion: reduce)');
  C.reduced = () => reducedQ.matches;
  C.$ = (s, r = document) => r.querySelector(s);
  C.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  C.EASE = { fx: 'cubic-bezier(.2,0,0,1)', emph: 'cubic-bezier(.05,.7,.1,1)', exit: 'cubic-bezier(.3,0,1,1)' };

  C.PRODUCTS = [
    { id:'starburst-no-1', n:1, name:'Starburst No. 1', price:53.20, size:'14 × 14 in', desc:'Our show-off. A big radial burst in warm neutrals — the piece everybody points at first.' },
    { id:'cobalt-study', n:2, name:'Cobalt Study', price:37.45, size:'10 × 10 in', desc:'A moody little number in deep blue. Small but mighty — likes a quiet wall.' },
    { id:'radial-bloom', n:3, name:'Radial Bloom', price:37.45, size:'12 × 12 in', desc:'Like a flower, if flowers were made of yarn and opinions.' },
    { id:'hearth-frame', n:4, name:'Hearth Frame', price:47.95, size:'11 × 11 in', desc:'Cozy as a quilt, tidy as a frame. An easy first piece for a bare hallway.' },
    { id:'openwork-study-i', n:5, name:'Openwork Study I', price:37.45, size:'12 × 10 in', desc:'Lacy, airy, and a little bit fancy. Catches the afternoon light something lovely.' },
    { id:'ember-grid', n:6, name:'Ember Grid', price:53.20, size:'13 × 13 in', desc:'Warm geometric rows — modern, but make it handmade.' },
    { id:'meadow-loop', n:7, name:'Meadow Loop', price:47.95, size:'11 × 12 in', desc:'Soft loops in meadow tones. Basically a hug for your wall.' },
    { id:'openwork-study-ii', n:8, name:'Openwork Study II', price:null, size:'12 × 10 in', desc:'The sequel! Looser, breezier, twice the charm.' }
  ];
  C.SHOP = 'https://www.depop.com/chumpchangecrochet/';
  const D = 'https://www.depop.com/products/';
  const DEPOP = {   // same mapping as the main site; several photos show the same design
    'starburst-no-1': D + 'chumpchangecdochet-framed-handmade-brown-filet-crochet-15ae/',
    'ember-grid': D + 'chumpchangecdochet-framed-handmade-brown-filet-crochet-15ae/',
    'cobalt-study': D + 'chumpchangecrocmet-framed-handmade-brown-filet-crochet-82be/',
    'radial-bloom': D + 'chompchangecrochet-framed-handmade-brown-filet-crochet-7857/',
    'hearth-frame': D + 'chuppchangecrochet-framed-handmade-brown-filet-crochet-7457/',
    'meadow-loop': D + 'chuppchangecrochet-framed-handmade-brown-filet-crochet-7457/',
    'openwork-study-i': D + 'chumpchangecroch7t-brown-framed-filet-crochet-abstract-1879/'
  };
  C.depopUrl = id => DEPOP[id] || C.SHOP;
  /* Shoppers' prices on Depop (they include Depop's marketplace fee). A piece with no confirmed listing shows a dash. */
  C.money = n => n == null ? '—' : '$' + Number(n).toFixed(2);
  C.ariaPrice = p => p.price == null ? '' : ', ' + C.money(p.price);
  C.pad = n => String(n).padStart(2, '0');

  C.srcset = n => GEN.lqip[n].widths.map(w => `${ROOT}assets/img/piece-${n}-${w}.webp ${w}w`).join(', ');
  /* photo block: blur-up placeholder, then the real image fades in. Set loading before the source. */
  C.photo = (ph, n, { sizes = '320px', eager = false, alt = '', hero = false } = {}) => {
    const info = hero ? GEN.hero : GEN.lqip[n];
    ph.style.backgroundImage = `url(${info.b64})`;
    const img = new Image();
    img.alt = alt; img.decoding = 'async'; img.width = info.w; img.height = info.h;
    if (eager) img.fetchPriority = 'high'; else img.loading = 'lazy';
    img.sizes = sizes;
    img.srcset = hero ? info.widths.map(w => `${ROOT}assets/img/hero-1-${w}.webp ${w}w`).join(', ') : C.srcset(n);
    const done = () => img.classList.add('loaded');
    img.addEventListener('load', done, { once: true });
    ph.appendChild(img);
    if (img.complete && img.naturalWidth) done();
    return img;
  };

  /* rise: opacity tween + a short move up on the shared ease */
  C.rise = (el, { delay = 0, y = 14, dur = 640, fx = 420 } = {}) => {
    if (!el) return;
    if (C.reduced()) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay, fill: 'backwards' }); return; }
    el.animate([{ transform: `translateY(${y}px)` }, { transform: 'none' }], { duration: dur, delay, easing: C.EASE.emph, fill: 'backwards' });
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fx, delay, easing: C.EASE.fx, fill: 'backwards' });
  };
  C.fade = (el, { delay = 0, dur = 600 } = {}) => el && el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: C.reduced() ? 160 : dur, delay, easing: C.EASE.fx, fill: 'backwards' });

  /* scroll reveals: [data-reveal] rises in, stagger 70ms capped at three */
  C.reveal = (root = document) => {
    const els = C.$$('[data-reveal]:not(.is-in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.filter(en => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((en, i) => {
          const el = en.target; io.unobserve(el); el.classList.add('is-in');
          C.rise(el, { delay: C.reduced() ? 0 : parseInt(el.dataset.delay || '0', 10) + Math.min(i, 3) * 70 });
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
  };

  /* every page opens at the top; in-page links scroll smoothly and never write #section into the address */
  document.documentElement.classList.add('js');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault();
    const behavior = C.reduced() ? 'auto' : 'smooth';
    if (id === '#top') { scrollTo({ top: 0, behavior }); return; }
    const t = C.$(id); if (!t) return;
    t.scrollIntoView({ behavior, block: 'start' });
    t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
    if (C.onNavigate) C.onNavigate();
  });

  /* start(): wait for fonts (350ms cap), then play the page's intro and arm the scroll reveals */
  C.start = play => {
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 350))]).then(() => {
      document.documentElement.classList.add('ready');
      if (play) play();
      C.reveal();
    });
  };

  /* small mobile menu helper: button toggles a panel's .open class and aria-expanded */
  C.menu = (btn, panel) => {
    if (!btn || !panel) return;
    const close = () => { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => { const o = panel.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    panel.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    C.onNavigate = close;
  };

  /* the shared footer column: Say hello */
  C.helloHTML = `<h5>Say hello</h5>
    <a href="https://www.instagram.com/chumpchangecrochet/" target="_blank" rel="noopener">@chumpchangecrochet</a>
    <a href="#top">hello@chumpchange.shop</a>`;
})();
