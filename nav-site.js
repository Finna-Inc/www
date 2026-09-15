/* ══ THE SITE'S NAVIGATION ══════════════════════════════════════════════════════════
   Lifted 1:1 from the 2026-09 build. Two behaviours: the burger sheet, and the promises
   menu — hover opens it where there is a pointer; click, Enter and Space open it
   everywhere else, which is what a finger and a keyboard need. Escape closes it and puts
   focus back on the parent; a click outside or a tab out of the group closes it too. On
   the narrow layout the rows are laid out inside the sheet, so the script leaves them be.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  var t = document.getElementById('navToggle'), l = document.getElementById('navLinks');
  if (!t) return;

  function shut() {
    if (!l.classList.contains('open')) return;
    l.classList.remove('open');
    t.setAttribute('aria-expanded', 'false');
  }

  t.addEventListener('click', function () {
    var open = l.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  l.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') shut();
  });

  /* A TAP ANYWHERE ELSE PUTS THE SHEET AWAY (Rose, 14 Sep 2026: "a tap on the page should
     do it also"). The burger was the only way out, which is a trap on a phone — the sheet
     covers the page and the way back is a small square in the corner.

     pointerdown, not click: on iOS a click on something that is not itself clickable does
     not reliably reach the document, and pointerdown also closes on the press rather than
     the release, which is what a dismissal should feel like. Taps on the burger and inside
     the sheet are left alone — the burger has its own handler and the sheet is what the
     reader is using. */
  document.addEventListener('pointerdown', function (e) {
    if (!l.classList.contains('open')) return;
    if (t.contains(e.target) || l.contains(e.target)) return;
    shut();
  });

  /* and the keyboard's way out, which the sheet did not have either */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !l.classList.contains('open')) return;
    shut();
    t.focus();
  });
})();

(function () {
  var group = document.querySelector('[data-dd]');
  if (!group) return;
  var trigger = group.querySelector('.nav-dd-t');
  var hoverable = matchMedia('(hover:hover)').matches;
  var inSheet = function () { return matchMedia('(max-width:900px)').matches; };
  var t;
  function open(v) {
    if (inSheet()) return;
    clearTimeout(t);
    group.classList.toggle('open', v);
    trigger.setAttribute('aria-expanded', v ? 'true' : 'false');
  }
  if (hoverable) {
    group.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') open(true); });
    /* a small grace period so a diagonal move to the panel does not close it */
    group.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'touch') return;
      clearTimeout(t); t = setTimeout(function () { open(false); }, 120);
    });
  }
  trigger.addEventListener('click', function (e) {
    if (inSheet()) return;
    if (hoverable && group.classList.contains('open')) return;   /* let the link through */
    e.preventDefault(); open(true);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !group.classList.contains('open')) return;
    open(false);
    if (group.contains(document.activeElement)) trigger.focus();
  });
  group.addEventListener('focusout', function (e) {
    if (!group.contains(e.relatedTarget)) open(false);
  });
  document.addEventListener('click', function (e) { if (!group.contains(e.target)) open(false); });
})();

/* ══ THE MARK'S MOTION ══════════════════════════════════════════════════════════════
   The gesture is the estate's: the stroke travels ONE WAY — the tail leaves the start
   point and runs round until the ring is empty, then the head draws it back in behind it.
   The dash pattern is one dash and one gap, each a whole ring long, so the pattern repeats
   every 208 and offset 0 (or any multiple of -208) is the ring whole.

   Why this is script and not CSS: a hover animation in CSS is dropped the moment the
   pointer leaves, and the ten-second cycle then paints whatever phase it is in — the stroke
   appears to blink back. Here, leaving does not interrupt anything: the pass carries on to
   the NEXT complete ring at the same speed, and only when it arrives does the slow cycle
   start again, from the beginning. Nothing ever reverses and nothing ever jumps.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  var brand = document.querySelector('.nav .brand');
  if (!brand || typeof brand.animate !== 'function') return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  var rings  = [].slice.call(brand.querySelectorAll('svg circle'));
  var core   = brand.querySelector('svg path');
  var PERIOD = 208;          /* one dash plus one gap */
  var LAP    = 2400;         /* a hovered pass, in ms */
  var STEP   = 90;           /* the rings answer in order, not as one object */
  var idle = [], live = [], hovering = false;

  var offs = function (el) {
    var v = getComputedStyle(el).strokeDashoffset;
    return parseFloat(v) || 0;
  };
  var stop = function (list) { list.forEach(function (a) { try { a.cancel(); } catch (e) {} }); list.length = 0; };

  /* the ten-second cycle: 2.8s of travel, then seven seconds of stillness */
  function startIdle() {
    stop(idle);
    rings.forEach(function (c, i) {
      idle.push(c.animate(
        [{ strokeDashoffset: 0 }, { strokeDashoffset: -PERIOD, offset: .28 }, { strokeDashoffset: -PERIOD }],
        { duration: 10000, iterations: Infinity, delay: i * STEP,
          easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' }));
    });
    if (core) idle.push(core.animate(
      [{ opacity: 1 }, { opacity: 0, offset: .06 }, { opacity: 0, offset: .28 },
       { opacity: 1, offset: .34 }, { opacity: 1 }],
      { duration: 10000, iterations: Infinity, easing: 'ease-in-out' }));
  }

  /* hovering: laps at a steady speed, starting from wherever each ring already is */
  function startHover() {
    stop(idle); stop(live);
    rings.forEach(function (c, i) {
      var from = offs(c);
      live.push(c.animate(
        [{ strokeDashoffset: from }, { strokeDashoffset: from - PERIOD }],
        { duration: LAP, iterations: Infinity, delay: i * STEP, easing: 'linear', fill: 'forwards' }));
    });
    if (core) live.push(core.animate([{ opacity: 1 }, { opacity: 0 }],
      { duration: 500, easing: 'ease-in-out', fill: 'forwards' }));
  }

  /* leaving: REWIND. The stroke runs back the way it came, from wherever it is to the
     start, and only then does the slow cycle begin again. Rewinding rather than finishing
     the lap is the point (Rose, 12 Sep 2026): the mark returns to the state you found it
     in, at a speed proportional to how far it had travelled, so there is no snap and no
     surprise extra lap after the pointer has gone. */
  function settle() {
    var frozen = rings.map(offs);
    stop(live);
    var longest = 0, done = 0;
    rings.forEach(function (c, i) {
      var from = frozen[i];
      var to   = Math.ceil(from / PERIOD) * PERIOD;        /* back to the nearest whole ring */
      var ms   = Math.round(Math.abs(to - from) / PERIOD * LAP * .8);   /* a touch quicker back */
      longest = Math.max(longest, ms);
      var a = c.animate([{ strokeDashoffset: from }, { strokeDashoffset: to }],
        { duration: ms, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
      live.push(a);
      a.onfinish = function () { if (++done === rings.length && !hovering) { stop(live); startIdle(); } };
    });
    if (core) live.push(core.animate([{ opacity: 0 }, { opacity: 1 }],
      { duration: Math.max(320, longest), easing: 'ease-in-out', fill: 'forwards' }));
    if (longest === 0) { stop(live); startIdle(); }
  }

  brand.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'touch') return;
    hovering = true; startHover();
  });
  brand.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'touch') return;
    hovering = false; settle();
  });

  startIdle();
})();

/* ── CLICKING THE MARK ON THE PAGE IT ALREADY OPENS (Rose, 12 Sep 2026) ─────────────
   The mark links home. On the home page that is a link to the page you are already on, so
   the browser reloads it: the bar's blurred surface re-rasterises and the mark restarts its
   cycle from nothing — which reads as a shrink and a blink. Here the click is answered
   instead: the page returns to the top, and nothing is thrown away. */
(function () {
  var brand = document.querySelector('.nav .brand');
  if (!brand) return;
  brand.addEventListener('click', function (e) {
    var here = location.href.split('#')[0].split('?')[0];
    if (brand.href.split('#')[0].split('?')[0] !== here) return;   /* a real journey home */
    e.preventDefault();
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();

/* ══ WHERE AN ANCHOR LANDS ══════════════════════════════════════════════════════════
   The bar is fixed, so a heading jumped to by #id would sit behind it. The clearance is
   MEASURED from the real bar and published on <html> as scroll-padding-top — one number,
   which the browser and Lenis both read, so nothing is typed twice or double-counted. */
(function () {
  'use strict';
  var bar = document.querySelector('.nav-outer');
  if (!bar) return;
  function measure() {
    document.documentElement.style.scrollPaddingTop =
      Math.round(bar.getBoundingClientRect().bottom + 16) + 'px';
  }
  measure();
  window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();

/* ══ BACK TO TOP ════════════════════════════════════════════════════════════════════
   The key appears once the header is behind you. The scroll handler queues a single
   animation frame rather than reading the position on every event. */
(function () {
  'use strict';
  const b = document.querySelector('.to-top');
  if (!b) return;
  const SHOW = 600;
  let on = false, queued = false;
  function check() {
    queued = false;
    const want = (window.scrollY || document.documentElement.scrollTop) > SHOW;
    if (want !== on) { on = want; b.classList.toggle('on', on); }
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(check); } },
    { passive: true });
  check();
})();

/* ══ THE PULL MARK ══════════════════════════════════════════════════════════════════
   Pull down from the top of a phone page and the estate's mark comes out from behind the
   bar, turns with the pull and settles under it; let go and it draws back.

   WHAT IT DOES NOT DO. It never calls preventDefault. The browser keeps its own rubber
   band and whatever it wants to do with the gesture, and this rides along on the same
   finger — overriding the scroll to own the gesture is how these things end up fighting
   the page on iOS. It reads touches and moves one element, nothing more.

   WHY IT CANNOT DISTURB THE BAR. The bar is sticky and composited with the page; this is
   a separate fixed element one layer below it, and nothing here touches the bar, the
   document's scroll, or any shared style.

   PROGRESSIVE ENHANCEMENT. No markup, no asset of its own: the mark is CLONED from the
   bar, so it is the project's own logo and follows it if it ever changes. Without touch,
   without the script, or for a reader who asked for less motion, the element is never
   built and the page is exactly as it was.

   THE FEEL. Resistance is exponential — 1 - e^(-d/DAMP) — so the first few pixels move it
   readily and the last ones barely at all, which is what makes a pull feel like it is
   against something rather than on rails. The travel is measured from the real bar each
   time, so it lands a thumb's width under it at every width.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!('ontouchstart' in window)) return;
  if (!matchMedia('(pointer:coarse)').matches) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  var src = document.querySelector('.nav .mark'),
      bar = document.querySelector('.nav'),
      sheet = document.getElementById('navLinks');
  if (!src || !bar) return;

  var el = document.createElement('div');
  el.className = 'pull-mark';
  el.setAttribute('aria-hidden', 'true');
  var art = src.cloneNode(true);
  art.removeAttribute('class');
  el.appendChild(art);
  document.body.appendChild(el);

  var PARK = 40,      /* how far above the top edge the mark rests, matching the CSS */
      GAP  = 16,      /* where it lands below the bar */
      DAMP = 150;     /* how quickly the resistance builds */

  var from = null, pull = 0, max = 140, frame = 0, idle = 0;

  function paint() {
    frame = 0;
    var t = pull / max,
        s = 0.78 + t * 0.22;
    el.style.opacity = Math.min(1, t * 1.8);
    el.style.transform =
      'translate(-50%,' + pull.toFixed(1) + 'px) ' +
      'rotate(' + (t * 90).toFixed(2) + 'deg) ' +
      'scale(' + s.toFixed(3) + ') ' +
      /* the stretch: a few percent taller at the end of the pull, and no more */
      'scaleY(' + (1 + t * 0.05).toFixed(3) + ')';
  }
  function draw() { if (!frame) frame = requestAnimationFrame(paint); }

  function atTop() { return (window.scrollY || document.documentElement.scrollTop || 0) <= 0; }

  window.addEventListener('touchstart', function (e) {
    from = null;
    if (e.touches.length !== 1) return;
    if (sheet && sheet.classList.contains('open')) return;   /* the menu owns the screen */
    if (!atTop()) return;
    from = e.touches[0].clientY;
    max = Math.round(bar.getBoundingClientRect().bottom + GAP + PARK);
    el.classList.remove('snap');
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (from === null || e.touches.length !== 1) return;
    var d = e.touches[0].clientY - from;
    if (d <= 0 || !atTop()) {          /* pushed back up, or the page took over */
      if (pull) { pull = 0; draw(); }
      return;
    }
    pull = max * (1 - Math.exp(-d / DAMP));
    draw();
    watch();
  }, { passive: true });

  /* THE RELEASE PAINTS AT ONCE, IT DOES NOT QUEUE (15 Sep 2026). Going through draw() left
     a race: a frame queued by the last touchmove could run after this and repaint the old
     pull, and the mark stayed out on screen. Cancel anything pending and paint here. */
  function release() {
    from = null;
    clearTimeout(idle);
    if (!pull) return;
    el.classList.add('snap');
    pull = 0;
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    paint();
  }
  /* CAPTURE, AND ON THE DOCUMENT. The end of the gesture is the one event that must never
     be missed — a missed one leaves the mark sitting on the page — so it is heard on the
     way down, where nothing can stop it first.

     NOT pointercancel. It looks like the right signal and is not: Chrome fires it the
     moment it claims the gesture for scrolling, which is every single downward drag at the
     top of the page — binding it here ended the pull before it had begun. */
  document.addEventListener('touchend', release, { passive: true, capture: true });
  document.addEventListener('touchcancel', release, { passive: true, capture: true });

  /* AND A WATCHDOG BEHIND BOTH OF THEM. Under fast input the end of a gesture can still be
     lost, and the cost of losing it is the mark stranded on screen. If the mark is out and
     nothing has moved for a beat, it goes home by itself. A second and a bit is far longer
     than any real pull holds still, so nobody meets this. */
  function watch() { clearTimeout(idle); idle = setTimeout(release, 1200); }
})();
