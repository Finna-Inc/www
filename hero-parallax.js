/* ══ THE HOME PAGE'S SCROLL PARALLAX ═══════════════════════════════════════════════════════
   Two effects, one scroll listener: the HERO at the top of the page, and the IDEA section
   (home-02 · not-a-fund) as it passes through the window.

   THE HERO — shipped from lab/hero-parallax.html, THE PICKED SETTING (Esben, 21 Sep 2026):
   the picture hangs back 32 and zooms 22 by the bottom, the words lead at 33 and fade across
   double the travel, the three word layers fan at 150, and the wave sits still.

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

   THE IDEA SECTION (Esben, 21 Sep 2026: "the same parallax as in hero"). SUBSTITUTION, stated
   plainly: the hero's rates are fractions of PAGE scroll because the hero starts at the top —
   a section in the middle of the page has no such anchor, so the same numbers cannot travel.
   What is carried over is the behaviour and the ratios: the mark hangs back while the words
   lead the other way, the three word layers fan on the hero's own shares (1 · .475 · .07),
   and the words fade as the section leaves. The travel is a distance in px across the
   section's pass through the window, and the section sits at rest (no offset, no fade) when
   it is centred — so what you read is always the still page.
     M_DRIFT  how far the mark travels, each way, in px. It moves on `top`, not on a
              transform, and it takes NO zoom — either would break Freya's overlay light.
              The reason is written out over .idea-mark in site.css.
     M_FADE   the opacity the mark loses by the time it is gone.
     W_DRIFT  the words, moving the other way.
     W_FADE   the opacity the fastest layer loses by the time it is gone.
     FADE_AT  how far past centre both fades start (0 = at centre, 1 = never).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var hero = document.querySelector('.hero-home'),
      wave = hero && hero.querySelector('.hero-wave'),
      idea = document.querySelector('.band-violet'),
      mark = idea && idea.querySelector('.idea-mark');
  if (!hero && !idea) return;

  /* the three layers of words, nearest first — the order is what the spread fans out */
  var WORDS = [
    hero.querySelector('h1'),
    hero.querySelector('p'),
    hero.querySelector('.cta')
  ].filter(Boolean);

  /* the idea section's three layers, nearest first — the same fan, one ground lower */
  var IDEA = idea ? [
    idea.querySelector('h2'),
    idea.querySelector('.pull'),
    idea.querySelector('.lede')
  ].filter(Boolean) : [];
  var rule = idea && idea.querySelector('.rule');   /* travels with the paragraph under it */

  var reduce = matchMedia('(prefers-reduced-motion:reduce)');

  var P_RATE = .32, P_ZOOM = .22, W_RATE = .33, W_FADE = 2.00, W_SPREAD = 1.50, V_RATE = 0;
  var M_DRIFT = 130, M_FADE = .80, W_DRIFT = 90, I_FADE = .90, FADE_AT = .15;

  var H = 1, iTop = 0, iH = 1, frame = 0;
  function measure() {
    if (hero) H = Math.max(1, hero.offsetHeight);
    if (idea) {
      /* cached, so the frame below reads nothing from the DOM and forces no layout */
      var n = idea, y = 0;
      while (n) { y += n.offsetTop; n = n.offsetParent; }
      iTop = y; iH = Math.max(1, idea.offsetHeight);
    }
  }

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
    var y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);

    if (hero) {
      var t = Math.max(0, Math.min(1, y / H));
      hero.style.setProperty('--py', (y * P_RATE).toFixed(1) + 'px');
      hero.style.setProperty('--ps', (1 + t * P_ZOOM).toFixed(4));

      WORDS.forEach(function (el, i) {
        var k = share(i);
        el.style.setProperty('--wy', (-y * W_RATE * k).toFixed(1) + 'px');
        el.style.setProperty('--wo', Math.max(0, 1 - t * W_FADE * k).toFixed(3));
      });

      if (wave) wave.style.setProperty('--vy', (y * V_RATE).toFixed(1) + 'px');
    }

    if (idea) {
      /* s is where the section sits against the middle of the window: +1 entering from
         below, 0 dead centre, -1 gone off the top. Half the travel each way, so the rest
         state is the centred one. On a phone the whole thing is softened: the column is
         stacked and a drift sized for a wide row would throw it about. */
      var vh = innerHeight || 1,
          soft = vh < 700 || innerWidth < 700 ? .6 : 1,
          s = Math.max(-1, Math.min(1, ((iTop - y) + iH / 2 - vh / 2) / ((vh + iH) / 2))),
          out = Math.max(0, (-s - FADE_AT) / (1 - FADE_AT));   /* 0 until past centre */

      if (mark) {
        /* the mark leads OUT THE TOP with the words and fades with them (Esben, 21 Sep
           2026) — it is not the hero's picture hanging back, it is a fourth layer of the
           same departure, the slowest one. */
        mark.style.setProperty('--my', (s * M_DRIFT * soft).toFixed(1) + 'px');
        mark.style.setProperty('--mo', Math.max(0, 1 - out * M_FADE).toFixed(3));
      }
      IDEA.forEach(function (el, i) {
        var k = share(i), d = (s * W_DRIFT * k * soft).toFixed(1) + 'px';
        el.style.setProperty('--wy', d);
        el.style.setProperty('--wo', Math.max(0, 1 - out * I_FADE * k).toFixed(3));
        if (i === 2 && rule) { rule.style.setProperty('--wy', d); }
      });
    }
  }
  function draw() { if (!frame) frame = requestAnimationFrame(paint); }

  addEventListener('scroll', draw, { passive: true });
  addEventListener('resize', function () { measure(); draw(); }, { passive: true });
  /* fonts and the picture can change the hero's height after DOM-ready — measure twice */
  addEventListener('load', function () { measure(); draw(); });

  measure(); draw();
})();
