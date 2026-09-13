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
  t.addEventListener('click', function () {
    var open = l.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  l.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { l.classList.remove('open'); t.setAttribute('aria-expanded','false'); }
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
