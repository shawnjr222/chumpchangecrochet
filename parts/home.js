/* ================= data ================= */
const PRODUCTS = [
  { id:'starburst-no-1', n:1, name:'Starburst No. 1', price:53.20, size:'14 × 14 in', desc:'Our show-off. A big radial burst in warm neutrals — the piece everybody points at first.' },
  { id:'cobalt-study', n:2, name:'Cobalt Study', price:37.45, size:'10 × 10 in', desc:'A moody little number in deep blue. Small but mighty — likes a quiet wall.' },
  { id:'radial-bloom', n:3, name:'Radial Bloom', price:37.45, size:'12 × 12 in', desc:'Like a flower, if flowers were made of yarn and opinions.' },
  { id:'hearth-frame', n:4, name:'Hearth Frame', price:47.95, size:'11 × 11 in', desc:'Cozy as a quilt, tidy as a frame. An easy first piece for a bare hallway.' },
  { id:'openwork-study-i', n:5, name:'Openwork Study I', price:37.45, size:'12 × 10 in', desc:'Lacy, airy, and a little bit fancy. Catches the afternoon light something lovely.' },
  { id:'ember-grid', n:6, name:'Ember Grid', price:53.20, size:'13 × 13 in', desc:'Warm geometric rows — modern, but make it handmade.' },
  { id:'meadow-loop', n:7, name:'Meadow Loop', price:47.95, size:'11 × 12 in', desc:'Soft loops in meadow tones. Basically a hug for your wall.' },
  { id:'openwork-study-ii', n:8, name:'Openwork Study II', price:null, size:'12 × 10 in', desc:'The sequel! Looser, breezier, twice the charm.' }
];
const DETAILS = ['100% cotton yarn', 'Hand-crocheted & blocked', 'Arrives framed, ready to hang', 'Ships in 3–5 days'];
/* Where each piece lives on Depop. Several site photos show the same design, so some share a listing.
   Anything without a confirmed listing falls back to the shop page. */
const DEPOP_SHOP = 'https://www.depop.com/chumpchangecrochet/';
const DEPOP = {
  'starburst-no-1':    'https://www.depop.com/products/chumpchangecdochet-framed-handmade-brown-filet-crochet-15ae/', // butterfly
  'ember-grid':        'https://www.depop.com/products/chumpchangecdochet-framed-handmade-brown-filet-crochet-15ae/', // butterfly
  'cobalt-study':      'https://www.depop.com/products/chumpchangecrocmet-framed-handmade-brown-filet-crochet-82be/', // sea shell
  'radial-bloom':      'https://www.depop.com/products/chompchangecrochet-framed-handmade-brown-filet-crochet-7857/', // sand dollar
  'hearth-frame':      'https://www.depop.com/products/chuppchangecrochet-framed-handmade-brown-filet-crochet-7457/', // beetle
  'meadow-loop':       'https://www.depop.com/products/chuppchangecrochet-framed-handmade-brown-filet-crochet-7457/', // beetle
  'openwork-study-i':  'https://www.depop.com/products/chumpchangecroch7t-brown-framed-filet-crochet-abstract-1879/'  // abstract heart
};
const depopUrl = id => DEPOP[id] || DEPOP_SHOP;
/* Prices are the shoppers' prices on Depop (they include Depop's marketplace fee). A piece without a confirmed listing has no price. */
const money = n => n == null ? '' : '$' + Number(n).toFixed(2);
const ariaPrice = p => p.price == null ? '' : ', ' + money(p.price);
const byId = id => PRODUCTS.find(p => p.id === id);

const heroImg = fillPhoto($('#heroPh'), GEN.hero, GEN.hero.widths.map(w => `assets/img/hero-1-${w}.webp ${w}w`).join(', '),
  { sizes: '(max-width:900px) 92vw, 560px', eager: true, alt: 'Starburst No. 1, a large radial crocheted wall piece' });

/* ================= grid ================= */
function cardHTML(p) {
  return `<article class="pcard" data-reveal data-open="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}${ariaPrice(p)}">
    <div class="ph pimg" data-piece="${p.n}">
      <span class="quick" aria-hidden="true">View details</span>
    </div>
    <div class="pmeta"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
    <p class="psub"><b>One of one</b>${p.size}</p></article>`;
}
const grid = $('#grid');
grid.innerHTML = PRODUCTS.map(cardHTML).join('');
$$('.pimg', grid).forEach(ph => {
  const n = +ph.dataset.piece, p = PRODUCTS.find(x => x.n === n);
  const img = fillPhoto(ph, GEN.lqip[n], srcset(n), { sizes: '(max-width:720px) 46vw, (max-width:1020px) 31vw, 290px', alt: p.name + ', crocheted wall art' });
  ph.insertBefore(img, ph.firstChild);   // keep the quick-add button above the photo
});

/* ================= overlays: focus trap, inert page, scroll lock ================= */
const page = $('#page'), scrim = $('#scrim');
let lastFocus = null, openLayer = null;
const lockPage = on => { page.toggleAttribute('inert', on); document.body.style.overflow = on ? 'hidden' : ''; };
function trap(e, root) {
  if (e.key !== 'Tab') return;
  const f = $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', root).filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (openLayer === 'qv') closeQV(); else if (openLayer === 'cm') closeCM(); else closeMenu(); }
  if (openLayer === 'qv') trap(e, $('#qv'));
  if (openLayer === 'cm') trap(e, $('#cm'));
});

/* ================= quick view: the sheet rises, the photo is already there ================= */
const qv = $('#qv');
let qvId = null;
function openQV(id) {
  const p = byId(id); if (!p) return;
  qvId = id; lastFocus = document.activeElement;
  const img = $('#qvImg'), ph = $('#qvPh');
  ph.style.backgroundImage = `url(${GEN.lqip[p.n].b64})`;
  img.classList.remove('loaded'); img.alt = p.name + ', crocheted wall art';
  img.sizes = '(max-width:1020px) 100vw, 470px'; img.srcset = srcset(p.n);
  img.onload = () => img.classList.add('loaded');
  if (img.complete && img.naturalWidth) img.classList.add('loaded');
  $('#qvName').textContent = p.name; $('#qvPrice').textContent = money(p.price) || 'See the price on Depop'; $('#qvDesc').textContent = p.desc; $('#qvBuy').href = depopUrl(id);
  $('#qvDetails').innerHTML = DETAILS.map(d => `<li>${d}</li>`).join('');
  qv.classList.add('open'); qv.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open'); lockPage(true); openLayer = 'qv';
  $('#qvClose').focus({ preventScroll: true });
  const card = $('#qvCard');
  card.getAnimations().forEach(a => a.cancel());   // drop the previous exit's held end state
  if (reduced()) card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
  else {
    const mobile = matchMedia('(max-width:720px)').matches;
    card.animate([{ transform: mobile ? 'translateY(40px)' : 'translateY(20px)' }, { transform: 'none' }], { duration: SP.serious.d, easing: SP.serious.e, fill: 'backwards' });
    card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FX.slow, easing: EASE.fx, fill: 'backwards' });
  }
}
function closeQV() {
  if (openLayer !== 'qv') return;
  const card = $('#qvCard');
  scrim.classList.remove('open');
  const finish = () => {
    qv.classList.remove('open'); qv.setAttribute('aria-hidden', 'true');
    card.getAnimations().forEach(a => a.cancel());
    if (openLayer === 'qv') { openLayer = null; lockPage(false); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  if (reduced()) return finish();
  card.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(12px)' }], { duration: FX.base, easing: EASE.exit, fill: 'forwards' });
  setTimeout(finish, FX.base);
}
$('#qvClose').addEventListener('click', closeQV);
qv.addEventListener('click', e => { if (e.target === qv) closeQV(); });

/* ================= custom pieces popup: same sheet motion, one control (Close) ================= */
const cm = $('#cm');
function openCM() {
  lastFocus = document.activeElement;
  cm.classList.add('open'); cm.setAttribute('aria-hidden', 'false');
  scrim.classList.add('open'); lockPage(true); openLayer = 'cm';
  const card = $('#cmCard'); $('#cmScroll').scrollTop = 0;
  steps.forEach((s, i) => setStep(s, i === 0));   // always start on step 1
  $('#cmClose').focus({ preventScroll: true });
  card.getAnimations().forEach(a => a.cancel());
  if (reduced()) card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
  else {
    const mobile = matchMedia('(max-width:720px)').matches;
    card.animate([{ transform: mobile ? 'translateY(40px)' : 'translateY(20px)' }, { transform: 'none' }], { duration: SP.serious.d, easing: SP.serious.e, fill: 'backwards' });
    card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FX.slow, easing: EASE.fx, fill: 'backwards' });
  }
}
function closeCM() {
  if (openLayer !== 'cm') return;
  const card = $('#cmCard');
  scrim.classList.remove('open');
  const finish = () => {
    cm.classList.remove('open'); cm.setAttribute('aria-hidden', 'true');
    card.getAnimations().forEach(a => a.cancel());
    if (openLayer === 'cm') { openLayer = null; lockPage(false); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  if (reduced()) return finish();
  card.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(12px)' }], { duration: FX.base, easing: EASE.exit, fill: 'forwards' });
  setTimeout(finish, FX.base);
}
/* steps: one open at a time; tapping the open one closes it */
const steps = $$('#cmSteps > li');
function setStep(li, open) { li.classList.toggle('open', open); $('.cm-head', li).setAttribute('aria-expanded', open ? 'true' : 'false'); }
steps.forEach(li => $('.cm-head', li).addEventListener('click', () => {
  const open = !li.classList.contains('open');
  steps.forEach(s => setStep(s, s === li ? open : false));
}));
$('#customOpen').addEventListener('click', openCM);
$('#cmClose').addEventListener('click', closeCM);
cm.addEventListener('click', e => { if (e.target === cm) closeCM(); });

/* open on click / keyboard; the only way to Depop is the "Buy on Depop" link inside the quick view */
scrim.addEventListener('click', () => { if (openLayer === 'qv') closeQV(); else if (openLayer === 'cm') closeCM(); });
document.addEventListener('click', e => {
  const open = e.target.closest('[data-open]');
  if (open) openQV(open.dataset.open);
});
grid.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open]')) { e.preventDefault(); openQV(e.target.dataset.open); }
});

/* ================= intro ================= */
startIntro(heroIntro);
