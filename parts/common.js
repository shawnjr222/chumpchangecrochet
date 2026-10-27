/* ============================================================
   Motion rules for the whole site (Caddis tokens):
   - one ease for travel (emphasizedEnter), a spring only for the quick-view sheet and mobile menu
   - one direction (up), 14px, nothing rotates, nothing overshoots, nothing loops
   - opacity is a tween; stagger is 70ms and capped at three
   ============================================================ */
const GEN = /*__GEN__*/;
const SP = {};
for (const k in GEN.springs) SP[k] = { d: Math.round(GEN.springs[k].duration * 1000), e: GEN.springs[k].easing };
if (!(window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)'))) for (const k in SP) SP[k].e = 'cubic-bezier(.22,1,.36,1)';
const EASE = { fx: 'cubic-bezier(.2,0,0,1)', emph: 'cubic-bezier(.05,.7,.1,1)', exit: 'cubic-bezier(.3,0,1,1)' };
const FX = { fast: 120, base: 200, slow: 320 };
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => reducedQuery.matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* rise: opacity tween + a short move up on the shared ease */
function rise(el, { delay = 0, y = 14, dur = 640, fx = 420 } = {}) {
  if (!el) return;
  if (reduced()) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay, fill: 'backwards' }); return; }
  el.animate([{ transform: `translateY(${y}px)` }, { transform: 'none' }], { duration: dur, delay, easing: EASE.emph, fill: 'backwards' });
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fx, delay, easing: EASE.fx, fill: 'backwards' });
}

const icon = (n, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

const srcset = n => GEN.lqip[n].widths.map(w => `assets/img/piece-${n}-${w}.webp ${w}w`).join(', ');

/* photo block: blur-up placeholder, then the real image fades in */
function fillPhoto(ph, info, set, { sizes, eager = false, alt = '' } = {}) {
  ph.style.backgroundImage = `url(${info.b64})`;
  const img = new Image();
  img.alt = alt; img.decoding = 'async'; img.width = info.w; img.height = info.h;
  if (eager) img.fetchPriority = 'high'; else img.loading = 'lazy';   // before the source
  img.sizes = sizes || '300px'; img.srcset = set;
  const done = () => img.classList.add('loaded');
  img.addEventListener('load', done, { once: true });
  ph.appendChild(img);
  if (img.complete && img.naturalWidth) done();
  return img;
}

/* ================= shared: intro state, chrome intro, hero intro ================= */
/* The first visit gets the full intro. Moving between pages afterwards only needs a quick fade. */
const seenIntro = (() => { try { return sessionStorage.getItem('ccc-intro') === '1'; } catch (e) { return false; } })();
const markSeen = () => { try { sessionStorage.setItem('ccc-intro', '1'); } catch (e) {} };
const quick = () => seenIntro || reduced();
function chromeIntro() {
  $$('.nav [data-intro]').forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: quick() ? 160 : 500, easing: EASE.fx, fill: 'backwards' }));
  if (!quick()) $('#navRule').animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1100, delay: 150, easing: EASE.emph, fill: 'backwards' });
}
function heroIntro() {
  const q = quick();
  $$('.hero-copy [data-intro="rise"]').forEach((el, i) => rise(el, q ? { delay: i * 30, dur: 360, y: 8, fx: 260 } : { delay: 120 + i * 80 }));
  const art = $('.hero-art [data-art]'); if (!art) return;
  if (q) { art.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE.fx, fill: 'backwards' }); return; }
  art.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 200, easing: EASE.fx, fill: 'backwards' });
  const img = $('img', art); if (img) img.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 1400, delay: 200, easing: EASE.emph, fill: 'backwards' });
  $('.hero-art .mat').animate([{ opacity: 0, transform: 'translate(-14px,-14px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 560, easing: EASE.emph, fill: 'backwards' });
}
function startIntro(play) {
  /* Start as soon as the fonts are in (so the headline doesn't reflow mid-animation), but never hold the
     screen for long: 350ms cap. Photos don't gate anything; their blur-up placeholders are already showing. */
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 350))]).then(() => {
    const root = document.documentElement;
    if (root.classList.contains('intro-on')) return;
    root.classList.add('intro-on'); performance.mark('intro-on');
    chromeIntro(); play(); markSeen(); observeReveals();
  });
}

/* ================= mobile menu ================= */
const mobileMenu = $('#mobileMenu'), menuBtn = $('#menuBtn');
function closeMenu() { mobileMenu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', () => { const o = mobileMenu.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
mobileMenu.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });

/* ================= scroll: nav hairline ================= */
const nav = $('#nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
nav.classList.toggle('scrolled', scrollY > 8);

/* ================= scroll reveals ================= */
function observeReveals() {
  const els = $$('[data-reveal]:not(.is-in)');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => {
    const seen = entries.filter(en => en.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    seen.forEach((en, i) => {
      const el = en.target; io.unobserve(el);
      const delay = reduced() ? 0 : parseInt(el.dataset.delay || '0', 10) + Math.min(i, 3) * 70;
      el.classList.add('is-in');
      rise(el, { delay });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
}

/* ================= pages always open at the top; in-page links don't touch the address ================= */
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
scrollTo({ top: 0, left: 0, behavior: 'instant' });
/* In-page links scroll smoothly without writing #section into the address, so a reload can't land mid-page. */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  e.preventDefault();
  closeMenu();
  const behavior = reduced() ? 'auto' : 'smooth';
  if (id === '#top') { scrollTo({ top: 0, behavior }); return; }
  const target = $(id); if (!target) return;
  target.scrollIntoView({ behavior, block: 'start' });
  target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
});