/* ══ SMOOTH SCROLL ══════════════════════════════════════════════════════════════════
   Lenis 1.3, wired once for the whole estate. Loaded after lenis.min.js:

       <link rel="stylesheet" href="vendor/lenis.css">
       <script src="vendor/lenis.min.js"></script>
       <script src="vendor/smooth-scroll.js" defer></script>

   What it does, and what it deliberately does NOT do:

   1 · Reduced motion is honoured by Lenis itself (respectReducedMotion is on by
       default): for anyone who asked their machine for less motion, scrolling is
       native and instant. We do not wrap that in a second check.
   2 · In-page anchors are handled by Lenis (anchors: true). Lenis reads the page's
       scroll-padding-top — which nav.js MEASURES from the real bar and rail and sets on
       <html> — so a heading lands under the chrome, not behind it. There is no
       hand-typed offset here: one number, measured once, read by everyone. (An offset
       here AND scroll-padding in CSS was double-counted, and headings landed 128px low.)
   3 · A deep link arriving cold is the one case Lenis cannot see, because the browser
       jumped before nav.js had measured anything. So it is re-run once, instantly.
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({
    duration: 1.05,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    touchMultiplier: 1.6,
    anchors: true
  });
  window.lenis = lenis;

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  if (location.hash.length > 1) {
    var t = document.getElementById(location.hash.slice(1));
    if (t) requestAnimationFrame(function () { lenis.scrollTo(t, { immediate: true }); });
  }
})();
