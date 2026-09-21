/* ══ THE HOME HERO'S PARALLAX ══════════════════════════════════════════════════════════════
   Shipped from lab/hero-parallax.html — THE PICKED SETTING (Esben, 21 Sep 2026): the picture
   hangs back 32 and zooms 22 by the bottom, the words lead at 33 and fade across double the
   travel, the three word layers fan at 150, and the wave sits still.

   One scroll listener feeding one animation frame. Nothing is read from the DOM inside that
   frame except a cached hero height, and the only properties written are custom properties
   that feed transforms (hero-home.css) — so the browser composites the lot without a single
   layout. Off entirely for anyone who asks for reduced motion; with this file missing or
   failing, every property sits at its rest default and the hero is exactly the still page.

   THE NUMBERS:
     P_RATE   how far the picture hangs back, as a fraction of the page's own travel. Kept
              under 1.0 on purpose: at any rate below 100% the picture's top edge stays above
              the window, so the layer needs no overhang and the crop is the still site's.
     P_ZOOM   a little scale, so the picture is still growing as it leaves.
     W_RATE   the words, moving the other way — up, faster than the page.
     W_FADE   how much of their opacity that costs them.
     W_SPREAD how far the headline, the paragraph and the keys fan apart on the way out.
     V_RATE   the wave, between picture and words (0 = it rides with the page).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var hero = document.querySelector('.hero-home'),
      wave = hero && hero.querySelector('.hero-wave');
  if (!hero) return;

  /* the three layers of words, nearest first — the order is what the spread fans out */
  var WORDS = [
    hero.querySelector('h1'),
    hero.querySelector('p'),
    hero.querySelector('.cta')
  ].filter(Boolean);

  var reduce = matchMedia('(prefers-reduced-motion:reduce)');

  var P_RATE = .32, P_ZOOM = .22, W_RATE = .33, W_FADE = 2.00, W_SPREAD = 1.50, V_RATE = 0;

  var H = 1, frame = 0;
  function measure() { H = Math.max(1, hero.offsetHeight); }

  /* HOW THE THREE FAN. Each gets a share of the words' rate: the headline the whole of it,
     the paragraph a little less, the keys least — so the gaps between them OPEN as the hero
     leaves rather than closing. The same share drives the fade, so whatever leaves fastest
     also goes first. At spread 0 all three carry the same number and it is one block again. */
  function share(i) { return 1 - W_SPREAD * [0, .35, .62][i]; }

  function paint() {
    frame = 0;
    if (reduce.matches) return;
    /* clamped at zero: a trackpad can rubber-band above the top, and a negative y would
       run the picture the wrong way and expose its bottom edge */
    var y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0),
        t = Math.max(0, Math.min(1, y / H));

    hero.style.setProperty('--py', (y * P_RATE).toFixed(1) + 'px');
    hero.style.setProperty('--ps', (1 + t * P_ZOOM).toFixed(4));

    WORDS.forEach(function (el, i) {
      var k = share(i);
      el.style.setProperty('--wy', (-y * W_RATE * k).toFixed(1) + 'px');
      el.style.setProperty('--wo', Math.max(0, 1 - t * W_FADE * k).toFixed(3));
    });

    if (wave) wave.style.setProperty('--vy', (y * V_RATE).toFixed(1) + 'px');
  }
  function draw() { if (!frame) frame = requestAnimationFrame(paint); }

  addEventListener('scroll', draw, { passive: true });
  addEventListener('resize', function () { measure(); draw(); }, { passive: true });
  /* fonts and the picture can change the hero's height after DOM-ready — measure twice */
  addEventListener('load', function () { measure(); draw(); });

  measure(); draw();
})();
